import API_URL from "../api";
import { useState } from "react";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Link as LinkIcon,
  Loader2,
  MessageSquare,
  Search,
  Shield,
  ShieldAlert,
  Activity,
  XCircle,
} from "lucide-react";

function MessageScanner({ onNavigate }) {
  const [message, setMessage] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleScan = async () => {
    setError("");
    setResult(null);

    if (!message.trim()) {
      setError("Please enter a message to scan.");
      return;
    }

    if (message.trim().length < 10) {
      setError("Please enter a longer message for better analysis.");
      return;
    }

    setScanning(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/scan/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to scan message."
        );
      }

      setResult({
        score: data.result.score,
        level: data.result.level,
        dangerous: data.result.score >= 60,
        category: data.result.category,
        confidence: data.result.confidence,
        prediction: data.result.prediction,
        reasons: data.result.reasons || [],
        detectedIndicators:
          data.result.detectedIndicators || [],
      });
    } catch (err) {
      console.error("Message Scanner Error:", err);

      const errorMessage = err.message || "";
      const lowerErrorMessage =
        errorMessage.toLowerCase();

      if (
        lowerErrorMessage.includes("too many") ||
        lowerErrorMessage.includes("rate limit")
      ) {
        setError(
          "Too many scan requests. Please wait a few minutes and try again."
        );
      } else if (
        lowerErrorMessage.includes("ml service") ||
        lowerErrorMessage.includes("sms ml")
      ) {
        setError(
          "SMS ML service is unavailable. Please start the AI detection service and try again."
        );
      } else if (
        lowerErrorMessage.includes("authentication") ||
        lowerErrorMessage.includes("token") ||
        lowerErrorMessage.includes("unauthorized")
      ) {
        setError(
          "Your session has expired. Please log in again."
        );
      } else {
        setError(
          errorMessage ||
            "Unable to connect to the backend. Make sure the backend is running on port 5000."
        );
      }
    } finally {
      setScanning(false);
    }
  };

  const handleClear = () => {
    setMessage("");
    setResult(null);
    setError("");
  };

  const resultTone =
    result?.dangerous
      ? "danger"
      : result?.score >= 30
      ? "warning"
      : "success";

  const toneClasses = {
    success: {
      soft: "bg-[#E8F1EC]",
      text: "text-[#2F7D5A]",
      border: "border-[#C8DCCF]",
    },
    warning: {
      soft: "bg-[#F3ECDD]",
      text: "text-[#8A713B]",
      border: "border-[#E5D8B9]",
    },
    danger: {
      soft: "bg-[#F3E2DF]",
      text: "text-[#8C5B55]",
      border: "border-[#E1C8C4]",
    },
  };

  const tone = toneClasses[resultTone];

  return (
    <div className="min-h-screen bg-[#EDECE7] text-[#2F302F]">

      {/* =====================================================
          BACK TO DASHBOARD
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
          PAGE HEADER
      ===================================================== */}

      <section className="border-b border-[#D6D3CC] bg-[#EDECE7]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C9C6BE] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#666761]">
                <MessageSquare
                  size={13}
                  className="text-[#2F7D5A]"
                />
                MESSAGE SECURITY CHECK
              </div>

              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#343532] sm:text-5xl">
                Analyze a message
                <span className="block text-[#2F7D5A]">
                  before you trust it.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#70716B] sm:text-base">
                Inspect suspicious SMS, email and message text for
                scam language, risky links and machine-learning
                signals.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#C8DCCF] bg-[#F1F7F3] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-[#2F7D5A]">
              <span className="h-2 w-2 rounded-full bg-[#2F7D5A]" />
              AI Detection Online
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          SCANNER CARD
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        <section className="rounded-[24px] border border-[#D4D1C9] bg-white p-5 shadow-sm sm:p-7">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ECEAE5] text-[#555650]">
              <FileText size={19} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#373834]">
                Message security scan
              </h2>

              <p className="mt-1 text-xs text-[#83847D]">
                Paste an SMS, email or suspicious message below.
              </p>
            </div>

          </div>

          <div className="mt-6">

            <div className="mb-2 flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#777872]">
                Message Content
              </label>

              <span className="text-[10px] text-[#9A9A92]">
                {message.length} characters
              </span>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste suspicious SMS, email or message here..."
              rows={9}
              className="w-full resize-none rounded-xl border border-[#D5D2CA] bg-white p-4 text-sm leading-6 !text-[#343532] caret-[#2F7D5A] outline-none transition placeholder:text-[#9A9A92] focus:border-[#8E8C85] focus:bg-white sm:p-5"
              style={{
                color: "#343532",
                WebkitTextFillColor: "#343532",
              }}
            />

            {error && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#E1C8C4] bg-[#FBF4F2] p-4 text-xs text-[#8C5B55]">
                <AlertTriangle
                  size={17}
                  className="mt-0.5 shrink-0"
                />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">

              <button
                onClick={handleScan}
                disabled={scanning}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#434341] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#333331] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {scanning ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search size={17} />
                    Analyze Message
                  </>
                )}
              </button>

              <button
                onClick={handleClear}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#CFCBC3] bg-[#F8F7F3] px-6 py-4 text-sm font-semibold text-[#666761] transition hover:bg-white sm:w-auto"
              >
                <XCircle size={17} />
                Clear
              </button>

            </div>

          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">

            <ScanFeature
              icon={<Shield size={17} />}
              title="Scam Detection"
              text="Identifies common scam language and patterns."
            />

            <ScanFeature
              icon={<LinkIcon size={17} />}
              title="Link Detection"
              text="Looks for suspicious links and risky wording."
            />

            <ScanFeature
              icon={<Activity size={17} />}
              title="AI Risk Analysis"
              text="Uses ML signals together with security rules."
            />

          </div>

        </section>

        {/* ===================================================
            RESULT
        =================================================== */}

        {result && (
          <div className="mt-6 space-y-5">

            <section className="overflow-hidden rounded-[24px] border border-[#D4D1C9] bg-white shadow-sm">

              <div
                className={`border-b ${tone.border} ${tone.soft} px-5 py-5 sm:px-7`}
              >

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-start gap-3">

                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white ${tone.text}`}>
                      {result.dangerous ? (
                        <ShieldAlert size={22} />
                      ) : result.score >= 30 ? (
                        <AlertTriangle size={22} />
                      ) : (
                        <CheckCircle2 size={22} />
                      )}
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777872]">
                        Final Security Decision
                      </p>

                      <h2
                        className={`mt-1 text-xl font-semibold ${tone.text}`}
                      >
                        {result.dangerous
                          ? "Potential scam detected"
                          : result.score >= 30
                          ? "Suspicious message"
                          : "Message appears safe"}
                      </h2>

                      <p className="mt-1 text-xs text-[#777872]">
                        {result.category}
                      </p>
                    </div>

                  </div>

                  <button
                    onClick={handleClear}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#CFCBC3] bg-white px-4 py-2.5 text-xs font-semibold text-[#656660] transition hover:bg-[#F5F3EE]"
                  >
                    <XCircle size={15} />
                    New Scan
                  </button>

                </div>

              </div>

              <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-2">

                {/* SCORE */}

                <div className="rounded-2xl border border-[#E0DDD5] bg-[#F8F7F3] p-5 sm:p-6">

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#85867F]">
                        Overall Risk
                      </p>

                      <h3 className="mt-1 text-lg font-semibold text-[#3B3C38]">
                        Security score
                      </h3>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase ${tone.soft} ${tone.text}`}
                    >
                      {result.level}
                    </span>
                  </div>

                  <div className="mt-7 flex flex-col items-center gap-6 sm:flex-row">

                    <div
                      className={`relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full border-[12px] ${tone.border}`}
                    >
                      <div
                        className={`absolute inset-[-12px] rounded-full border-[12px] border-transparent ${
                          result.dangerous
                            ? "border-t-[#8C5B55] border-r-[#B88A82]"
                            : result.score >= 30
                            ? "border-t-[#A28D59] border-r-[#C6B488]"
                            : "border-t-[#5C9878] border-r-[#9CC2AA]"
                        } rotate-[35deg]`}
                      />

                      <div className="text-center">
                        <p className="text-4xl font-semibold text-[#363733]">
                          {result.score}
                        </p>

                        <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#90918A]">
                          / 100
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className={`text-xl font-semibold ${tone.text}`}>
                        {result.level}
                      </p>

                      <p className="mt-2 text-sm text-[#777872]">
                        {result.category}
                      </p>

                      <p className="mt-3 text-xs text-[#90918A]">
                        Confidence:{" "}
                        <span className="font-semibold text-[#555650]">
                          {result.confidence}%
                        </span>
                      </p>
                    </div>

                  </div>

                </div>

                {/* AI ANALYSIS */}

                <div className="rounded-2xl border border-[#434341] bg-[#434341] p-5 text-white sm:p-6">

                  <div className="flex items-start justify-between">

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#C9C6BE]">
                        Machine Learning
                      </p>

                      <h3 className="mt-1 text-lg font-semibold">
                        Message model analysis
                      </h3>

                      <p className="mt-1 text-xs text-[#C1BEB6]">
                        Logistic Regression + rule-based analysis
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#555551]">
                      <Activity
                        size={18}
                        className="text-[#DAD9D4]"
                      />
                    </div>

                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">

                    <DarkMetric
                      label="Model Prediction"
                      value={
                        result.prediction === "spam"
                          ? "SPAM"
                          : result.prediction === "phishing"
                          ? "PHISHING"
                          : "LEGITIMATE"
                      }
                      danger={
                        result.prediction === "spam" ||
                        result.prediction === "phishing"
                      }
                    />

                    <DarkMetric
                      label="Model Confidence"
                      value={`${result.confidence}%`}
                    />

                  </div>

                  <div className="mt-3 rounded-xl border border-[#686862] bg-[#4D4D49] p-4">
                    <div className="flex items-center gap-2 text-[#D6D3CB]">
                      <Shield size={15} />
                      <span className="text-[10px] font-semibold uppercase tracking-wide">
                        Final security decision
                      </span>
                    </div>

                    <p
                      className={`mt-2 text-lg font-semibold ${
                        result.dangerous
                          ? "text-[#D4A6A0]"
                          : result.score >= 30
                          ? "text-[#D2BD86]"
                          : "text-[#A9CCB7]"
                      }`}
                    >
                      {result.level}
                    </p>
                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                DETECTED INDICATORS
            ================================================= */}

            {result.detectedIndicators.length > 0 && (
              <section className="rounded-[24px] border border-[#D4D1C9] bg-white shadow-sm">

                <div className="border-b border-[#E0DDD5] px-5 py-5 sm:px-7">

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECEAE5] text-[#555650]">
                      <ShieldAlert size={17} />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-[#393A36]">
                        Detected Indicators
                      </h3>

                      <p className="mt-1 text-[10px] text-[#898A84]">
                        Explainable signals identified during message analysis
                      </p>
                    </div>
                  </div>

                </div>

                <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7">

                  {result.detectedIndicators.map(
                    (indicator, index) => (
                      <div
                        key={`${indicator.type || "indicator"}-${index}`}
                        className="rounded-xl border border-[#E0DDD5] bg-[#F8F7F3] p-4"
                      >
                        <div className="flex items-start gap-3">

                          <div
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                              result.dangerous
                                ? "bg-[#F3E2DF] text-[#8C5B55]"
                                : result.score >= 30
                                ? "bg-[#F3ECDD] text-[#8A713B]"
                                : "bg-[#E8F1EC] text-[#2F7D5A]"
                            }`}
                          >
                            <CheckCircle2 size={15} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#41423E]">
                              {indicator.label}
                            </p>

                            <p className="mt-1 break-words text-[11px] leading-5 text-[#85867F]">
                              {indicator.details}
                            </p>
                          </div>

                        </div>
                      </div>
                    )
                  )}

                </div>

              </section>
            )}

            {/* =================================================
                FINDINGS
            ================================================= */}

            <section className="rounded-[24px] border border-[#D4D1C9] bg-white shadow-sm">

              <div className="border-b border-[#E0DDD5] px-5 py-5 sm:px-7">

                <p className="text-sm font-semibold text-[#3B3C38]">
                  Detection Findings
                </p>

                <p className="mt-1 text-[10px] text-[#898A84]">
                  Signals used to support the final security decision
                </p>

              </div>

              <div className="space-y-2.5 p-5 sm:p-7">

                {result.reasons.map((reason, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-[#E0DDD5] bg-[#FAF9F6] p-3.5"
                  >
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        result.dangerous
                          ? "bg-[#8C5B55]"
                          : result.score >= 30
                          ? "bg-[#A28D59]"
                          : "bg-[#2F7D5A]"
                      }`}
                    />

                    <p className="text-xs leading-5 text-[#666761]">
                      {reason}
                    </p>
                  </div>
                ))}

              </div>

            </section>

            {/* =================================================
                ANALYZED MESSAGE
            ================================================= */}

            <section className="rounded-[24px] border border-[#D4D1C9] bg-white p-5 shadow-sm sm:p-7">

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#85867F]">
                    Original Content
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-[#393A36]">
                    Analyzed message
                  </h3>
                </div>

                <MessageSquare
                  size={19}
                  className="text-[#777872]"
                />
              </div>

              <div className="mt-5 rounded-xl border border-[#E0DDD5] bg-[#F8F7F3] p-4 sm:p-5">
                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#555650]">
                  {message}
                </p>
              </div>

            </section>

          </div>
        )}

        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        {!result && (
          <section className="mt-10">

            <div className="mb-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#85867F]">
                How it works
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#393A36]">
                Three-step message protection
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">

              <StepCard
                number="01"
                title="Paste message"
                text="Copy the suspicious SMS, email or message into the scanner."
              />

              <StepCard
                number="02"
                title="Analyze content"
                text="The system checks wording, links, urgency and other scam indicators."
              />

              <StepCard
                number="03"
                title="Review result"
                text="Get a risk score, category, ML confidence and explainable findings."
              />

            </div>

          </section>
        )}

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
                AI-powered scam message protection with
                explainable analysis for suspicious content.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold">
                Scanner
              </p>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => onNavigate?.("url-scanner")}
                  className="block text-xs text-[#CAC7BF] hover:text-white"
                >
                  URL Scanner
                </button>

                <button
                  onClick={() => onNavigate?.("message-scanner")}
                  className="block text-xs text-[#CAC7BF] hover:text-white"
                >
                  Message Scanner
                </button>

                <button
                  onClick={() => onNavigate?.("threat-reports")}
                  className="block text-xs text-[#CAC7BF] hover:text-white"
                >
                  Threat Reports
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold">
                Platform
              </p>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => onNavigate?.("analytics")}
                  className="block text-xs text-[#CAC7BF] hover:text-white"
                >
                  Analytics
                </button>

                <button
                  onClick={() => onNavigate?.("settings")}
                  className="block text-xs text-[#CAC7BF] hover:text-white"
                >
                  Settings
                </button>

                <button
                  onClick={() => onNavigate?.("home")}
                  className="block text-xs text-[#CAC7BF] hover:text-white"
                >
                  Dashboard
                </button>
              </div>
            </div>

          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-[#666660] pt-5 text-[10px] text-[#C1BEB6] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 ScamGuard AI. All rights reserved.</p>
            <p>AI-powered phishing & scam detection system</p>
          </div>

        </div>

      </footer>

    </div>
  );
}

function ScanFeature({ icon, title, text }) {
  return (
    <div className="rounded-xl border border-[#E0DDD5] bg-[#F8F7F3] p-4">
      <div className="flex items-center gap-2.5">
        <div className="text-[#555650]">{icon}</div>
        <p className="text-xs font-semibold text-[#434440]">
          {title}
        </p>
      </div>

      <p className="mt-2 text-[10px] leading-5 text-[#898A84]">
        {text}
      </p>
    </div>
  );
}

function DarkMetric({
  icon,
  label,
  value,
  danger = false,
}) {
  return (
    <div className="rounded-xl border border-[#65655F] bg-[#4D4D49] p-4">
      <div className="flex items-center gap-2 text-[#C9C6BE]">
        {icon}
        <span className="text-[9px] uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p
        className={`mt-3 text-lg font-semibold ${
          danger ? "text-[#D4A6A0]" : "text-[#E5E2DB]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function StepCard({ number, title, text }) {
  return (
    <div className="rounded-2xl border border-[#D8D5CD] bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-[0.18em] text-[#2F7D5A]">
          {number}
        </span>

        <ArrowRight
          size={15}
          className="text-[#AAA9A2]"
        />
      </div>

      <h3 className="mt-5 text-sm font-semibold text-[#3D3E3A]">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-[#85867F]">
        {text}
      </p>
    </div>
  );
}

export default MessageScanner;
