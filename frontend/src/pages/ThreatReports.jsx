import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  ChevronDown,
  Eye,
  FileWarning,
  Filter,
  Search,
  ShieldAlert,
  XCircle,
} from "lucide-react";

function ThreatReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const tableScrollRef = useRef(null);

  // ==========================================
  // GET REPORTS FROM BACKEND
  // ==========================================

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");

       const token = localStorage.getItem("token");

const response = await fetch(
  "http://localhost:5000/api/reports",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to fetch reports."
          );
        }

        const formattedReports = data.reports.map(
          (report, index) => {
            let status = "Safe";

            if (report.score >= 60) {
              status = "Detected";
            } else if (report.score >= 30) {
              status = "Suspicious";
            }

            return {
              id:
                report._id ||
                `TR-${String(index + 1).padStart(4, "0")}`,

              type:
                report.type === "MESSAGE"
                  ? "Message"
                  : "URL",

              target: report.target || "Unknown",

              category:
                report.category || "Unknown",

              risk: report.score || 0,

              status,

              date: report.createdAt
                ? new Date(
                    report.createdAt
                  ).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Unknown",

              confidence: report.confidence || 0,

              reasons: report.reasons || [],
            };
          }
        );

        setReports(formattedReports);
      } catch (err) {
        console.error(
          "Reports Error:",
          err
        );

        setError(
          "Unable to connect to the backend. Make sure the backend is running on port 5000."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesFilter =
        filter === "All" ||
        report.status === filter;

      const query = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        report.target
          .toLowerCase()
          .includes(query) ||
        report.category
          .toLowerCase()
          .includes(query) ||
        report.type
          .toLowerCase()
          .includes(query) ||
        report.id
          .toLowerCase()
          .includes(query);

      return (
        matchesFilter &&
        matchesSearch
      );
    });
  }, [reports, search, filter]);

  // ==========================================
  // MOBILE TABLE SWIPE HINT
  // ==========================================

  useEffect(() => {
    const container = tableScrollRef.current;

    if (!container) return;

    const handleScroll = () => {
      if (container.scrollLeft > 10) {
        setShowSwipeHint(false);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [loading, error, filteredReports.length]);

  // ==========================================
  // SUMMARY COUNTS
  // ==========================================

  const detected = reports.filter(
    (report) =>
      report.status === "Detected"
  ).length;

  const suspicious = reports.filter(
    (report) =>
      report.status === "Suspicious"
  ).length;

  const safe = reports.filter(
    (report) =>
      report.status === "Safe"
  ).length;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-transparent text-white">

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">

        {/* HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#174D6E] bg-[#0D2B40]">

              <FileWarning
                size={24}
                className="text-[#42B9FF]"
              />

            </div>

            <div>

              <h1 className="text-3xl font-bold">
                Threat Reports
              </h1>

              <p className="mt-1 text-sm text-[#607D94]">
                Review and investigate detected phishing and scam threats
              </p>

            </div>

          </div>

        </div>


        {/* SUMMARY */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <SummaryCard
            title="Total Reports"
            value={reports.length}
            icon={
              <FileWarning size={20} />
            }
            type="blue"
          />

          <SummaryCard
            title="Threats Detected"
            value={detected}
            icon={
              <ShieldAlert size={20} />
            }
            type="red"
          />

          <SummaryCard
            title="Suspicious"
            value={suspicious}
            icon={
              <AlertTriangle size={20} />
            }
            type="orange"
          />

          <SummaryCard
            title="Safe"
            value={safe}
            icon={
              <CheckCircle size={20} />
            }
            type="green"
          />

        </div>


        {/* REPORT TABLE */}

        <div className="mt-6 rounded-2xl border border-[#1A344C] bg-[#0B1B2B]/90">

          {/* TOOLBAR */}

          <div className="flex flex-col gap-4 border-b border-[#17344D] p-5 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH */}

            <div className="relative w-full lg:max-w-md">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#607D94]"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search reports..."
                className="w-full rounded-xl border border-[#25445D] bg-[#081725] py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-[#42B9FF]"
              />

            </div>


            {/* FILTER */}

            <div className="relative">

              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#607D94]"
              />

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value)
                }
                className="appearance-none rounded-xl border border-[#25445D] bg-[#081725] py-3 pl-10 pr-10 text-sm text-[#C4D0DB] outline-none focus:border-[#42B9FF]"
              >

                <option value="All">
                  All Reports
                </option>

                <option value="Detected">
                  Detected
                </option>

                <option value="Suspicious">
                  Suspicious
                </option>

                <option value="Safe">
                  Safe
                </option>

              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#607D94]"
              />

            </div>

          </div>


          {/* LOADING */}

          {loading && (
            <div className="p-12 text-center">

              <p className="text-sm text-[#607D94]">
                Loading threat reports...
              </p>

            </div>
          )}


          {/* ERROR */}

          {error && !loading && (
            <div className="m-5 rounded-xl border border-[#5A202A] bg-[#2A1218] p-4">

              <p className="text-sm text-[#FF4D5E]">
                {error}
              </p>

            </div>
          )}


          {/* TABLE */}

          {!loading && !error && (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>

                  <tr className="border-b border-[#17344D] text-left">

                    <th className="px-5 py-4 text-xs font-semibold text-[#607D94]">
                      REPORT
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold text-[#607D94]">
                      TYPE
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold text-[#607D94]">
                      CATEGORY
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold text-[#607D94]">
                      RISK
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold text-[#607D94]">
                      STATUS
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold text-[#607D94]">
                      DATE
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold text-[#607D94]">
                      ACTION
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredReports.map(
                    (report) => (

                      <tr
                        key={report.id}
                        className="border-b border-[#142C42] transition hover:bg-[#102236]"
                      >

                        {/* REPORT */}

                        <td className="px-5 py-4">

                          <p className="text-xs font-bold text-[#42B9FF]">
                            {report.id}
                          </p>

                          <p className="mt-1 max-w-[230px] truncate text-sm text-[#C4D0DB]">
                            {report.target}
                          </p>

                        </td>


                        {/* TYPE */}

                        <td className="px-5 py-4">

                          <span className="rounded-lg border border-[#25445D] bg-[#081725] px-3 py-1.5 text-xs font-semibold text-[#A7BAC9]">
                            {report.type}
                          </span>

                        </td>


                        {/* CATEGORY */}

                        <td className="px-5 py-4">

                          <span className="text-xs text-[#A7BAC9]">
                            {report.category}
                          </span>

                        </td>


                        {/* RISK */}

                        <td className="px-5 py-4">

                          <RiskBadge
                            score={report.risk}
                          />

                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <StatusBadge
                            status={report.status}
                          />

                        </td>


                        {/* DATE */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2 text-xs text-[#607D94]">

                            <Calendar
                              size={14}
                            />

                            {report.date}

                          </div>

                        </td>


                        {/* ACTION */}

                        <td className="px-5 py-4">

                          <button
                            onClick={() =>
                              setSelectedReport(
                                report
                              )
                            }
                            className="flex items-center gap-2 rounded-lg border border-[#25445D] px-3 py-2 text-xs font-semibold text-[#A7BAC9] transition hover:border-[#42B9FF] hover:bg-[#102A43] hover:text-white"
                          >

                            <Eye
                              size={15}
                            />

                            View

                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>


              {/* NO REPORTS */}

              {filteredReports.length === 0 && (

                <div className="p-12 text-center">

                  <Search
                    size={30}
                    className="mx-auto mb-3 text-[#526B82]"
                  />

                  <p className="font-semibold">
                    No reports found
                  </p>

                  <p className="mt-1 text-xs text-[#607D94]">
                    Try changing your search or filter.
                  </p>

                </div>

              )}

            </div>
          )}

        </div>


        {/* DATABASE INFO */}

        <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#174D6E] bg-[#0D2B40] p-4">

          <CheckCircle
            size={18}
            className="shrink-0 text-[#32D583]"
          />

          <p className="text-xs leading-5 text-[#8BA0B2]">
            Reports are loaded from the backend
            database and updated from URL and
            Message Scanner results.
          </p>

        </div>

      </div>


      {/* DETAIL MODAL */}

      {selectedReport && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5">

          <div className="w-full max-w-lg rounded-2xl border border-[#25445D] bg-[#091624] shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-[#17344D] p-5">

              <div>

                <p className="text-xs text-[#607D94]">
                  Threat Report
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  {selectedReport.id}
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelectedReport(null)
                }
                className="rounded-lg p-2 text-[#607D94] hover:bg-[#102A43] hover:text-white"
              >

                <XCircle size={20} />

              </button>

            </div>


            {/* MODAL CONTENT */}

            <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5">

              <DetailRow
                label="Target"
                value={selectedReport.target}
              />

              <DetailRow
                label="Type"
                value={selectedReport.type}
              />

              <DetailRow
                label="Category"
                value={selectedReport.category}
              />

              <DetailRow
                label="Risk Score"
                value={`${selectedReport.risk} / 100`}
              />

              <DetailRow
                label="Status"
                value={selectedReport.status}
              />

              <DetailRow
  label="Detection Confidence"
  value={`${selectedReport.confidence}%`}
/>

              <DetailRow
                label="Detected"
                value={selectedReport.date}
              />


              {/* DETECTION FINDINGS */}

              {selectedReport.reasons?.length > 0 && (

                <div>

                  <p className="mb-2 text-xs text-[#607D94]">
                    Detection Findings
                  </p>

                  <div className="space-y-2">

                    {selectedReport.reasons.map(
                      (reason, index) => (

                        <div
                          key={index}
                          className="rounded-lg border border-[#17344D] bg-[#081725] p-3 text-sm text-[#C4D0DB]"
                        >
                          • {reason}
                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

            </div>


            {/* MODAL FOOTER */}

            <div className="border-t border-[#17344D] p-5">

              <button
                onClick={() =>
                  setSelectedReport(null)
                }
                className="w-full rounded-xl bg-[#FF9F43] py-3 font-bold text-[#17100A] hover:bg-[#FFB66B]"
              >
                Close Report
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}


// =========================================================
// SUMMARY CARD
// =========================================================

function SummaryCard({
  title,
  value,
  icon,
  type,
}) {
  const styles = {
    blue: "bg-[#0D2B40] text-[#42B9FF]",
    red: "bg-[#3A1720] text-[#FF4D5E]",
    orange: "bg-[#392514] text-[#FF9F43]",
    green: "bg-[#0B3028] text-[#32D583]",
  };

  return (
    <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90 p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs text-[#607D94]">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {value}
          </p>

        </div>

        <div
          className={`rounded-lg p-3 ${styles[type]}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


// =========================================================
// RISK BADGE
// =========================================================

function RiskBadge({ score }) {

  if (score >= 60) {
    return (
      <span className="rounded-lg bg-[#3A1720] px-3 py-1.5 text-xs font-bold text-[#FF4D5E]">
        HIGH · {score}
      </span>
    );
  }

  if (score >= 30) {
    return (
      <span className="rounded-lg bg-[#392514] px-3 py-1.5 text-xs font-bold text-[#FF9F43]">
        MEDIUM · {score}
      </span>
    );
  }

  return (
    <span className="rounded-lg bg-[#0B3028] px-3 py-1.5 text-xs font-bold text-[#32D583]">
      LOW · {score}
    </span>
  );
}


// =========================================================
// STATUS BADGE
// =========================================================

function StatusBadge({ status }) {

  if (status === "Detected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#3A1720] px-3 py-1.5 text-xs font-bold text-[#FF4D5E]">

        <ShieldAlert size={13} />

        Detected

      </span>
    );
  }

  if (status === "Suspicious") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#392514] px-3 py-1.5 text-xs font-bold text-[#FF9F43]">

        <AlertTriangle size={13} />

        Suspicious

      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B3028] px-3 py-1.5 text-xs font-bold text-[#32D583]">

      <CheckCircle size={13} />

      Safe

    </span>
  );
}


// =========================================================
// DETAIL ROW
// =========================================================

function DetailRow({ label, value }) {

  return (
    <div>

      <p className="mb-1 text-xs text-[#607D94]">
        {label}
      </p>

      <p className="break-words rounded-lg border border-[#17344D] bg-[#081725] p-3 text-sm text-[#C4D0DB]">
        {value}
      </p>

    </div>
  );
}

export default ThreatReports;