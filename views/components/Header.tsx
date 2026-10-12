import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  title?: string;
  showLogout?: boolean;
}

export default function Header({
  title = "DataEntryPMERNStack",
  showLogout = false,
}: HeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <header style={styles.header}>
      <span>{title}</span>
      {showLogout && (
        <button style={styles.logout} onClick={handleLogout}>
          logout
        </button>
      )}
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 1.5rem",
    borderBottom: "1px solid #000",
    fontSize: "0.85rem",
    letterSpacing: "0.02em",
  },
  logout: {
    background: "transparent",
    border: "1px solid #000",
    padding: "0.35rem 0.75rem",
    fontSize: "0.75rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    cursor: "pointer",
  },
};
