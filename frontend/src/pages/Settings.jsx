import API_URL from "../api";
import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  Eye,
  EyeOff,
  Lock,
  Monitor,
  Save,
  Shield,
  User,
} from "lucide-react";

function Settings({ onLogout, onNavigate }) {
  const [user, setUser] = useState({
    name: "User",
    email: "Not available",
  });

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("scamshield-settings");

    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch {
        // Fall back to safe defaults when stored data is invalid.
      }
    }

    return {
      notifications: true,
      threatAlerts: true,
      emailAlerts: false,
      autoScan: true,
      darkMode: false,
    };
  });

  const [saved, setSaved] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

    setUser({
      name: savedUser.name || "User",
      email: savedUser.email || "Not available",
    });
  }, []);

  const updateSetting = (name) => {
    setSettings((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));

    setSaved(false);
  };

  const saveSettings = () => {
    localStorage.setItem("scamshield-settings", JSON.stringify(settings));

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const updatePasswordField = (field, value) => {
    setPasswordData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setPasswordMessage("");
    setPasswordError("");
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "New password must be different from current password."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setPasswordError("Your session has expired. Please log in again.");
      return;
    }

    try {
      setChangingPassword(true);

      const response = await fetch(
        `${API_URL}/api/auth/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to change password.");
      }

      setPasswordMessage(data.message || "Password changed successfully.");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordError(
        error.message || "Unable to change password. Please try again."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const navItems = [
    ["home", "Home"],
    ["url-scanner", "Scan URL"],
    ["message-scanner", "Scan Message"],
    ["analytics", "Analytics"],
    ["threat-reports", "Threat Reports"],
    ["users", "Users"],
    ["settings", "Settings"],
  ];

  return (
    <div className="min-h-screen bg-[#EDECE7] text-[#2F302F]">
      {/* TOP NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-[#DAD9D4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={() => onNavigate?.("home")}
            className="flex shrink-0 items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#434341] text-white">
              <Shield size={18} />
            </div>
            <span className="hidden text-sm font-extrabold sm:inline">
              ScamGuard AI
            </span>
          </button>

          <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
            {navItems.map(([id, label]) => (
              <button
                key={id}
                onClick={() => onNavigate?.(id)}
                className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  id === "settings"
                    ? "bg-[#434341] text-white"
                    : "text-[#686861] hover:bg-[#F0EFEB] hover:text-[#2F302F]"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <span className="h-2 w-2 rounded-full bg-[#2F7D5A]" />
            <span className="text-xs font-semibold text-[#6B6B66]">
              System online
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        {/* PAGE INTRO */}
        <section className="mb-7">
          <button
            onClick={() => onNavigate?.("home")}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#6B6B66] transition hover:text-[#2F302F]"
          >
            ← Back to Dashboard
          </button>

          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D4D1C9] bg-white">
              <Shield size={22} className="text-[#434341]" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7A7972]">
                Preferences
              </p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Settings
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B6B66]">
                Manage your account, detection preferences, notifications, and
                security controls.
              </p>
            </div>
          </div>
        </section>

        {/* ACCOUNT */}
        <SettingsSection
          icon={<User size={18} />}
          title="Account"
          description="Your current account information"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <InputField label="Full Name" value={user.name} />
            <InputField label="Email Address" value={user.email} />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#85847D]">
              Account Role
            </label>
            <div className="rounded-xl border border-[#DAD7D0] bg-[#FAF9F7] p-3.5 text-sm font-bold text-[#434341]">
              Users
            </div>
          </div>
        </SettingsSection>

        {/* SECURITY */}
        <SettingsSection
          icon={<Lock size={18} />}
          title="Security"
          description="Configure protection behavior for your account"
        >
          <ToggleSetting
            title="Automatic URL Scanning"
            description="Automatically analyze URLs submitted to the scanner"
            enabled={settings.autoScan}
            onChange={() => updateSetting("autoScan")}
          />

          <ToggleSetting
            title="Threat Alerts"
            description="Show alerts when a high-risk threat is detected"
            enabled={settings.threatAlerts}
            onChange={() => updateSetting("threatAlerts")}
          />
        </SettingsSection>

        {/* CHANGE PASSWORD */}
        <SettingsSection
          icon={<Lock size={18} />}
          title="Change Password"
          description="Update your account password securely"
        >
          <form onSubmit={handleChangePassword}>
            <div className="grid gap-4 md:grid-cols-2">
              <PasswordField
                label="Current Password"
                value={passwordData.currentPassword}
                onChange={(value) =>
                  updatePasswordField("currentPassword", value)
                }
                showPassword={showCurrentPassword}
                onToggle={() =>
                  setShowCurrentPassword((previous) => !previous)
                }
              />

              <PasswordField
                label="New Password"
                value={passwordData.newPassword}
                onChange={(value) => updatePasswordField("newPassword", value)}
                showPassword={showNewPassword}
                onToggle={() => setShowNewPassword((previous) => !previous)}
              />

              <PasswordField
                label="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(value) =>
                  updatePasswordField("confirmPassword", value)
                }
                showPassword={showConfirmPassword}
                onToggle={() =>
                  setShowConfirmPassword((previous) => !previous)
                }
              />
            </div>

            <p className="mt-3 text-xs text-[#77766F]">
              Password must contain at least 6 characters.
            </p>

            {passwordError && (
              <div className="mt-4 rounded-xl border border-[#E7CCCC] bg-[#FFF6F6] px-4 py-3 text-sm font-semibold text-[#A64F4F]">
                {passwordError}
              </div>
            )}

            {passwordMessage && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#C9DDD1] bg-[#F1F8F3] px-4 py-3 text-sm font-semibold text-[#2F7D5A]">
                <Check size={17} />
                {passwordMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={changingPassword}
              className="mt-5 rounded-xl bg-[#434341] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#343532] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {changingPassword ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </SettingsSection>

        {/* NOTIFICATIONS */}
        <SettingsSection
          icon={<Bell size={18} />}
          title="Notifications"
          description="Choose which security notifications are displayed"
        >
          <ToggleSetting
            title="Security Notifications"
            description="Receive notifications about important security events"
            enabled={settings.notifications}
            onChange={() => updateSetting("notifications")}
          />

          <ToggleSetting
            title="Email Alerts"
            description="Receive high-risk threat alerts by email"
            enabled={settings.emailAlerts}
            onChange={() => updateSetting("emailAlerts")}
          />
        </SettingsSection>

        {/* APPEARANCE */}
        <SettingsSection
          icon={<Monitor size={18} />}
          title="Appearance"
          description="Customize the application interface"
        >
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="text-sm font-extrabold text-[#343532]">
                Light Product Theme
              </p>
              <p className="mt-1 max-w-xl text-xs leading-5 text-[#77766F]">
                The current interface uses the warm light product theme used
                across ScamGuard AI.
              </p>
            </div>

            <div className="rounded-xl border border-[#C9DDD1] bg-[#F1F8F3] px-3 py-2 text-xs font-extrabold text-[#2F7D5A]">
              Active
            </div>
          </div>
        </SettingsSection>

        {/* DETECTION ENGINE */}
        <SettingsSection
          icon={<Shield size={18} />}
          title="Detection Engine"
          description="Current phishing and scam detection configuration"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoBox label="Detection Mode" value="AI + Rule Based" />
            <InfoBox label="Risk Score Range" value="0 — 100" />
            <InfoBox label="URL Detection" value="Enabled" />
            <InfoBox label="Message Detection" value="Enabled" />
          </div>
        </SettingsSection>

        {/* SAVE */}
        <section className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#D4D1C9] bg-white p-5 shadow-[0_8px_25px_rgba(47,48,47,0.035)] sm:flex-row sm:items-center">
          <div>
            {saved ? (
              <div className="flex items-center gap-2 text-sm font-extrabold text-[#2F7D5A]">
                <Check size={18} />
                Settings saved successfully
              </div>
            ) : (
              <p className="text-xs font-medium text-[#77766F]">
                Preference changes are stored locally on this device.
              </p>
            )}
          </div>

          <button
            onClick={saveSettings}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#434341] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#343532] sm:w-auto"
          >
            <Save size={18} />
            Save Settings
          </button>
        </section>

        {/* SIGN OUT */}
        <section className="mt-5 rounded-2xl border border-[#E7CCCC] bg-[#FFF8F8] p-5">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-extrabold text-[#343532]">Sign Out</p>
              <p className="mt-1 text-xs text-[#77766F]">
                Sign out of your ScamGuard AI account on this device.
              </p>
            </div>

            <button
              onClick={onLogout}
              className="rounded-xl border border-[#D99595] bg-white px-6 py-3 text-sm font-extrabold text-[#A64F4F] transition hover:bg-[#FFF1F1]"
            >
              Logout
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-10 bg-[#434341] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <Shield size={17} />
                </div>
                <span className="font-extrabold">ScamGuard AI</span>
              </div>
              <p className="mt-2 max-w-md text-xs leading-5 text-white/65">
                AI-assisted phishing and scam detection for safer digital
                communication.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {navItems.map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => onNavigate?.(id)}
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4 text-xs text-white/45">
            © {new Date().getFullYear()} ScamGuard AI. Security decisions are
            assisted by machine learning and rule-based analysis.
          </div>
        </div>
      </footer>
    </div>
  );
}

function SettingsSection({ icon, title, description, children }) {
  return (
    <section className="mb-5 overflow-hidden rounded-3xl border border-[#D4D1C9] bg-white shadow-[0_10px_30px_rgba(47,48,47,0.04)]">
      <div className="flex items-center gap-3 border-b border-[#E7E5E0] p-5">
        <div className="rounded-xl bg-[#F0EFEB] p-2.5 text-[#434341]">{icon}</div>

        <div>
          <h2 className="font-extrabold text-[#343532]">{title}</h2>
          <p className="mt-1 text-xs text-[#77766F]">{description}</p>
        </div>
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

function InputField({ label, value }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#85847D]">
        {label}
      </label>

      <input
        value={value}
        readOnly
        className="w-full rounded-xl border border-[#DAD7D0] bg-[#FAF9F7] px-4 py-3 text-sm font-semibold !text-[#4B4B46] outline-none"
        style={{ color: "#4B4B46", WebkitTextFillColor: "#4B4B46" }}
      />
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  showPassword,
  onToggle,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#85847D]">
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-[#D5D2CA] bg-white px-4 py-3 pr-12 text-sm font-medium !text-[#343532] caret-[#2F7D5A] outline-none transition placeholder:text-[#9A9A92] focus:border-[#8E8C85]"
          style={{ color: "#343532", WebkitTextFillColor: "#343532" }}
          placeholder="Enter password"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#85847D] transition hover:bg-[#F0EFEB] hover:text-[#434341]"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

function ToggleSetting({ title, description, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-[#E8E6E1] py-4 last:border-b-0">
      <div>
        <p className="text-sm font-extrabold text-[#343532]">{title}</p>
        <p className="mt-1 max-w-xl text-xs leading-5 text-[#77766F]">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-pressed={enabled}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-[#2F7D5A]" : "bg-[#B3B0A8]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#DEDCD6] bg-[#FAF9F7] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#85847D]">
        {label}
      </p>
      <p className="mt-2 text-sm font-extrabold text-[#434341]">{value}</p>
    </div>
  );
}

export default Settings;
