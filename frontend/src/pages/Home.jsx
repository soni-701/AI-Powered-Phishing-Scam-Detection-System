import {
  AlertTriangle,
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  Globe,
  LayoutDashboard,
  Link as LinkIcon,
  Lock,
  Menu,
  MessageSquareWarning,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Target,
  Users,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

function Home({ onNavigate, onLogout }) {
  const [mobileMenu, setMobileMenu] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);

  const savedUser = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const userName = savedUser.name || "User";

const userInitials = userName
  .split(" ")
  .filter(Boolean)
  .map((name) => name[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

  const [analytics, setAnalytics] = useState({
    totalScans: 0,
    threatsDetected: 0,
    suspiciousScans: 0,
    safeScans: 0,
    averageRisk: 0,

    riskDistribution: {
      safe: 0,
      suspicious: 0,
      highRisk: 0,
    },

    recentScans: [],

    dailyActivity: [],
  });

  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/analytics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to fetch analytics."
          );
        }

        setAnalytics(data.analytics);
      } catch (error) {
        console.error("Home Analytics Error:", error);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  /*
  =========================================================
  DETECTION ACTIVITY GRAPH
  =========================================================
  */

  const activityData = analytics.dailyActivity || [];

  const maxActivity = Math.max(
    ...activityData.map((day) =>
      Math.max(day.safe || 0, day.threats || 0)
    ),
    1
  );

  return (
    <div className="min-h-screen bg-transparent text-white">

      {/* ================= MOBILE MENU ================= */}

      {mobileMenu && (
        <div className="fixed inset-0 z-50 bg-[#07111F] lg:hidden">

          <div className="flex items-center justify-between border-b border-[#172D44] p-5">

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#102A43]">
                <Shield
                  className="text-[#42B9FF]"
                  size={22}
                />
              </div>

              <div>
                <h1 className="font-bold">
                  ScamShield{" "}
                  <span className="text-[#FF9F43]">
                    AI
                  </span>
                </h1>

                <p className="text-[9px] uppercase tracking-widest text-[#607D94]">
                  Security Center
                </p>
              </div>

            </div>

            <button
              onClick={() => setMobileMenu(false)}
              className="rounded-lg p-2 hover:bg-[#102A43]"
            >
              <X size={25} />
            </button>

          </div>

          <div className="space-y-3 p-5">

            <MobileNav
  icon={<LayoutDashboard size={19} />}
  text="Dashboard"
  onClick={() => {
    setMobileMenu(false);
    onNavigate("home");
  }}
/>

<MobileNav
  icon={<LinkIcon size={19} />}
  text="URL Scanner"
  onClick={() => {
    setMobileMenu(false);
    onNavigate("url-scanner");
  }}
/>

<MobileNav
  icon={<MessageSquareWarning size={19} />}
  text="Message Scanner"
  onClick={() => {
    setMobileMenu(false);
    onNavigate("message-scanner");
  }}
/>

<MobileNav
  icon={<BarChart3 size={19} />}
  text="Analytics"
  onClick={() => {
    setMobileMenu(false);
    onNavigate("analytics");
  }}
/>

<MobileNav
  icon={<ShieldAlert size={19} />}
  text="Threat Reports"
  onClick={() => {
    setMobileMenu(false);
    onNavigate("threat-reports");
  }}
/>

<MobileNav
  icon={<Users size={19} />}
  text="Users"
  onClick={() => {
    setMobileMenu(false);
    onNavigate("users");
  }}
/>

<MobileNav
  icon={<Settings size={19} />}
  text="Settings"
  onClick={() => {
    setMobileMenu(false);
    onNavigate("settings");
  }}
/>
          </div>

        </div>
      )}

      {/* ================= SIDEBAR ================= */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-[#172D44] bg-[#091624] lg:block">

        <div className="flex h-20 items-center gap-3 border-b border-[#172D44] px-6">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#235174] bg-[#102A43]">

            <Shield
              className="text-[#42B9FF]"
              size={22}
            />

          </div>

          <div>

            <h1 className="font-bold">
              ScamShield{" "}
              <span className="text-[#FF9F43]">
                AI
              </span>
            </h1>

            <p className="text-[9px] uppercase tracking-[0.2em] text-[#607D94]">
              Security Center
            </p>

          </div>

        </div>

        <div className="p-4">

          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-[#526B82]">
            Main Menu
          </p>

          <SidebarItem
            active
            icon={<LayoutDashboard size={18} />}
            text="Dashboard"
          />

          <SidebarItem
            icon={<LinkIcon size={18} />}
            text="URL Scanner"
            onClick={() => onNavigate("url-scanner")}
          />

          <SidebarItem
            icon={<MessageSquareWarning size={18} />}
            text="Message Scanner"
            onClick={() => onNavigate("message-scanner")}
          />

          <SidebarItem
            icon={<BarChart3 size={18} />}
            text="Analytics"
            onClick={() => onNavigate("analytics")}
          />

          <SidebarItem
            icon={<ShieldAlert size={18} />}
            text="Threat Reports"
            onClick={() => onNavigate("threat-reports")}
          />

          <p className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-widest text-[#526B82]">
            System
          </p>

          <SidebarItem
            icon={<Users size={18} />}
            text="Users"
            onClick={() => onNavigate("users")}
          />

          <SidebarItem
            icon={<Settings size={18} />}
            text="Settings"
            onClick={() => onNavigate("settings")}
          />

        </div>

        <div className="absolute bottom-5 left-4 right-4 rounded-xl border border-[#1B354E] bg-[#0C1D2E] p-4">

          <div className="flex items-center gap-2">

            <span className="h-2.5 w-2.5 rounded-full bg-[#32D583] shadow-[0_0_10px_#32D583]" />

            <span className="text-sm font-semibold">
              AI Engine Online
            </span>

          </div>

          <p className="mt-2 text-xs text-[#607D94]">
            Detection services operational
          </p>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="lg:ml-64">

        {/* ================= TOP BAR ================= */}

        <header className="flex min-h-20 items-center justify-between border-b border-[#172D44] bg-[#091624] px-3 py-3 sm:px-5 lg:h-20 lg:px-8 lg:py-0">

          <div className="flex min-w-0 items-center gap-2 sm:gap-4">

            <button
              onClick={() => setMobileMenu(true)}
              className="rounded-lg p-2 hover:bg-[#102A43] lg:hidden"
            >
              <Menu size={25} />
            </button>

            <div>

              <p className="text-xs text-[#607D94]">
                Security Center
              </p>

              <div className="flex items-center gap-2">

                <h2 className="text-base font-bold sm:text-lg">
                  Threat Detection
                </h2>

                <ChevronDown
                  size={16}
                  className="text-[#607D94]"
                />

              </div>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden items-center gap-2 rounded-lg border border-[#1B354E] bg-[#0C1D2E] px-3 py-2 md:flex">

              <Search
                size={16}
                className="text-[#607D94]"
              />

              <input
                type="text"
                placeholder="Search threats..."
                className="w-32 bg-transparent text-sm outline-none placeholder:text-[#526B82]"
              />

            </div>

           <div className="relative">

  <button
    onClick={() =>
      setShowNotifications(!showNotifications)
    }
    className="relative rounded-lg border border-[#1B354E] bg-[#0C1D2E] p-2.5 transition hover:bg-[#102A43]"
  >

    <Bell size={18} />

    {analytics.recentScans?.some(
      (scan) => scan.score >= 60
    ) && (
      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#FF4D5E]" />
    )}

  </button>

  {/* ================= NOTIFICATION PANEL ================= */}

  {showNotifications && (

    <div className="fixed left-4 right-4 top-24 z-[100] w-auto max-w-none overflow-hidden rounded-xl border border-[#1A344C] bg-[#091624] shadow-2xl lg:absolute lg:left-auto lg:right-0 lg:top-12 lg:w-80 lg:max-w-80">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-[#17344D] px-4 py-3">

        <div>

          <p className="text-sm font-bold">
            Notifications
          </p>

          <p className="text-[10px] text-[#607D94]">
            Recent security alerts
          </p>

        </div>

        <Bell
          size={16}
          className="text-[#42B9FF]"
        />

      </div>

      {/* Notifications */}

      <div className="max-h-80 overflow-y-auto">

        {analytics.recentScans &&
        analytics.recentScans.filter(
          (scan) => scan.score >= 60
        ).length > 0 ? (

          analytics.recentScans
            .filter((scan) => scan.score >= 60)
            .map((scan) => (

             <div
                 key={scan._id}
                 onClick={() => {
                setShowNotifications(false);
               onNavigate("threat-reports");
                 }}
              className="cursor-pointer border-b border-[#142C42] px-4 py-3 transition hover:bg-[#0D2133]"
        >

                <div className="flex gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3A1720]">

                    <AlertTriangle
                      size={15}
                      className="text-[#FF4D5E]"
                    />

                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-semibold text-white">
                      {scan.type === "URL"
                        ? "Phishing URL detected"
                        : "Scam message detected"}
                    </p>

                    <p className="mt-1 truncate text-[10px] text-[#607D94]">
                      {scan.category}
                    </p>

                    <p className="mt-1 text-[9px] text-[#526B82]">
                      Risk Score: {scan.score}
                    </p>

                    <p className="mt-1 text-[9px] text-[#526B82]">
                      {new Date(
                        scan.createdAt
                      ).toLocaleString([], {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>

                  </div>

                </div>

              </div>

            ))

        ) : (

          <div className="px-4 py-8 text-center">

            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#0B3028]">

              <ShieldCheck
                size={20}
                className="text-[#32D583]"
              />

            </div>

            <p className="text-xs font-semibold">
              No new threats
            </p>

            <p className="mt-1 text-[10px] text-[#607D94]">
              Your recent scans look safe.
            </p>

          </div>

        )}

      </div>

    </div>

  )}

</div>

            <div className="flex items-center gap-2">

              <div 
              title={userName}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#17344D] text-sm font-bold">
                {userInitials}
              </div>

              <button
  onClick={onLogout}
  className="rounded-xl border border-[#FF4D5E] bg-[#3A1720] px-3 py-2.5 text-xs font-bold text-[#FF4D5E] transition hover:bg-[#4A1B25] sm:px-5 sm:text-sm"
>
  <span className="sm:hidden">↪</span>
  <span className="hidden sm:inline">Logout</span>
</button>

            </div>

          </div>

        </header>

        {/* ==================================================
            HOME HERO
        ================================================== */}

        <section className="relative min-h-[600px] sm:min-h-[680px] overflow-hidden">

          {/* BACKGROUND IMAGE */}

          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('/backgroundcybercrime.jpg')",
            }}
          />

          {/* DARK OVERLAY */}

          <div className="absolute inset-0 bg-[#07111F]/65" />

          {/* BLUE GLOW */}

          <div className="absolute -right-40 top-10 h-[450px] w-[450px] rounded-full bg-[#42B9FF]/10 blur-[100px]" />

          {/* RED GLOW */}

          <div className="absolute -left-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#FF4D5E]/10 blur-[100px]" />

          {/* HERO CONTENT */}

          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:gap-12 sm:px-6 sm:py-16 lg:py-28 lg:grid-cols-2 ">

            {/* ================= LEFT ================= */}

            <div>

              {/* Badge */}

              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#42B9FF]/40 bg-[#07111F]/75 px-4 py-2 text-sm font-semibold text-[#42B9FF] backdrop-blur-md">

                <span className="h-2 w-2 rounded-full bg-[#32D583] shadow-[0_0_10px_#32D583]" />

                AI-Powered Threat Detection

              </div>

              {/* Heading */}

              <h1 className="text-3xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">

                Detect Phishing

                <span className="block text-[#FF9F43]">
                  & Scam Attacks
                </span>

                <span className="block text-white">
                  Before They Harm You
                </span>

              </h1>

              {/* Description */}

              <p className="mt-5 text-base leading-7 text-[#C4D5E5] sm:mt-6 sm:text-lg sm:leading-8">
                Protect yourself from suspicious links, fake websites,
                scam messages and online fraud with AI-powered threat
                detection.

              </p>

              {/* Buttons */}

              <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4">

                <button
                  onClick={() => onNavigate("url-scanner")}
                  className="flex items-center gap-2 rounded-xl bg-[#FF9F43] px-7 py-4 font-bold text-[#17100A] shadow-lg transition hover:bg-[#FFB66B]"
                >

                  <Search size={18} />

                  Start Scanning

                </button>

                <button className="rounded-xl border border-white/30 bg-[#07111F]/60 px-7 py-4 font-bold text-white backdrop-blur-md transition hover:bg-white/10">

                  Learn More →

                </button>

              </div>

              {/* Features */}

              <div className="mt-9 flex flex-wrap gap-6 text-sm text-[#D0DAE3]">

                <div className="flex items-center gap-2">

                  <span className="text-[#32D583]">
                    ✓
                  </span>

                  AI Analysis

                </div>

                <div className="flex items-center gap-2">

                  <span className="text-[#32D583]">
                    ✓
                  </span>

                  Real-time Risk Score

                </div>

                <div className="flex items-center gap-2">

                  <span className="text-[#32D583]">
                    ✓
                  </span>

                  Threat Detection

                </div>

              </div>

            </div>

            {/* ================= RIGHT ================= */}

            <div className="relative">

              <div className="rounded-2xl border border-[#31516D] bg-[#07111F]/85 p-5 shadow-2xl backdrop-blur-md">

                {/* Card Header */}

                <div className="mb-5 flex items-center justify-between border-b border-[#1A344C] pb-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#102A43]">

                      <Shield
                        size={22}
                        className="text-[#42B9FF]"
                      />

                    </div>

                    <div>

                      <p className="font-bold">
                        Security Risk Score
                      </p>

                      <p className="text-xs text-[#607D94]">
                        Based on your recent scans
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#32D583]">

                    <span className="h-2 w-2 rounded-full bg-[#32D583]" />

                    LIVE

                  </div>

                </div>

                {/* Score */}

                <div className="flex justify-center py-8">

                  <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[10px] sm:h-48 sm:w-48 sm:border-[14px] border-[#FF4D5E]/20">

                    <div className="absolute -inset-3 rounded-full border-[12px] border-transparent border-t-[#42B9FF] border-r-[#FF4D5E] rotate-[-35deg]" />

                    <div className="text-center">

                      <p className="text-5xl font-extrabold sm:text-6xl">

                        {analyticsLoading
                          ? "..."
                          : analytics.averageRisk}

                      </p>

                      <p
                        className={`mt-1 text-xs font-bold uppercase tracking-widest ${
                          analytics.averageRisk >= 60
                            ? "text-[#FF4D5E]"
                            : analytics.averageRisk >= 30
                            ? "text-[#FF9F43]"
                            : "text-[#32D583]"
                        }`}
                      >

                        {analyticsLoading
                          ? "Loading"
                          : analytics.averageRisk >= 60
                          ? "High Risk"
                          : analytics.averageRisk >= 30
                          ? "Suspicious"
                          : "Safe"}

                      </p>

                    </div>

                  </div>

                </div>

                {/* Risk boxes */}

                <div className="grid grid-cols-3 gap-2 sm:gap-3">

                  <RiskBox
                    value={
                      analyticsLoading
                        ? "..."
                        : String(
                            analytics.riskDistribution.highRisk
                          ).padStart(2, "0")
                    }
                    label="High Risk"
                    type="red"
                  />

                  <RiskBox
                    value={
                      analyticsLoading
                        ? "..."
                        : String(
                            analytics.riskDistribution.suspicious
                          ).padStart(2, "0")
                    }
                    label="Suspicious"
                    type="orange"
                  />

                  <RiskBox
                    value={
                      analyticsLoading
                        ? "..."
                        : String(
                            analytics.riskDistribution.safe
                          ).padStart(2, "0")
                    }
                    label="Safe"
                    type="blue"
                  />

                </div>

              </div>

              {/* Floating status */}

              <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-[#1B354E] bg-[#091624]/95 p-4 shadow-xl backdrop-blur-md sm:block">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B3028]">

                    <ShieldCheck
                      size={20}
                      className="text-[#32D583]"
                    />

                  </div>

                  <div>

                    <p className="text-xs text-[#607D94]">
                      AI Status
                    </p>

                    <p className="text-sm font-bold text-[#32D583]">
                      Detection Active
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            SECURITY OVERVIEW
        ================================================== */}

        <section className="bg-transparent px-4 py-8 sm:px-5 sm:py-10 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <div className="mb-6">

              <div className="flex items-center gap-2">

                <h2 className="text-2xl font-bold">
                  Security Overview
                </h2>

                <span className="rounded-md border border-[#174D6E] bg-[#0D2B40] px-2 py-1 text-[10px] font-bold uppercase text-[#42B9FF]">
                  Live
                </span>

              </div>

              <p className="mt-1 text-sm text-[#607D94]">
                Real-time phishing and scam monitoring
              </p>

            </div>

            {/* STAT CARDS */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <StatCard
                title="Total Scans"
                value={
                  analyticsLoading
                    ? "..."
                    : analytics.totalScans
                }
                change="Live"
                icon={<Target size={21} />}
                type="blue"
              />

              <StatCard
                title="Threats Detected"
                value={
                  analyticsLoading
                    ? "..."
                    : analytics.threatsDetected
                }
                change="Live"
                icon={<ShieldAlert size={21} />}
                type="red"
              />

              <StatCard
                title="Safe Content"
                value={
                  analyticsLoading
                    ? "..."
                    : analytics.safeScans
                }
                change="Live"
                icon={<ShieldCheck size={21} />}
                type="green"
              />

              <StatCard
                title="Average Risk"
                value={
                  analyticsLoading
                    ? "..."
                    : `${analytics.averageRisk}%`
                }
                change="Live"
                icon={<Bot size={21} />}
                type="orange"
              />

            </div>

            {/* THREAT + RISK */}

            <div className="mt-5 grid gap-5 xl:grid-cols-3">

              <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90 xl:col-span-2">

                <PanelHeader
                  title="Top Threat Alerts"
                  icon={<AlertTriangle size={17} />}
                />

                <div className="p-4">

                  {analytics.recentScans &&
                  analytics.recentScans.filter(
                    (scan) => scan.score >= 60
                  ).length > 0 ? (

                    analytics.recentScans
                      .filter((scan) => scan.score >= 60)
                      .map((scan) => (
                        <ThreatRow
                          key={scan._id}
                          title={
                            scan.type === "URL"
                              ? "Phishing URL detected"
                              : "Scam message detected"
                          }
                          source={scan.category}
                          severity={scan.level}
                          time={new Date(
                            scan.createdAt
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          critical
                        />
                      ))

                  ) : (

                    <p className="py-6 text-center text-xs text-[#607D94]">
                      No high-risk threats detected recently.
                    </p>

                  )}

                </div>

              </div>

              {/* RISK */}

              <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90">

                <PanelHeader
                  title="Security Risk Score"
                  icon={<Shield size={17} />}
                />

                <div className="p-5">

                  <div className="flex justify-center py-5">

                    <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[12px] border-[#FF4D5E]/20">

                      <div className="absolute -inset-3 rounded-full border-[12px] border-transparent border-t-[#42B9FF] border-r-[#FF4D5E] rotate-[-35deg]" />

                      <div className="text-center">

                        <p className="text-5xl font-extrabold">

                          {analyticsLoading
                            ? "..."
                            : analytics.averageRisk}

                        </p>

                        <p
                          className={`text-xs uppercase tracking-widest ${
                            analytics.averageRisk >= 60
                              ? "text-[#FF4D5E]"
                              : analytics.averageRisk >= 30
                              ? "text-[#FF9F43]"
                              : "text-[#32D583]"
                          }`}
                        >

                          {analyticsLoading
                            ? "Loading"
                            : analytics.averageRisk >= 60
                            ? "High Risk"
                            : analytics.averageRisk >= 30
                            ? "Suspicious"
                            : "Safe"}

                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="space-y-3">

                    <RiskItem
                      label="High Risk"
                      value={
                        analyticsLoading
                          ? "..."
                          : analytics.riskDistribution.highRisk
                      }
                      color="red"
                    />

                    <RiskItem
                      label="Suspicious"
                      value={
                        analyticsLoading
                          ? "..."
                          : analytics.riskDistribution.suspicious
                      }
                      color="orange"
                    />

                    <RiskItem
                      label="Safe"
                      value={
                        analyticsLoading
                          ? "..."
                          : analytics.riskDistribution.safe
                      }
                      color="yellow"
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* ==================================================
                DETECTION ACTIVITY
            ================================================== */}

            <div className="mt-5 grid gap-5 xl:grid-cols-3">

              <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90 xl:col-span-2">

                <PanelHeader
                  title="Detection Activity"
                  icon={<BarChart3 size={17} />}
                />

                <div className="p-5">

                  <div className="mb-5 flex items-center justify-between">

                    <div>

                      <p className="text-2xl font-bold">

                        {analyticsLoading
                          ? "..."
                          : analytics.totalScans}

                      </p>

                      <p className="text-xs text-[#607D94]">
                        total scans
                      </p>

                    </div>

                    <div className="rounded-md border border-[#145A47] bg-[#0C3027] px-2 py-1 text-xs font-semibold text-[#32D583]">
                      LAST 7 DAYS
                    </div>

                  </div>

                  {/* REAL ACTIVITY GRAPH */}

                  <div className="relative h-52 overflow-hidden rounded-lg border border-[#142C42] bg-[#081725]">

                    {/* Grid */}

                    <div className="absolute inset-0 bg-[linear-gradient(#17344D_1px,transparent_1px),linear-gradient(90deg,#17344D_1px,transparent_1px)] bg-[size:60px_40px] opacity-40" />

                    {activityData.length > 0 ? (

                      <div className="absolute inset-x-4 bottom-10 top-5 flex items-end justify-between gap-2">

                        {activityData.map((day) => {

                          const safeHeight =
                            ((day.safe || 0) /
                              maxActivity) *
                            100;

                          const threatHeight =
                            ((day.threats || 0) /
                              maxActivity) *
                            100;

                          return (
                            <div
                              key={day.date}
                              className="flex h-full flex-1 items-end justify-center gap-1"
                            >

                              {/* Safe */}

                              <div
                                title={`Safe: ${day.safe || 0}`}
                                className="w-2 rounded-t bg-[#42B9FF] sm:w-3 transition-all duration-500"
                                style={{
                                  height: `${Math.max(
                                    safeHeight,
                                    day.safe > 0 ? 5 : 0
                                  )}%`,
                                }}
                              />

                              {/* Threat */}

                              <div
                                title={`Threats: ${day.threats || 0}`}
                                className="w-2 rounded-t bg-[#FF4D5E] sm:w-3 transition-all duration-500"
                                style={{
                                  height: `${Math.max(
                                    threatHeight,
                                    day.threats > 0 ? 5 : 0
                                  )}%`,
                                }}
                              />

                            </div>
                          );
                        })}

                      </div>

                    ) : (

                      <div className="absolute inset-0 flex items-center justify-center">

                        <p className="text-xs text-[#607D94]">
                          No scan activity available yet.
                        </p>

                      </div>

                    )}

                    {/* Dates */}

                    <div className="absolute bottom-3 left-4 right-4 flex justify-between text-[9px] text-[#526B82]">

                      {activityData.length > 0 ? (

                        activityData.map((day) => {

                          const date = new Date(
                            `${day.date}T00:00:00`
                          );

                          return (
                            <span key={day.date}>
                              {date.toLocaleDateString([], {
                                day: "2-digit",
                                month: "short",
                              })}
                            </span>
                          );
                        })

                      ) : (

                        <>
                          <span>Day 1</span>
                          <span>Day 2</span>
                          <span>Day 3</span>
                          <span>Day 4</span>
                          <span>Day 5</span>
                          <span>Day 6</span>
                          <span>Day 7</span>
                        </>

                      )}

                    </div>

                  </div>

                  <div className="mt-4 flex gap-5 text-xs">

                    <div className="flex items-center gap-2">

                      <span className="h-2 w-2 rounded-full bg-[#42B9FF]" />

                      Safe Scans

                    </div>

                    <div className="flex items-center gap-2">

                      <span className="h-2 w-2 rounded-full bg-[#FF4D5E]" />

                      Threats

                    </div>

                  </div>

                </div>

              </div>

              {/* RECENT SCANS */}

              <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90">

                <PanelHeader
                  title="Recent Scans"
                  icon={<Search size={17} />}
                />

                <div className="overflow-x-auto">

                  <table className="w-full text-left text-xs">

                    <thead className="border-b border-[#17344D] text-[#526B82]">

                      <tr>

                        <th className="px-4 py-3 font-medium">
                          TYPE
                        </th>

                        <th className="px-4 py-3 font-medium">
                          RISK
                        </th>

                        <th className="px-4 py-3 font-medium">
                          TIME
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {analytics.recentScans &&
                      analytics.recentScans.length > 0 ? (

                        analytics.recentScans.map((scan) => (

                          <RecentScan
                            key={scan._id}
                            type={
                              scan.type === "URL"
                                ? "URL Scan"
                                : "Message Scan"
                            }
                            risk={String(
                              scan.score
                            ).padStart(2, "0")}
                            time={new Date(
                              scan.createdAt
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            safe={scan.score < 30}
                          />

                        ))

                      ) : (

                        <tr>

                          <td
                            colSpan="3"
                            className="px-4 py-6 text-center text-[#607D94]"
                          >
                            No recent scans available.
                          </td>

                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

            {/* BOTTOM CARDS */}

            <div className="mt-5 grid gap-5 lg:grid-cols-3">

              {/* THREAT DISTRIBUTION */}

              <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90">

                <PanelHeader
                  title="Threat Distribution"
                  icon={<BarChart3 size={17} />}
                />

                <div className="space-y-5 p-5">

                  <ProgressItem
                    label="High Risk"
                    value={
                      analytics.totalScans > 0
                        ? `${Math.round(
                            (analytics.riskDistribution.highRisk /
                              analytics.totalScans) *
                              100
                          )}%`
                        : "0%"
                    }
                    percentage={
                      analytics.totalScans > 0
                        ? Math.round(
                            (analytics.riskDistribution.highRisk /
                              analytics.totalScans) *
                              100
                          )
                        : 0
                    }
                    color="bg-[#FF4D5E]"
                  />

                  <ProgressItem
                    label="Suspicious"
                    value={
                      analytics.totalScans > 0
                        ? `${Math.round(
                            (analytics.riskDistribution.suspicious /
                              analytics.totalScans) *
                              100
                          )}%`
                        : "0%"
                    }
                    percentage={
                      analytics.totalScans > 0
                        ? Math.round(
                            (analytics.riskDistribution.suspicious /
                              analytics.totalScans) *
                              100
                          )
                        : 0
                    }
                    color="bg-[#FF9F43]"
                  />

                  <ProgressItem
                    label="Safe"
                    value={
                      analytics.totalScans > 0
                        ? `${Math.round(
                            (analytics.riskDistribution.safe /
                              analytics.totalScans) *
                              100
                          )}%`
                        : "0%"
                    }
                    percentage={
                      analytics.totalScans > 0
                        ? Math.round(
                            (analytics.riskDistribution.safe /
                              analytics.totalScans) *
                              100
                          )
                        : 0
                    }
                    color="bg-[#42B9FF]"
                  />

                </div>

              </div>

              {/* AI ENGINE */}

              <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90">

                <PanelHeader
                  title="AI Detection Engine"
                  icon={<Bot size={17} />}
                />

                <div className="p-5">

                  <div className="rounded-xl border border-[#174D6E] bg-[#0A2437] p-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#103B59]">

                        <Bot
                          className="text-[#42B9FF]"
                          size={22}
                        />

                      </div>

                      <div>

                        <p className="font-bold">
                          Detection Engine
                        </p>

                        <p className="text-xs text-[#607D94]">
                          Rule-based threat analysis
                        </p>

                      </div>

                    </div>

                    <div className="mt-5 flex items-end justify-between">

                      <div>

                        <p className="text-3xl font-bold">

                          {analyticsLoading
                            ? "..."
                            : analytics.totalScans}

                        </p>

                        <p className="text-xs text-[#607D94]">
                          Scans processed
                        </p>

                      </div>

                      <span className="rounded-md bg-[#0B382B] px-2 py-1 text-xs font-bold text-[#32D583]">
                        ONLINE
                      </span>

                    </div>

                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <MiniStat
                      label="Threats"
                      value={
                        analyticsLoading
                          ? "..."
                          : analytics.threatsDetected
                      }
                    />

                    <MiniStat
                      label="Safe"
                      value={
                        analyticsLoading
                          ? "..."
                          : analytics.safeScans
                      }
                    />

                  </div>

                </div>

              </div>

              {/* PROTECTION */}

              <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90">

                <PanelHeader
                  title="Protection Status"
                  icon={<Lock size={17} />}
                />

                <div className="space-y-3 p-5">

                  <ProtectionItem
                    icon={<Globe size={17} />}
                    title="URL Scanner"
                    status="Active"
                  />

                  <ProtectionItem
                    icon={<MessageSquareWarning size={17} />}
                    title="Message Analyzer"
                    status="Active"
                  />

                  <ProtectionItem
                    icon={<Bot size={17} />}
                    title="AI Detection"
                    status="Active"
                  />

                  <ProtectionItem
                    icon={<Shield size={17} />}
                    title="Threat Database"
                    status="Updated"
                  />

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <footer className="mt-8 flex flex-col justify-between gap-3 border-t border-[#172D44] pt-6 text-xs text-[#526B82] md:flex-row">

              <p>
                © 2026 ScamShield AI
              </p>

              <p>
                AI-powered phishing & scam detection system
              </p>

              <div className="flex flex-wrap gap-4">

                <span className="cursor-pointer hover:text-white">
                  Privacy
                </span>

                <span className="cursor-pointer hover:text-white">
                  Security
                </span>

                <span className="cursor-pointer hover:text-white">
                  Help
                </span>

              </div>

            </footer>

          </div>

        </section>

      </main>

    </div>
  );
}


/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  icon,
  text,
  active = false,
  onClick,
}) {

  return (

    <div
      onClick={onClick}
      className={`mb-1 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
        active
          ? "border border-[#174D6E] bg-[#0D2B40] text-[#42B9FF]"
          : "text-[#7891A6] hover:bg-[#0D2133] hover:text-white"
      }`}
    >

      {icon}

      <span>
        {text}
      </span>

    </div>

  );
}


/* =========================================================
   MOBILE NAV
========================================================= */

function MobileNav({
  icon,
  text,
  onClick,
}) {

  return (

    <div className="flex cursor-pointer items-center gap-3 rounded-lg bg-[#0D2133] p-4 text-[#B5C7D6]" onClick={onClick}>

      {icon}

      {text}

    </div>

  );

}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  change,
  icon,
  type,
}) {

  const styles = {

    blue: {
      icon: "bg-[#0D2B40] text-[#42B9FF]",
      change: "text-[#42B9FF]",
    },

    red: {
      icon: "bg-[#3A1720] text-[#FF4D5E]",
      change: "text-[#FF6B78]",
    },

    green: {
      icon: "bg-[#0B3028] text-[#32D583]",
      change: "text-[#32D583]",
    },

    orange: {
      icon: "bg-[#392514] text-[#FF9F43]",
      change: "text-[#FF9F43]",
    },

  };

  return (

    <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90 p-5 transition hover:border-[#31516D]">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs text-[#607D94]">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {value}
          </p>

        </div>

        <div
          className={`rounded-lg p-2.5 ${styles[type].icon}`}
        >
          {icon}
        </div>

      </div>

      <p
        className={`mt-4 text-xs font-semibold ${styles[type].change}`}
      >

        {change}

        <span className="font-normal text-[#526B82]">
          {" "}vs last month
        </span>

      </p>

    </div>

  );

}


/* =========================================================
   PANEL HEADER
========================================================= */

function PanelHeader({
  title,
  icon,
}) {

  return (

    <div className="flex items-center justify-between border-b border-[#17344D] px-5 py-4">

      <div className="flex items-center gap-2">

        <span className="text-[#42B9FF]">
          {icon}
        </span>

        <h3 className="text-sm font-bold">
          {title}
        </h3>

      </div>

      <button className="text-xs text-[#526B82] hover:text-white">
        ⋮
      </button>

    </div>

  );

}


/* =========================================================
   THREAT ROW
========================================================= */

function ThreatRow({
  title,
  source,
  severity,
  time,
  critical = false,
}) {

  return (

    <div className="mb-2 flex items-center gap-3 rounded-lg border border-[#17344D] bg-[#0D2133] p-3">

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          critical
            ? "bg-[#3A1720] text-[#FF4D5E]"
            : "bg-[#392514] text-[#FF9F43]"
        }`}
      >

        <AlertTriangle size={17} />

      </div>

      <div className="min-w-0 flex-1">

        <p className="truncate text-sm font-semibold">
          {title}
        </p>

        <p className="mt-1 truncate text-[11px] text-[#607D94]">
          {source}
        </p>

      </div>

      <div className="hidden text-right sm:block">

        <p
          className={`text-xs font-bold ${
            critical
              ? "text-[#FF4D5E]"
              : "text-[#FF9F43]"
          }`}
        >
          {severity}
        </p>

        <p className="mt-1 text-[10px] text-[#526B82]">
          {time}
        </p>

      </div>

    </div>

  );

}


/* =========================================================
   RISK ITEM
========================================================= */

function RiskItem({
  label,
  value,
  color,
}) {

  const colors = {

    red: "bg-[#FF4D5E]",

    orange: "bg-[#FF9F43]",

    yellow: "bg-[#FFD166]",

  };

  return (

    <div className="flex items-center justify-between">

      <div className="flex items-center gap-2">

        <span
          className={`h-2 w-2 rounded-full ${colors[color]}`}
        />

        <span className="text-xs text-[#8BA0B2]">
          {label}
        </span>

      </div>

      <span className="text-sm font-bold">
        {value}
      </span>

    </div>

  );

}


/* =========================================================
   RISK BOX
========================================================= */

function RiskBox({
  value,
  label,
  type,
}) {

  const styles = {

    red: {
      box: "border-[#3A1720] bg-[#24131A]",
      text: "text-[#FF4D5E]",
    },

    orange: {
      box: "border-[#49351E] bg-[#241B12]",
      text: "text-[#FF9F43]",
    },

    blue: {
      box: "border-[#174D6E] bg-[#0D2638]",
      text: "text-[#42B9FF]",
    },

  };

  return (

    <div
      className={`rounded-lg border p-3 text-center ${styles[type].box}`}
    >

      <p
        className={`text-lg font-bold ${styles[type].text}`}
      >
        {value}
      </p>

      <p className="text-[10px] text-[#8094A5]">
        {label}
      </p>

    </div>

  );

}


/* =========================================================
   RECENT SCAN
========================================================= */

function RecentScan({
  type,
  risk,
  time,
  safe = false,
}) {

  return (

    <tr className="border-b border-[#142C42]">

      <td className="px-4 py-3">

        <div className="flex items-center gap-2">

          <span
            className={`h-1.5 w-1.5 rounded-full ${
              safe
                ? "bg-[#32D583]"
                : "bg-[#FF4D5E]"
            }`}
          />

          <span className="whitespace-nowrap">
            {type}
          </span>

        </div>

      </td>

      <td
        className={`px-4 py-3 font-bold ${
          safe
            ? "text-[#32D583]"
            : "text-[#FF4D5E]"
        }`}
      >
        {risk}
      </td>

      <td className="px-4 py-3 text-[#607D94]">
        {time}
      </td>

    </tr>

  );

}


/* =========================================================
   PROGRESS ITEM
========================================================= */

function ProgressItem({
  label,
  value,
  percentage,
  color,
}) {

  return (

    <div>

      <div className="mb-2 flex justify-between text-xs">

        <span className="text-[#8BA0B2]">
          {label}
        </span>

        <span className="font-bold">
          {value}
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#142C42]">

        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>

  );

}


/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  label,
  value,
}) {

  return (

    <div className="rounded-lg border border-[#17344D] bg-[#081725] p-3">

      <p className="text-[10px] uppercase tracking-wide text-[#526B82]">
        {label}
      </p>

      <p className="mt-1 font-bold">
        {value}
      </p>

    </div>

  );

}


/* =========================================================
   PROTECTION ITEM
========================================================= */

function ProtectionItem({
  icon,
  title,
  status,
}) {

  return (

    <div className="flex items-center justify-between rounded-lg border border-[#17344D] bg-[#081725] p-3">

      <div className="flex items-center gap-3">

        <div className="text-[#42B9FF]">
          {icon}
        </div>

        <span className="text-xs font-medium">
          {title}
        </span>

      </div>

      <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#32D583]">

        <span className="h-1.5 w-1.5 rounded-full bg-[#32D583]" />

        {status}

      </span>

    </div>

  );

}


export default Home;
