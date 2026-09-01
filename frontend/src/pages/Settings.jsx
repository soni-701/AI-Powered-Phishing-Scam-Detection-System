import { useState } from "react";
import {
  Bell,
  Check,
  Lock,
  Monitor,
  Save,
  Shield,
  User,
} from "lucide-react";

function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    threatAlerts: true,
    emailAlerts: false,
    autoScan: true,
    darkMode: true,
  });

  const [saved, setSaved] = useState(false);

  const updateSetting = (name) => {
    setSettings((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));

    setSaved(false);
  };

  const saveSettings = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
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
              value="Admin User"
            />

            <InputField
              label="Email Address"
              value="admin@scamshield.ai"
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

          <ToggleSetting
            title="Dark Mode"
            description="Use the dark cybersecurity interface"
            enabled={settings.darkMode}
            onChange={() => updateSetting("darkMode")}
          />

          <div className="mt-5">

            <p className="mb-3 text-sm font-semibold">
              Interface Theme
            </p>

            <div className="grid gap-3 sm:grid-cols-3">

              <ThemeOption
                name="Cyber Dark"
                active
              />

              <ThemeOption
                name="Midnight"
              />

              <ThemeOption
                name="System"
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


        {/* FOOTER */}

        <div className="mt-6 text-center text-xs text-[#526B82]">
          ScamShield AI Security Platform
        </div>

      </div>
    </div>
  );
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
  active = false,
}) {

  return (
    <button
      className={`rounded-xl border p-4 text-left transition ${
        active
          ? "border-[#42B9FF] bg-[#0D2B40]"
          : "border-[#17344D] bg-[#081725] hover:border-[#25445D]"
      }`}
    >

      <div className="mb-3 h-10 rounded-lg bg-[#050B14]" />

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