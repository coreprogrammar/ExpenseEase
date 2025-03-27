import { Route, Routes } from "react-router-dom";
import routes from "../../routes/index.js";
import Home from "../pages/Home.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Profile from "../pages/Profile.jsx";
import ProtectedRoute from "./ProtectedRoutes.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";
import PDFUpload from "../pages/PDFUpload.jsx";
import Categories from "../pages/Categories.jsx";
import TransactionPage from "../pages/TransactionPage.jsx";
import BudgetPage from "../pages/BudgetPage.jsx";
import Reports from "../pages/Reports.jsx";


export default function ExpenseEaseRoutes() {
  return (
    <Routes>
      <Route path={routes.home} element={<Home />} />
      <Route path={routes.signup} element={<Register />} />
      <Route path={routes.login} element={<Login />} />
      
      {/* ✅ Forgot & Reset Password Routes */}
      <Route path={routes.forgotPassword} element={<ForgotPassword />} />
      <Route path={routes.resetPassword} element={<ResetPassword />} />

      {/* ✅ Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path={routes.dashboard} element={<Dashboard />} />
        <Route path={routes.profile} element={<Profile />} />
        <Route path={routes.pdfUpload} element={<PDFUpload />} />
        <Route path={routes.categoryManage} element={<Categories/>} />
        <Route path={routes.transactions} element={<TransactionPage/>} />
        <Route path={routes.budget} element={<BudgetPage/>} />
        <Route path={routes.report} element={<Reports/>} />
      </Route>
    </Routes>
  );
}
