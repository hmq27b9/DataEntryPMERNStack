//views/components/Header.tsx
import { Link, useNavigate } from "react-router-dom";
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
  const { logout, isAuthenticated } = useAuth();

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
      <div style={styles.left}>
        <Link to="/" style={styles.brand}>
          {title}
        </Link>

        {isAuthenticated && (
          <nav style={styles.nav}>
            <Link to="/dashboard" style={styles.navLink}>
              dashboard
            </Link>
            <Link to="/data-entry-postgres" style={styles.navLink}>
              data entry
            </Link>
          </nav>
        )}
      </div>

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
  left: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },
  brand: {
    color: "#000",
    textDecoration: "none",
    fontWeight: 500,
  },
  nav: {
    display: "flex",
    gap: "1.25rem",
  },
  navLink: {
    color: "#000",
    textDecoration: "none",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    opacity: 0.6,
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
