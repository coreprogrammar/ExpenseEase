import React from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Smart Budgeting',
    description: 'Create, track and manage your budgets based on categories and time periods.',
    icon: '💡',
  },
  {
    title: 'PDF Statement Parsing',
    description: 'Easily upload and extract transactions from your bank/credit card PDFs.',
    icon: '📄',
  },
  {
    title: 'Visual Analytics',
    description: 'Interactive charts and reports to help you visualize and optimize your spending.',
    icon: '📊',
  },
  {
    title: 'Automated Alerts',
    description: 'Get real-time alerts when your budget limit approaches.',
    icon: '🔔',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    features: ['10 Transactions/month', '1 Budget Category', 'PDF Upload (Basic)', 'Email Support'],
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$9.99/mo',
    features: ['Unlimited Transactions', 'Unlimited Budgets', 'Priority Support', 'Advanced Reports'],
    highlight: true,
  },
  {
    name: 'Team',
    price: '$29.99/mo',
    features: ['Team Collaboration', 'Admin Dashboard', 'Custom Alerts', 'CSV Exports'],
    highlight: false,
  },
];

const testimonials = [
  {
    name: 'Sarah J.',
    quote: 'ExpenseEase changed the way I budget. I now save $300 every month!',
    avatar: 'https://i.pravatar.cc/100?img=32',
  },
  {
    name: 'Liam M.',
    quote: 'The visual reports and alerts keep me in control of my finances 24/7.',
    avatar: 'https://i.pravatar.cc/100?img=47',
  },
  {
    name: 'Anjali K.',
    quote: 'PDF upload feature is a game-changer. Super accurate and seamless!',
    avatar: 'https://i.pravatar.cc/100?img=18',
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-20">
      <motion.h1
        className="text-4xl font-extrabold text-center text-indigo-600 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Our Services
      </motion.h1>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>

    
      {/* Pricing Plans Section */}
        <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10 animate-fade-in">Flexible Pricing for Everyone</h2>
            <div className="grid md:grid-cols-3 gap-8">
            {[
                {
                name: "Basic",
                price: "Free",
                features: ["Upload up to 5 PDFs", "Basic Budget Tracking", "Essential Reports"],
                highlight: false,
                },
                {
                name: "Pro",
                price: "$9.99/mo",
                features: ["Unlimited PDFs", "Advanced Budgeting", "Category Management", "Daily Email Summary"],
                highlight: true,
                },
                {
                name: "Enterprise",
                price: "Contact Us",
                features: ["Custom Integration", "Priority Support", "Team Access", "AI-driven Suggestions"],
                highlight: false,
                },
            ].map((plan) => (
                <div
                key={plan.name}
                className={`rounded-xl p-6 shadow-md transition transform hover:scale-105 ${plan.highlight ? 'bg-indigo-100 border-2 border-indigo-600' : 'bg-white'}`}
                >
                <h3 className="text-2xl font-semibold text-indigo-700 mb-3">{plan.name}</h3>
                <p className="text-3xl font-bold mb-4">{plan.price}</p>
                <ul className="space-y-2 text-gray-700 mb-6">
                    {plan.features.map((f, idx) => (
                    <li key={idx}>✅ {f}</li>
                    ))}
                </ul>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    {plan.name === "Enterprise" ? "Get in Touch" : "Start Now"}
                </button>
                </div>
            ))}
            </div>
        </div>
        </section>

      {/* Testimonials */}
        <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold text-indigo-700 mb-12">What Our Users Say</h2>
            <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up">
            {[
                {
                name: "Anika Sharma",
                role: "Freelancer",
                quote: "ExpenseEase completely transformed how I manage money. I love the smart alerts!",
                },
                {
                name: "John Miller",
                role: "Small Business Owner",
                quote: "The best tool for tracking transactions from PDFs. Saved me hours each month.",
                },
                {
                name: "Sara Ali",
                role: "Student",
                quote: "Very intuitive and beginner-friendly. I finally understand where my money goes.",
                },
            ].map((t, idx) => (
                <div key={idx} className="bg-gray-100 p-6 rounded-xl shadow-lg">
                <p className="text-gray-700 italic">“{t.quote}”</p>
                <div className="mt-4">
                    <p className="font-semibold text-indigo-700">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                </div>
                </div>
            ))}
            </div>
        </div>
        </section>

            {/* Comparison Table */}
            <section className="py-20 bg-indigo-50">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-indigo-800 mb-8">Compare Plans</h2>
                <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-xl shadow">
                    <thead className="bg-indigo-100 text-indigo-700">
                    <tr>
                        <th className="py-3 px-6 text-left">Feature</th>
                        <th className="py-3 px-6 text-center">Basic</th>
                        <th className="py-3 px-6 text-center">Pro</th>
                        <th className="py-3 px-6 text-center">Enterprise</th>
                    </tr>
                    </thead>
                    <tbody className="text-center text-gray-700">
                    {[
                        ["PDF Upload Limit", "5", "Unlimited", "Unlimited"],
                        ["Category Management", "❌", "✅", "✅"],
                        ["Budget Alerts", "✅", "✅", "✅"],
                        ["Team Access", "❌", "❌", "✅"],
                        ["Priority Support", "❌", "❌", "✅"],
                    ].map(([feature, basic, pro, enterprise], idx) => (
                        <tr key={idx} className="border-b">
                        <td className="py-3 px-6 text-left font-medium">{feature}</td>
                        <td className="py-3 px-6">{basic}</td>
                        <td className="py-3 px-6">{pro}</td>
                        <td className="py-3 px-6">{enterprise}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            </section>

    </div>
  );
};

export default Services;
