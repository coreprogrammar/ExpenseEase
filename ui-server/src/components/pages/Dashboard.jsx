import React from "react";

function Dashboard() {
  // Mock data (replace later with real API data)
  const dashboardData = {
    totalSpentMonth: 1200,
    totalIncome: 3000,
    budgetSummary: "You've used 40% of your monthly budget.",
    recentTransactions: [
      { date: "2023-02-10", description: "Groceries", amount: 75.5 },
      { date: "2023-02-11", description: "Utility Bill", amount: 100.0 },
      { date: "2023-02-12", description: "Restaurant", amount: 45.25 },
      { date: "2023-02-13", description: "Gym Subscription", amount: 30.0 },
    ],
  };

  const { 
    totalSpentMonth, 
    totalIncome, 
    budgetSummary, 
    recentTransactions 
  } = dashboardData;

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
              <a 
                href="#dashboard" 
                className="block py-2 px-3 rounded bg-gray-100 font-semibold"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a 
                href="#transactions" 
                className="block py-2 px-3 rounded hover:bg-gray-100"
              >
                Transactions
              </a>
            </li>
            <li>
              <a 
                href="#settings" 
                className="block py-2 px-3 rounded hover:bg-gray-100"
              >
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Top header (could be a navbar or custom header) */}
        <header className="px-4 py-4 bg-white shadow md:hidden">
          {/* This is visible only on mobile (when sidebar is hidden) */}
          <h2 className="text-xl font-semibold">ExpenseTracker</h2>
        </header>

        {/* Dashboard content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Total Spent */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold">Total Spent This Month</h2>
              <p className="text-2xl mt-2">{`$${totalSpentMonth}`}</p>
            </div>

            {/* Total Income */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold">Total Income</h2>
              <p className="text-2xl mt-2">{`$${totalIncome}`}</p>
            </div>

            {/* Budget Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold">Budget Summary</h2>
              <p className="mt-2">{budgetSummary}</p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            {recentTransactions && recentTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Description</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{tx.date}</td>
                        <td className="px-4 py-2">{tx.description}</td>
                        <td className="px-4 py-2">{`$${tx.amount}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No recent transactions found.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
