import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

interface MeResponse {
  user?: User;
  error?: string;
}

export default function DashboardView() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then(async (res) => {
        const data: MeResponse = await res.json();
        if (!res.ok || !data.user) throw new Error(data.error || "Failed");
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ padding: "2rem" }}>Loading...</div>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.title}>Welcome, {user.username}!</h1>
        <p style={styles.muted}>{user.email}</p>
        <p style={styles.muted}>
          Member since: {new Date(user.created_at).toLocaleDateString()}
        </p>
        <button style={styles.button} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "3rem 2rem",
    maxWidth: "720px",
    margin: "0 auto",
  },
  title: {
    fontSize: "1.75rem",
    marginBottom: "0.5rem",
  },
  muted: {
    color: "#666",
    marginBottom: "0.5rem",
  },
  button: {
    padding: "0.75rem 1.5rem",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "1.5rem",
  },
};
