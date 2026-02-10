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
