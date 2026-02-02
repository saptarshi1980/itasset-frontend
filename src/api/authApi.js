// src/api/authApi.js

const API_BASE = ""; // if running dev server proxy, keep it empty or use "http://localhost:3000"

/**
 * Login API
 * @param {Object} data - { empCode, password }
 * @returns {Object} { token }
 */
export async function login(data) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Login failed");
  }

  return res.json();
}

/**
 * Optional: helper to get stored token
 */
export function getToken() {
  return localStorage.getItem("token");
}

/**
 * Optional: helper to logout
 */
export function logout() {
  localStorage.removeItem("token");
}
