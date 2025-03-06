import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar.jsx";
import Dashboard from './components/pages/Dashboard.jsx';
import Home from './components/pages/Home.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      {/* Add padding to prevent overlap */}
      <div className="pt-16 p-6">
      
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<Home />} />

          {/* Dashboard Route */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </div>
    </Router>
  );
}

export default App;
