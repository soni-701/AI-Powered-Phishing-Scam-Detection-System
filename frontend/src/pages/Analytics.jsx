import API_URL from "../api";
import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronRight,
  Shield,
  ShieldAlert,
  Target,
  TrendingUp,
} from "lucide-react";

function Analytics({ onNavigate }) {
  const [analytics, setAnalytics] = useState({
    totalScans: 0,
    threatsDetected: 0,
    suspiciousScans: 0,
    safeScans: 0,
    urlScans: 0,
    messageScans: 0,
    averageRisk: 0,
    riskDistribution: {
      safe: 0,
      suspicious: 0,
      highRisk: 0,
    },
    categoryCounts: {},
    mlPredictions: {
      phishing: 0,
      legitimate: 0,
      spam: 0,
      ham: 0,
      unknown: 0,
    },
    mlDetection: {
      url: {
        total: 0,
        phishing: 0,
        legitimate: 0,
      },
      message: {
        total: 0,
        spam: 0,
        ham: 0,
      },
    },
    averageMLConfidence: 0,
    dailyActivity: [],
    recentScans: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/api/analytics`,
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

        setAnalytics((previous) => ({
          ...previous,
          ...data.analytics,

          riskDistribution: {
            ...previous.riskDistribution,
            ...(data.analytics.riskDistribution || {}),
          },

          categoryCounts:
            data.analytics.categoryCounts || {},

          mlPredictions: {
            ...previous.mlPredictions,
            ...(data.analytics.mlPredictions || {}),
          },

          mlDetection: {
            ...previous.mlDetection,
            ...(data.analytics.mlDetection || {}),
          },

          averageMLConfidence:
            data.analytics.averageMLConfidence || 0,

          dailyActivity:
            data.analytics.dailyActivity || [],

          recentScans:
            data.analytics.recentScans || [],
        }));
      } catch (err) {
        console.error("Analytics Error:", err);

        setError(
          err.message ||
            "Unable to connect to the backend. Make sure the backend is running on port 5000."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const riskPercentages = useMemo(() => {
    const total = analytics.totalScans;

    if (total === 0) {
      return {
        safe: 0,
        suspicious: 0,
        highRisk: 0,
      };
    }

    return {
      safe: Math.round(
        (analytics.riskDistribution.safe / total) * 100
      ),
      suspicious: Math.round(
        (analytics.riskDistribution.suspicious / total) * 100
      ),
      highRisk: Math.round(
        (analytics.riskDistribution.highRisk / total) * 100
      ),
    };
  }, [analytics]);

  const categories = useMemo(() => {
    const entries = Object.entries(
      analytics.categoryCounts || {}
    );

    const totalThreats = entries.reduce(
      (sum, [, count]) => sum + count,
      0
    );

    return entries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        count,
        percentage:
          totalThreats > 0
            ? Math.round((count / totalThreats) * 100)
            : 0,
      }));
  }, [analytics]);

  const totalMLPredictions =
    analytics.mlPredictions.phishing +
    analytics.mlPredictions.legitimate +
    analytics.mlPredictions.spam +
    analytics.mlPredictions.ham;

  const maxActivity = Math.max(
    ...analytics.dailyActivity.map((day) =>
      Math.max(day.safe || 0, day.threats || 0)
    ),
    1
  );

  const averageRiskLabel =
    analytics.averageRisk >= 60
      ? "High Risk"
      : analytics.averageRisk >= 30
      ? "Suspicious"
      : "Safe";

  const recentThreats = (analytics.recentScans || []).filter(
    (scan) => scan.score >= 60
  );

  const urlPercentage =
    analytics.totalScans > 0
      ? Math.round(
          (analytics.urlScans / analytics.totalScans) * 100
        )
      : 0;

  const messagePercentage =
    analytics.totalScans > 0
      ? Math.round(
          (analytics.messageScans / analytics.totalScans) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-[#EDECE7] text-[#2F302F]">

      {/* =====================================================
          BACK
      ===================================================== */}

      <div className="border-b border-[#D8D5CD] bg-[#F4F2ED]">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={() => onNavigate?.("home")}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#666761] transition hover:bg-white hover:text-[#343532]"
          >
            <span className="text-base leading-none">←</span>
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="border-b border-[#D6D3CC] bg-[#EDECE7]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C9C6BE] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#666761]">
                <BarChart3 size={13} className="text-[#2F7D5A]" />
                SECURITY ANALYTICS
              </div>

              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#343532] sm:text-5xl">
                See what your
                <span className="block text-[#2F7D5A]">
                  security data says.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#70716B] sm:text-base">
                Monitor scan activity, threat levels, detection
                categories and machine-learning performance from
                your live security data.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#C8DCCF] bg-[#F1F7F3] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-[#2F7D5A]">
              <span className="h-2 w-2 rounded-full bg-[#2F7D5A]" />
              Live Database Data
            </div>

          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        {loading && (
          <div className="mb-5 rounded-2xl border border-[#D4D1C9] bg-white p-5 text-center text-sm text-[#777872]">
            Loading security analytics...
          </div>
        )}

        {error && !loading && (
          <div className="mb-5 rounded-2xl border border-[#E1C8C4] bg-[#FBF4F2] p-4 text-sm text-[#8C5B55]">
            {error}
          </div>
        )}

        {/* ===================================================
            KPI CARDS
        =================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <KpiCard
            title="Total Scans"
            value={analytics.totalScans}
            description="All completed scans"
            icon={<Target size={19} />}
          />

          <KpiCard
            title="Threats Detected"
            value={analytics.threatsDetected}
            description="Risk score 60 and above"
            icon={<ShieldAlert size={19} />}
            danger
          />

          <KpiCard
            title="Safe Scans"
            value={analytics.safeScans}
            description="Risk score below 30"
            icon={<CheckCircle2 size={19} />}
            success
          />

          <KpiCard
            title="Average Risk"
            value={`${analytics.averageRisk}%`}
            description="Average across all scans"
            icon={<Activity size={19} />}
          />

        </section>

        {/* ===================================================
            OVERVIEW
        =================================================== */}

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">

          <div className="rounded-[24px] border border-[#D4D1C9] bg-white shadow-sm">

            <SectionHeader
              title="Scan Overview"
              description="Distribution of URL and message scans"
              icon={<TrendingUp size={17} />}
            />

            <div className="p-5 sm:p-7">

              <div className="grid gap-4 sm:grid-cols-3">
                <OverviewBox
                  title="Total"
                  value={analytics.totalScans}
                  icon={<Target size={17} />}
                />

                <OverviewBox
                  title="URL"
                  value={analytics.urlScans}
                  icon={<Shield size={17} />}
                />

                <OverviewBox
                  title="Messages"
                  value={analytics.messageScans}
                  icon={<Activity size={17} />}
                />
              </div>

              <div className="mt-7 space-y-6">

                <RatioBar
                  label="URL Scans"
                  value={analytics.urlScans}
                  percentage={urlPercentage}
                  variant="green"
                />

                <RatioBar
                  label="Message Scans"
                  value={analytics.messageScans}
                  percentage={messagePercentage}
                  variant="gray"
                />

              </div>

            </div>

          </div>

          <div className="rounded-[24px] border border-[#D4D1C9] bg-white shadow-sm">

            <SectionHeader
              title="Risk Distribution"
              description="Current threat mix"
              icon={<Shield size={17} />}
            />

            <div className="p-5 sm:p-7">

              <div className="flex justify-center py-3">
                <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[13px] border-[#D7E7DC]">

                  <div
                    className="absolute inset-[-13px] rounded-full border-[13px] border-transparent border-t-[#2F7D5A] border-r-[#88AF99] rotate-[30deg]"
                  />

                  <div className="text-center">
                    <p className="text-3xl font-semibold text-[#363733]">
                      {analytics.totalScans}
                    </p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#8A8A83]">
                      Scans
                    </p>
                  </div>

                </div>
              </div>

              <div className="mt-5 space-y-4">

                <DistributionItem
                  label="Safe"
                  value={`${riskPercentages.safe}%`}
                  color="bg-[#2F7D5A]"
                />

                <DistributionItem
                  label="Suspicious"
                  value={`${riskPercentages.suspicious}%`}
                  color="bg-[#A28D59]"
                />

                <DistributionItem
                  label="High Risk"
                  value={`${riskPercentages.highRisk}%`}
                  color="bg-[#8C5B55]"
                />

              </div>

              <div className="mt-6 rounded-xl border border-[#D8D5CD] bg-[#F8F7F3] p-4">
                <p className="text-xs text-[#72736D]">
                  Average risk:{" "}
                  <span className="font-semibold text-[#3F403C]">
                    {analytics.averageRisk}%
                  </span>{" "}
                  · Overall status:{" "}
                  <span className="font-semibold text-[#2F7D5A]">
                    {averageRiskLabel}
                  </span>
                </p>
              </div>

            </div>
          </div>

        </section>

        {/* ===================================================
            ACTIVITY
        =================================================== */}

        <section className="mt-5 rounded-[24px] border border-[#D4D1C9] bg-white shadow-sm">

          <SectionHeader
            title="Detection Activity"
            description="Seven-day scan activity from your live database"
            icon={<Activity size={17} />}
          />

          <div className="p-5 sm:p-7">

            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-semibold text-[#363733]">
                  {analytics.totalScans}
                </p>

                <p className="mt-1 text-xs text-[#888982]">
                  total scans processed
                </p>
              </div>

              <div className="flex gap-4 text-xs text-[#777872]">
                <Legend label="Safe" green />
                <Legend label="Threat" />
              </div>
            </div>

            <div className="relative h-64 overflow-hidden rounded-xl border border-[#DDD9D1] bg-[#F8F7F3]">

              <div
                className="absolute inset-0 opacity-80"
                style={{
                  backgroundImage:
                    "linear-gradient(#E5E2DB 1px, transparent 1px), linear-gradient(90deg, #E5E2DB 1px, transparent 1px)",
                  backgroundSize: "70px 42px",
                }}
              />

              {analytics.dailyActivity.length > 0 ? (
                <div className="absolute inset-x-5 bottom-12 top-6 flex items-end justify-between gap-2">
                  {analytics.dailyActivity.map((day) => {

                    const safeHeight =
                      ((day.safe || 0) / maxActivity) * 100;

                    const threatHeight =
                      ((day.threats || 0) / maxActivity) * 100;

                    return (
                      <div
                        key={day.date}
                        className="flex h-full flex-1 items-end justify-center gap-1.5"
                      >
                        <div
                          title={`Safe: ${day.safe || 0}`}
                          className="w-2 rounded-t-md bg-[#7FAE95] transition-all sm:w-3"
                          style={{
                            height: `${Math.max(
                              safeHeight,
                              day.safe > 0 ? 4 : 0
                            )}%`,
                          }}
                        />

                        <div
                          title={`Threats: ${day.threats || 0}`}
                          className="w-2 rounded-t-md bg-[#9D716B] transition-all sm:w-3"
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
                  <p className="text-xs text-[#8A8A83]">
                    No scan activity available yet.
                  </p>
                </div>
              )}

              <div className="absolute bottom-3 left-5 right-5 flex justify-between text-[9px] text-[#91918A]">
                {analytics.dailyActivity.length > 0
                  ? analytics.dailyActivity.map((day) => {
                      const date = new Date(`${day.date}T00:00:00`);

                      return (
                        <span key={day.date}>
                          {date.toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })}
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

        </section>

        {/* ===================================================
            THREAT CATEGORIES + RECENT THREATS
        =================================================== */}

        <section className="mt-5 grid gap-5 lg:grid-cols-2">

          <div className="rounded-[24px] border border-[#D4D1C9] bg-white shadow-sm">

            <SectionHeader
              title="Threat Categories"
              description="Most common detection categories"
              icon={<AlertTriangle size={17} />}
            />

            <div className="space-y-5 p-5 sm:p-7">

              {categories.length > 0 ? (
                categories.map((category) => (
                  <CategoryRow
                    key={category.name}
                    name={category.name}
                    count={category.count}
                    percentage={category.percentage}
                  />
                ))
              ) : (
                <EmptyState text="No threat category data available." />
              )}

            </div>

          </div>

          <div className="rounded-[24px] border border-[#D4D1C9] bg-white shadow-sm">

            <SectionHeader
              title="Recent High-Risk Alerts"
              description="Latest scans with risk score 60+"
              icon={<ShieldAlert size={17} />}
              action="View reports"
              onClick={() => onNavigate?.("threat-reports")}
            />

            <div className="space-y-2.5 p-5 sm:p-7">

              {recentThreats.length > 0 ? (
                recentThreats.slice(0, 5).map((scan) => (
                  <ThreatRow
                    key={scan._id}
                    title={
                      scan.type === "URL"
                        ? "Phishing URL detected"
                        : "Scam message detected"
                    }
                    category={scan.category}
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
                ))
              ) : (
                <EmptyState text="No high-risk threats detected recently." />
              )}

            </div>

          </div>

        </section>

        {/* ===================================================
            ML ANALYTICS
        =================================================== */}

        <section className="mt-5 rounded-[24px] border border-[#434341] bg-[#434341] text-white shadow-sm">

          <div className="border-b border-[#666660] px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#555551]">
                <Bot size={19} />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#C9C6BE]">
                  MACHINE LEARNING
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  AI / ML detection analytics
                </h2>

                <p className="mt-1 text-xs text-[#C1BEB6]">
                  Predictions generated by the Python ML service
                </p>
              </div>

            </div>
          </div>

          <div className="p-5 sm:p-7">

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <DarkKpi
                label="Phishing"
                value={analytics.mlPredictions.phishing}
                description="URL predictions"
                danger
              />

              <DarkKpi
                label="Legitimate"
                value={analytics.mlPredictions.legitimate}
                description="Safe URL predictions"
                success
              />

              <DarkKpi
                label="Spam"
                value={analytics.mlPredictions.spam}
                description="Message predictions"
                warning
              />

              <DarkKpi
                label="Ham"
                value={analytics.mlPredictions.ham}
                description="Safe message predictions"
              />

            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">

              <DarkInfoCard
                title="Average ML Confidence"
                value={`${analytics.averageMLConfidence}%`}
                description="Average confidence across stored predictions"
              />

              <DarkInfoCard
                title="URL ML Detection"
                value={analytics.mlDetection.url.total}
                description={`${analytics.mlDetection.url.phishing} phishing · ${analytics.mlDetection.url.legitimate} legitimate`}
              />

              <DarkInfoCard
                title="Message ML Detection"
                value={analytics.mlDetection.message.total}
                description={`${analytics.mlDetection.message.spam} spam · ${analytics.mlDetection.message.ham} ham`}
              />

            </div>

            <div className="mt-5 rounded-xl border border-[#666660] bg-[#4D4D49] p-5">

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">
                    ML Prediction Distribution
                  </p>

                  <p className="mt-1 text-xs text-[#C1BEB6]">
                    {totalMLPredictions} predictions currently stored
                  </p>
                </div>

                <span className="rounded-full bg-[#555551] px-3 py-1.5 text-[10px] font-semibold text-[#E1DED6]">
                  LIVE
                </span>
              </div>

              <div className="mt-6 space-y-4">

                <MLBar
                  label="Phishing"
                  value={analytics.mlPredictions.phishing}
                  total={totalMLPredictions}
                  variant="danger"
                />

                <MLBar
                  label="Legitimate"
                  value={analytics.mlPredictions.legitimate}
                  total={totalMLPredictions}
                  variant="success"
                />

                <MLBar
                  label="Spam"
                  value={analytics.mlPredictions.spam}
                  total={totalMLPredictions}
                  variant="warning"
                />

                <MLBar
                  label="Ham"
                  value={analytics.mlPredictions.ham}
                  total={totalMLPredictions}
                  variant="neutral"
                />

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            MODEL EVALUATION
        =================================================== */}

        <section className="mt-5 rounded-[24px] border border-[#D4D1C9] bg-white shadow-sm">

          <SectionHeader
            title="ML Model Evaluation"
            description="Current model architecture and reported evaluation"
            icon={<Bot size={17} />}
          />

          <div className="p-5 sm:p-7">

            <div className="grid gap-4 lg:grid-cols-2">

              <ModelCard
                title="URL Phishing Model"
                algorithm="Random Forest Classifier"
                accuracy="99.57%"
                dataset="UCI PhiUSIIL URL Dataset"
                features="18 lexical URL features"
                description="Classifies URLs as phishing or legitimate using URL structure and lexical characteristics."
              />

              <ModelCard
                title="Message Spam Model"
                algorithm="Logistic Regression"
                accuracy="97.40%"
                dataset="UCI SMS Spam Collection"
                features="TF-IDF text features"
                description="Classifies messages as spam or ham using TF-IDF based text representation."
              />

            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">

              <div className="rounded-xl border border-[#D8D5CD] bg-[#F8F7F3] p-5">
                <p className="text-xs font-semibold text-[#3E403C]">
                  Detection architecture
                </p>

                <p className="mt-2 text-xs leading-5 text-[#777872]">
                  Machine-learning models provide prediction and
                  confidence, while the rule layer contributes
                  explainable threat indicators.
                </p>
              </div>

              <div className="rounded-xl border border-[#D8D5CD] bg-[#F8F7F3] p-5">
                <p className="text-xs font-semibold text-[#3E403C]">
                  Average model confidence
                </p>

                <p className="mt-2 text-2xl font-semibold text-[#2F7D5A]">
                  {analytics.averageMLConfidence}%
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            DATABASE SUMMARY
        =================================================== */}

        <section className="mt-5 grid gap-4 md:grid-cols-3">

          <SummaryCard
            title="Stored Scans"
            value={analytics.totalScans}
            description="Scans stored in MongoDB"
          />

          <SummaryCard
            title="Suspicious Scans"
            value={analytics.suspiciousScans}
            description="Medium-risk scans"
          />

          <SummaryCard
            title="Average Risk"
            value={`${analytics.averageRisk}%`}
            description="Average risk across all scans"
          />

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-[#D6D3CB] bg-[#434341] text-white">

        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">

          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#555551]">
                  <Shield size={17} />
                </div>

                <p className="font-semibold">
                  ScamGuard AI
                </p>
              </div>

              <p className="mt-3 max-w-md text-xs leading-5 text-[#D0CDC5]">
                Live security analytics for phishing, scam and
                machine-learning detection activity.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold">
                Analytics
              </p>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => onNavigate?.("home")}
                  className="block text-xs text-[#CAC7BF] hover:text-white"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => onNavigate?.("threat-reports")}
                  className="block text-xs text-[#CAC7BF] hover:text-white"
                >
                  Threat Reports
                </button>

                <button
                  onClick={() => onNavigate?.("url-scanner")}
                  className="block text-xs text-[#CAC7BF] hover:text-white"
                >
                  URL Scanner
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold">
                Platform
              </p>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => onNavigate?.("message-scanner")}
                  className="block text-xs text-[#CAC7BF] hover:text-white"
                >
                  Message Scanner
                </button>

                <button
                  onClick={() => onNavigate?.("users")}
                  className="block text-xs text-[#CAC7BF] hover:text-white"
                >
                  Users
                </button>

                <button
                  onClick={() => onNavigate?.("settings")}
                  className="block text-xs text-[#CAC7BF] hover:text-white"
                >
                  Settings
                </button>
              </div>
            </div>

          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-[#666660] pt-5 text-[10px] text-[#C1BEB6] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 ScamGuard AI. All rights reserved.</p>
            <p>Live MongoDB analytics · AI-powered security</p>
          </div>

        </div>

      </footer>

    </div>
  );
}

/* =========================================================
   KPI CARD
========================================================= */

function KpiCard({
  title,
  value,
  description,
  icon,
  danger = false,
  success = false,
}) {
  const iconClass = danger
    ? "bg-[#F3E2DF] text-[#8C5B55]"
    : success
    ? "bg-[#E8F1EC] text-[#2F7D5A]"
    : "bg-[#ECEAE5] text-[#555650]";

  return (
    <div className="rounded-2xl border border-[#D4D1C9] bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-xs text-[#7B7C76]">
            {title}
          </p>

          <p className="mt-2 text-3xl font-semibold text-[#343532]">
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
   SECTION HEADER
========================================================= */

function SectionHeader({
  title,
  description,
  icon,
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
          <h2 className="text-sm font-semibold text-[#393A36]">
            {title}
          </h2>

          <p className="mt-0.5 text-[10px] text-[#898A84]">
            {description}
          </p>
        </div>

      </div>

      {action && (
        <button
          onClick={onClick}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F7D5A] hover:text-[#245F45]"
        >
          {action}
          <ChevronRight size={14} />
        </button>
      )}

    </div>
  );
}

/* =========================================================
   OVERVIEW BOX
========================================================= */

function OverviewBox({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-[#E0DDD5] bg-[#F8F7F3] p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-wide text-[#898A84]">
          {title}
        </p>

        <span className="text-[#555650]">
          {icon}
        </span>
      </div>

      <p className="mt-3 text-2xl font-semibold text-[#3D3E3A]">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   RATIO BAR
========================================================= */

function RatioBar({
  label,
  value,
  percentage,
  variant,
}) {
  const bar =
    variant === "green"
      ? "bg-[#2F7D5A]"
      : "bg-[#777872]";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-[#666761]">
          {label}
        </span>

        <span className="font-semibold text-[#3F403C]">
          {value} · {percentage}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#E4E1D9]">
        <div
          className={`h-full rounded-full ${bar}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   DISTRIBUTION ITEM
========================================================= */

function DistributionItem({
  label,
  value,
  color,
}) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-2.5">
        <span
          className={`h-2.5 w-2.5 rounded-full ${color}`}
        />

        <span className="text-xs text-[#666761]">
          {label}
        </span>
      </div>

      <span className="text-sm font-semibold text-[#3F403C]">
        {value}
      </span>

    </div>
  );
}

/* =========================================================
   LEGEND
========================================================= */

function Legend({ label, green = false }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`h-2 w-2 rounded-full ${
          green ? "bg-[#2F7D5A]" : "bg-[#9D716B]"
        }`}
      />
      {label}
    </span>
  );
}

/* =========================================================
   CATEGORY ROW
========================================================= */

function CategoryRow({
  name,
  count,
  percentage,
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <span className="text-sm font-semibold text-[#42433F]">
            {name}
          </span>

          <span className="ml-2 text-[10px] text-[#96968F]">
            {count} detections
          </span>
        </div>

        <span className="text-xs font-semibold text-[#555650]">
          {percentage}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#E4E1D9]">
        <div
          className="h-full rounded-full bg-[#777872]"
          style={{ width: `${percentage}%` }}
        />
      </div>

    </div>
  );
}

/* =========================================================
   THREAT ROW
========================================================= */

function ThreatRow({
  title,
  category,
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
          {category}
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
   EMPTY
========================================================= */

function EmptyState({ text }) {
  return (
    <div className="rounded-xl border border-dashed border-[#D8D5CD] bg-[#F8F7F3] px-5 py-9 text-center">
      <ShieldCheckIcon />
      <p className="mt-2 text-xs text-[#85867F]">
        {text}
      </p>
    </div>
  );
}

function ShieldCheckIcon() {
  return (
    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F1EC] text-[#2F7D5A]">
      <CheckCircle2 size={19} />
    </div>
  );
}

/* =========================================================
   DARK KPI
========================================================= */

function DarkKpi({
  label,
  value,
  description,
  danger = false,
  success = false,
  warning = false,
}) {
  const text = danger
    ? "text-[#D4A6A0]"
    : success
    ? "text-[#A9CCB7]"
    : warning
    ? "text-[#D2BD86]"
    : "text-[#E5E2DB]";

  return (
    <div className="rounded-xl border border-[#65655F] bg-[#4D4D49] p-4">

      <p className="text-[9px] uppercase tracking-wide text-[#B8B5AD]">
        {label}
      </p>

      <p className={`mt-2 text-2xl font-semibold ${text}`}>
        {value}
      </p>

      <p className="mt-1 text-[9px] text-[#B8B5AD]">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   DARK INFO
========================================================= */

function DarkInfoCard({
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-xl border border-[#65655F] bg-[#4D4D49] p-4">

      <p className="text-[9px] uppercase tracking-wide text-[#B8B5AD]">
        {title}
      </p>

      <p className="mt-2 text-2xl font-semibold text-[#E5E2DB]">
        {value}
      </p>

      <p className="mt-1 text-[10px] leading-5 text-[#C2BFB7]">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   ML BAR
========================================================= */

function MLBar({
  label,
  value,
  total,
  variant,
}) {
  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  const bar = {
    danger: "bg-[#9D716B]",
    success: "bg-[#7FAE95]",
    warning: "bg-[#B9A16F]",
    neutral: "bg-[#9A9991]",
  }[variant];

  return (
    <div>

      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-[#D0CDC5]">
          {label}
        </span>

        <span className="font-semibold text-[#EEECE6]">
          {value} ({percentage}%)
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#5D5D58]">
        <div
          className={`h-full rounded-full ${bar}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

    </div>
  );
}

/* =========================================================
   MODEL CARD
========================================================= */

function ModelCard({
  title,
  algorithm,
  accuracy,
  dataset,
  features,
  description,
}) {
  return (
    <div className="rounded-2xl border border-[#D8D5CD] bg-[#F8F7F3] p-5">

      <div className="flex items-start justify-between gap-4">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECEAE5] text-[#555650]">
          <Bot size={18} />
        </div>

        <span className="rounded-full bg-[#E8F1EC] px-3 py-1.5 text-sm font-semibold text-[#2F7D5A]">
          {accuracy}
        </span>

      </div>

      <h3 className="mt-4 text-sm font-semibold text-[#3D3E3A]">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-[#777872]">
        {description}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">

        <MiniDetail
          label="Algorithm"
          value={algorithm}
        />

        <MiniDetail
          label="Dataset"
          value={dataset}
        />

        <MiniDetail
          label="Features"
          value={features}
          full
        />

      </div>

    </div>
  );
}

/* =========================================================
   MINI DETAIL
========================================================= */

function MiniDetail({
  label,
  value,
  full = false,
}) {
  return (
    <div
      className={`rounded-xl border border-[#E0DDD5] bg-white p-3 ${
        full ? "sm:col-span-2" : ""
      }`}
    >
      <p className="text-[9px] uppercase tracking-wide text-[#96968F]">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-[#555650]">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-[#D4D1C9] bg-white p-5">
      <p className="text-xs text-[#7B7C76]">
        {title}
      </p>

      <p className="mt-2 text-2xl font-semibold text-[#343532]">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-[#96968F]">
        {description}
      </p>
    </div>
  );
}

export default Analytics;
