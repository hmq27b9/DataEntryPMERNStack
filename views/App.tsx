//views/App.tsx
import { Navigate, Route, Routes } from "react-router-dom";
import LoginView from "./starterPages/LoginView";
import DashboardView from "./starterPages/DashboardView";
import DataEntryPostgresView from "./dataEntryPostgresPages/DataEntryPostgresView";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.85rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        checking…
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginView />
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? <DashboardView /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/data-entry-postgres"
        element={
          isAuthenticated ? (
            <DataEntryPostgresView />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
