import mongoose from "mongoose";
import Session from "../models/Session.js";

export const logout = async (req, res) => {
    try {
        await Session.deleteOne({ jti: req.jti, userId: req.userId });

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        res.json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const logoutAll = async (req, res) => {
    try {
        await Session.deleteMany({ userId: req.userId });

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        res.json({ message: "Logged out from all devices" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const getSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ userId: req.userId })
            .select("device browser os ip lastActive createdAt")
            .sort({ lastActive: -1 })
            .lean();

        const formatted = sessions.map((session) => ({
            id: session._id,
            device: session.device,
            browser: session.browser,
            os: session.os,
            ip: session.ip,
            lastActive: session.lastActive,
            createdAt: session.createdAt,
            isCurrent: session._id.toString() === req.sessionId,
        }));

        res.json({ sessions: formatted });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const revokeSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(sessionId)) {
            return res.status(400).json({ message: "Invalid session ID" });
        }

        const session = await Session.findOne({
            _id: sessionId,
            userId: req.userId,
        });

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        if (session.jti === req.jti) {
            return res.status(400).json({ message: "Cannot revoke current session. Use logout instead." });
        }

        await Session.deleteOne({ _id: sessionId });

        res.json({ message: "Session revoked successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
