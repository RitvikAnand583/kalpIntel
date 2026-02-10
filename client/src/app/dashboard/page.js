"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getMe()
            .then((data) => setUser(data.user))
            .catch(() => router.replace("/login"))
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) {
        return (
            <div className="auth-container">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Dashboard</h1>
                <div style={{ marginBottom: "16px" }}>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}</p>
                </div>
                <p style={{ color: "#666", fontSize: "14px" }}>
                    You are logged in. This is a protected page.
                </p>
            </div>
        </div>
    );
}
