import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-indigo-600 text-center">Forgot Password</h2>
        <p className="text-gray-600 text-center mt-2">Enter your email to reset your password</p>

        {message && <p className="text-green-500 text-center mt-4">{message}</p>}

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
          <button type="submit" className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
