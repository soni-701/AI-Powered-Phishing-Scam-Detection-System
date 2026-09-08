import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  Lock,
  Monitor,
  Save,
  Shield,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

function Settings({ onLogout }) {
  const [user, setUser] = useState({
    name: "User",
    email: "Not available",
  });

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("scamshield-settings");

    if (savedSettings) {
      return JSON.parse(savedSettings);
    }

    return {
      notifications: true,
      threatAlerts: true,
      emailAlerts: false,
      autoScan: true,
      darkMode: true,
    };
  });

  const [saved, setSaved] = useState(false);

  // Appearance state
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem("scamshield-theme") || "cyber-dark";
  });

  // Change password states
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
    applyTheme(selectedTheme);
  }, [selectedTheme]);

  useEffect(() => {
    const savedUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

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
    localStorage.setItem(
      "scamshield-settings",
      JSON.stringify(settings)
    );

    localStorage.setItem("scamshield-theme", selectedTheme);

    setSaved(true);

    setTimeout(() => {
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

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirm password do not match."
      );
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
      setPasswordError(
        "Your session has expired. Please log in again."
      );
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
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
        throw new Error(
          data.message || "Unable to change password."
        );
      }

      setPasswordMessage(
        data.message || "Password changed successfully."
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordError(
        error.message ||
          "Unable to change password. Please try again."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="mx-auto max-w-5xl px-5 py-8 lg:px-8">

        {/* HEADER */}

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#174D6E] bg-[#0D2B40]">
            <Shield
              size={24}
              className="text-[#42B9FF]"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              Settings
            </h1>

            <p className="mt-1 text-sm text-[#607D94]">
              Manage your security platform preferences
            </p>
          </div>
        </div>

        {/* ACCOUNT */}

        <SettingsSection
          icon={<User size={18} />}
          title="Account"
          description="Manage your account information"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <InputField
              label="Full Name"
              value={user.name}
            />

            <InputField
              label="Email Address"
              value={user.email}
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-xs font-semibold text-[#607D94]">
              Account Role
            </label>

            <div className="rounded-xl border border-[#17344D] bg-[#081725] p-3 text-sm text-[#42B9FF]">
              Administrator
            </div>
          </div>
        </SettingsSection>

        {/* SECURITY */}

        <SettingsSection
          icon={<Lock size={18} />}
          title="Security"
          description="Configure security preferences"
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
                  updatePasswordField(
                    "currentPassword",
                    value
                  )
                }
                showPassword={showCurrentPassword}
                onToggle={() =>
                  setShowCurrentPassword(
                    (previous) => !previous
                  )
                }
              />

              <PasswordField
                label="New Password"
                value={passwordData.newPassword}
                onChange={(value) =>
                  updatePasswordField(
                    "newPassword",
                    value
                  )
                }
                showPassword={showNewPassword}
                onToggle={() =>
                  setShowNewPassword(
                    (previous) => !previous
                  )
                }
              />

              <PasswordField
                label="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(value) =>
                  updatePasswordField(
                    "confirmPassword",
                    value
                  )
                }
                showPassword={showConfirmPassword}
                onToggle={() =>
                  setShowConfirmPassword(
                    (previous) => !previous
                  )
                }
              />

            </div>

            <p className="mt-3 text-xs text-[#607D94]">
              Password must contain at least 6 characters.
            </p>

            {passwordError && (
              <div className="mt-4 rounded-xl border border-[#5A202A] bg-[#1C1015] px-4 py-3 text-sm text-[#FF6B7A]">
                {passwordError}
              </div>
            )}

            {passwordMessage && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#174F3D] bg-[#0B3028] px-4 py-3 text-sm font-semibold text-[#32D583]">
                <Check size={17} />
                {passwordMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={changingPassword}
              className="mt-5 rounded-xl bg-[#42B9FF] px-6 py-3 text-sm font-bold text-[#06111A] transition hover:bg-[#72CCFF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {changingPassword
                ? "Changing Password..."
                : "Change Password"}
            </button>
          </form>
        </SettingsSection>

        {/* NOTIFICATIONS */}

        <SettingsSection
          icon={<Bell size={18} />}
          title="Notifications"
          description="Choose how you receive security notifications"
        >
          <ToggleSetting
            title="Security Notifications"
            description="Receive notifications about important security events"
            enabled={settings.notifications}
            onChange={() =>
              updateSetting("notifications")
            }
          />

          <ToggleSetting
            title="Email Alerts"
            description="Receive high-risk threat alerts by email"
            enabled={settings.emailAlerts}
            onChange={() =>
              updateSetting("emailAlerts")
            }
          />
        </SettingsSection>

        {/* APPEARANCE */}

        <SettingsSection
          icon={<Monitor size={18} />}
          title="Appearance"
          description="Customize the application interface"
        >
          <ToggleSetting
            title="Dark Mode"
            description="Use the dark cybersecurity interface"
            enabled={settings.darkMode}
            onChange={() => {
              setSettings((previous) => {
                const nextDarkMode = !previous.darkMode;

                setSelectedTheme(
                  nextDarkMode ? "cyber-dark" : "system"
                );

                return {
                  ...previous,
                  darkMode: nextDarkMode,
                };
              });

              setSaved(false);
            }}
          />

          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold">
              Interface Theme
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <ThemeOption
                name="Cyber Dark"
                theme="cyber-dark"
                active={selectedTheme === "cyber-dark"}
                onClick={() =>
                  handleThemeChange("cyber-dark")
                }
              />

              <ThemeOption
                name="Midnight"
                theme="midnight"
                active={selectedTheme === "midnight"}
                onClick={() =>
                  handleThemeChange("midnight")
                }
              />

              <ThemeOption
                name="System"
                theme="system"
                active={selectedTheme === "system"}
                onClick={() =>
                  handleThemeChange("system")
                }
              />
            </div>
          </div>
        </SettingsSection>

        {/* AI SETTINGS */}

        <SettingsSection
          icon={<Shield size={18} />}
          title="Detection Engine"
          description="Configure phishing and scam detection"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <InfoBox
              label="Detection Mode"
              value="AI + Rule Based"
            />

            <InfoBox
              label="Risk Score Range"
              value="0 — 100"
            />

            <InfoBox
              label="URL Detection"
              value="Enabled"
            />

            <InfoBox
              label="Message Detection"
              value="Enabled"
            />
          </div>
        </SettingsSection>

        {/* SAVE */}

        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90 p-5 sm:flex-row">
          <div>
            {saved ? (
              <div className="flex items-center gap-2 text-sm font-semibold text-[#32D583]">
                <Check size={18} />
                Settings saved successfully
              </div>
            ) : (
              <p className="text-xs text-[#607D94]">
                Changes are currently stored for this session.
              </p>
            )}
          </div>

          <button
            onClick={saveSettings}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#FF9F43] px-6 py-3 font-bold text-[#17100A] transition hover:bg-[#FFB66B]"
          >
            <Save size={18} />
            Save Settings
          </button>
        </div>

        {/* LOGOUT */}

        <div className="mt-5 rounded-xl border border-[#5A202A] bg-[#1C1015] p-5">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <p className="text-sm font-semibold text-white">
                Sign Out
              </p>

              <p className="mt-1 text-xs text-[#607D94]">
                Sign out of your ScamShield account on this device.
              </p>
            </div>

            <button
              onClick={onLogout}
              className="rounded-xl border border-[#FF4D5E] bg-[#3A1720] px-6 py-3 text-sm font-bold text-[#FF4D5E] transition hover:bg-[#4A1B25]"
            >
              Logout
            </button>
          </div>
        </div>

        {/* FOOTER */}

        <div className="mt-6 text-center text-xs text-[#526B82]">
          ScamShield AI Security Platform
        </div>

      </div>
    </div>
  );
}


/* =========================================================
   THEME APPLICATION
========================================================= */

function applyTheme(theme) {
  const root = document.documentElement;

  if (theme === "system") {
    root.style.filter =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
        ? "brightness(1.18)"
        : "brightness(1)";
    return;
  }

  if (theme === "midnight") {
    root.style.filter = "brightness(0.88)";
    return;
  }

  root.style.filter = "brightness(1)";
}


/* =========================================================
   SETTINGS SECTION
========================================================= */

function SettingsSection({
  icon,
  title,
  description,
  children,
}) {
  return (
    <section className="mb-5 rounded-2xl border border-[#1A344C] bg-[#0B1B2B]/90">

      <div className="flex items-center gap-3 border-b border-[#17344D] p-5">
        <div className="rounded-lg bg-[#0D2B40] p-2.5 text-[#42B9FF]">
          {icon}
        </div>

        <div>
          <h2 className="font-bold">
            {title}
          </h2>

          <p className="mt-1 text-xs text-[#607D94]">
            {description}
          </p>
        </div>
      </div>

      <div className="p-5">
        {children}
      </div>

    </section>
  );
}


/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({ label, value }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-[#607D94]">
        {label}
      </label>

      <input
        value={value}
        readOnly
        className="w-full rounded-xl border border-[#17344D] bg-[#081725] px-4 py-3 text-sm text-[#C4D0DB] outline-none"
      />
    </div>
  );
}


/* =========================================================
   PASSWORD FIELD
========================================================= */

function PasswordField({
  label,
  value,
  onChange,
  showPassword,
  onToggle,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-[#607D94]">
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="w-full rounded-xl border border-[#17344D] bg-[#081725] px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-[#42B9FF]"
          placeholder="Enter password"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#607D94] transition hover:text-white"
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>
    </div>
  );
}


/* =========================================================
   TOGGLE
========================================================= */

function ToggleSetting({
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-[#142C42] py-4 last:border-b-0">

      <div>
        <p className="text-sm font-semibold">
          {title}
        </p>

        <p className="mt-1 max-w-xl text-xs leading-5 text-[#607D94]">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-[#42B9FF]"
            : "bg-[#25445D]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>

    </div>
  );
}


/* =========================================================
   THEME OPTION
========================================================= */

function ThemeOption({
  name,
  theme,
  active = false,
  onClick,
}) {
  const previewClasses = {
    "cyber-dark": "bg-[#050B14]",
    midnight: "bg-[#101827]",
    system: "bg-gradient-to-r from-[#E7EEF5] to-[#050B14]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        active
          ? "border-[#42B9FF] bg-[#0D2B40]"
          : "border-[#17344D] bg-[#081725] hover:border-[#25445D]"
      }`}
    >
      <div
        className={`mb-3 h-10 rounded-lg ${
          previewClasses[theme]
        }`}
      />

      <p className="text-xs font-bold">
        {name}
      </p>

      {active && (
        <p className="mt-1 text-[10px] text-[#42B9FF]">
          Active
        </p>
      )}
    </button>
  );
}


/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl border border-[#17344D] bg-[#081725] p-4">
      <p className="text-xs text-[#607D94]">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold text-[#42B9FF]">
        {value}
      </p>
    </div>
  );
}


export default Settings;