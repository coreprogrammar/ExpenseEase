//  src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* ─── tiny helper (fade‑in on scroll) ───────────────────────────── */
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      entries =>
        entries.forEach(e =>
          e.isIntersecting && e.target.classList.add("opacity-100", "translate-y-0"),
        ),
      { threshold: 0.18 },
    );
    els.forEach(el => io.observe(el));
    return () => els.forEach(el => io.unobserve(el));
  }, []);
};

/* ─── FAQ helper ────────────────────────────────────────────── */
const FAQItem = ({ q, a, idx }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl border border-gray-200 overflow-hidden"
      data-reveal
      style={{ transitionDelay: `${idx * 80}ms` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-gray-50 transition"
      >
        <span className="font-medium text-gray-800">{q}</span>
        <svg
          className={`w-5 h-5 transform transition ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-600 leading-relaxed bg-white">
          {a}
        </div>
      )}
    </div>
  );
};

function Home() {
  useReveal();

  /* auto‑scrolling testimonials */
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setOffset(o => (o + 1) % 3), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative min-h-screen font-sans bg-gray-50">
      {/* █ animated $ pattern background */}
      <div className="absolute inset-0 -z-10">
        <svg viewBox="0 0 800 600" className="w-full h-full animate-[pulse_12s_ease-in-out_infinite]">
          <defs>
            <pattern id="moneyPattern" width="100" height="100" patternUnits="userSpaceOnUse">
              <text
                x="0"
                y="70"
                fontSize="60"
                fontWeight="700"
                fill="rgba(255,255,255,0.04)"
                className="select-none"
              >
                $
              </text>
            </pattern>
          </defs>
          <rect width="800" height="600" fill="url(#moneyPattern)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col">
        {/* █ HERO */}
        <section className="bg-gradient-to-tr from-indigo-600 via-purple-600 to-fuchsia-600 text-white py-24 px-6 overflow-hidden">
          <div className="absolute -top-20 left-1/2 w-96 h-96 rounded-full bg-pink-400 opacity-20 blur-3xl -translate-x-1/2" />
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow">ExpenseEase</h1>
            <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
              Simplify your finances – track spending, manage budgets &amp; get actionable insights
              in one beautiful dashboard.
            </p>
            <div className="flex justify-center gap-6">
              <Link
                to="/sign-up"
                className="px-8 py-3 rounded-full bg-white/90 text-indigo-700 font-semibold
                           hover:bg-white transition shadow-lg hover:-translate-y-0.5"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 rounded-full border border-white/80 text-white
                           hover:bg-white/10 transition shadow-md hover:-translate-y-0.5"
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* █ Why Choose */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-14" data-reveal>
              Why Choose ExpenseEase?
            </h2>
            <div className="grid gap-10 md:grid-cols-3">
              {[
                {
                  title: "Intuitive Dashboard",
                  desc: "Interactive charts & KPIs give you a crystal‑clear picture of spending and budgets."
                },
                {
                  title: "Automated Tracking",
                  desc: "Upload bank statements and let our smart parser do the heavy lifting."
                },
                {
                  title: "Actionable Alerts",
                  desc: "Get nudges when you near a budget limit and export rich reports anytime."
                }
              ].map(({ title, desc }, i) => (
                <div
                  key={title}
                  data-reveal
                  style={{ transitionDelay: `${i * 120}ms` }}
                  className="opacity-0 translate-y-8 bg-white/70 backdrop-blur
                             border border-gray-200 rounded-xl p-8 shadow-xl hover:shadow-2xl transition"
                >
                  <div className="w-14 h-14 mb-4 grid place-items-center rounded-full bg-indigo-50">
                    <span className="text-2xl text-indigo-600">★</span>
                  </div>
                  <h3 className="text-xl font-semibold text-indigo-600 mb-2">{title}</h3>
                  <p className="text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* █ How it Works */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-14" data-reveal>
              How it Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                ["Upload", "Add your PDF bank statements in one click."],
                ["Review", "Tweak categories, dates or amounts if needed."],
                ["Insights", "Watch dashboards & budgets update in real‑time."]
              ].map(([title, desc], i) => (
                <div
                  key={title}
                  className="opacity-0 translate-y-8 bg-white border border-indigo-100
                             rounded-xl p-8 shadow-sm hover:shadow-lg transition"
                  data-reveal
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <div className="w-10 h-10 mb-3 grid place-items-center rounded-full bg-indigo-600 text-white">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-indigo-700 mb-1">
                    {title}
                  </h3>
                  <p className="text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* █ Testimonials */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-14" data-reveal>
              Users ♥ ExpenseEase
            </h2>
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-[1200ms] ease-out"
                style={{ transform: `translateX(-${offset * 100}%)` }}
              >
                {[
                  {
                    name: "Maya F.",
                    txt: "I used to dread budgeting – now it’s actually fun!",
                  },
                  {
                    name: "Liam R.",
                    txt: "PDF upload saved me hours. Love the alerts too.",
                  },
                  {
                    name: "Avery S.",
                    txt: "The visuals convinced my partner to budget with me 🤝",
                  }
                ].map(({ name, txt }) => (
                  <div
                    key={name}
                    className="min-w-full px-4 md:px-0 flex justify-center"
                  >
                    <div
                      className="max-w-lg bg-white/70 backdrop-blur border border-gray-200
                                 rounded-xl p-10 shadow-lg text-center"
                    >
                      <svg
                        className="w-8 h-8 mb-4 text-indigo-600 mx-auto"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7.17 6A5 5 0 002 11v7a1 1 0 001 1h6a1 1 0 001-1v-7A5 5 0 007.17 6zM19.17 6A5 5 0 0014 11v7a1 1 0 001 1h6a1 1 0 001-1v-7a5 5 0 00-2.83-5z" />
                      </svg>
                      <p className="text-gray-700 italic mb-6">“{txt}”</p>
                      <span className="font-semibold text-indigo-700">{name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* █ FAQ */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10" data-reveal>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                [
                  "Is ExpenseEase really free?",
                  "Yes – basic expense tracking & budgets are free forever. Pro features will be optional."
                ],
                [
                  "Which banks are supported?",
                  "Any bank that lets you download PDF statements. We’ll add direct integrations soon."
                ],
                [
                  "Will my data stay private?",
                  "Absolutely. All data is encrypted at rest and never shared with third parties."
                ]
              ].map(([q, a], i) => (
                <FAQItem q={q} a={a} idx={i} key={q} />
              ))}
            </div>
          </div>
        </section>

        {/* █ CTA again */}
        <section className="relative bg-indigo-700 text-white py-20 px-6">
          <div className="absolute right-10 -top-16 w-72 h-72 bg-fuchsia-500 opacity-30 rounded-full blur-3xl" />
          <div className="max-w-4xl mx-auto text-center relative">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6" data-reveal>
              Start budgeting smarter today
            </h2>
            <p className="text-xl mb-10 max-w-xl mx-auto" data-reveal>
              No credit card required – cancel anytime.
            </p>
            <Link
              to="/sign-up"
              className="inline-block px-10 py-4 rounded-full bg-white text-indigo-700
                         font-semibold shadow-lg hover:bg-gray-100 transition"
              data-reveal
            >
              Join for free
            </Link>
          </div>
        </section>

        
      </div>
    </div>
  );
}

export default Home;
