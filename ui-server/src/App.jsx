import './App.css'
import Navbar from "./components/navbar/Navbar.jsx";
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ExpenseEaseRoutes from "./components/Routes/ExpenseEaseRoutes.jsx";


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
      <Navbar/>
      <div className="mt-16">
        <ExpenseEaseRoutes />
      </div>
    </Router>
  </React.StrictMode>
  )
}

export default App
