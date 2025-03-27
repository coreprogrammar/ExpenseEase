import React, { useEffect, useState } from 'react';

function BudgetPage() {
  // State for budgets
  const [budgets, setBudgets] = useState([]);
  // State for form fields
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [amount, setAmount] = useState('');
  const [categories, setCategories] = useState(''); // e.g. "Restaurants,Groceries"
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchBudgets();
  }, []);

  // 1) Fetch existing budgets
  const fetchBudgets = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Please log in to view budgets.');
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:5000/api/budgets', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error fetching budgets');
      }

      const data = await res.json(); // array of budgets
      setBudgets(data);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Could not load budgets');
    } finally {
      setLoading(false);
    }
  };

  // 2) Create a new budget
  const handleCreateBudget = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Please log in.');
        setLoading(false);
        return;
      }

      // parse categories from comma-separated string
      let catArray = categories
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c !== '');

      const body = {
        name,
        frequency,
        amount: parseFloat(amount),
        categories: catArray
      };
      if (startDate) body.startDate = startDate;
      if (endDate) body.endDate = endDate;

      const res = await fetch('http://localhost:5000/api/budgets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error creating budget');
      }

      await res.json(); // newBudget if needed
      setSuccessMessage('Budget created successfully!');

      // Clear form
      setName('');
      setFrequency('monthly');
      setAmount('');
      setCategories('');
      setStartDate('');
      setEndDate('');

      // Refresh the budgets
      fetchBudgets();
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Could not create budget');
    } finally {
      setLoading(false);
    }
  };

  // 3) Group budgets by category
  const groupBudgetsByCategory = (budgetList) => {
    const grouped = {};
    budgetList.forEach((budget) => {
      if (budget.categories && budget.categories.length > 0) {
        budget.categories.forEach((cat) => {
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(budget);
        });
      } else {
        // If no categories
        if (!grouped['No Category']) grouped['No Category'] = [];
        grouped['No Category'].push(budget);
      }
    });
    return grouped;
  };

  const groupedBudgets = groupBudgetsByCategory(budgets);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar (identical to Dashboard or Transactions) */}
      <aside className="w-64 bg-white shadow hidden md:flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-indigo-600">ExpenseTracker</h2>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a
                href="/dashboard"
                className="block py-2 px-3 rounded hover:bg-gray-100"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/transactions"
                className="block py-2 px-3 rounded hover:bg-gray-100"
              >
                Transactions
              </a>
            </li>
            <li>
              <a
                href="/budget"
                className="block py-2 px-3 rounded bg-gray-100 font-semibold"
              >
                Budget
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Mobile header */}
        <header className="px-4 py-4 bg-white shadow md:hidden">
          <h2 className="text-xl font-semibold text-indigo-600">ExpenseTracker</h2>
        </header>

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-indigo-700">Budget Management</h1>

          {/* Status messages */}
          {errorMessage && (
            <p className="text-red-600 text-center mb-4">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-600 text-center mb-4">{successMessage}</p>
          )}
          {loading && (
            <p className="text-indigo-600 mb-4 text-center">Loading / Processing...</p>
          )}

          {/* Create Budget Form */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-indigo-600">Create New Budget</h2>
            <form onSubmit={handleCreateBudget} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Name</label>
                <input
                  type="text"
                  className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Frequency</label>
                <select
                  className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Categories (comma separated)
                </label>
                <input
                  type="text"
                  className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="e.g. Restaurants,Groceries"
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                />
              </div>

              {/* Date range fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Create Budget
              </button>
            </form>
          </div>

          {/* Existing Budgets, grouped by category */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-indigo-600">
              Existing Budgets
            </h2>
            {budgets.length === 0 ? (
              <p className="text-gray-700">No budgets found.</p>
            ) : (
              <div className="space-y-8">
                {Object.keys(groupedBudgets).map((catName) => (
                  <div key={catName}>
                    <h3 className="text-md font-bold mb-2 text-indigo-700">
                      {catName} Budgets
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full table-auto">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">
                              Name
                            </th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">
                              Frequency
                            </th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">
                              Amount
                            </th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">
                              Start Date
                            </th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">
                              End Date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupedBudgets[catName].map((budget) => (
                            <tr
                              key={budget._id}
                              className="border-b hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 py-2">{budget.name}</td>
                              <td className="px-4 py-2 capitalize">
                                {budget.frequency}
                              </td>
                              <td className="px-4 py-2">{`$${budget.amount}`}</td>
                              <td className="px-4 py-2">
                                {budget.startDate
                                  ? budget.startDate.slice(0, 10)
                                  : '--'}
                              </td>
                              <td className="px-4 py-2">
                                {budget.endDate
                                  ? budget.endDate.slice(0, 10)
                                  : '--'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default BudgetPage;
