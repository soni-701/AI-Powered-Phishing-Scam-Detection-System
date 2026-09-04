import { useState } from "react";
import {
  ShieldCheck,
  Mail,
  Lock,
  LogIn,
  AlertCircle,
} from "lucide-react";

function Login({ onNavigate ,onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
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
        throw new Error(data.message || "Login failed.");
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save logged-in user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Go to home page after successful login
      onLogin();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black/40">
      <div className="w-full max-w-md">

        {/* Logo / Heading */}
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
            Secure access to your threat detection dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-400/20 rounded-2xl p-7 shadow-2xl">

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Welcome Back
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Login to continue
            </p>
          </div>

          {/* Error Message */}
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

          <form onSubmit={handleSubmit}>

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
                  placeholder="Enter your password"
                  required
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 outline-none focus:border-cyan-400 transition"
                />

              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-lg transition"
            >
              <LogIn size={19} />

              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Register */}
          <div className="text-center mt-6">

            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}

              <button
                type="button"
                onClick={() => onNavigate("register")}
                className="text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Create Account
              </button>
            </p>

          </div>

        </div>

        {/* Security Text */}
        <div className="text-center mt-6">

          <p className="text-xs text-gray-500">
            Protected by secure authentication
          </p>

        </div>

      </div>
    </div>
  );
}

export default Login;