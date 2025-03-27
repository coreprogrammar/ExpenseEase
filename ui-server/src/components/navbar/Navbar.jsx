import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.module.css";
import { Bars3Icon } from "@heroicons/react/16/solid";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  // ✅ Listen for authentication changes dynamically
  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token")); // ✅ Update state immediately
    };

    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Remove token
    setIsAuthenticated(false); // ✅ Update state immediately
    window.dispatchEvent(new Event("storage")); // ✅ Notify all components of logout
    navigate("/login"); // ✅ Redirect to login page
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-indigo-600">ExpenseEase</h1>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6">
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
            <li>
              <Link to="/services" className="nav-link">
                Services
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
            </li>

            {/* Conditionally show links if logged in */}
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/profile" className="nav-link">
                    Profile
                  </Link>
                </li>
                {/* Add "Upload PDF" link for authenticated users */}
                <li>
                  <Link to="/upload-pdf" className="nav-link">
                    Upload PDF
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Category Management
                  </Link>
                </li>
                <li>
                  <Link to="/reports" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Reports
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="nav-link text-red-600 font-semibold"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/sign-up" className="nav-link">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
              </>
            )}
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
            <li>
              <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link to="/services" className="nav-link" onClick={() => setMenuOpen(false)}>
                Services
              </Link>
            </li>
            
            <li>
              <Link to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>
                </li>
                {/* Add "Upload PDF" link here too */}
                <li>
                  <Link to="/upload-pdf" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Upload PDF
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Category Management
                  </Link>
                </li>
                <li>
                  <Link to="/reports" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Reports
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="nav-link text-red-600 font-semibold"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/sign-up" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
