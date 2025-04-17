import React, { useEffect, useState } from 'react';

function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [amount, setAmount] = useState('');
  const [categories, setCategories] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchBudgets();
  }, []);

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
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error((await res.json()).error || 'Error fetching budgets');

      const data = await res.json();
      setBudgets(data);
    } catch (err) {
      setErrorMessage(err.message || 'Could not load budgets');
    } finally {
      setLoading(false);
    }
  };

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

      const catArray = categories.split(',').map(c => c.trim()).filter(Boolean);
      const body = {
        name,
        frequency,
        amount: parseFloat(amount),
        categories: catArray,
        ...(startDate && { startDate }),
        ...(endDate && { endDate })
      };

      const res = await fetch('http://localhost:5000/api/budgets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error((await res.json()).error || 'Error creating budget');

      setSuccessMessage('Budget created successfully!');
      setName('');
      setFrequency('monthly');
      setAmount('');
      setCategories('');
      setStartDate('');
      setEndDate('');
      fetchBudgets();
    } catch (err) {
      setErrorMessage(err.message || 'Could not create budget');
    } finally {
      setLoading(false);
    }
  };

  const groupBudgetsByCategory = (budgetList) => {
    const grouped = {};
    budgetList.forEach(budget => {
      if (budget.categories?.length) {
        budget.categories.forEach(cat => {
          grouped[cat] = [...(grouped[cat] || []), budget];
        });
      } else {
        grouped['No Category'] = [...(grouped['No Category'] || []), budget];
      }
    });
    return grouped;
  };

  const groupedBudgets = groupBudgetsByCategory(budgets);

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-indigo-600">ExpenseTracker</h2>
        </div>
        <nav className="flex-1 p-6">
          <ul className="space-y-4">
            {['dashboard', 'transactions', 'budget', 'reports'].map(route => (
              <li key={route}>
                <a
                  href={`/${route}`}
                  className={`block px-4 py-2 rounded transition duration-200 ${
                    route === 'budget'
                      ? 'bg-indigo-100 text-indigo-800 font-semibold'
                      : 'hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {route.charAt(0).toUpperCase() + route.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Mobile Header */}
        <header className="px-4 py-4 bg-white shadow md:hidden">
          <h2 className="text-xl font-semibold text-indigo-600">ExpenseTracker</h2>
        </header>

        <div className="p-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-indigo-700">Budget Management</h1>

          {errorMessage && (
            <p className="text-red-600 text-center mb-4">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-600 text-center mb-4">{successMessage}</p>
          )}
          {loading && (
            <p className="text-indigo-600 mb-4 text-center">Loading / Processing...</p>
          )}

          {/* Form */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-indigo-600">Create New Budget</h2>
            <form onSubmit={handleCreateBudget} className="space-y-4">
              {[
                { label: 'Name', value: name, setter: setName },
                { label: 'Amount', type: 'number', value: amount, setter: setAmount },
                { label: 'Categories (comma separated)', value: categories, setter: setCategories }
              ].map(({ label, type = 'text', value, setter }) => (
                <div key={label}>
                  <label className="block font-semibold mb-1">{label}</label>
                  <input
                    type={type}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    required={label === 'Name' || label === 'Amount'}
                  />
                </div>
              ))}

              <div>
                <label className="block font-semibold mb-1">Frequency</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  {['weekly', 'monthly', 'yearly', 'custom'].map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Create Budget
              </button>
            </form>
          </div>

          {/* Budget Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-indigo-600">Existing Budgets</h2>
            {budgets.length === 0 ? (
              <p className="text-gray-700">No budgets found.</p>
            ) : (
              <div className="space-y-8">
                {Object.keys(groupedBudgets).map(catName => (
                  <div key={catName}>
                    <h3 className="text-md font-bold mb-2 text-indigo-700">
                      {catName} Budgets
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full table-auto border">
                        <thead className="bg-gray-50">
                          <tr>
                            {['Name', 'Frequency', 'Amount', 'Start Date', 'End Date'].map(h => (
                              <th
                                key={h}
                                className="px-4 py-2 text-left font-semibold text-gray-700 border-b"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {groupedBudgets[catName].map(budget => (
                            <tr
                              key={budget._id}
                              className="border-b hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 py-2">{budget.name}</td>
                              <td className="px-4 py-2 capitalize">{budget.frequency}</td>
                              <td className="px-4 py-2">${budget.amount}</td>
                              <td className="px-4 py-2">
                                {budget.startDate ? budget.startDate.slice(0, 10) : '--'}
                              </td>
                              <td className="px-4 py-2">
                                {budget.endDate ? budget.endDate.slice(0, 10) : '--'}
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
