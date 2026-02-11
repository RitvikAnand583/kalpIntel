const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
};

const setToken = (token) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
    }
};

const removeToken = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
    }
};

const request = async (endpoint, options = {}) => {
    const headers = {
        "Content-Type": "application/json",
    };

    const token = getToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        headers,
        credentials: "include",
        ...options,
    });

    let data;
    try {
        data = await res.json();
    } catch {
        throw new Error("Unable to connect to server");
    }

    if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};

export const api = {
    register: (body) =>
        request("/auth/register", { method: "POST", body: JSON.stringify(body) }),

    verifyEmail: (token) =>
        request(`/auth/verify-email/${token}`),

    login: async (body) => {
        const data = await request("/auth/login", { method: "POST", body: JSON.stringify(body) });
        if (data.token) {
            setToken(data.token);
        }
        return data;
    },

    getMe: () =>
        request("/auth/me"),

    logout: async () => {
        const data = await request("/session/logout", { method: "POST" });
        removeToken();
        return data;
    },

    logoutAll: async () => {
        const data = await request("/session/logout-all", { method: "POST" });
        removeToken();
        return data;
    },

    getDevices: () =>
        request("/session/devices"),

    revokeSession: (sessionId) =>
        request(`/session/${sessionId}`, { method: "DELETE" }),

    forgotPassword: (body) =>
        request("/auth/forgot-password", { method: "POST", body: JSON.stringify(body) }),

    resetPassword: (token, body) =>
        request(`/auth/reset-password/${token}`, { method: "POST", body: JSON.stringify(body) }),
};
