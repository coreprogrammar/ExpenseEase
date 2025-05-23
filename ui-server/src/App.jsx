import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar.jsx";
import React from 'react';
import ExpenseEaseRoutes from "./components/Routes/ExpenseEaseRoutes.jsx";
import Footer from './components/pages/Footer.jsx';

function App() {
  return (


  <React.StrictMode>
    <Router future={
      {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }
    }
    >
      <Navbar />
      <div className="pt-16 p-6">
        <ExpenseEaseRoutes />
      </div>
      <Footer />
    </Router>
  </React.StrictMode>
  )
}

export default App;
