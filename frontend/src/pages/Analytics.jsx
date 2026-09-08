import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  CheckCircle,
  Shield,
  ShieldAlert,
  Target,
  TrendingUp,
} from "lucide-react";

function Analytics() {
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

    // ==========================================
    // ML ANALYTICS
    // ==========================================

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

  // ==========================================
  // GET ANALYTICS FROM BACKEND
  // ==========================================

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

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

  // ==========================================
  // RISK PERCENTAGES
  // ==========================================

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

  // ==========================================
  // CATEGORY DATA
  // ==========================================

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
      .map(([name, count], index) => {
        const percentage =
          totalThreats > 0
            ? Math.round(
                (count / totalThreats) * 100
              )
            : 0;

        const colors = [
          "bg-[#FF4D5E]",
          "bg-[#FF9F43]",
          "bg-[#42B9FF]",
          "bg-[#9B8AFB]",
          "bg-[#32D583]",
        ];

        return {
          name,
          count,
          percentage,
          color: colors[index],
        };
      });
  }, [analytics]);

  // ==========================================
  // ML PREDICTION TOTAL
  // ==========================================

  const totalMLPredictions =
    analytics.mlPredictions.phishing +
    analytics.mlPredictions.legitimate +
    analytics.mlPredictions.spam +
    analytics.mlPredictions.ham;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-transparent text-white">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-5 sm:py-8 lg:px-8">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#174D6E] bg-[#0D2B40] sm:h-12 sm:w-12">

              <BarChart3
                size={24}
                className="text-[#42B9FF]"
              />

            </div>

            <div>

              <h1 className="text-2xl font-bold sm:text-3xl">
                Security Analytics
              </h1>

              <p className="mt-1 text-sm text-[#607D94]">
                Monitor phishing and scam detection performance
              </p>

            </div>

          </div>

          <div className="w-full rounded-lg border border-[#25445D] bg-[#0B1B2B] px-4 py-2.5 text-center text-sm text-[#C4D0DB] md:w-auto">
            Live Database Data
          </div>

        </div>

        {/* ==========================================
            LOADING
        ========================================== */}

        {loading && (
          <div className="mb-5 rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90 p-5 text-center">

            <p className="text-sm text-[#607D94]">
              Loading analytics...
            </p>

          </div>
        )}

        {/* ==========================================
            ERROR
        ========================================== */}

        {error && !loading && (
          <div className="mb-5 rounded-xl border border-[#5A202A] bg-[#2A1218] p-4">

            <p className="text-sm text-[#FF4D5E]">
              {error}
            </p>

          </div>
        )}

        {/* ==========================================
            OVERVIEW CARDS
        ========================================== */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <AnalyticsCard
            title="Total Scans"
            value={analytics.totalScans}
            change="Live"
            icon={<Target size={21} />}
            type="blue"
          />

          <AnalyticsCard
            title="Threats Detected"
            value={analytics.threatsDetected}
            change="Risk ≥ 60"
            icon={<ShieldAlert size={21} />}
            type="red"
          />

          <AnalyticsCard
            title="Safe Scans"
            value={analytics.safeScans}
            change="Risk < 30"
            icon={<CheckCircle size={21} />}
            type="green"
          />

          <AnalyticsCard
            title="Average Risk"
            value={`${analytics.averageRisk}%`}
            change="All scans"
            icon={<Bot size={21} />}
            type="orange"
          />

        </div>

        {/* ==========================================
            MAIN ANALYTICS
        ========================================== */}

        <div className="mt-5 grid gap-5 xl:grid-cols-3">

          {/* SCAN OVERVIEW */}

          <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90 xl:col-span-2">

            <PanelHeader
              title="Scan Overview"
              icon={<TrendingUp size={17} />}
            />

            <div className="p-5">

              <div className="grid gap-4 sm:grid-cols-3">

                <OverviewBox
                  title="Total Scans"
                  value={analytics.totalScans}
                  icon={<Target size={18} />}
                />

                <OverviewBox
                  title="URL Scans"
                  value={analytics.urlScans}
                  icon={<Shield size={18} />}
                />

                <OverviewBox
                  title="Message Scans"
                  value={analytics.messageScans}
                  icon={<Activity size={18} />}
                />

              </div>

              {/* URL SCANS */}

              <div className="mt-6 rounded-xl border border-[#142C42] bg-[#081725] p-4 sm:p-5">

                <div className="mb-3 flex justify-between text-xs text-[#607D94]">

                  <span>
                    URL Scans
                  </span>

                  <span>
                    {analytics.urlScans}
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-[#142C42]">

                  <div
                    className="h-full rounded-full bg-[#42B9FF]"
                    style={{
                      width:
                        analytics.totalScans > 0
                          ? `${Math.round(
                              (analytics.urlScans /
                                analytics.totalScans) *
                                100
                            )}%`
                          : "0%",
                    }}
                  />

                </div>

                {/* MESSAGE SCANS */}

                <div className="mb-3 mt-6 flex justify-between text-xs text-[#607D94]">

                  <span>
                    Message Scans
                  </span>

                  <span>
                    {analytics.messageScans}
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-[#142C42]">

                  <div
                    className="h-full rounded-full bg-[#FF9F43]"
                    style={{
                      width:
                        analytics.totalScans > 0
                          ? `${Math.round(
                              (analytics.messageScans /
                                analytics.totalScans) *
                                100
                            )}%`
                          : "0%",
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* RISK DISTRIBUTION */}

          <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90">

            <PanelHeader
              title="Risk Distribution"
              icon={<Shield size={17} />}
            />

            <div className="p-5">

              <div className="flex justify-center overflow-hidden py-5">

                <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-[14px] border-[#32D583] sm:h-44 sm:w-44 sm:border-[18px]">

                  <div className="text-center">

                    <p className="text-4xl font-extrabold">
                      {analytics.totalScans}
                    </p>

                    <p className="text-[10px] uppercase tracking-widest text-[#607D94]">
                      Scans
                    </p>

                  </div>

                </div>

              </div>

              <div className="space-y-4">

                <DistributionItem
                  label="Safe"
                  value={`${riskPercentages.safe}%`}
                  color="bg-[#32D583]"
                />

                <DistributionItem
                  label="Suspicious"
                  value={`${riskPercentages.suspicious}%`}
                  color="bg-[#FF9F43]"
                />

                <DistributionItem
                  label="High Risk"
                  value={`${riskPercentages.highRisk}%`}
                  color="bg-[#FF4D5E]"
                />

              </div>

            </div>

          </div>

        </div>

        {/* ==========================================
            THREAT CATEGORIES + SCANNER PERFORMANCE
        ========================================== */}

        <div className="mt-5 grid gap-5 lg:grid-cols-2">

          {/* THREAT CATEGORIES */}

          <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90">

            <PanelHeader
              title="Threat Categories"
              icon={<AlertTriangle size={17} />}
            />

            <div className="space-y-5 p-5">

              {categories.length > 0 ? (
                categories.map((category) => (

                  <CategoryBar
                    key={category.name}
                    title={category.name}
                    count={category.count}
                    percentage={`${category.percentage}%`}
                    width={`${category.percentage}%`}
                    color={category.color}
                  />

                ))
              ) : (

                <p className="py-8 text-center text-sm text-[#607D94]">
                  No threat category data available.
                </p>

              )}

            </div>

          </div>

          {/* SCANNER PERFORMANCE */}

          <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90">

            <PanelHeader
              title="Scanner Performance"
              icon={<Activity size={17} />}
            />

            <div className="p-5">

              <ScannerPerformance
                title="URL Scanner"
                scans={analytics.urlScans}
                percentage={
                  analytics.totalScans > 0
                    ? Math.round(
                        (analytics.urlScans /
                          analytics.totalScans) *
                          100
                      )
                    : 0
                }
                color="bg-[#42B9FF]"
              />

              <ScannerPerformance
                title="Message Scanner"
                scans={analytics.messageScans}
                percentage={
                  analytics.totalScans > 0
                    ? Math.round(
                        (analytics.messageScans /
                          analytics.totalScans) *
                          100
                      )
                    : 0
                }
                color="bg-[#FF9F43]"
              />

            </div>

          </div>

        </div>

        {/* ==========================================
            AI / ML ANALYTICS
        ========================================== */}

        <div className="mt-5 rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90">

          <PanelHeader
            title="AI / ML Detection Analytics"
            icon={<Bot size={17} />}
          />

          <div className="p-5">

            {/* ML SUMMARY */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <MLStatCard
                title="Phishing"
                value={analytics.mlPredictions.phishing}
                description="URL ML predictions"
                icon={<ShieldAlert size={20} />}
                type="red"
              />

              <MLStatCard
                title="Legitimate"
                value={analytics.mlPredictions.legitimate}
                description="Safe URL predictions"
                icon={<Shield size={20} />}
                type="green"
              />

              <MLStatCard
                title="Spam"
                value={analytics.mlPredictions.spam}
                description="Message ML predictions"
                icon={<AlertTriangle size={20} />}
                type="orange"
              />

              <MLStatCard
                title="Ham"
                value={analytics.mlPredictions.ham}
                description="Safe message predictions"
                icon={<CheckCircle size={20} />}
                type="blue"
              />

            </div>

            {/* ML DETAILS */}

            <div className="mt-5 grid gap-5 md:grid-cols-3">

              {/* AVERAGE CONFIDENCE */}

              <div className="rounded-xl border border-[#17344D] bg-[#081725] p-5">

                <div className="flex items-center gap-3">

                  <div className="rounded-lg bg-[#0D2B40] p-3 text-[#42B9FF]">

                    <Bot size={21} />

                  </div>

                  <div>

                    <p className="text-xs text-[#607D94]">
                      Average ML Confidence
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {analytics.averageMLConfidence}%
                    </p>

                  </div>

                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#142C42]">

                  <div
                    className="h-full rounded-full bg-[#42B9FF]"
                    style={{
                      width: `${Math.min(
                        analytics.averageMLConfidence,
                        100
                      )}%`,
                    }}
                  />

                </div>

              </div>

              {/* URL ML */}

              <div className="rounded-xl border border-[#17344D] bg-[#081725] p-5">

                <div className="mb-4 flex items-center justify-between">

                  <div>

                    <p className="text-xs text-[#607D94]">
                      URL ML Detection
                    </p>

                    <p className="mt-1 text-xl font-bold">
                      {analytics.mlDetection.url.total}
                    </p>

                    <p className="text-xs text-[#526B82]">
                      Total URL predictions
                    </p>

                  </div>

                  <Shield
                    size={22}
                    className="text-[#42B9FF]"
                  />

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <div className="rounded-lg border border-[#3A1720] bg-[#2A1218] p-3">

                    <p className="text-xs text-[#607D94]">
                      Phishing
                    </p>

                    <p className="mt-1 text-lg font-bold text-[#FF4D5E]">
                      {analytics.mlDetection.url.phishing}
                    </p>

                  </div>

                  <div className="rounded-lg border border-[#173F35] bg-[#0B3028] p-3">

                    <p className="text-xs text-[#607D94]">
                      Legitimate
                    </p>

                    <p className="mt-1 text-lg font-bold text-[#32D583]">
                      {analytics.mlDetection.url.legitimate}
                    </p>

                  </div>

                </div>

              </div>

              {/* MESSAGE ML */}

              <div className="rounded-xl border border-[#17344D] bg-[#081725] p-5">

                <div className="mb-4 flex items-center justify-between">

                  <div>

                    <p className="text-xs text-[#607D94]">
                      Message ML Detection
                    </p>

                    <p className="mt-1 text-xl font-bold">
                      {analytics.mlDetection.message.total}
                    </p>

                    <p className="text-xs text-[#526B82]">
                      Total message predictions
                    </p>

                  </div>

                  <Activity
                    size={22}
                    className="text-[#FF9F43]"
                  />

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <div className="rounded-lg border border-[#3A1720] bg-[#2A1218] p-3">

                    <p className="text-xs text-[#607D94]">
                      Spam
                    </p>

                    <p className="mt-1 text-lg font-bold text-[#FF4D5E]">
                      {analytics.mlDetection.message.spam}
                    </p>

                  </div>

                  <div className="rounded-lg border border-[#173F35] bg-[#0B3028] p-3">

                    <p className="text-xs text-[#607D94]">
                      Ham
                    </p>

                    <p className="mt-1 text-lg font-bold text-[#32D583]">
                      {analytics.mlDetection.message.ham}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* ML PREDICTION DISTRIBUTION */}

            <div className="mt-5 rounded-xl border border-[#17344D] bg-[#081725] p-5">

              <div className="mb-4 flex items-center justify-between">

                <div>

                  <p className="text-sm font-bold">
                    ML Prediction Distribution
                  </p>

                  <p className="mt-1 text-xs text-[#607D94]">
                    Predictions generated by the Python ML service
                  </p>

                </div>

                <p className="text-sm font-bold text-[#42B9FF]">
                  {totalMLPredictions} predictions
                </p>

              </div>

              <div className="space-y-4">

                <MLDistributionBar
                  label="Phishing"
                  value={analytics.mlPredictions.phishing}
                  total={totalMLPredictions}
                  color="bg-[#FF4D5E]"
                />

                <MLDistributionBar
                  label="Legitimate"
                  value={analytics.mlPredictions.legitimate}
                  total={totalMLPredictions}
                  color="bg-[#32D583]"
                />

                <MLDistributionBar
                  label="Spam"
                  value={analytics.mlPredictions.spam}
                  total={totalMLPredictions}
                  color="bg-[#FF9F43]"
                />

                <MLDistributionBar
                  label="Ham"
                  value={analytics.mlPredictions.ham}
                  total={totalMLPredictions}
                  color="bg-[#42B9FF]"
                />

              </div>

            </div>

          </div>

        </div>

        {/* ==========================================
            ML MODEL EVALUATION
        ========================================== */}

        <div className="mt-5 rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90">

          <PanelHeader
            title="ML Model Evaluation"
            icon={<Bot size={17} />}
          />

          <div className="p-5">

            <div className="grid gap-5 md:grid-cols-2">

              <ModelEvaluationCard
                title="URL Phishing Model"
                algorithm="Random Forest Classifier"
                accuracy="99.57%"
                dataset="UCI PhiUSIIL URL Dataset"
                features="18 lexical URL features"
                description="Classifies URLs as phishing or legitimate using URL structure and lexical characteristics."
                type="blue"
              />

              <ModelEvaluationCard
                title="Message Spam Model"
                algorithm="Logistic Regression"
                accuracy="97.40%"
                dataset="UCI SMS Spam Collection"
                features="TF-IDF text features"
                description="Classifies messages as spam or ham using TF-IDF based text representation."
                type="orange"
              />

            </div>

            <div className="mt-5 rounded-xl border border-[#17344D] bg-[#081725] p-5">

              <div className="flex items-start gap-3">

                <div className="rounded-lg bg-[#0D2B40] p-2.5 text-[#42B9FF]">
                  <Shield size={20} />
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Hybrid Detection Architecture
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#607D94]">
                    ML models provide prediction and confidence, while the
                    rule-based layer adds explainable threat indicators.
                    The backend combines both signals into the final risk assessment.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ==========================================
            DATABASE METRICS
        ========================================== */}

        <div className="mt-5 grid gap-5 md:grid-cols-3">

          <MetricCard
            icon={<Target size={21} />}
            title="Total Scans"
            value={analytics.totalScans}
            description="Scans stored in MongoDB"
            type="blue"
          />

          <MetricCard
            icon={<ShieldAlert size={21} />}
            title="Suspicious"
            value={analytics.suspiciousScans}
            description="Medium-risk scans"
            type="orange"
          />

          <MetricCard
            icon={<Activity size={21} />}
            title="Average Risk"
            value={`${analytics.averageRisk}%`}
            description="Average score across all scans"
            type="green"
          />

        </div>

        {/* ==========================================
            FOOTER
        ========================================== */}

        <footer className="mt-8 border-t border-[#172D44] pt-6 text-center text-xs leading-5 text-[#526B82]">

          AI-powered phishing & scam analytics · Live MongoDB data

        </footer>

      </div>

    </div>
  );
}

// =========================================================
// ANALYTICS CARD
// =========================================================

function AnalyticsCard({
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
    <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90 p-5">

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
      </p>

    </div>
  );
}

// =========================================================
// PANEL HEADER
// =========================================================

function PanelHeader({ title, icon }) {
  return (
    <div className="flex items-center gap-2 border-b border-[#17344D] px-5 py-4">

      <span className="text-[#42B9FF]">
        {icon}
      </span>

      <h3 className="text-sm font-bold">
        {title}
      </h3>

    </div>
  );
}

// =========================================================
// OVERVIEW BOX
// =========================================================

function OverviewBox({
  title,
  value,
  icon,
}) {
  return (
    <div className="rounded-xl border border-[#17344D] bg-[#081725] p-4">

      <div className="flex items-center justify-between">

        <p className="text-xs text-[#607D94]">
          {title}
        </p>

        <span className="text-[#42B9FF]">
          {icon}
        </span>

      </div>

      <p className="mt-3 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}

// =========================================================
// DISTRIBUTION ITEM
// =========================================================

function DistributionItem({
  label,
  value,
  color,
}) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-2">

        <span
          className={`h-2.5 w-2.5 rounded-full ${color}`}
        />

        <span className="text-xs text-[#A7BAC9]">
          {label}
        </span>

      </div>

      <span className="text-sm font-bold">
        {value}
      </span>

    </div>
  );
}

// =========================================================
// CATEGORY BAR
// =========================================================

function CategoryBar({
  title,
  count,
  percentage,
  width,
  color,
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <div>

          <span className="text-sm font-semibold">
            {title}
          </span>

          <span className="ml-2 text-xs text-[#526B82]">
            {count} detections
          </span>

        </div>

        <span className="text-xs font-bold">
          {percentage}
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#142C42]">

        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width,
          }}
        />

      </div>

    </div>
  );
}

// =========================================================
// SCANNER PERFORMANCE
// =========================================================

function ScannerPerformance({
  title,
  scans,
  percentage,
  color,
}) {
  return (
    <div className="mb-6 last:mb-0">

      <div className="mb-3 flex items-center justify-between">

        <div>

          <p className="text-sm font-bold">
            {title}
          </p>

          <p className="mt-1 text-xs text-[#607D94]">
            {scans} total scans
          </p>

        </div>

        <p className="text-lg font-bold">
          {percentage}%
        </p>

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

// =========================================================
// ML STAT CARD
// =========================================================

function MLStatCard({
  title,
  value,
  description,
  icon,
  type,
}) {
  const styles = {
    red: {
      icon: "bg-[#3A1720] text-[#FF4D5E]",
      value: "text-[#FF4D5E]",
    },

    green: {
      icon: "bg-[#0B3028] text-[#32D583]",
      value: "text-[#32D583]",
    },

    orange: {
      icon: "bg-[#392514] text-[#FF9F43]",
      value: "text-[#FF9F43]",
    },

    blue: {
      icon: "bg-[#0D2B40] text-[#42B9FF]",
      value: "text-[#42B9FF]",
    },
  };

  return (
    <div className="rounded-xl border border-[#17344D] bg-[#081725] p-4">

      <div className="flex items-center justify-between">

        <div
          className={`rounded-lg p-2.5 ${styles[type].icon}`}
        >
          {icon}
        </div>

        <p
          className={`text-2xl font-bold ${styles[type].value}`}
        >
          {value}
        </p>

      </div>

      <p className="mt-4 text-sm font-bold">
        {title}
      </p>

      <p className="mt-1 text-xs text-[#607D94]">
        {description}
      </p>

    </div>
  );
}

// =========================================================
// ML DISTRIBUTION BAR
// =========================================================

function MLDistributionBar({
  label,
  value,
  total,
  color,
}) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-xs text-[#A7BAC9]">
          {label}
        </span>

        <span className="text-xs font-bold">
          {value} ({percentage}%)
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

// =========================================================
// METRIC CARD
// =========================================================

function MetricCard({
  icon,
  title,
  value,
  description,
  type,
}) {
  const styles = {
    blue: "text-[#42B9FF] bg-[#0D2B40]",
    orange: "text-[#FF9F43] bg-[#392514]",
    green: "text-[#32D583] bg-[#0B3028]",
  };

  return (
    <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90 p-5">

      <div className="flex items-center gap-3">

        <div
          className={`rounded-lg p-3 ${styles[type]}`}
        >
          {icon}
        </div>

        <div>

          <p className="text-xs text-[#607D94]">
            {title}
          </p>

          <p className="text-2xl font-bold">
            {value}
          </p>

        </div>

      </div>

      <p className="mt-4 text-xs text-[#607D94]">
        {description}
      </p>

    </div>
  );
}

export default Analytics;