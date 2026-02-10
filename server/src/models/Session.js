import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        jti: {
            type: String,
            required: true,
            unique: true,
        },
        device: {
            type: String,
            default: "Unknown",
        },
        browser: {
            type: String,
            default: "Unknown",
        },
        os: {
            type: String,
            default: "Unknown",
        },
        ip: {
            type: String,
            default: "Unknown",
        },
        lastActive: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

sessionSchema.index({ userId: 1 });
sessionSchema.index(
    { userId: 1, device: 1, browser: 1, os: 1 },
    { unique: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
