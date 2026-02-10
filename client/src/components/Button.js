"use client";

import styles from "./Button.module.css";

export default function Button({ children, type = "button", onClick, disabled = false, variant = "primary" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${styles.button} ${styles[variant]}`}
        >
            {disabled ? "Please wait..." : children}
        </button>
    );
}
