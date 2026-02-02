
import { useState } from "react";
import { login } from "../api/authApi";
import sha256 from "crypto-js/sha256";

export default function Login({ onLogin }) {
  const [empCode, setEmpCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const hexPassword = sha256(password).toString();

      const result = await login({
        empCode,
        hexPassword
      });

      // ✅ STORE JWT
      localStorage.setItem("token", result.token);

      // ✅ UPDATE APP STATE (THIS CAUSES REDIRECT)
      onLogin(result.token);

    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: "50px auto" }}>
      <h2>IT Asset Management Login</h2>

      <input
        placeholder="Employee Code"
        value={empCode}
        onChange={(e) => setEmpCode(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
