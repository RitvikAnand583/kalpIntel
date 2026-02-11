"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import { api } from "@/lib/api";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [form, setForm] = useState({ password: "", confirmPassword: "" });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (form.password !== form.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match" });
            return;
        }

        if (form.password.length < 8) {
            setMessage({ type: "error", text: "Password must be at least 8 characters" });
            return;
        }

        setLoading(true);

        try {
            const data = await api.resetPassword(token, { password: form.password });
            setMessage({ type: "success", text: data.message });
            setTimeout(() => router.push("/login"), 2000);
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h1>Invalid Link</h1>
                    <p style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>
                        This password reset link is invalid or missing a token.
                    </p>
                    <div className="auth-footer">
                        <Link href="/forgot-password">Request a new link</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Reset Password</h1>
                {message && (
                    <div className={`message ${message.type}`}>{message.text}</div>
                )}
                <form onSubmit={handleSubmit} className="auth-form">
                    <FormInput
                        label="New Password"
                        id="new-password"
                        type="password"
                        value={form.password}
                        onChange={handleChange("password")}
                    />
                    <FormInput
                        label="Confirm Password"
                        id="confirm-password"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange("confirmPassword")}
                    />
                    <Button type="submit" disabled={loading}>Reset Password</Button>
                </form>
                <div className="auth-footer">
                    <Link href="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={<div className="auth-container"><p>Loading...</p></div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
