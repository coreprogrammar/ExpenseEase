import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Full-page Money Background */}
      <div className="absolute inset-0 -z-10">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="moneyPattern" patternUnits="userSpaceOnUse" width="100" height="100">
              <text
                x="0"
                y="50"
                fontFamily="sans-serif"
                fontSize="40"
                fill="rgba(255,255,255,0.1)"
              >
                $
              </text>
            </pattern>
          </defs>
          <rect width="800" height="600" fill="url(#moneyPattern)" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">ExpenseEase</h1>
            <p className="text-xl mb-8">
              Simplify your finances—track your expenses, manage budgets, and get actionable insights, all in one place.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/sign-up"
                className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded hover:bg-gray-100"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 border border-white text-white font-semibold rounded hover:bg-white hover:text-indigo-600"
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose ExpenseEase?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 border rounded-lg shadow hover:shadow-lg transition duration-300">
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">Intuitive Dashboard</h3>
                <p className="text-gray-600">
                  View interactive charts and insights that give you a clear picture of your spending and budget performance.
                </p>
              </div>
              <div className="p-6 border rounded-lg shadow hover:shadow-lg transition duration-300">
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">Automated Expense Tracking</h3>
                <p className="text-gray-600">
                  Upload your bank statements and let our smart parser extract your transactions automatically.
                </p>
              </div>
              <div className="p-6 border rounded-lg shadow hover:shadow-lg transition duration-300">
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">Actionable Alerts & Reports</h3>
                <p className="text-gray-600">
                  Receive suggestions when you’re nearing your budget limits and generate detailed reports to stay on top of your finances.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="bg-indigo-600 text-white py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to take control of your finances?</h2>
            <p className="text-xl mb-8">
              Join ExpenseEase today and start managing your expenses smarter.
            </p>
            <div className="flex justify-center">
              <Link
                to="/sign-up"
                className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded hover:bg-gray-100"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-300 py-6 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} ExpenseEase. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
