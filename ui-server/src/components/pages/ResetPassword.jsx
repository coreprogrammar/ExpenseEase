import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams(); // Get token from URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.success) {
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-indigo-600 text-center">Reset Password</h2>
        <p className="text-gray-600 text-center mt-2">Enter a new password</p>

        {message && <p className="text-green-500 text-center mt-4">{message}</p>}

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

          <button type="submit" className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
