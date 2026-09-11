import API_URL from "../api";
import { useState } from "react";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Globe,
  Hash,
  Link as LinkIcon,
  Loader2,
  Lock,
  Network,
  Search,
  Shield,
  ShieldAlert,
  Target,
  XCircle,
} from "lucide-react";

function URLScanner({ onNavigate }) {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const featureNames = [
    "URL Length",
    "Hostname Length",
    "Path Length",
    "Dot Count",
    "Hyphen Count",
    "Slash Count",
    "Question Mark Count",
    "Equal Sign Count",
    "At Symbol Count",
    "Percent Count",
    "HTTPS",
    "HTTP",
    "IP Address",
    "Suspicious Word Count",
    "Subdomain Count",
    "Digit Count",
    "Letter Count",
    "Shortened URL",
  ];

  const handleScan = async () => {
    setError("");
    setResult(null);

    if (!url.trim()) {
      setError("Please enter a URL to scan.");
      return;
    }

    let inputUrl = url.trim();

    if (
      !inputUrl.startsWith("http://") &&
      !inputUrl.startsWith("https://")
    ) {
      inputUrl = `https://${inputUrl}`;
    }

    let validUrl;

    try {
      validUrl = new URL(inputUrl);
    } catch {
      setError(
        "Please enter a valid URL or domain, for example: youtube.com"
      );
      return;
    }

    if (!["http:", "https:"].includes(validUrl.protocol)) {
      setError("Only HTTP and HTTPS URLs are supported.");
      return;
    }

    const hostname = validUrl.hostname;

    const isIPv4 =
      /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname);

    const isValidHostname =
      isIPv4 ||
      (hostname.includes(".") &&
        !hostname.startsWith(".") &&
        !hostname.endsWith(".") &&
        !hostname.includes(".."));

    if (!isValidHostname) {
      setError(
        "Please enter a valid domain, for example: youtube.com"
      );
      return;
    }

    setScanning(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/scan/url`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            url: inputUrl,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to scan URL."
        );
      }

      setResult({
        url: data.result.url,
        score: data.result.score,
        dangerous: data.result.score >= 60,
        level: data.result.level,
        category: data.result.category,
        confidence: data.result.confidence,
        prediction: data.result.prediction,
        features: data.result.features || [],
        reasons: data.result.reasons || [],
      });
    } catch (err) {
      console.error("URL Scanner Error:", err);

      const errorMessage = err.message || "";
      const lower = errorMessage.toLowerCase();

      if (
        lower.includes("too many") ||
        lower.includes("rate limit")
      ) {
        setError(
          "Too many scan requests. Please wait a few minutes and try again."
        );
      } else if (
        lower.includes("ml service") ||
        lower.includes("url ml")
      ) {
        setError(
          "URL ML service is unavailable. Please start the AI detection service and try again."
        );
      } else if (
        lower.includes("authentication") ||
        lower.includes("token") ||
        lower.includes("unauthorized")
      ) {
        setError(
          "Your session has expired. Please log in again."
        );
      } else {
        setError(
          errorMessage || "Unable to connect to the backend."
        );
      }
    } finally {
      setScanning(false);
    }
  };

  const handleClear = () => {
    setUrl("");
    setResult(null);
    setError("");
  };

  const formatFeatureValue = (name, value) => {
    if (
      name === "HTTPS" ||
      name === "HTTP" ||
      name === "Shortened URL"
    ) {
      return value === 1 ? "Yes" : "No";
    }

    if (name === "IP Address") {
      return value === 1 ? "Detected" : "Not Detected";
    }

    return value;
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
      icon: "text-[#2F7D5A]",
    },
    warning: {
      soft: "bg-[#F3ECDD]",
      text: "text-[#8A713B]",
      border: "border-[#E5D8B9]",
      icon: "text-[#8A713B]",
    },
    danger: {
      soft: "bg-[#F3E2DF]",
      text: "text-[#8C5B55]",
      border: "border-[#E1C8C4]",
      icon: "text-[#8C5B55]",
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
          SCANNER HEADER
      ===================================================== */}

      <section className="border-b border-[#D6D3CC] bg-[#EDECE7]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C9C6BE] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#666761]">
                <LinkIcon size={13} className="text-[#2F7D5A]" />
                URL SECURITY CHECK
              </div>

              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#343532] sm:text-5xl">
                Scan a website
                <span className="block text-[#434341]">
                  before you trust it.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#70716B] sm:text-base">
                Analyze URL structure, suspicious indicators and
                machine-learning signals to understand the security
                risk of a website.
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
          SCANNER
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        <section className="rounded-[24px] border border-[#D4D1C9] bg-white p-5 shadow-sm sm:p-7">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ECEAE5] text-[#555650]">
              <Shield size={19} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#373834]">
                Website security scan
              </h2>

              <p className="mt-1 text-xs text-[#83847D]">
                Paste a full URL or simply enter a domain such as
                youtube.com
              </p>
            </div>

          </div>

          <div className="mt-6">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#777872]">
              Website URL
            </label>

            <div className="flex flex-col gap-3 lg:flex-row">

              <div className="relative flex-1">
                <Globe
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#96968F]"
                />

                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleScan();
                    }
                  }}
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-[#D5D2CA] bg-white py-4 pl-11 pr-4 text-sm font-medium !text-[#343532] caret-[#2F7D5A] outline-none transition placeholder:text-[#9A9A92] focus:border-[#8E8C85] focus:bg-white selection:bg-[#DCEBE1] selection:text-[#343532]"
                  style={{
                    color: "#343532",
                    WebkitTextFillColor: "#343532",
                  }}
                />
              </div>

              <button
                onClick={handleScan}
                disabled={scanning}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#434341] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#333331] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {scanning ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search size={17} />
                    Scan URL
                  </>
                )}
              </button>

            </div>

            {error && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#E1C8C4] bg-[#FBF4F2] p-4 text-xs text-[#8C5B55]">
                <AlertTriangle
                  size={17}
                  className="mt-0.5 shrink-0"
                />
                <span>{error}</span>
              </div>
            )}

          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">

            <ScanCheck
              icon={<Lock size={17} />}
              title="HTTPS & Connection"
              text="Checks whether the URL uses a secure protocol."
            />

            <ScanCheck
              icon={<ShieldAlert size={17} />}
              title="Threat Indicators"
              text="Looks for suspicious words and URL patterns."
            />

            <ScanCheck
              icon={<Network size={17} />}
              title="AI Feature Analysis"
              text="Extracts lexical features for ML classification."
            />

          </div>

        </section>

        {/* ===================================================
            RESULT
        =================================================== */}

        {result && (
          <div className="mt-6 space-y-5">

            {/* Result summary */}

            <section className="overflow-hidden rounded-[24px] border border-[#D4D1C9] bg-white shadow-sm">

              <div className={`border-b ${tone.border} ${tone.soft} px-5 py-5 sm:px-7`}>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-3">

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

                      <h2 className={`mt-1 text-xl font-semibold ${tone.text}`}>
                        {result.level === "HIGH RISK"
                          ? "Potential phishing threat"
                          : result.level === "SUSPICIOUS"
                          ? "Suspicious URL"
                          : "URL appears safe"}
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

              <div className="p-5 sm:p-7">

                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8A8B84]">
                  Scanned URL
                </p>

                <div className="rounded-xl border border-[#DDD9D1] bg-[#F8F7F3] px-4 py-3">
                  <p className="break-all text-sm font-medium text-[#454641]">
                    {result.url}
                  </p>
                </div>

              </div>

            </section>

            {/* Risk + model */}

            <div className="grid gap-5 lg:grid-cols-2">

              <section className="rounded-[24px] border border-[#D4D1C9] bg-white p-5 shadow-sm sm:p-7">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#85867F]">
                      Overall Risk
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-[#3B3C38]">
                      Security score
                    </h3>
                  </div>

                  <div className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase ${tone.soft} ${tone.text}`}>
                    {result.level}
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row">

                  <div className={`relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full border-[12px] ${tone.border}`}>

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

                    <p className="mt-4 text-xs leading-5 text-[#90918A]">
                      The final score combines the security rules
                      and AI output rather than relying on a model
                      prediction alone.
                    </p>
                  </div>

                </div>

              </section>

              <section className="rounded-[24px] border border-[#D4D1C9] bg-[#434341] p-5 text-white shadow-sm sm:p-7">

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#C9C6BE]">
                      Machine Learning
                    </p>

                    <h3 className="mt-1 text-lg font-semibold">
                      URL model analysis
                    </h3>

                    <p className="mt-1 text-xs text-[#C1BEB6]">
                      Random Forest classification
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
                    icon={<Target size={16} />}
                    label="Model Prediction"
                    value={
                      result.prediction === "phishing"
                        ? "PHISHING"
                        : "LEGITIMATE"
                    }
                    danger={
                      result.prediction === "phishing"
                    }
                  />

                  <DarkMetric
                    icon={<Activity size={16} />}
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

                  <p className={`mt-2 text-lg font-semibold ${
                    result.dangerous
                      ? "text-[#D4A6A0]"
                      : result.score >= 30
                      ? "text-[#D2BD86]"
                      : "text-[#A9CCB7]"
                  }`}>
                    {result.level}
                  </p>

                </div>

              </section>

            </div>

            {/* Features */}

            {result.features.length > 0 && (
              <section className="rounded-[24px] border border-[#D4D1C9] bg-white shadow-sm">

                <div className="border-b border-[#E0DDD5] px-5 py-5 sm:px-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECEAE5] text-[#555650]">
                      <Network size={17} />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-[#393A36]">
                        URL Feature Analysis
                      </h3>

                      <p className="mt-1 text-[10px] text-[#898A84]">
                        Features extracted by the ML pipeline
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-7">

                  {result.features.map((value, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-[#E0DDD5] bg-[#F8F7F3] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">

                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-[#8A8B84]">
                            {featureNames[index] ||
                              `Feature ${index + 1}`}
                          </p>

                          <p className="mt-2 text-sm font-semibold text-[#40413D]">
                            {formatFeatureValue(
                              featureNames[index],
                              value
                            )}
                          </p>
                        </div>

                        <Hash
                          size={15}
                          className="text-[#9A9A92]"
                        />

                      </div>
                    </div>
                  ))}

                </div>

              </section>
            )}

            {/* Findings */}

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

            {/* How it works */}

            <section>

              <div className="mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#85867F]">
                  How it works
                </p>

                <h3 className="mt-1 text-xl font-semibold text-[#393A36]">
                  Three-step URL protection
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-3">

                <StepCard
                  number="01"
                  title="Enter URL"
                  text="Paste a full URL or domain into the scanner."
                />

                <StepCard
                  number="02"
                  title="Analyze signals"
                  text="Rules and the machine-learning model inspect the URL."
                />

                <StepCard
                  number="03"
                  title="Review decision"
                  text="Get the score, model output and reasons behind the result."
                />

              </div>

            </section>

          </div>
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
                AI-powered phishing protection with explainable
                security analysis for suspicious websites.
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

/* =========================================================
   SCAN CHECK
========================================================= */

function ScanCheck({ icon, title, text }) {
  return (
    <div className="rounded-xl border border-[#E0DDD5] bg-[#F8F7F3] p-4">
      <div className="flex items-center gap-2.5">
        <div className="text-[#555650]">
          {icon}
        </div>

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

/* =========================================================
   DARK METRIC
========================================================= */

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
          danger
            ? "text-[#D4A6A0]"
            : "text-[#E5E2DB]"
        }`}
      >
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   STEP CARD
========================================================= */

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

      <h4 className="mt-5 text-sm font-semibold text-[#3D3E3A]">
        {title}
      </h4>

      <p className="mt-2 text-xs leading-5 text-[#85867F]">
        {text}
      </p>

    </div>
  );
}

export default URLScanner;
