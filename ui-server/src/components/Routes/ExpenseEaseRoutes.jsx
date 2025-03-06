import { Route, Routes } from "react-router-dom";
import routes from "../../routes/index.js";
import Home from "../pages/Home.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import ProtectedRoute from "./ProtectedRoutes.jsx";  

export default function ExpenseEaseRoutes() {
  return (
    <Routes>
      <Route path={routes.home} element={<Home />} />
      <Route path={routes.signup} element={<Register />} />
      <Route path={routes.login} element={<Login />} />

      {/* ✅ Protect Dashboard Route */}
      <Route element={<ProtectedRoute />}>
        <Route path={routes.dashboard} element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
