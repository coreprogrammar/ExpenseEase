import { Route, Routes, } from 'react-router-dom';

import routes from '../../routes/index.js';
import Home from "../pages/Home.jsx";
import Register from "../pages/Register.jsx";

export default function ExpenseEaseRoutes() {
  return (
    <Routes>
      <Route path={routes.home} element={<Home/>} />
      <Route path={routes.signup} element={<Register />} />
    </Routes>
  );
}
