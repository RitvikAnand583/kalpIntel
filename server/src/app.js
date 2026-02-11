import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import sessionRoutes from "./routes/session.js";

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const allowed = [process.env.CLIENT_URL];
        if (
            allowed.includes(origin) ||
            origin.endsWith(".vercel.app") ||
            origin.endsWith(".onrender.com")
        ) {
            return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Internal server error" });
});

export default app;
