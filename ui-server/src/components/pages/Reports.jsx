import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';          // ✨
import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import AreaChart from './AreaChart';
import ScatterPlot from './ScatterPlot';
import StackedBarChart from './StackedBarChart';

const fadeVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function Reports() {
  /* ---------------- state + filters  ---------------- */
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filters, setFilters] = useState({ startDate: '', endDate: '', category: '' });

  const [dailyTrends, setDailyTrends]             = useState([]);
  const [monthlyOverview, setMonthlyOverview]     = useState([]);
  const [categoryDistribution, setCategoryDist]   = useState([]);
  const [areaChartData, setAreaChartData]         = useState([]);
  const [scatterData, setScatterData]             = useState([]);
  const [stackedData, setStackedData]             = useState([]);
  const [stackKeys, setStackKeys]                 = useState([]);

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  /* ---------------- fetch logic  ---------------- */
  const fetchReportData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in to view reports.');
      const qs = new URLSearchParams(filters).toString();
      const res = await fetch(`https://expenseease-backend-e786293136db.herokuapp.com/api/reports?${qs}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error((await res.json()).error);

      const data = await res.json();
      setDailyTrends(data.dailyTrends || []);
      setMonthlyOverview(data.monthlyOverview || []);
      setCategoryDist(data.categoryDistribution || []);
      setAreaChartData(data.dailyTrends || []);
      setScatterData(
        (data.dailyTrends || []).map(d => ({
          x: parseInt(d.date.split('-')[2], 10),
          y: d.totalSpent
        }))
      );
      setStackedData(data.stackedData || []);
      setStackKeys(data.stackKeys || []);
    } catch (err) {
      setErrorMessage(err.message || 'Could not load report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReportData(); }, [filters]);

  /* ---------------- util ---------------- */
  const card = (title, chart) => (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="show"
      transition={{ duration: .4 }}
      className="bg-white rounded-lg shadow p-6 mb-8 transform transition hover:-translate-y-1 hover:shadow-xl"
    >
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {chart}
    </motion.div>
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ---------- Sidebar ---------- */}
      <aside className="w-64 bg-white shadow hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-indigo-600">ExpenseTracker</h2>
        </div>
        <nav className="flex-1 p-6">
          <ul className="space-y-4">
            {['dashboard','transactions','budget','reports'].map(p => (
              <li key={p}>
                <Link
                  to={`/${p}`}
                  className={`block py-2 px-4 rounded ${
                    p==='reports' ? 'bg-gray-100 font-bold' : 'hover:bg-gray-200'
                  }`}>
                  {p[0].toUpperCase()+p.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* ---------- Main ---------- */}
      <main className="flex-1 p-6">
        {/* Mobile header unchanged */}
        <header className="bg-white shadow p-4 md:hidden">
          <h2 className="text-2xl font-bold text-indigo-600">ExpenseTracker</h2>
        </header>

        <h1 className="text-3xl font-bold text-indigo-700 mb-6">Reports</h1>

        {/* ---------- Filters ---------- */}
        <motion.div
          variants={fadeVariants}
          initial="hidden"
          animate="show"
          transition={{ duration: .4, delay: .1 }}
          className="bg-white rounded-lg shadow p-6 mb-6"
        >
          <h2 className="text-xl font-semibold mb-4">Advanced Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name:'startDate', type:'date', label:'Start Date' },
              { name:'endDate',   type:'date', label:'End Date' },
              { name:'category',  type:'text', label:'Category', placeholder:'e.g., Restaurants'}
            ].map(f => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-gray-700">{f.label}</label>
                <input
                  {...f}
                  value={filters[f.name]}
                  onChange={handleFilterChange}
                  className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={()=>window.print()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            >
              Print / Export
            </button>
          </div>
        </motion.div>

        {/* ---------- Alerts / spinner ---------- */}
        {errorMessage && <p className="text-red-600 text-center mb-4">{errorMessage}</p>}
        {loading && (
          <div className="flex justify-center my-10">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ---------- Charts ---------- */}
        {!loading && !errorMessage && (
          <>
            {card('Monthly Overview (Bar Chart)',
              <BarChart data={monthlyOverview} width={600} height={300} />)}

            {card('Daily Spending Trends (Line Chart)',
              <LineChart data={dailyTrends} width={600} height={300} />)}

            {card('Category Distribution (Pie Chart)',
              <PieChart data={categoryDistribution} width={400} height={400} innerRadius={80} />)}

            {card('Daily Spending Trends (Area Chart)',
              <AreaChart data={areaChartData} width={600} height={300} />)}

            {card('Scatter Plot (Day vs Amount)',
              <ScatterPlot data={scatterData} width={600} height={300} />)}

            {card('Stacked Bar Chart (Categories over Days)',
              <StackedBarChart data={stackedData} keys={stackKeys} width={600} height={300} />)}
          </>
        )}
      </main>
    </div>
  );
}

export default Reports;
