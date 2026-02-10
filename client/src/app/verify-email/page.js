"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Suspense } from "react";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("No verification token provided");
            return;
        }

        api.verifyEmail(token)
            .then((data) => {
                setStatus("success");
                setMessage(data.message);
            })
            .catch((err) => {
                setStatus("error");
                setMessage(err.message);
            });
    }, [token]);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Email Verification</h1>
                {status === "verifying" && <p>Verifying your email...</p>}
                {status === "success" && (
                    <>
                        <div className="message success">{message}</div>
                        <Link href="/login">Go to Login</Link>
                    </>
                )}
                {status === "error" && (
                    <>
                        <div className="message error">{message}</div>
                        <Link href="/register">Back to Register</Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmail() {
    return (
        <Suspense fallback={<div className="auth-container"><p>Loading...</p></div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
