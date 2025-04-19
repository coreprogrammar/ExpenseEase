import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://expenseease-backend-e786293136db.herokuapp.com/api/auth/reset-password/${token}", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsError(true);
        setMessage(data.message || "Invalid or expired token.");
      } else {
        setIsError(false);
        setMessage("✅ Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2500);
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
        <h2 className="text-2xl font-bold text-indigo-600 text-center">Reset Password</h2>
        <p className="text-gray-600 text-center mt-2">Enter a new password</p>

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
          <label className="block font-medium text-gray-700">New Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded-lg mt-1"
            placeholder="Enter new password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="block font-medium text-gray-700 mt-4">Confirm Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded-lg mt-1"
            placeholder="Confirm new password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
