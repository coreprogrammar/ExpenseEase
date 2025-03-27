import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BarChart from './BarChart';
import DonutChart from './DonutChart';

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Real data states
  const [monthlyOverview, setMonthlyOverview] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [totalSpentMonth, setTotalSpentMonth] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [budgetSummary, setBudgetSummary] = useState('');
  const [budgetUsedPercent, setBudgetUsedPercent] = useState(0); // e.g. 40 => 40%
  const [recentTransactions, setRecentTransactions] = useState([]);

  // Alerts state
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchAlerts();
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

      // Your API returns an object with "recentTransactions" among other fields
      const res = await fetch('http://localhost:5000/api/transactions/summary', {
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
      
      console.log('Recent Transactions:', data.recentTransactions);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Could not load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/alerts', {
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

  const dismissAlert = async (alertId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/alerts/${alertId}/dismiss`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAlerts(alerts.filter((alert) => alert._id !== alertId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow hidden md:flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">ExpenseTracker</h2>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/dashboard" 
                className="block py-2 px-3 rounded bg-gray-100 font-semibold"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/transactions" 
                className="block py-2 px-3 rounded hover:bg-gray-100"
              >
                Transactions
              </Link>
            </li>
            <li>
              <Link 
                to="/budget" 
                className="block py-2 px-3 rounded hover:bg-gray-100"
              >
                Budget
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Mobile Header */}
        <header className="px-4 py-4 bg-white shadow md:hidden">
          <h2 className="text-xl font-semibold">ExpenseTracker</h2>
        </header>

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {/* Alerts Banner */}
          {alerts.length > 0 && (
            <div className="mb-6 space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert._id}
                  className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
                >
                  <span className="block sm:inline">{alert.message}</span>
                  <button
                    onClick={() => dismissAlert(alert._id)}
                    className="absolute top-0 right-0 px-4 py-3"
                  >
                    Got it
                  </button>
                </div>
              ))}
            </div>
          )}

          {errorMessage && (
            <p className="text-red-600 text-center mb-4">{errorMessage}</p>
          )}
          {loading && (
            <p className="text-indigo-600 mb-4 text-center">Loading data...</p>
          )}

          {!loading && !errorMessage && (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold">Total Spent This Month</h2>
                  <p className="text-2xl mt-2">{`$${totalSpentMonth}`}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold">Total Income</h2>
                  <p className="text-2xl mt-2">{`$${totalIncome}`}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-2">Budget Summary</h2>
                  <p className="mb-3 text-sm text-gray-600">{budgetSummary}</p>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: `${budgetUsedPercent}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{budgetUsedPercent}% used of monthly budget.</p>
                </div>
              </div>

              {/* Charts Row: Monthly Overview & Top Spending Categories */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-2">Monthly Overview</h2>
                  <p className="text-sm text-gray-600 mb-4">Spending by month (bar chart).</p>
                  <BarChart data={monthlyOverview} width={420} height={220} />
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-2">Top Spending Categories</h2>
                  <p className="text-sm text-gray-600 mb-4">Visual breakdown by category (donut chart).</p>
                  <DonutChart data={topCategories} width={280} height={280} innerRadius={60} />
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
                {recentTransactions.length === 0 ? (
                  <p className="text-gray-600 text-center">No recent transactions found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Description</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTransactions.map((tx, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-2">{tx.date}</td>
                            <td className="px-4 py-2">{tx.description}</td>
                            <td className="px-4 py-2 font-bold">{`$${tx.amount}`}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
