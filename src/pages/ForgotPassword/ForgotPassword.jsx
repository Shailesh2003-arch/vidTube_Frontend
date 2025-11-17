import { useState } from "react";
// import axios from "axios";
import api from "../../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/api/v1/auth/forgot-password", { email });

      setMessage(res.data.message || "Password reset link has been sent!");
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 w-full max-w-md p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-semibold text-white text-center mb-2">
          Forgot your password?
        </h2>

        <p className="text-gray-400 text-center text-sm mb-6">
          Enter your email and we’ll send you a link to reset it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {message && (
            <p className="text-green-400 text-sm text-center">{message}</p>
          )}

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-medium disabled:bg-blue-400"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/register"
            className="text-blue-400 hover:text-blue-500 text-sm"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
