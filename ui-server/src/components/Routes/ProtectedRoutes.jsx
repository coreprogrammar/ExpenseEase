import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("🔴 No token found. Redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    console.log("🟢 Decoded Token:", decoded); // ✅ Log decoded token
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      console.log("🔴 Token expired. Redirecting to login...");
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    console.log("✅ User is authenticated. Access granted.");
    return <Outlet />;
  } catch (error) {
    console.log("🔴 Invalid token. Redirecting to login...");
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
