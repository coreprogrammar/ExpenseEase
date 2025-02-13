import { useState } from "react";
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
            <li><a href="#" className="nav-link">Home</a></li>
            <li><a href="#" className="nav-link">About</a></li>
            <li><a href="#" className="nav-link">Services</a></li>
            <li><a href="#" className="nav-link">Contact</a></li>
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
            <li><a href="#" className="nav-link" onClick={() => setMenuOpen(false)}>Home</a></li>
            <li><a href="#" className="nav-link" onClick={() => setMenuOpen(false)}>About</a></li>
            <li><a href="#" className="nav-link" onClick={() => setMenuOpen(false)}>Services</a></li>
            <li><a href="#" className="nav-link" onClick={() => setMenuOpen(false)}>Contact</a></li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
