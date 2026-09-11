import { useState } from "react";
import {
  ShieldCheck,
  Mail,
  Lock,
  LogIn,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

function Login({ onNavigate, onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onLogin();
    } catch (error) {
      setError(error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDECE7] text-[#2F302F]">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        {/* BRAND PANEL */}
        <section className="hidden bg-[#434341] px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                <ShieldCheck size={23} />
              </div>
              <span className="text-lg font-extrabold tracking-tight">
                ScamGuard AI
              </span>
            </div>

            <div className="mt-24 max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">
                AI Security Platform
              </p>

              <h1 className="mt-4 text-5xl font-extrabold leading-[1.05] tracking-tight xl:text-6xl">
                Detect suspicious links and messages before they become a
                problem.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/65">
                Access your phishing and scam detection dashboard with AI
                analysis, rule-based protection, threat reports, and security
                analytics in one place.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <SecurityPoint text="URL scanning" />
            <SecurityPoint text="Message analysis" />
            <SecurityPoint text="Threat reports" />
          </div>
        </section>

        {/* LOGIN PANEL */}
        <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-12 xl:px-20">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4D1C9] bg-white lg:mx-0">
                <ShieldCheck size={28} className="text-[#434341]" />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#85847D]">
                Secure Access
              </p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#6B6B66]">
                Sign in to continue to your security dashboard.
              </p>
            </div>

            <div className="rounded-3xl border border-[#D4D1C9] bg-white p-6 shadow-[0_18px_50px_rgba(47,48,47,0.08)] sm:p-8">
              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#E7CCCC] bg-[#FFF6F6] p-4 text-[#A64F4F]">
                  <AlertCircle size={19} className="mt-0.5 shrink-0" />
                  <p className="text-sm font-semibold leading-5">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#77766F]">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99988F]"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border border-[#D5D2CA] bg-white py-3.5 pl-11 pr-4 text-sm font-medium !text-[#343532] caret-[#2F7D5A] outline-none transition placeholder:text-[#A09F97] focus:border-[#8E8C85] focus:ring-4 focus:ring-[#434341]/5"
                      style={{
                        color: "#343532",
                        WebkitTextFillColor: "#343532",
                      }}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#77766F]">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99988F]"
                    />

                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="w-full rounded-xl border border-[#D5D2CA] bg-white py-3.5 pl-11 pr-4 text-sm font-medium !text-[#343532] caret-[#2F7D5A] outline-none transition placeholder:text-[#A09F97] focus:border-[#8E8C85] focus:ring-4 focus:ring-[#434341]/5"
                      style={{
                        color: "#343532",
                        WebkitTextFillColor: "#343532",
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#434341] py-3.5 text-sm font-extrabold text-white transition hover:bg-[#343532] disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <LogIn size={18} />
                  {loading ? "Signing in..." : "Sign In"}
                  {!loading && (
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  )}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#E5E3DE]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A9991]">
                  New here?
                </span>
                <div className="h-px flex-1 bg-[#E5E3DE]" />
              </div>

              <button
                type="button"
                onClick={() => onNavigate("register")}
                className="w-full rounded-xl border border-[#D4D1C9] bg-[#FAF9F7] py-3 text-sm font-extrabold text-[#434341] transition hover:bg-[#F1EFEB]"
              >
                Create Account
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-[#87867F]">
              <CheckCircle2 size={15} className="text-[#2F7D5A]" />
              Protected by secure authentication
            </div>

            <p className="mt-3 text-center text-[11px] leading-5 text-[#9A9991]">
              © {new Date().getFullYear()} ScamGuard AI
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function SecurityPoint({ text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
        <CheckCircle2 size={15} />
      </div>
      <p className="text-xs font-semibold text-white/75">{text}</p>
    </div>
  );
}

export default Login;
