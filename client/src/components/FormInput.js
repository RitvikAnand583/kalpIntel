"use client";

import styles from "./FormInput.module.css";

export default function FormInput({ label, id, type = "text", value, onChange, required = true }) {
    return (
        <div className={styles.group}>
            <label htmlFor={id} className={styles.label}>{label}</label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                className={styles.input}
                autoComplete="off"
            />
        </div>
    );
}
