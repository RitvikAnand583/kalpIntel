"use client";

import { useState } from "react";
import Link from "next/link";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import { api } from "@/lib/api";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
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
            const data = await api.register(form);
            setMessage({ type: "success", text: data.message });
            setForm({ name: "", email: "", password: "" });
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Create Account</h1>
                {message && (
                    <div className={`message ${message.type}`}>{message.text}</div>
                )}
                <form onSubmit={handleSubmit} className="auth-form">
                    <FormInput label="Name" id="name" value={form.name} onChange={handleChange("name")} />
                    <FormInput label="Email" id="email" type="email" value={form.email} onChange={handleChange("email")} />
                    <FormInput label="Password" id="password" type="password" value={form.password} onChange={handleChange("password")} />
                    <Button type="submit" disabled={loading}>Register</Button>
                </form>
                <div className="auth-footer">
                    Already have an account? <Link href="/login">Log in</Link>
                </div>
            </div>
        </div>
    );
}
