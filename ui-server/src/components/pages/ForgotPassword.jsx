import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      const response = await fetch("https://expenseease-backend-e786293136db.herokuapp.com/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsError(true);
        setMessage(data.message || "Something went wrong.");
      } else {
        setIsError(false);
        setMessage(data.message || "Check your email for reset link.");
      }
    } catch (error) {
      setIsError(true);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-lg max-w-md w-full animate-fade-in">
        <h2 className="text-2xl font-bold text-indigo-600 text-center">Forgot Password</h2>
        <p className="text-gray-600 text-center mt-2">Enter your email to reset your password</p>

        {message && (
          <div
            className={`mt-4 px-4 py-2 rounded text-center transition-all duration-300 ${
              isError ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="block font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded-lg mt-1"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
