import { Link } from "react-router-dom";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-indigo-900 text-white py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold mb-3">ExpenseEase</h2>
          <p className="text-sm text-gray-300">
            Your ultimate tool for budget tracking, expense insights and smart
            financial decisions.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-indigo-300">Home</Link></li>
            <li><Link to="/about" className="hover:text-indigo-300">About</Link></li>
            <li><Link to="/services" className="hover:text-indigo-300">Services</Link></li>
            <li><Link to="/dashboard" className="hover:text-indigo-300">Dashboard</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-300">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-indigo-300" />
              Brantford, Ontario, Canada
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon className="w-5 h-5 text-indigo-300" />
              +1 (234) 567-8901
            </li>
            <li className="flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5 text-indigo-300" />
              support@expenseease.dev
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Follow Us</h3>
          <div className="flex gap-4 text-xl text-indigo-200">
            <a href="#" className="hover:text-white"><FaFacebookF /></a>
            <a href="#" className="hover:text-white"><FaTwitter /></a>
            <a href="#" className="hover:text-white"><FaInstagram /></a>
            <a href="#" className="hover:text-white"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-sm text-gray-400 mt-10 border-t border-indigo-800 pt-4">
        © {new Date().getFullYear()} ExpenseEase. Designed with 💙 by Team ExpenseEase.
      </div>
    </footer>
  );
};

export default Footer;
