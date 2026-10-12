//views/starterPages/DashboardView.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

export default function DashboardView() {
  const { token, user, logout } = useAuth();
  const [loading, setLoading] = useState<boolean>(!user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    if (user) {
      setLoading(false);
      return;
    }
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load profile");
      })
      .catch(() => {
        logout();
        navigate("/login", { replace: true });
      })
      .finally(() => setLoading(false));
  }, [token, user, logout, navigate]);

  if (loading) {
    return (
      <>
        <Header showLogout />
        <p style={{ padding: "2rem", fontSize: "0.85rem" }}>loading…</p>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Header showLogout />
      <main style={styles.main}>
        <p style={styles.kicker}>dashboard</p>
        <h1 style={styles.title}>{user.username}</h1>
        <p style={styles.meta}>{user.email}</p>
      </main>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    padding: "4rem 1.5rem",
    maxWidth: "640px",
    margin: "0 auto",
  },
  kicker: {
    fontSize: "0.75rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    marginBottom: "0.75rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 400,
    letterSpacing: "-0.01em",
    marginBottom: "0.5rem",
  },
  meta: {
    fontSize: "0.9rem",
    borderTop: "1px solid #000",
    paddingTop: "0.75rem",
    marginTop: "1rem",
  },
};
