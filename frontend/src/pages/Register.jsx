import { useState } from "react";
import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  UserPlus,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

function Register({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed."
        );
      }

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        onNavigate("login");
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black/40">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 mb-4">
            <ShieldCheck
              size={36}
              className="text-cyan-400"
            />
          </div>

          <h1 className="text-3xl font-bold text-white">
            AI Phishing Detector
          </h1>

          <p className="text-gray-400 mt-2">
            Create your secure detection account
          </p>

        </div>

        {/* Register Card */}
        <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-400/20 rounded-2xl p-7 shadow-2xl">

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Create Account
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Register to access the dashboard
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-3 mb-5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">

              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0"
              />

              <p className="text-sm">
                {error}
              </p>

            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-start gap-3 p-3 mb-5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">

              <CheckCircle
                size={20}
                className="mt-0.5 shrink-0"
              />

              <p className="text-sm">
                {success}
              </p>

            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="mb-5">

              <label className="block text-sm text-gray-300 mb-2">
                Full Name
              </label>

              <div className="relative">

                <User
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 outline-none focus:border-cyan-400 transition"
                />

              </div>

            </div>

            {/* Email */}
            <div className="mb-5">

              <label className="block text-sm text-gray-300 mb-2">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 outline-none focus:border-cyan-400 transition"
                />

              </div>

            </div>

            {/* Password */}
            <div className="mb-6">

              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength={6}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 outline-none focus:border-cyan-400 transition"
                />

              </div>

              <p className="text-xs text-gray-500 mt-2">
                Password must contain at least 6 characters.
              </p>

            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-lg transition"
            >

              <UserPlus size={19} />

              {loading
                ? "Creating Account..."
                : "Create Account"}

            </button>

          </form>

          {/* Login */}
          <div className="text-center mt-6">

            <p className="text-gray-400 text-sm">

              Already have an account?{" "}

              <button
                type="button"
                onClick={() => onNavigate("login")}
                className="text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Login
              </button>

            </p>

          </div>

        </div>

        {/* Security */}
        <div className="text-center mt-6">

          <p className="text-xs text-gray-500">
            Your password is securely encrypted before storage.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;