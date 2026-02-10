const API_URL = process.env.NEXT_PUBLIC_API_URL;

const request = async (endpoint, options = {}) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        ...options,
    });

    const data = await res.json();

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

    login: (body) =>
        request("/auth/login", { method: "POST", body: JSON.stringify(body) }),

    getMe: () =>
        request("/auth/me"),

    logout: () =>
        request("/session/logout", { method: "POST" }),

    logoutAll: () =>
        request("/session/logout-all", { method: "POST" }),

    getDevices: () =>
        request("/session/devices"),

    revokeSession: (sessionId) =>
        request(`/session/${sessionId}`, { method: "DELETE" }),
};
