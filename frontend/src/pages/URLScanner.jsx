import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Globe,
  Link as LinkIcon,
  Loader2,
  Shield,
  ShieldAlert,
  Search,
  Lock,
} from "lucide-react";

function URLScanner() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

 const handleScan = async () => {
  setError("");
  setResult(null);

  if (!url.trim()) {
    setError("Please enter a URL to scan.");
    return;
  }

  let validUrl;

  try {
    validUrl = new URL(url);
  } catch {
    setError(
      "Please enter a valid URL, for example: https://example.com"
    );
    return;
  }

  if (!["http:", "https:"].includes(validUrl.protocol)) {
    setError("Only HTTP and HTTPS URLs are supported.");
    return;
  }

  setScanning(true);

  try {
    const token = localStorage.getItem("token");

const response = await fetch(
  "http://localhost:5000/api/scan/url",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      url: url.trim(),
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
      score: data.result.score,
      dangerous: data.result.score >= 60,
      level: data.result.level,
      category: data.result.category,
      confidence: data.result.confidence,
      reasons: data.result.reasons,
    });

  } catch (error) {
    console.error("URL Scanner Error:", error);

    setError(
      "Unable to connect to the backend. Make sure the backend is running on port 5000."
    );
  } finally {
    setScanning(false);
  }
};

  const handleClear = () => {
    setUrl("");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-transparent text-white">

      {/* PAGE */}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-5 sm:py-8 lg:px-8">

        {/* HEADER */}

        <div className="mb-8">

          <div className="mb-3 flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#174D6E] bg-[#0D2B40]">

              <LinkIcon
                size={24}
                className="text-[#42B9FF]"
              />

            </div>

            <div>

              <h1 className="text-2xl font-bold sm:text-3xl">
                URL Scanner
              </h1>

              <p className="text-sm text-[#607D94]">
                Analyze suspicious websites and detect phishing threats
              </p>

            </div>

          </div>

        </div>


        {/* SCANNER CARD */}

        <div className="rounded-2xl border border-[#1A344C] bg-[#0B1B2B]/90 p-4 sm:p-6 shadow-xl">

          {/* CARD HEADER */}

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#102A43]">

              <Shield
                size={20}
                className="text-[#42B9FF]"
              />

            </div>

            <div>

              <h2 className="font-bold">
                Scan a Website URL
              </h2>

              <p className="text-xs text-[#607D94]">
                Enter a URL to analyze its security risk
              </p>

            </div>

          </div>


          {/* INPUT */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-[#C4D0DB]">
              Website URL
            </label>

            <div className="flex flex-col gap-3 md:flex-row">

              <div className="relative flex-1">

                <Globe
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#607D94]"
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
                  className="w-full rounded-xl border border-[#25445D] bg-[#081725] py-4 pl-12 pr-4 text-sm text-white outline-none transition focus:border-[#42B9FF]"
                />

              </div>


              <button
                onClick={handleScan}
                disabled={scanning}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#FF9F43] px-7 py-4 font-bold text-[#17100A] transition hover:bg-[#FFB66B] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {scanning ? (
                  <>
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />

                    Scanning...
                  </>
                ) : (
                  <>
                    <Search size={19} />

                    Scan URL
                  </>
                )}

              </button>

            </div>


            {/* ERROR */}

            {error && (

              <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#5A2028] bg-[#2A1218] p-3 text-sm text-[#FF6B78]">

                <AlertTriangle size={18} />

                {error}

              </div>

            )}

          </div>


          {/* SECURITY INFO */}

          <div className="mt-6 grid gap-3 md:grid-cols-3">

            <InfoItem
              icon={<Lock size={18} />}
              title="HTTPS Check"
              text="Checks secure connection"
            />

            <InfoItem
              icon={<ShieldAlert size={18} />}
              title="Threat Analysis"
              text="Looks for suspicious indicators"
            />

            <InfoItem
              icon={<Globe size={18} />}
              title="Domain Analysis"
              text="Analyzes URL structure"
            />

          </div>

        </div>


        {/* RESULT */}

        {result && (

          <div className="mt-6 rounded-2xl border border-[#1A344C] bg-[#0B1B2B]/90 p-6 shadow-xl">

            {/* RESULT HEADER */}

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-3">

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

                  <h2 className="text-xl font-bold">
                    {result.dangerous
                      ? "Potential Phishing Threat"
                      : result.score >= 30
                      ? "Suspicious URL"
                      : "URL Appears Safe"}
                  </h2>

                </div>

              </div>


              <button
                onClick={handleClear}
                className="w-full rounded-lg border border-[#25445D] px-4 py-2 text-sm md:w-auto text-[#8BA0B2] transition hover:bg-[#102A43] hover:text-white"
              >
                New Scan
              </button>

            </div>


            {/* URL */}

            <div className="mb-6 rounded-xl border border-[#17344D] bg-[#081725] p-4">

              <p className="mb-2 text-xs uppercase tracking-wider text-[#526B82]">
                Scanned URL
              </p>

              <p className="break-all text-sm text-[#C4D0DB]">
                {url}
              </p>

            </div>


            {/* SCORE */}

            <div className="grid gap-6 lg:grid-cols-2">

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

                    <p className="mt-2 text-xs leading-5 text-[#607D94]">
                      This score is currently generated by the
                      frontend demo analyzer.
                    </p>

                  </div>

                </div>

              </div>


              {/* REASONS */}

              <div className="rounded-xl border border-[#17344D] bg-[#081725] p-6">

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

            </div>


            {/* DISCLAIMER */}

            <div className="mt-5 rounded-lg border border-[#49351E] bg-[#241B12] p-4">

              <div className="flex gap-3">

                <AlertTriangle
                  size={18}
                  className="mt-0.5 shrink-0 text-[#FF9F43]"
                />

                <p className="text-xs leading-5 text-[#B5A18A]">

                  Demo mode: this scanner currently uses basic
                  URL heuristics. We will connect the real backend
                  and AI/ML detection engine in the next step.

                </p>

              </div>

            </div>

          </div>

        )}


        {/* HOW IT WORKS */}

        {!result && (

          <div className="mt-6">

            <h2 className="mb-4 text-xl font-bold">
              How URL Detection Works
            </h2>

            <div className="grid gap-4 md:grid-cols-3">

              <StepCard
                number="01"
                title="Enter URL"
                text="Paste the suspicious website URL into the scanner."
              />

              <StepCard
                number="02"
                title="Analyze"
                text="The system checks URL structure, protocol and suspicious patterns."
              />

              <StepCard
                number="03"
                title="Get Risk Score"
                text="Receive a security score and explanation of detected indicators."
              />

            </div>

          </div>

        )}

      </div>

    </div>
  );
}


/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({ icon, title, text }) {

  return (

    <div className="flex items-start gap-3 rounded-xl border border-[#17344D] bg-[#081725]/90 p-4">

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

function StepCard({
  number,
  title,
  text,
}) {

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


export default URLScanner;