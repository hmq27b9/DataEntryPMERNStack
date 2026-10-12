//views/starterPages/LoginView.tsx
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AuthUser, useAuth } from "../context/AuthContext";

interface FormState {
  email: string;
  password: string;
}

interface AuthResponse {
  user?: AuthUser;
  token?: string;
  error?: string;
}

export default function LoginView() {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data: AuthResponse = await res.json();
      if (!res.ok || !data.token || !data.user) {
        throw new Error(data.error || "Login failed");
      }

      login(data.token, data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main style={styles.main}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <h1 style={styles.title}>Sign in</h1>

          <label style={styles.label}>
            email
            <input
              style={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </label>

          <label style={styles.label}>
            password
            <input
              style={styles.input}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "..." : "continue"}
          </button>
        </form>
      </main>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "calc(100vh - 57px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
  },
  form: {
    width: "100%",
    maxWidth: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: 400,
    letterSpacing: "0.02em",
    marginBottom: "0.5rem",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  input: {
    padding: "0.6rem 0",
    border: "none",
    borderBottom: "1px solid #000",
    background: "transparent",
    fontSize: "0.95rem",
  },
  button: {
    marginTop: "0.5rem",
    padding: "0.75rem 1rem",
    background: "#000",
    color: "#fff",
    border: "1px solid #000",
    fontSize: "0.85rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  error: {
    fontSize: "0.8rem",
    borderLeft: "2px solid #000",
    paddingLeft: "0.75rem",
  },
};
