import jwt from "jsonwebtoken";
import Session from "../models/Session.js";

const authenticate = async (req, res, next) => {
    try {
        let token = null;

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const session = await Session.findOne({
            jti: decoded.jti,
            userId: decoded.userId,
        });

        if (!session) {
            res.clearCookie("token");
            return res.status(401).json({ message: "Session expired or revoked" });
        }

        session.lastActive = new Date();
        await session.save();

        req.userId = decoded.userId;
        req.jti = decoded.jti;
        req.sessionId = session._id.toString();

        next();
    } catch (err) {
        res.clearCookie("token");
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default authenticate;
