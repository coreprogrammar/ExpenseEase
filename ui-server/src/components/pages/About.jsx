import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaQuestionCircle, FaCogs, FaUsers, FaRocket } from 'react-icons/fa';

function About() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I upload bank statements?",
      answer: "Go to the Transactions page, click 'Upload Statement', and select your PDF bank file. The app will parse and display transactions automatically."
    },
    {
      question: "How does the budget alert system work?",
      answer: "You'll get a dashboard alert when any category exceeds 80% of its budget. Alerts can be dismissed once reviewed."
    },
    {
      question: "Can I export my data?",
      answer: "Absolutely! Export your transactions as CSV anytime using the 'Export' button in the Transactions section."
    },
    {
      question: "Is this free to use?",
      answer: "Yes, this version is completely free and open-source. Future versions may introduce premium analytics."
    }
  ];

  const team = [
    {
      name: "Shahrukh Khan",
      role: "Project Lead & Full Stack Developer",
      bio: "Led the architecture, API design, and overall UI/UX. Passionate about building scalable finance tools.",
      avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Shahrukh"
    },
    {
      name: "Sri Lakshmi Nallamothu",
      role: "Leadership Analyst",
      bio: "Helped define the vision and oversaw key leadership components and stakeholder mapping.",
      avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Lakshmi"
    },
    {
      name: "Ashwin Mathew",
      role: "Implementation Lead",
      bio: "Managed data flow, error handling and integration testing with PDFs and alert system.",
      avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Ashwin"
    },
    {
      name: "Dileep Kumar Yarramasu",
      role: "ROI & Measurement Specialist",
      bio: "Handled KPIs, analytics planning, and continuous improvement metrics for the dashboard.",
      avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Dileep"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 animate-fade-in">
      <main className="max-w-5xl mx-auto py-12 px-6">
        {/* Hero Section */}
        <section className="text-center mb-14">
          <h1 className="text-4xl font-bold text-indigo-700 mb-4">About ExpenseEase</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            ExpenseEase is your smart companion for managing personal finances. From visualizing expenses to setting alerts and automating transaction tracking — we’ve got you covered.
          </p>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6 flex items-center gap-2">
            <FaCogs /> What Can You Do with ExpenseEase?
          </h2>
          <ul className="grid md:grid-cols-2 gap-6 list-none text-base">
            <li className="bg-white shadow rounded-lg p-5 hover:shadow-md transition">
              💳 Upload and parse bank statements (PDF)
            </li>
            <li className="bg-white shadow rounded-lg p-5 hover:shadow-md transition">
              📊 Visualize your expenses with interactive charts
            </li>
            <li className="bg-white shadow rounded-lg p-5 hover:shadow-md transition">
              💡 Get budget alerts when spending exceeds limits
            </li>
            <li className="bg-white shadow rounded-lg p-5 hover:shadow-md transition">
              🧾 Export transactions to CSV and customize categories
            </li>
            <li className="bg-white shadow rounded-lg p-5 hover:shadow-md transition">
              🔐 Enjoy secure authentication and email recovery
            </li>
          </ul>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6 flex items-center gap-2">
            <FaUsers /> Meet the Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="bg-white shadow rounded-lg p-4 text-center hover:shadow-lg transition">
                <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full mx-auto mb-3" />
                <h4 className="font-bold text-lg">{member.name}</h4>
                <p className="text-sm text-indigo-600 font-medium">{member.role}</p>
                <p className="text-sm text-gray-600 mt-2">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6 flex items-center gap-2">
            <FaQuestionCircle /> Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white shadow rounded p-4">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left font-medium text-indigo-700 flex justify-between items-center"
                >
                  {faq.question}
                  <span>{openFAQ === index ? '−' : '+'}</span>
                </button>
                {openFAQ === index && (
                  <p className="mt-2 text-gray-700">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">🛠️ Our Technology Stack</h2>
          <ul className="list-disc ml-6 text-base text-gray-700 space-y-1">
            <li><strong>Frontend:</strong> React, Tailwind CSS, Heroicons, D3.js</li>
            <li><strong>Backend:</strong> Node.js, Express, MongoDB</li>
            <li><strong>Authentication:</strong> JWT, bcrypt</li>
            <li><strong>Email & Notifications:</strong> Nodemailer + Ethereal</li>
            <li><strong>PDF Parsing:</strong> PDF.js, Regex parsing</li>
            <li><strong>Hosting:</strong> Vercel (frontend), Render (backend)</li>
          </ul>
        </section>

        {/* Call to Action */}
        <section className="bg-indigo-600 text-white text-center rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-2">Ready to take control of your finances?</h2>
          <p className="mb-4">Start tracking your spending with ExpenseEase today!</p>
          <Link
            to="/sign-up"
            className="bg-white text-indigo-700 px-6 py-2 rounded font-semibold hover:bg-gray-200 transition"
          >
            Get Started
          </Link>
        </section>

        {/* Contact Us Section */}
        <section className="mt-16 bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4 text-center">📬 Contact Us</h2>
          <p className="text-gray-600 text-center mb-6">
            Have questions, suggestions, or need help? Drop us a message below and we’ll get back to you soon!
          </p>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                placeholder="e.g. Feedback, Issue, Inquiry"
                className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
              <textarea
                rows="4"
                placeholder="Type your message here..."
                className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              ></textarea>
            </div>

            <div className="md:col-span-2 text-center">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition duration-300"
              >
                Send Message
              </button>
            </div>
          </form>
        </section>


      </main>
    </div>
  );
}

export default About;
