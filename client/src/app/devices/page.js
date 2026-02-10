"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import styles from "./devices.module.css";

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString();
}

function SessionCard({ session, onRevoke }) {
    return (
        <div className={`${styles.sessionCard} ${session.isCurrent ? styles.current : ""}`}>
            <div className={styles.sessionTop}>
                <div>
                    <p className={styles.deviceName}>
                        {session.browser} on {session.os}
                        {session.isCurrent && (
                            <span className={styles.currentTag}>This device</span>
                        )}
                    </p>
                    <p className={styles.sessionDetails}>
                        Device: {session.device}<br />
                        IP: {session.ip}<br />
                        Last active: {formatDate(session.lastActive)}
                    </p>
                </div>
                {!session.isCurrent && (
                    <button
                        className={styles.revokeBtn}
                        onClick={() => onRevoke(session.id)}
                    >
                        Revoke
                    </button>
                )}
            </div>
        </div>
    );
}

export default function DevicesPage() {
    const router = useRouter();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = useCallback(async () => {
        try {
            const data = await api.getDevices();
            setSessions(data.sessions);
        } catch {
            router.replace("/login");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    const handleRevoke = async (sessionId) => {
        try {
            await api.revokeSession(sessionId);
            setSessions((prev) => prev.filter((s) => s.id !== sessionId));
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

    return (
        <div className="auth-container">
            <div className={styles.devicesPage}>
                <div className={styles.header}>
                    <h1>Active Sessions</h1>
                    <Link href="/dashboard" className={styles.backLink}>
                        Back
                    </Link>
                </div>
                <div className={styles.sessionList}>
                    {sessions.length === 0 ? (
                        <p className={styles.empty}>No active sessions found.</p>
                    ) : (
                        sessions.map((session) => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                onRevoke={handleRevoke}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
