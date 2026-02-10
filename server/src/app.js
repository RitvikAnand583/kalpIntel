import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import sessionRoutes from "./routes/session.js";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);

export default app;
