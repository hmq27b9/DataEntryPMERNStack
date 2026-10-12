import { Navigate, Route, Routes } from "react-router-dom";
import LoginView from "./starterPages/LoginView";
import DashboardView from "./starterPages/DashboardView";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginView />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <DashboardView /> : <Navigate to="/login" />}
      />
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
