import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BarChart from './BarChart';
import DonutChart from './DonutChart';

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [monthlyOverview, setMonthlyOverview] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [totalSpentMonth, setTotalSpentMonth] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [budgetSummary, setBudgetSummary] = useState('');
  const [budgetUsedPercent, setBudgetUsedPercent] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgetUsageData, setBudgetUsageData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchAlerts();
    fetchBudgetUsage();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Please log in to view the dashboard.');
        setLoading(false);
        return;
      }
      const res = await fetch('https://expenseease-backend-e786293136db.herokuapp.com/api/transactions/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error fetching summary');
      }
      const data = await res.json();
      setMonthlyOverview(data.monthlyOverview || []);
      setTopCategories(data.topCategories || []);
      setTotalSpentMonth(data.totalSpentMonth || 0);
      setTotalIncome(data.totalIncome || 0);
      setBudgetSummary(data.budgetSummary || '');
      setBudgetUsedPercent(data.budgetUsedPercent || 0);
      setRecentTransactions(Array.isArray(data.recentTransactions) ? data.recentTransactions : []);
    } catch (err) {
      setErrorMessage(err.message || 'Could not load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('https://expenseease-backend-e786293136db.herokuapp.com/api/alerts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBudgetUsage = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('https://expenseease-backend-e786293136db.herokuapp.com/api/budgets/usage', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBudgetUsageData(data.budgetsUsage || []);
      }
    } catch (err) {
      console.error("Error fetching budget usage:", err);
    }
  };

  const dismissAlert = async (alertId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://expenseease-backend-e786293136db.herokuapp.com/api/alerts/${alertId}/dismiss`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAlerts(alerts.filter((alert) => alert._id !== alertId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row transition-all duration-300">
      {/* Sidebar */}
      <aside className={`bg-white shadow-lg w-64 transform md:translate-x-0 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative fixed z-50 md:z-auto h-full`}>
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-indigo-600">ExpenseTracker</h2>
        </div>
        <nav className="p-6">
          <ul className="space-y-4">
            <li>
              <Link to="/dashboard" className="block px-4 py-2 rounded bg-indigo-100 text-indigo-800 font-semibold">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/transactions" className="block px-4 py-2 rounded hover:bg-gray-200">
                Transactions
              </Link>
            </li>
            <li>
              <Link to="/budget" className="block px-4 py-2 rounded hover:bg-gray-200">
                Budget
              </Link>
            </li>
            <li>
              <Link to="/reports" className="block px-4 py-2 rounded hover:bg-gray-200">
                Reports
              </Link>
            </li>
          </ul>
        </nav>
      </aside>


      {/* Mobile toggle */}
      <div className="md:hidden flex justify-between items-center p-4 shadow bg-white sticky top-0 z-40">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-indigo-600 font-bold text-lg">☰</button>
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">Dashboard</h1>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-3 mb-6">
            {alerts.map(alert => (
              <div key={alert._id} className="bg-yellow-100 border-l-4 border-yellow-600 p-4 rounded relative shadow animate-pulse">
                <p className="text-yellow-800">{alert.message}</p>
                <button
                  onClick={() => dismissAlert(alert._id)}
                  className="absolute top-2 right-2 text-yellow-700 hover:text-yellow-900"
                >✕</button>
              </div>
            ))}
          </div>
        )}

        {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
        {loading && <p className="text-indigo-500 text-center mb-4">Loading dashboard data...</p>}

        {!loading && !errorMessage && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                <h2 className="text-gray-700 font-semibold">Total Spent</h2>
                <p className="text-3xl text-indigo-600 mt-2">${totalSpentMonth.toFixed(2)}</p>
              </div>
              <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                <h2 className="text-gray-700 font-semibold">Total Income</h2>
                <p className="text-3xl text-green-600 mt-2">${totalIncome}</p>
              </div>
              <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                <h2 className="text-gray-700 font-semibold">Budget Usage</h2>
                <p className="text-sm text-gray-500">{budgetSummary}</p>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                  <div className="h-4 bg-blue-600 rounded-full transition-all" style={{ width: `${budgetUsedPercent}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{budgetUsedPercent}% used</p>
              </div>
            </div>

            {/* Budgets */}
            <div className="bg-white p-6 rounded shadow mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Budgets</h2>
                <button onClick={fetchBudgetUsage} className="text-sm text-indigo-600 hover:underline">Refresh</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {budgetUsageData.map(budget => (
                  <div key={budget._id} className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-semibold mb-1">{budget.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{budget.usedPercent}% of ${budget.amount}</p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${budget.usedPercent}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Categories: {budget.categories.join(', ') || 'All'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded shadow">
                <h2 className="font-semibold mb-2">Monthly Overview</h2>
                <BarChart data={monthlyOverview} width={400} height={220} />
              </div>
              <div className="bg-white p-6 rounded shadow">
                <h2 className="font-semibold mb-2">Top Spending Categories</h2>
                <DonutChart data={topCategories} width={260} height={260} innerRadius={60} />
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
              {recentTransactions.length === 0 ? (
                <p className="text-gray-600">No transactions found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-left">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((tx, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50 transition">
                          <td className="px-4 py-2">{tx.date}</td>
                          <td className="px-4 py-2">{tx.description}</td>
                          <td className="px-4 py-2 font-bold">${tx.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
