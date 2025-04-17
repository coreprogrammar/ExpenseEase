import React, { useEffect, useState } from 'react';
import TransactionSearch from './TransactionSearch';

function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // For inline editing
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState({});

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const fetchAllTransactions = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Please log in to view transactions.');
        setLoading(false);
        return;
      }
      const res = await fetch('http://localhost:5000/api/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error fetching transactions');
      }
      const data = await res.json();
      setTransactions(data || []);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Could not load transactions');
    } finally {
      setLoading(false);
    }
  };

  // Handle deletion
  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error deleting transaction');
      }
      // Remove from local state
      setTransactions(transactions.filter(tx => tx._id !== id));
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Could not delete transaction');
    }
  };

  // Start editing a transaction
  const handleEditTransaction = (transaction) => {
    setEditingTransactionId(transaction._id);
    setEditingTransaction({ ...transaction });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingTransactionId(null);
    setEditingTransaction({});
  };

  // Save updated transaction
  const handleSaveTransaction = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingTransaction)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error updating transaction');
      }
      const updatedTx = await res.json();
      // Update local state
      setTransactions(
        transactions.map(tx => (tx._id === id ? updatedTx : tx))
      );
      setEditingTransactionId(null);
      setEditingTransaction({});
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Could not update transaction');
    }
  };

  // Handle input change for inline editing
  const handleInputChange = (field, value) => {
    setEditingTransaction({
      ...editingTransaction,
      [field]: value
    });
  };

  // Called by TransactionSearch on form submission
  const handleSearch = async (filters) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Please log in to view transactions.');
        setLoading(false);
        return;
      }
      
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.searchText) params.append('query', filters.searchText);
      if (filters.filterCategory) params.append('category', filters.filterCategory);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const res = await fetch(`http://localhost:5000/api/transactions/search?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error searching transactions');
      }
      const data = await res.json();
      setTransactions(data || []);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Could not search transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to export transactions.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/export/transactions", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Error exporting transactions");
      }
      const blob = await response.blob();
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transactions.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert(err.message);
    }
  };
  


  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-indigo-600">ExpenseTracker</h2>
        </div>
        <nav className="flex-1 p-6">
          <ul className="space-y-4">
            <li>
              <a
                href="/dashboard"
                className="block px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/transactions"
                className="block px-4 py-2 rounded bg-indigo-100 font-semibold text-indigo-800"
              >
                Transactions
              </a>
            </li>
            <li>
              <a
                href="/budget"
                className="block px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200"
              >
                Budget
              </a>
            </li>
            <li>
              <a
                href="/reports"
                className="block px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200"
              >
                Reports
              </a>
            </li>
          </ul>
        </nav>
      </aside>


      {/* Main Content */}
      <main className="flex-1">
        {/* Mobile Header */}
        <header className="px-6 py-4 bg-white shadow md:hidden">
          <h2 className="text-2xl font-bold text-indigo-600">ExpenseTracker</h2>
        </header>

        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-8">All Transactions</h1>

          {errorMessage && (
            <div className="mb-6">
              <p className="text-red-600 text-center text-lg">{errorMessage}</p>
            </div>
          )}

          {/* Transaction Search & Filtering */}
          <TransactionSearch onSearch={handleSearch} />

          {loading && (
            <div className="flex items-center justify-center mb-6">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2" />
              <span className="text-indigo-600 text-lg font-semibold">
                Loading transactions...
              </span>
            </div>
          )}

          {/* Export Button */}
          <div className="mb-4 flex justify-end">
            <button 
              onClick={handleExportCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Export to CSV
            </button>
          </div>

          {!loading && !errorMessage && transactions.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Description</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Amount</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr key={tx._id || index} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        {editingTransactionId === tx._id ? (
                          <input
                            type="text"
                            value={editingTransaction.date}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-28"
                          />
                        ) : (
                          tx.date
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingTransactionId === tx._id ? (
                          <input
                            type="text"
                            value={editingTransaction.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-48"
                          />
                        ) : (
                          tx.description
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingTransactionId === tx._id ? (
                          <input
                            type="text"
                            value={editingTransaction.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-36"
                          />
                        ) : (
                          tx.category
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold">
                        {editingTransactionId === tx._id ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editingTransaction.amount}
                            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-24"
                          />
                        ) : (
                          `$${tx.amount}`
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingTransactionId === tx._id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSaveTransaction(tx._id)}
                              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded-md text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditTransaction(tx)}
                              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(tx._id)}
                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !errorMessage && transactions.length === 0 && (
            <p className="text-center text-gray-600 text-xl">No transactions found.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default TransactionPage;
