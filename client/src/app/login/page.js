"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import { api } from "@/lib/api";

export default function Login() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            await api.login(form);
            router.push("/dashboard");
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Log In</h1>
                {message && (
                    <div className={`message ${message.type}`}>{message.text}</div>
                )}
                <form onSubmit={handleSubmit} className="auth-form">
                    <FormInput label="Email" id="email" type="email" value={form.email} onChange={handleChange("email")} />
                    <FormInput label="Password" id="password" type="password" value={form.password} onChange={handleChange("password")} />
                    <Button type="submit" disabled={loading}>Log In</Button>
                </form>
                <div className="auth-footer">
                    Don&apos;t have an account? <Link href="/register">Register</Link>
                </div>
            </div>
        </div>
    );
}
