import crypto from "crypto";
import jwt from "jsonwebtoken";
import UAParser from "ua-parser-js";
import User from "../models/User.js";
import Session from "../models/Session.js";
import { generateToken } from "../utils/token.js";
import { sendVerificationEmail, sendResetEmail } from "../utils/email.js";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const trimmedName = name.trim();
        if (trimmedName.length < 2) {
            return res.status(400).json({ message: "Name must be at least 2 characters" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const verificationToken = generateToken();
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const user = await User.create({
            name: trimmedName,
            email,
            password,
            verificationToken,
            verificationTokenExpiry,
        });

        try {
            await sendVerificationEmail(user.email, verificationToken);
        } catch (emailErr) {
            console.error("Email send failed:", emailErr.message);
        }

        res.status(201).json({
            message: "Registration successful. Please check your email to verify your account.",
        });
    } catch (err) {
        console.error("Register error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification link" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        res.json({ message: "Email verified successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email before logging in" });
        }

        const parser = new UAParser(req.headers["user-agent"]);
        const ua = parser.getResult();
        const deviceInfo = {
            device: ua.device.model || ua.device.type || "Desktop",
            browser: ua.browser.name || "Unknown",
            os: ua.os.name ? `${ua.os.name} ${ua.os.version || ""}`.trim() : "Unknown",
        };

        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown";
        const jti = crypto.randomBytes(16).toString("hex");

        try {
            await Session.findOneAndUpdate(
                {
                    userId: user._id,
                    device: deviceInfo.device,
                    browser: deviceInfo.browser,
                    os: deviceInfo.os,
                },
                {
                    $set: {
                        jti,
                        ip,
                        lastActive: new Date(),
                    },
                },
                { upsert: true, new: true }
            );
        } catch (dupErr) {
            if (dupErr.code === 11000) {
                await Session.findOneAndUpdate(
                    {
                        userId: user._id,
                        device: deviceInfo.device,
                        browser: deviceInfo.browser,
                        os: deviceInfo.os,
                    },
                    {
                        $set: {
                            jti,
                            ip,
                            lastActive: new Date(),
                        },
                    },
                    { new: true }
                );
            } else {
                throw dupErr;
            }
        }

        const token = jwt.sign(
            { userId: user._id, jti },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password -verificationToken -verificationTokenExpiry -resetToken -resetTokenExpiry");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "If an account with that email exists, a reset link has been sent." });
        }

        const resetToken = generateToken();
        user.resetToken = resetToken;
        user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();

        await sendResetEmail(user.email, resetToken);

        res.json({ message: "If an account with that email exists, a reset link has been sent." });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset link" });
        }

        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        await Session.deleteMany({ userId: user._id });

        res.json({ message: "Password reset successful. Please log in with your new password." });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
