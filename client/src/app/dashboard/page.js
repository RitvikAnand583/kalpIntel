"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import Button from "@/components/Button";

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

    const handleLogout = async () => {
        try {
            await api.logout();
            router.replace("/login");
        } catch (err) {
            alert(err.message);
        }
    };

    const handleLogoutAll = async () => {
        try {
            await api.logoutAll();
            router.replace("/login");
        } catch (err) {
            alert(err.message);
        }
    };

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
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "24px" }}>
                    You are logged in. This is a protected page.
                </p>
                <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                    <Button onClick={handleLogout}>Logout</Button>
                    <Button onClick={handleLogoutAll} variant="secondary">
                        Logout All Devices
                    </Button>
                </div>
                <Link
                    href="/devices"
                    style={{ fontSize: "14px", color: "#1a1a1a" }}
                >
                    Manage Devices
                </Link>
            </div>
        </div>
    );
}
