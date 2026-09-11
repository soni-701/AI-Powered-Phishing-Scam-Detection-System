import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronRight,
  Globe2,
  Link as LinkIcon,
  LockKeyhole,
  MessageSquareWarning,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Target,
  TrendingUp,
} from "lucide-react";

function Home({ onNavigate }) {
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

  const activityData = analytics.dailyActivity || [];

  const maxActivity = useMemo(() => {
    return Math.max(
      ...activityData.map((day) =>
        Math.max(day.safe || 0, day.threats || 0)
      ),
      1
    );
  }, [activityData]);

  const recentThreats = useMemo(() => {
    return (analytics.recentScans || []).filter(
      (scan) => scan.score >= 60
    );
  }, [analytics.recentScans]);

  const safePercentage =
    analytics.totalScans > 0
      ? Math.round(
          (analytics.riskDistribution.safe /
            analytics.totalScans) *
            100
        )
      : 0;

  const threatPercentage =
    analytics.totalScans > 0
      ? Math.round(
          (analytics.riskDistribution.highRisk /
            analytics.totalScans) *
            100
        )
      : 0;

  const suspiciousPercentage =
    analytics.totalScans > 0
      ? Math.round(
          (analytics.riskDistribution.suspicious /
            analytics.totalScans) *
            100
        )
      : 0;

  const averageRiskLabel =
    analytics.averageRisk >= 60
      ? "High Risk"
      : analytics.averageRisk >= 30
      ? "Suspicious"
      : "Safe";

  const handleScanUrl = () => {
    onNavigate("url-scanner");
  };

  const handleScanMessage = () => {
    onNavigate("message-scanner");
  };

  const navItems = [
    ["home", "Home"],
    ["url-scanner", "URL Scanner"],
    ["message-scanner", "Message Scanner"],
    ["analytics", "Analytics"],
    ["threat-reports", "Threat Reports"],
    ["users", "Users"],
    ["settings", "Settings"],
  ];

  return (
    <div className="min-h-screen bg-[#EDECE7] text-[#2F302F]">

      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-[#D8D5CD] bg-[#EDECE7]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-[1500px] items-center gap-5 px-4 sm:px-6 lg:px-8">

          {/* BRAND */}

          <button
            onClick={() => onNavigate("home")}
            className="flex shrink-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#434341] text-white">
              <Shield size={20} />
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold tracking-tight text-[#343532]">
                ScamGuard AI
              </p>
              <p className="text-[9px] uppercase tracking-[0.16em] text-[#85867F]">
                Threat Intelligence
              </p>
            </div>
          </button>

          {/* NAVIGATION */}

          <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex">
            {navItems.map(([id, label]) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                  id === "home"
                    ? "bg-[#434341] text-white"
                    : "text-[#666761] hover:bg-white hover:text-[#343532]"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* MOBILE NAV */}

          <div className="ml-auto flex max-w-full items-center gap-2 overflow-x-auto xl:hidden">
            {navItems.map(([id, label]) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`shrink-0 rounded-lg px-2.5 py-2 text-[10px] font-medium transition ${
                  id === "home"
                    ? "bg-[#434341] text-white"
                    : "text-[#666761] hover:bg-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* USER */}

          <div className="hidden items-center gap-2 md:flex">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#CFCBC3] bg-white px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[#2F7D5A]" />
              <span className="text-[10px] font-semibold text-[#666761]">
                System Online
              </span>
            </div>

            <button
              onClick={() => onNavigate("settings")}
              className="flex items-center gap-2 rounded-xl border border-[#CFCBC3] bg-white px-2 py-1.5 transition hover:border-[#AAA69E]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#434341] text-xs font-semibold text-white">
                U
              </div>
              <span className="text-xs font-semibold text-[#3D3E3A]">
                Account
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="border-b border-[#D6D3CC] bg-[#EDECE7]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:px-8 lg:py-20">

          {/* HERO COPY */}

          <div>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#B8B5AD] bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-[#4F514E] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#2F7D5A]" />
              AI-POWERED THREAT PROTECTION
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.03] tracking-[-0.04em] text-[#2F302F] sm:text-5xl lg:text-6xl">
              Detect phishing
              <span className="block text-[#434341]">
                before it becomes
              </span>
              <span className="block text-[#2F7D5A]">
                your problem.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#656761] sm:text-lg">
              ScamGuard AI combines machine learning with
              explainable security rules to analyze suspicious
              websites and scam messages quickly and clearly.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleScanUrl}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#434341] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#333331]"
              >
                <LinkIcon size={17} />
                Scan a URL
                <ArrowRight size={16} />
              </button>

              <button
                onClick={handleScanMessage}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#B8B5AD] bg-white px-6 py-3.5 text-sm font-semibold text-[#3E403D] transition hover:border-[#8E8C85] hover:bg-[#F8F7F3]"
              >
                <MessageSquareWarning size={17} />
                Analyze a Message
              </button>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#6A6B66]">
              <FeatureTick text="Hybrid AI detection" />
              <FeatureTick text="Explainable results" />
              <FeatureTick text="Secure authentication" />
            </div>

          </div>

          {/* HERO STATUS PANEL */}

          <div className="relative">

            <div className="overflow-hidden rounded-[28px] border border-[#333431] bg-[#434341] p-5 text-white shadow-[0_24px_60px_rgba(67,67,65,0.18)] sm:p-7">

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D7D4CD]">
                    SECURITY OVERVIEW
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold">
                    Your current risk
                  </h2>

                  <p className="mt-1 text-sm text-[#C9C6BF]">
                    Based on your recent scans
                  </p>
                </div>

                <div className="rounded-full border border-[#7D817A] bg-[#555551] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#E5E2DB]">
                  Live
                </div>
              </div>

              <div className="mt-8 flex items-center gap-7">

                <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full border-[12px] border-[#686863] sm:h-40 sm:w-40">

                  <div
                    className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-t-[#2F7D5A] border-r-[#8AB6A0] rotate-[35deg]"
                    aria-hidden="true"
                  />

                  <div className="text-center">
                    <p className="text-4xl font-semibold">
                      {analyticsLoading
                        ? "..."
                        : analytics.averageRisk}
                    </p>

                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#C0BDB6]">
                      / 100
                    </p>
                  </div>

                </div>

                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#BDBAB3]">
                    Current Status
                  </p>

                  <p className="mt-2 text-2xl font-semibold">
                    {analyticsLoading
                      ? "Loading"
                      : averageRiskLabel}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-[#D5D2CA]">
                    <span className="h-2 w-2 rounded-full bg-[#79B697]" />
                    Detection engine operational
                  </div>
                </div>

              </div>

              <div className="mt-8 grid grid-cols-3 gap-2">
                <DarkRiskBox
                  value={
                    analyticsLoading
                      ? "..."
                      : analytics.riskDistribution.highRisk
                  }
                  label="High Risk"
                />

                <DarkRiskBox
                  value={
                    analyticsLoading
                      ? "..."
                      : analytics.riskDistribution.suspicious
                  }
                  label="Suspicious"
                />

                <DarkRiskBox
                  value={
                    analyticsLoading
                      ? "..."
                      : analytics.riskDistribution.safe
                  }
                  label="Safe"
                />
              </div>

            </div>

            <div className="mt-4 ml-auto w-full max-w-sm rounded-xl border border-[#D1CEC6] bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8F1EC]">
                  <ShieldCheck
                    size={16}
                    className="text-[#2F7D5A]"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-[#85867F]">
                    Protection
                  </p>

                  <p className="text-xs font-semibold text-[#3F413D]">
                    Active and monitoring
                  </p>
                </div>

                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#E8F1EC] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-[#2F7D5A]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2F7D5A]" />
                  Active
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          QUICK STATS
      ===================================================== */}

      <section className="border-b border-[#D6D3CC] bg-white">
        <div className="mx-auto grid max-w-7xl gap-px bg-[#D6D3CC] px-4 sm:px-6 lg:grid-cols-4 lg:px-8">

          <HomeStat
            title="Total Scans"
            value={
              analyticsLoading ? "..." : analytics.totalScans
            }
            description="All completed scans"
            icon={<Target size={19} />}
          />

          <HomeStat
            title="Threats Detected"
            value={
              analyticsLoading
                ? "..."
                : analytics.threatsDetected
            }
            description="High-risk detections"
            icon={<ShieldAlert size={19} />}
            danger
          />

          <HomeStat
            title="Safe Content"
            value={
              analyticsLoading
                ? "..."
                : analytics.safeScans
            }
            description={`${safePercentage}% of total scans`}
            icon={<ShieldCheck size={19} />}
            success
          />

          <HomeStat
            title="Average Risk"
            value={
              analyticsLoading
                ? "..."
                : `${analytics.averageRisk}%`
            }
            description="Across your scan history"
            icon={<Activity size={19} />}
          />

        </div>
      </section>

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#777872]">
            Get started
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#323330]">
            Choose a security check
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">

          <ActionCard
            icon={<Globe2 size={20} />}
            title="Scan a Website"
            description="Check a suspicious URL for phishing indicators, unsafe patterns and AI risk signals."
            action="Open URL Scanner"
            onClick={handleScanUrl}
          />

          <ActionCard
            icon={<MessageSquareWarning size={20} />}
            title="Analyze a Message"
            description="Inspect SMS or message text for scam language, suspicious links and spam indicators."
            action="Open Message Scanner"
            onClick={handleScanMessage}
          />

        </div>

      </section>

      {/* =====================================================
          THREAT + RISK
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">

        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">

          {/* THREAT ALERTS */}

          <div className="overflow-hidden rounded-2xl border border-[#D4D1C9] bg-white">

            <SectionHeader
              icon={<AlertTriangle size={17} />}
              title="Recent Threat Alerts"
              description="High-risk detections from your recent activity"
              onClick={() =>
                onNavigate("threat-reports")
              }
              action="View reports"
            />

            <div className="p-5">

              {recentThreats.length > 0 ? (
                <div className="space-y-2.5">
                  {recentThreats.slice(0, 5).map((scan) => (
                    <ThreatAlertRow
                      key={scan._id}
                      title={
                        scan.type === "URL"
                          ? "Phishing URL detected"
                          : "Scam message detected"
                      }
                      source={scan.category}
                      score={scan.score}
                      time={new Date(
                        scan.createdAt
                      ).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<ShieldCheck size={22} />}
                  title="No high-risk threats"
                  description="Your recent scans do not contain any high-risk detections."
                />
              )}

            </div>

          </div>

          {/* RISK DISTRIBUTION */}

          <div className="overflow-hidden rounded-2xl border border-[#D4D1C9] bg-white">

            <SectionHeader
              icon={<BarChart3 size={17} />}
              title="Risk Distribution"
              description="Your current scan mix"
            />

            <div className="space-y-6 p-5">

              <DistributionBar
                label="Safe"
                percentage={safePercentage}
                value={
                  analyticsLoading
                    ? "..."
                    : analytics.riskDistribution.safe
                }
                variant="success"
              />

              <DistributionBar
                label="Suspicious"
                percentage={suspiciousPercentage}
                value={
                  analyticsLoading
                    ? "..."
                    : analytics.riskDistribution.suspicious
                }
                variant="warning"
              />

              <DistributionBar
                label="High Risk"
                percentage={threatPercentage}
                value={
                  analyticsLoading
                    ? "..."
                    : analytics.riskDistribution.highRisk
                }
                variant="danger"
              />

              <div className="rounded-xl border border-[#DDD9D0] bg-[#F5F3EE] p-4">
                <p className="text-xs leading-5 text-[#686963]">
                  The final security score combines machine-learning
                  signals with rule-based indicators to reduce
                  false positives and explain why a scan was flagged.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          DETECTION ACTIVITY
      ===================================================== */}

      <section className="bg-[#DAD9D4]">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6D6D67]">
                Activity
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#343532]">
                Detection activity
              </h2>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#BDB9B0] bg-[#ECEAE5] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#64655F]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2F7D5A]" />
              Last 7 days
            </span>
          </div>

          <div className="rounded-2xl border border-[#C9C6BE] bg-[#F6F4EF] p-5 sm:p-6">

            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-semibold text-[#343532]">
                  {analyticsLoading
                    ? "..."
                    : analytics.totalScans}
                </p>

                <p className="mt-1 text-xs text-[#777872]">
                  total scans processed
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#6D6E68]">
                <LegendDot
                  label="Safe"
                  variant="success"
                />
                <LegendDot
                  label="Threat"
                  variant="danger"
                />
              </div>
            </div>

            <div className="relative h-64 overflow-hidden rounded-xl border border-[#D6D3CB] bg-white">

              <div
                className="absolute inset-0 opacity-80"
                style={{
                  backgroundImage:
                    "linear-gradient(#E5E2DB 1px, transparent 1px), linear-gradient(90deg, #E5E2DB 1px, transparent 1px)",
                  backgroundSize: "70px 42px",
                }}
              />

              {activityData.length > 0 ? (
                <div className="absolute inset-x-5 bottom-12 top-6 flex items-end justify-between gap-2">
                  {activityData.map((day) => {
                    const safeHeight =
                      ((day.safe || 0) / maxActivity) *
                      100;

                    const threatHeight =
                      ((day.threats || 0) / maxActivity) *
                      100;

                    return (
                      <div
                        key={day.date}
                        className="flex h-full flex-1 items-end justify-center gap-1.5"
                      >
                        <div
                          title={`Safe: ${day.safe || 0}`}
                          className="w-2 rounded-t-md bg-[#7FAE95] transition-all duration-500 sm:w-3"
                          style={{
                            height: `${Math.max(
                              safeHeight,
                              day.safe > 0 ? 4 : 0
                            )}%`,
                          }}
                        />

                        <div
                          title={`Threats: ${day.threats || 0}`}
                          className="w-2 rounded-t-md bg-[#8C5B55] transition-all duration-500 sm:w-3"
                          style={{
                            height: `${Math.max(
                              threatHeight,
                              day.threats > 0 ? 4 : 0
                            )}%`,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xs text-[#878880]">
                    No scan activity available yet.
                  </p>
                </div>
              )}

              <div className="absolute bottom-3 left-5 right-5 flex justify-between text-[9px] text-[#8A8A83]">
                {activityData.length > 0
                  ? activityData.map((day) => {
                      const date = new Date(
                        `${day.date}T00:00:00`
                      );

                      return (
                        <span key={day.date}>
                          {date.toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                            }
                          )}
                        </span>
                      );
                    })
                  : Array.from({ length: 7 }).map(
                      (_, index) => (
                        <span key={index}>
                          Day {index + 1}
                        </span>
                      )
                    )}
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          RECENT SCANS + AI ENGINE
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">

          {/* RECENT SCANS */}

          <div className="overflow-hidden rounded-2xl border border-[#D4D1C9] bg-white">

            <SectionHeader
              icon={<Search size={17} />}
              title="Recent Scans"
              description="Latest URL and message analysis"
              onClick={() =>
                onNavigate("threat-reports")
              }
              action="View all"
            />

            <div className="overflow-x-auto">

              <table className="w-full min-w-[540px] text-left">

                <thead className="border-b border-[#E0DDD5] bg-[#F8F7F3]">
                  <tr>
                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wide text-[#85867F]">
                      Type
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wide text-[#85867F]">
                      Risk
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wide text-[#85867F]">
                      Time
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {analytics.recentScans &&
                  analytics.recentScans.length > 0 ? (
                    analytics.recentScans
                      .slice(0, 6)
                      .map((scan) => (
                        <RecentScanRow
                          key={scan._id}
                          type={
                            scan.type === "URL"
                              ? "URL Scan"
                              : "Message Scan"
                          }
                          risk={scan.score}
                          time={new Date(
                            scan.createdAt
                          ).toLocaleString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        />
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-5 py-10 text-center text-xs text-[#888982]"
                      >
                        No recent scans available.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>

            </div>

          </div>

          {/* AI ENGINE */}

          <div className="overflow-hidden rounded-2xl border border-[#434341] bg-[#434341] text-white">

            <div className="border-b border-[#666660] px-5 py-4">

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#555551]">
                  <Bot
                    size={18}
                    className="text-[#DAD9D4]"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    AI Detection Engine
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#C3C0B8]">
                    Hybrid ML + rule-based protection
                  </p>
                </div>
              </div>

            </div>

            <div className="p-5">

              <div className="rounded-xl border border-[#696963] bg-[#4D4D49] p-4">

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#C6C3BB]">
                      Engine status
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                      Operational
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7C8B82] bg-[#58645C] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-[#E0E2DC]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#91C6A6]" />
                    Online
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <EngineBadge text="URL ML Detection" />
                  <EngineBadge text="Message ML Detection" />
                  <EngineBadge text="Explainable Rules" />
                  <EngineBadge text="Risk Scoring" />
                </div>

              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <DarkMetric
                  label="Threats"
                  value={
                    analyticsLoading
                      ? "..."
                      : analytics.threatsDetected
                  }
                />

                <DarkMetric
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

        </div>

      </section>

      {/* =====================================================
          PROTECTION GRID
      ===================================================== */}

      <section className="border-t border-[#D6D3CC] bg-[#F4F2ED]">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#777872]">
              Platform coverage
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#343532]">
              Protection that stays on
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <ProtectionCard
              icon={<Globe2 size={19} />}
              title="URL Scanner"
              text="Website structure and phishing pattern analysis."
            />

            <ProtectionCard
              icon={<MessageSquareWarning size={19} />}
              title="Message Analyzer"
              text="Scam language and spam indicator detection."
            />

            <ProtectionCard
              icon={<Bot size={19} />}
              title="AI Detection"
              text="Machine-learning predictions with confidence scoring."
            />

            <ProtectionCard
              icon={<LockKeyhole size={19} />}
              title="Secure Access"
              text="Authenticated scans, protected reports and account controls."
            />

          </div>

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="bg-[#434341] text-white">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C8C5BD]">
                Stay one step ahead
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Have something suspicious?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#D0CDC5]">
                Run a quick check before clicking a link or trusting
                a message.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleScanUrl}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#EDECE7] px-5 py-3 text-sm font-semibold text-[#3A3A38] transition hover:bg-white"
              >
                Scan URL
                <ChevronRight size={16} />
              </button>

              <button
                onClick={handleScanMessage}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#777771] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#50504C]"
              >
                Analyze Message
              </button>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

/* =========================================================
   FEATURE TICK
========================================================= */

function FeatureTick({ text }) {
  return (
    <span className="inline-flex items-center gap-2">
      <CheckCircle2
        size={14}
        className="text-[#2F7D5A]"
      />
      {text}
    </span>
  );
}

/* =========================================================
   DARK RISK BOX
========================================================= */

function DarkRiskBox({ value, label }) {
  return (
    <div className="rounded-xl border border-[#666660] bg-[#4F4F4B] px-3 py-3 text-center">
      <p className="text-lg font-semibold text-white">
        {value}
      </p>
      <p className="mt-1 text-[9px] uppercase tracking-wide text-[#CBC8C0]">
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   HOME STAT
========================================================= */

function HomeStat({
  title,
  value,
  description,
  icon,
  danger = false,
  success = false,
}) {
  const iconClass = danger
    ? "bg-[#F5E8E6] text-[#8C5B55]"
    : success
    ? "bg-[#E8F1EC] text-[#2F7D5A]"
    : "bg-[#ECEAE5] text-[#555650]";

  return (
    <div className="bg-white px-5 py-6 sm:px-6">
      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-xs text-[#7B7C76]">
            {title}
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-[#343532]">
            {value}
          </p>

          <p className="mt-1 text-[10px] text-[#96968F]">
            {description}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${iconClass}`}>
          {icon}
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   ACTION CARD
========================================================= */

function ActionCard({
  icon,
  title,
  description,
  action,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-[#D4D1C9] bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#A8A59D] hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-5">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ECEAE5] text-[#555650] transition group-hover:bg-[#E8F1EC] group-hover:text-[#2F7D5A]">
          {icon}
        </div>

        <ArrowRight
          size={17}
          className="text-[#9A9A92] transition group-hover:translate-x-1 group-hover:text-[#2F7D5A]"
        />

      </div>

      <h3 className="mt-6 text-lg font-semibold text-[#373834]">
        {title}
      </h3>

      <p className="mt-2 max-w-lg text-sm leading-6 text-[#72736D]">
        {description}
      </p>

      <p className="mt-5 text-xs font-semibold text-[#2F7D5A]">
        {action}
      </p>

    </button>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon,
  title,
  description,
  action,
  onClick,
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#E0DDD5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECEAE5] text-[#555650]">
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[#393A36]">
            {title}
          </h3>

          <p className="mt-0.5 text-[10px] text-[#898A84]">
            {description}
          </p>
        </div>

      </div>

      {action && (
        <button
          onClick={onClick}
          className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-[#2F7D5A] transition hover:text-[#245F45]"
        >
          {action}
          <ChevronRight size={14} />
        </button>
      )}

    </div>
  );
}

/* =========================================================
   THREAT ALERT ROW
========================================================= */

function ThreatAlertRow({
  title,
  source,
  score,
  time,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E3D5D2] bg-[#FBF6F5] p-3.5">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1DFDC] text-[#8C5B55]">
        <ShieldAlert size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-[#41423E]">
          {title}
        </p>

        <p className="mt-1 truncate text-[10px] text-[#85857E]">
          {source}
        </p>
      </div>

      <div className="text-right">
        <p className="text-xs font-semibold text-[#8C5B55]">
          {score}
        </p>

        <p className="mt-1 text-[9px] text-[#999991]">
          {time}
        </p>
      </div>

    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon,
  title,
  description,
}) {
  return (
    <div className="rounded-xl border border-dashed border-[#D8D5CD] bg-[#F8F7F3] px-5 py-10 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#E8F1EC] text-[#2F7D5A]">
        {icon}
      </div>

      <p className="mt-3 text-sm font-semibold text-[#41423E]">
        {title}
      </p>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#888982]">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   DISTRIBUTION BAR
========================================================= */

function DistributionBar({
  label,
  percentage,
  value,
  variant,
}) {
  const variants = {
    success: {
      bar: "bg-[#7FAE95]",
      dot: "bg-[#2F7D5A]",
    },
    warning: {
      bar: "bg-[#B9A16F]",
      dot: "bg-[#8A713B]",
    },
    danger: {
      bar: "bg-[#9D716B]",
      dot: "bg-[#8C5B55]",
    },
  };

  const style =
    variants[variant] || variants.success;

  return (
    <div>

      <div className="mb-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${style.dot}`}
          />
          <span className="text-[#666761]">
            {label}
          </span>
        </div>

        <span className="font-semibold text-[#41423E]">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#E4E1D9]">
        <div
          className={`h-full rounded-full ${style.bar}`}
          style={{
            width: `${Math.min(
              Math.max(percentage, 0),
              100
            )}%`,
          }}
        />
      </div>

      <p className="mt-1 text-right text-[9px] text-[#9A9A92]">
        {percentage}%
      </p>

    </div>
  );
}

/* =========================================================
   LEGEND DOT
========================================================= */

function LegendDot({ label, variant }) {
  const className =
    variant === "danger"
      ? "bg-[#8C5B55]"
      : "bg-[#2F7D5A]";

  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${className}`} />
      {label}
    </span>
  );
}

/* =========================================================
   RECENT SCAN ROW
========================================================= */

function RecentScanRow({
  type,
  risk,
  time,
}) {
  const isSafe = risk < 30;
  const isSuspicious = risk >= 30 && risk < 60;

  const badgeClass = isSafe
    ? "bg-[#E8F1EC] text-[#2F7D5A]"
    : isSuspicious
    ? "bg-[#F3ECDD] text-[#8A713B]"
    : "bg-[#F1DFDC] text-[#8C5B55]";

  const riskClass = isSafe
    ? "text-[#2F7D5A]"
    : isSuspicious
    ? "text-[#8A713B]"
    : "text-[#8C5B55]";

  return (
    <tr className="border-b border-[#EEECE5] last:border-b-0">

      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span
            className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${badgeClass}`}
          >
            {type === "URL Scan" ? (
              <LinkIcon size={14} />
            ) : (
              <MessageSquareWarning size={14} />
            )}
          </span>

          <span className="text-xs font-medium text-[#4C4D48]">
            {type}
          </span>
        </div>
      </td>

      <td className={`px-5 py-3.5 text-xs font-semibold ${riskClass}`}>
        {risk}
      </td>

      <td className="px-5 py-3.5 text-xs text-[#8A8A83]">
        {time}
      </td>

    </tr>
  );
}

/* =========================================================
   ENGINE BADGE
========================================================= */

function EngineBadge({ text }) {
  return (
    <div className="rounded-lg border border-[#64645E] bg-[#575752] px-3 py-2 text-[9px] font-medium text-[#E0DDD5]">
      <span className="mr-1.5 text-[#A9C8B6]">
        ✓
      </span>
      {text}
    </div>
  );
}

/* =========================================================
   DARK METRIC
========================================================= */

function DarkMetric({ label, value }) {
  return (
    <div className="rounded-xl border border-[#5F5F59] bg-[#4D4D49] p-3.5">
      <p className="text-[9px] uppercase tracking-wide text-[#B8B5AD]">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   PROTECTION CARD
========================================================= */

function ProtectionCard({
  icon,
  title,
  text,
}) {
  return (
    <div className="rounded-2xl border border-[#D8D5CD] bg-white p-5">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECEAE5] text-[#555650]">
        {icon}
      </div>

      <h3 className="mt-5 text-sm font-semibold text-[#3D3E3A]">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-[#80817A]">
        {text}
      </p>

      <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold text-[#2F7D5A]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#2F7D5A]" />
        Active
      </div>

    </div>
  );
}

export default Home;
