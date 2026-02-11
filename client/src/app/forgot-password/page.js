"use client";

import { useState } from "react";
import Link from "next/link";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import { api } from "@/lib/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            const data = await api.forgotPassword({ email });
            setMessage({ type: "success", text: data.message });
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Forgot Password</h1>
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
                    Enter your email address and we will send you a link to reset your password.
                </p>
                {message && (
                    <div className={`message ${message.type}`}>{message.text}</div>
                )}
                <form onSubmit={handleSubmit} className="auth-form">
                    <FormInput
                        label="Email"
                        id="forgot-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button type="submit" disabled={loading}>Send Reset Link</Button>
                </form>
                <div className="auth-footer">
                    <Link href="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}
