import { Navigate, Route, Routes } from "react-router-dom";
import LoginView from "./starterPages/LoginView";
import DashboardView from "./starterPages/DashboardView";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route
        path="/dashboard"
        element={token ? <DashboardView /> : <Navigate to="/login" />}
      />
      <Route
        path="/"
        element={<Navigate to={token ? "/dashboard" : "/login"} />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
