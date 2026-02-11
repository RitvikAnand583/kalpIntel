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
                <div style={{
                    padding: "16px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    border: "1px solid #f3f4f6"
                }}>
                    <p style={{ marginBottom: "6px" }}><strong>Name:</strong> {user.name}</p>
                    <p style={{ marginBottom: "6px" }}><strong>Email:</strong> {user.email}</p>
                    <p><strong>Status:</strong> {user.isVerified ? "Verified" : "Unverified"}</p>
                </div>
                <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                    <Button onClick={handleLogout}>Logout</Button>
                    <Button onClick={handleLogoutAll} variant="danger">
                        Logout All Devices
                    </Button>
                </div>
                <div style={{ textAlign: "center" }}>
                    <Link href="/devices" style={{ fontSize: "14px", color: "#1a1a1a" }}>
                        Manage Devices
                    </Link>
                </div>
            </div>
        </div>
    );
}
