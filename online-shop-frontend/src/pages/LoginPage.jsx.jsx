import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:9090/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Login fehlgeschlagen");
      }

      const data = await response.json();
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message || "Unbekannter Fehler");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Einloggen</h2>
        <p className="subheading">
          Melde dich mit deinem Konto an, um zu bestellen.
        </p>
      </div>

      <div className="card" style={{ maxWidth: "420px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "0.8rem" }}>
            <label className="form-label">E-Mail</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: "0.8rem" }}>
            <label className="form-label">Passwort</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="info-text error">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? "Wird eingeloggt..." : "Einloggen"}
          </button>
        </form>

        <p style={{ marginTop: "0.8rem", fontSize: "0.9rem" }}>
          Noch kein Konto?{" "}
          <Link to="/register" className="link-inline">
            Jetzt registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
