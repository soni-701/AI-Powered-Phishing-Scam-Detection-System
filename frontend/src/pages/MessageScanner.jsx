import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Link,
  Loader2,
  MessageSquare,
  Search,
  Shield,
  ShieldAlert,
} from "lucide-react";

function MessageScanner() {
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
  "http://localhost:5000/api/scan/message",
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
      reasons: data.result.reasons,
    });

  } catch (error) {
    console.error("Message Scanner Error:", error);

    setError(
      "Unable to connect to the backend. Make sure the backend is running on port 5000."
    );
  } finally {
    setScanning(false);
  }
};

  const handleClear = () => {
    setMessage("");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-5 sm:py-8 lg:px-8">

        {/* HEADER */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start gap-3 sm:items-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#174D6E] bg-[#0D2B40]">
              <MessageSquare
                size={24}
                className="text-[#42B9FF]"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Message Scanner
              </h1>

              <p className="mt-1 text-xs leading-5 text-[#607D94] sm:text-sm">
                Detect phishing, scam and fraudulent messages
              </p>
            </div>

          </div>
        </div>

        {/* SCANNER */}
        <div className="rounded-2xl border border-[#1A344C] bg-[#0B1B2B]/90 p-4 shadow-xl sm:p-6">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#102A43]">
              <FileText
                size={20}
                className="text-[#42B9FF]"
              />
            </div>

            <div>
              <h2 className="font-bold">
                Analyze a Message
              </h2>

              <p className="text-xs text-[#607D94]">
                Paste an SMS, email or suspicious message below
              </p>
            </div>

          </div>

          {/* TEXTAREA */}
          <label className="mb-2 block text-sm font-semibold text-[#C4D0DB]">
            Message Content
          </label>

          <div className="relative">

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste suspicious SMS, email or message here..."
              rows={9}
              className="w-full resize-none rounded-xl border border-[#25445D] bg-[#081725] p-4 text-sm leading-6 text-white outline-none transition focus:border-[#42B9FF] sm:p-5"
            />

            <div className="absolute bottom-3 right-3 text-[10px] text-[#526B82] sm:right-4 sm:text-xs">
              {message.length} characters
            </div>

          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#5A2028] bg-[#2A1218] p-3 text-sm text-[#FF6B78]">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

          {/* BUTTONS */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">

            <button
              onClick={handleScan}
              disabled={scanning}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF9F43] px-5 py-4 font-bold text-[#17100A] transition hover:bg-[#FFB66B] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-7"
            >
              {scanning ? (
                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search size={19} />
                  Scan Message
                </>
              )}
            </button>

            <button
              onClick={handleClear}
              className="w-full rounded-xl border border-[#25445D] px-5 py-4 font-semibold text-[#A7BAC9] transition hover:bg-[#102A43] hover:text-white sm:w-auto sm:px-7"
            >
              Clear
            </button>

          </div>

          {/* FEATURES */}
          <div className="mt-6 grid gap-3 md:grid-cols-3">

            <Feature
              icon={<Shield size={18} />}
              title="Scam Detection"
              text="Identifies common scam patterns"
            />

            <Feature
              icon={<Link size={18} />}
              title="Link Detection"
              text="Finds suspicious links"
            />

            <Feature
              icon={<ShieldAlert size={18} />}
              title="Risk Analysis"
              text="Calculates threat severity"
            />

          </div>

        </div>

        {/* RESULT */}
        {result && (
          <div className="mt-6 rounded-2xl border border-[#1A344C] bg-[#0B1B2B]/90 p-6 shadow-xl">

            {/* RESULT TITLE */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="flex items-start gap-3 sm:items-center">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    result.dangerous
                      ? "bg-[#3A1720]"
                      : result.score >= 30
                      ? "bg-[#392514]"
                      : "bg-[#0B3028]"
                  }`}
                >
                  {result.dangerous ? (
                    <ShieldAlert
                      size={25}
                      className="text-[#FF4D5E]"
                    />
                  ) : result.score >= 30 ? (
                    <AlertTriangle
                      size={25}
                      className="text-[#FF9F43]"
                    />
                  ) : (
                    <CheckCircle
                      size={25}
                      className="text-[#32D583]"
                    />
                  )}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-[#607D94]">
                    Scan Result
                  </p>

                  <h2 className="text-lg font-bold sm:text-xl">
                    {result.dangerous
                      ? "Potential Scam Detected"
                      : result.score >= 30
                      ? "Suspicious Message"
                      : "Message Appears Safe"}
                  </h2>
                </div>

              </div>

              <button
                onClick={handleClear}
                className="rounded-lg border border-[#25445D] px-4 py-2 text-sm text-[#8BA0B2] transition hover:bg-[#102A43] hover:text-white"
              >
                New Scan
              </button>

            </div>

            {/* RESULT GRID */}
            <div className="grid gap-6 lg:grid-cols-2">

              {/* SCORE */}
              <div className="rounded-xl border border-[#17344D] bg-[#081725] p-6">

                <p className="mb-5 text-sm font-semibold text-[#8BA0B2]">
                  Risk Score
                </p>

                <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">

                  <div
                    className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[10px] sm:h-36 sm:w-36 sm:border-[12px] ${
                      result.dangerous
                        ? "border-[#FF4D5E]/30"
                        : result.score >= 30
                        ? "border-[#FF9F43]/30"
                        : "border-[#32D583]/30"
                    }`}
                  >

                    <div className="text-center">

                      <p className="text-3xl font-extrabold sm:text-4xl">
                        {result.score}
                      </p>

                      <p className="text-[10px] uppercase tracking-widest text-[#607D94]">
                        / 100
                      </p>

                    </div>

                  </div>

                  <div>

                    <p
                      className={`text-xl font-bold ${
                        result.dangerous
                          ? "text-[#FF4D5E]"
                          : result.score >= 30
                          ? "text-[#FF9F43]"
                          : "text-[#32D583]"
                      }`}
                    >
                      {result.level}
                    </p>

                    <p className="mt-2 text-xs text-[#607D94]">
                      Confidence:{" "}
                      <span className="font-bold text-white">
                        {result.confidence}%
                      </span>
                    </p>

                  </div>

                </div>

              </div>

              {/* CATEGORY */}
              <div className="rounded-xl border border-[#17344D] bg-[#081725] p-6">

                <p className="mb-5 text-sm font-semibold text-[#8BA0B2]">
                  Scam Category
                </p>

                <div className="rounded-xl border border-[#25445D] bg-[#0B1B2B] p-5">

                  <p className="break-words text-xl font-bold text-[#42B9FF] sm:text-2xl">
                    {result.category}
                  </p>

                  <p className="mt-2 text-xs text-[#607D94]">
                    Category based on detected message patterns.
                  </p>

                </div>

              </div>

            </div>

            {/* FINDINGS */}
            <div className="mt-6 rounded-xl border border-[#17344D] bg-[#081725] p-6">

              <p className="mb-4 text-sm font-semibold text-[#8BA0B2]">
                Detection Findings
              </p>

              <div className="space-y-3">

                {result.reasons.map((reason, index) => (
                  <div
                    key={index}
                    className="flex gap-3 rounded-lg border border-[#17344D] bg-[#0B1B2B] p-3"
                  >

                    <span
                      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                        result.dangerous
                          ? "bg-[#FF4D5E]"
                          : result.score >= 30
                          ? "bg-[#FF9F43]"
                          : "bg-[#32D583]"
                      }`}
                    />

                    <p className="text-xs leading-5 text-[#B5C7D6]">
                      {reason}
                    </p>

                  </div>
                ))}

              </div>

            </div>

            {/* ANALYZED MESSAGE */}
            <div className="mt-6 rounded-xl border border-[#17344D] bg-[#081725] p-5">

              <p className="mb-3 text-xs uppercase tracking-wider text-[#526B82]">
                Analyzed Message
              </p>

              <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#C4D0DB]">
                {message}
              </p>

            </div>

            {/* BACKEND NOTICE */}
            <div className="mt-5 rounded-lg border border-[#174D6E] bg-[#0D2B40] p-4">
              <div className="flex items-start gap-3">
                <Shield
                  size={18}
                  className="mt-0.5 shrink-0 text-[#42B9FF]"
                />

                <p className="text-xs leading-5 text-[#8BA0B2]">
                  Analysis completed by the backend threat detection engine.
                  Results are based on detected scam and phishing indicators.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* HOW IT WORKS */}
        {!result && (
          <div className="mt-8">

            <h2 className="mb-4 text-xl font-bold">
              How Message Detection Works
            </h2>

            <div className="grid gap-4 md:grid-cols-3">

              <StepCard
                number="01"
                title="Paste Message"
                text="Copy a suspicious SMS, email or message and paste it into the scanner."
              />

              <StepCard
                number="02"
                title="Analyze Content"
                text="The system checks for suspicious words, links, urgency and financial requests."
              />

              <StepCard
                number="03"
                title="Get Risk Report"
                text="Receive a risk score, threat level, category and detection reasons."
              />

            </div>

          </div>
        )}

      </div>
    </div>
  );
}


/* =========================================================
   FEATURE
========================================================= */

function Feature({ icon, title, text }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#17344D] bg-[#081725]/90 p-4">

      <div className="text-[#42B9FF]">
        {icon}
      </div>

      <div>
        <p className="text-xs font-bold">
          {title}
        </p>

        <p className="mt-1 text-[10px] text-[#607D94]">
          {text}
        </p>
      </div>

    </div>
  );
}


/* =========================================================
   STEP CARD
========================================================= */

function StepCard({ number, title, text }) {
  return (
    <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90 p-5">

      <span className="text-xs font-bold text-[#42B9FF]">
        {number}
      </span>

      <h3 className="mt-3 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-[#607D94]">
        {text}
      </p>

    </div>
  );
}

export default MessageScanner;