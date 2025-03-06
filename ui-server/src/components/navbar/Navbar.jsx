import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import "./Navbar.module.css";
import { Bars3Icon } from "@heroicons/react/16/solid";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-indigo-600">ExpenseEase</h1>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/about" className="nav-link">About</Link></li>
            <li><Link to="/services" className="nav-link">Services</Link></li>
            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
            <li><Link to="/contact" className="nav-link">Contact</Link></li>
            <li><Link to="/sign-up" className="nav-link">Sign Up</Link></li>
          </ul>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Bars3Icon className="h-6 w-6 text-gray-800" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md absolute top-16 left-0 w-full py-4">
          <ul className="flex flex-col items-center space-y-4">
            <li><Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>About</Link></li>
            <li><Link to="/services" className="nav-link" onClick={() => setMenuOpen(false)}>Services</Link></li>
            <li><Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
            <li><Link to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>Contact</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
