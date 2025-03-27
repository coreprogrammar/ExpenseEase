import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import AreaChart from './AreaChart';
import ScatterPlot from './ScatterPlot';
import StackedBarChart from './StackedBarChart';

function Reports() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Filter state for advanced filters
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: ''
  });
  
  // Report data state (expected from backend)
  const [dailyTrends, setDailyTrends] = useState([]);
  const [monthlyOverview, setMonthlyOverview] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [areaChartData, setAreaChartData] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [stackedData, setStackedData] = useState([]);
  const [stackKeys, setStackKeys] = useState([]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Fetch report data from backend
  const fetchReportData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Please log in to view reports.');
        setLoading(false);
        return;
      }
      // Build query string from filters
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.category) params.append('category', filters.category);

      const res = await fetch(`http://localhost:5000/api/reports?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error fetching report data');
      }
      const data = await res.json();
      // Expected structure from backend:
      // { dailyTrends, monthlyOverview, categoryDistribution, stackedData, stackKeys }
      setDailyTrends(data.dailyTrends || []);
      setMonthlyOverview(data.monthlyOverview || []);
      setCategoryDistribution(data.categoryDistribution || []);
      // For AreaChart, we use dailyTrends data
      setAreaChartData(data.dailyTrends || []);
      // For ScatterPlot, assume each data point has { date: 'YYYY-MM-DD', totalSpent }
      setScatterData(
        (data.dailyTrends || []).map(item => ({
          x: parseInt(item.date.split('-')[2], 10), // day of month
          y: item.totalSpent
        }))
      );
      // StackedBarChart: if not provided, use dummy data as fallback
      setStackedData(
        data.stackedData || [
          { date: '2024-02-01', Food: 100, Transport: 50, Entertainment: 20 },
          { date: '2024-02-02', Food: 80, Transport: 60, Entertainment: 30 },
          { date: '2024-02-03', Food: 120, Transport: 40, Entertainment: 25 }
        ]
      );
      setStackKeys(data.stackKeys || ['Food', 'Transport', 'Entertainment']);
      console.log('Report data:', data);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Could not load report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [filters]);

  // Print/Export function
  const handleExport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-indigo-600">ExpenseTracker</h2>
        </div>
        <nav className="flex-1 p-6">
          <ul className="space-y-4">
            <li>
              <Link to="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-200">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/transactions" className="block py-2 px-4 rounded hover:bg-gray-200">
                Transactions
              </Link>
            </li>
            <li>
              <Link to="/budget" className="block py-2 px-4 rounded hover:bg-gray-200">
                Budget
              </Link>
            </li>
            <li>
              <Link to="/reports" className="block py-2 px-4 rounded bg-gray-100 font-bold">
                Reports
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Mobile Header */}
        <header className="bg-white shadow p-4 md:hidden">
          <h2 className="text-2xl font-bold text-indigo-600">ExpenseTracker</h2>
        </header>

        <div>
          <h1 className="text-3xl font-bold text-indigo-700 mb-6">Reports</h1>

          {/* Advanced Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Advanced Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g., Restaurants"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Print / Export
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-600 text-center mb-4">{errorMessage}</p>
          )}
          {loading && (
            <p className="text-indigo-600 text-center mb-4">Loading report data...</p>
          )}

          {!loading && !errorMessage && (
            <>
              {/* Chart 1: Bar Chart for Monthly Overview */}
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Monthly Overview (Bar Chart)</h2>
                <BarChart data={monthlyOverview} width={600} height={300} />
              </div>

              {/* Chart 2: Line Chart for Daily Trends */}
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Daily Spending Trends (Line Chart)</h2>
                <LineChart data={dailyTrends} width={600} height={300} />
              </div>

              {/* Chart 3: Pie Chart for Category Distribution */}
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Category Distribution (Pie Chart)</h2>
                <PieChart data={categoryDistribution} width={400} height={400} innerRadius={80} />
              </div>

              {/* Chart 4: Area Chart for Daily Trends */}
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Daily Spending Trends (Area Chart)</h2>
                <AreaChart data={areaChartData} width={600} height={300} />
              </div>

              {/* Chart 5: Scatter Plot (Day vs Amount) */}
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Scatter Plot (Day vs Amount)</h2>
                <ScatterPlot data={scatterData} width={600} height={300} />
              </div>

              {/* Chart 6: Stacked Bar Chart (Categories over Days) */}
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Stacked Bar Chart (Categories over Days)</h2>
                <StackedBarChart data={stackedData} keys={stackKeys} width={600} height={300} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Reports;
