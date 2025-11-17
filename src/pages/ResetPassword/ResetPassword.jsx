import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:4000";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [validToken, setValidToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // STEP 1: Verify token as soon as page loads
  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.post(`${BASE_URL}/api/v1/auth/verify-reset-token/${token}`);
        setValidToken(true);
      } catch (err) {
        setError("Reset link is invalid or expired.");
      }
      setLoading(false);
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      await axios.post(`${BASE_URL}/api/v1/auth/reset-password`, {
        token,
        password,
      });

      setSuccess("Password updated successfully! Login to continue");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/register"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Hold up, verifying your link...
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h2 className="text-2xl font-semibold text-red-600">
          Invalid or expired link
        </h2>
        <p className="text-gray-600">Try requesting a fresh reset email.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 w-full max-w-md p-8 rounded-xl shadow-2xl border border-gray-700"
      >
        <h2 className="text-2xl font-semibold text-white text-center mb-2">
          Reset Your Password
        </h2>

        <p className="text-gray-400 text-center text-sm mb-6">
          Enter your new password below and you're good to go.
        </p>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 text-green-400 p-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        {/* New Password */}
        <label className="text-gray-300 text-sm">New Password</label>
        <input
          type="password"
          required
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1 px-4 py-2 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 mb-5"
        />

        {/* Confirm Password */}
        <label className="text-gray-300 text-sm">Confirm Password</label>
        <input
          type="password"
          required
          placeholder="Re-enter new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mt-1 px-4 py-2 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 mb-6"
        />

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-medium"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
