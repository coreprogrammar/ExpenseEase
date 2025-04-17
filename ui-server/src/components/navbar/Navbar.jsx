import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleAuthChange);
    return () => window.removeEventListener("storage", handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const navLinkClasses = "text-gray-700 hover:text-indigo-600 transition duration-200 font-medium";

  return (
    <nav className="bg-white shadow fixed top-0 left-0 w-full z-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-indigo-600">ExpenseEase</Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex space-x-6 items-center">
            <li><Link to="/" className={navLinkClasses}>Home</Link></li>
            <li><Link to="/about" className={navLinkClasses}>About</Link></li>
            <li><Link to="/services" className={navLinkClasses}>Services</Link></li>
            <li><Link to="/dashboard" className={navLinkClasses}>Dashboard</Link></li>
          

            {isAuthenticated ? (
              <>
                <li><Link to="/profile" className={navLinkClasses}>Profile</Link></li>
                <li><Link to="/upload-pdf" className={navLinkClasses}>Upload PDF</Link></li>
                <li><Link to="/categories" className={navLinkClasses}>Categories</Link></li>
                <li><Link to="/reports" className={navLinkClasses}>Reports</Link></li>
                <li>
                  <button onClick={handleLogout} className="text-red-600 font-semibold hover:text-red-800 transition">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/sign-up" className={navLinkClasses}>Sign Up</Link></li>
                <li><Link to="/login" className={navLinkClasses}>Login</Link></li>
              </>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button className="md:hidden focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <XMarkIcon className="h-6 w-6 text-gray-800" /> : <Bars3Icon className="h-6 w-6 text-gray-800" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-16 left-0 w-full z-40 py-4 px-6">
          <ul className="flex flex-col space-y-4">
            <li><Link to="/" className={navLinkClasses} onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/about" className={navLinkClasses} onClick={() => setMenuOpen(false)}>About</Link></li>
            <li><Link to="/services" className={navLinkClasses} onClick={() => setMenuOpen(false)}>Services</Link></li>
            

            {isAuthenticated ? (
              <>
                <li><Link to="/dashboard" className={navLinkClasses} onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
                <li><Link to="/profile" className={navLinkClasses} onClick={() => setMenuOpen(false)}>Profile</Link></li>
                <li><Link to="/upload-pdf" className={navLinkClasses} onClick={() => setMenuOpen(false)}>Upload PDF</Link></li>
                <li><Link to="/categories" className={navLinkClasses} onClick={() => setMenuOpen(false)}>Categories</Link></li>
                <li><Link to="/reports" className={navLinkClasses} onClick={() => setMenuOpen(false)}>Reports</Link></li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="text-red-600 font-semibold hover:text-red-800 transition"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/sign-up" className={navLinkClasses} onClick={() => setMenuOpen(false)}>Sign Up</Link></li>
                <li><Link to="/login" className={navLinkClasses} onClick={() => setMenuOpen(false)}>Login</Link></li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
