import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle,
  ChevronDown,
  Download,
  Eye,
  FileWarning,
  Filter,
  Search,
  Shield,
  ShieldAlert,
  X,
} from "lucide-react";

function ThreatReports({ onNavigate }) {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/reports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch reports.");
        }

        const formattedReports = data.reports.map((report, index) => {
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
            type: report.type === "MESSAGE" ? "Message" : "URL",
            target: report.target || "Unknown",
            category: report.category || "Unknown",
            risk: report.score || 0,
            status,
            date: report.createdAt
              ? new Date(report.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Unknown",
            confidence: report.confidence || 0,
            prediction: report.prediction || null,
            features: Array.isArray(report.features) ? report.features : [],
            reasons: report.reasons || [],
          };
        });

        setReports(formattedReports);
      } catch (err) {
        console.error("Reports Error:", err);
        setError(err.message || "Unable to connect to the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesFilter =
        filter === "All" || report.status === filter;

      const matchesType =
        typeFilter === "All" || report.type === typeFilter;

      const query = search.toLowerCase().trim();

      const matchesSearch =
        report.target.toLowerCase().includes(query) ||
        report.category.toLowerCase().includes(query) ||
        report.type.toLowerCase().includes(query) ||
        report.id.toLowerCase().includes(query);

      return matchesFilter && matchesType && matchesSearch;
    });
  }, [reports, search, filter, typeFilter]);

  const detected = reports.filter((report) => report.status === "Detected").length;
  const suspicious = reports.filter((report) => report.status === "Suspicious").length;
  const safe = reports.filter((report) => report.status === "Safe").length;

  const exportCSV = () => {
    if (filteredReports.length === 0) return;

    const generatedAt = new Date().toLocaleString("en-IN");

    const headers = [
      "Report ID",
      "Type",
      "Target",
      "Category",
      "Risk Score",
      "Status",
      "Confidence",
      "Prediction",
      "Date",
      "Detection Findings",
      "Generated At",
    ];

    const rows = filteredReports.map((report) => [
      report.id,
      report.type,
      report.target,
      report.category,
      report.risk,
      report.status,
      `${report.confidence}%`,
      report.prediction || "N/A",
      report.date,
      report.reasons.join(" | "),
      generatedAt,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => {
            const safeValue = String(value ?? "");
            return `"${safeValue.replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `threat-reports-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const downloadPDF = async (report) => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Your session has expired. Please log in again.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/reports/${report.id}/pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let errorMessage = "Unable to download PDF report.";

        try {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } catch {
          // Response may not be JSON.
        }

        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `ScamShield_Report_${report.id}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("PDF Download Error:", err);

      setError(
        err.message ||
          "Unable to download PDF report. Please try again."
      );
    }
  };

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

  const formatFeatureValue = (name, value) => {
    if (
      name === "HTTPS" ||
      name === "HTTP" ||
      name === "IP Address" ||
      name === "Shortened URL"
    ) {
      return value === 1 ? "Yes" : "No";
    }

    return value;
  };

  const navItems = [
    ["home", "Home"],
    ["url-scanner", "Scan URL"],
    ["message-scanner", "Scan Message"],
    ["analytics", "Analytics"],
    ["threat-reports", "Threat Reports"],
    ["users", "Users"],
    ["settings", "Settings"],
  ];

  return (
    <div className="min-h-screen bg-[#EDECE7] text-[#2F302F]">
      {/* TOP NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-[#DAD9D4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={() => onNavigate?.("home")}
            className="flex shrink-0 items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#434341] text-white">
              <Shield size={18} />
            </div>
            <span className="hidden text-sm font-extrabold tracking-tight sm:inline">
              ScamGuard AI
            </span>
          </button>

          <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto scrollbar-none">
            {navItems.map(([id, label]) => (
              <button
                key={id}
                onClick={() => onNavigate?.(id)}
                className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  id === "threat-reports"
                    ? "bg-[#434341] text-white"
                    : "text-[#686861] hover:bg-[#F0EFEB] hover:text-[#2F302F]"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <span className="h-2 w-2 rounded-full bg-[#2F7D5A]" />
            <span className="text-xs font-semibold text-[#6B6B66]">
              System online
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        {/* HEADER */}
        <section className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <button
              onClick={() => onNavigate?.("home")}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#6B6B66] transition hover:text-[#2F302F]"
            >
              ← Back to Dashboard
            </button>

            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D4D1C9] bg-white">
                <FileWarning size={22} className="text-[#434341]" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7A7972]">
                  Security history
                </p>
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Threat Reports
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B6B66]">
                  Review scan history and investigate phishing and scam
                  detection results.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={exportCSV}
            disabled={loading || filteredReports.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#434341] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#343532] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={18} />
            Export CSV
          </button>
        </section>

        {/* SUMMARY */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Reports"
            value={reports.length}
            icon={<FileWarning size={20} />}
            tone="charcoal"
          />
          <SummaryCard
            title="Threats Detected"
            value={detected}
            icon={<ShieldAlert size={20} />}
            tone="red"
          />
          <SummaryCard
            title="Suspicious"
            value={suspicious}
            icon={<AlertTriangle size={20} />}
            tone="warm"
          />
          <SummaryCard
            title="Safe"
            value={safe}
            icon={<CheckCircle size={20} />}
            tone="green"
          />
        </section>

        {/* REPORT PANEL */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-[#D4D1C9] bg-white shadow-[0_12px_35px_rgba(47,48,47,0.05)]">
          <div className="border-b border-[#E1DFDA] p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-extrabold">Scan History</h2>
                <p className="mt-1 text-xs text-[#77766F]">
                  Search reports and filter them by risk level or scan type.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
                <div className="relative w-full sm:min-w-[280px]">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#92928A]"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search reports..."
                    className="w-full rounded-xl border border-[#D5D2CA] bg-white py-3 pl-11 pr-4 text-sm font-medium !text-[#343532] caret-[#2F7D5A] outline-none transition placeholder:text-[#9A9A92] focus:border-[#8E8C85] selection:bg-[#DCEBE1] selection:text-[#343532]"
                    style={{
                      color: "#343532",
                      WebkitTextFillColor: "#343532",
                    }}
                  />
                </div>

                <SelectFilter
                  value={filter}
                  onChange={setFilter}
                  icon={<Filter size={15} />}
                  options={["All", "Detected", "Suspicious", "Safe"]}
                  labels={{
                    All: "All Risk Levels",
                    Detected: "Detected",
                    Suspicious: "Suspicious",
                    Safe: "Safe",
                  }}
                />

                <SelectFilter
                  value={typeFilter}
                  onChange={setTypeFilter}
                  options={["All", "URL", "Message"]}
                  labels={{
                    All: "All Scan Types",
                    URL: "URL Scans",
                    Message: "Message Scans",
                  }}
                />
              </div>
            </div>
          </div>

          {loading && (
            <div className="p-14 text-center">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#706F68]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#2F7D5A]" />
                Loading threat reports...
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="m-5 rounded-2xl border border-[#E8C9C9] bg-[#FFF7F7] p-4">
              <p className="text-sm font-semibold text-[#A84C4C]">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px]">
                <thead>
                  <tr className="border-b border-[#E7E5E0] bg-[#FAF9F7] text-left">
                    <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#85847D]">
                      Report
                    </th>
                    <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#85847D]">
                      Type
                    </th>
                    <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#85847D]">
                      Category
                    </th>
                    <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#85847D]">
                      Risk
                    </th>
                    <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#85847D]">
                      Status
                    </th>
                    <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#85847D]">
                      Date
                    </th>
                    <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#85847D]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b border-[#ECEAE5] transition hover:bg-[#FCFBF8]"
                    >
                      <td className="px-5 py-4">
                        <p className="text-xs font-extrabold text-[#5B5B55]">
                          {report.id}
                        </p>
                        <p className="mt-1 max-w-[250px] truncate text-sm font-semibold text-[#343532]">
                          {report.target}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-[#F0EFEB] px-3 py-1.5 text-xs font-extrabold text-[#66665F]">
                          {report.type}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold text-[#6F6E67]">
                          {report.category}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <RiskBadge score={report.risk} />
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={report.status} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-[#77766F]">
                          <Calendar size={14} />
                          {report.date}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#D3D0C8] bg-white px-3 py-2 text-xs font-bold text-[#434341] transition hover:bg-[#F4F2ED]"
                          >
                            <Eye size={15} />
                            View
                          </button>

                          <button
                            onClick={() => downloadPDF(report)}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#434341] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#343532]"
                          >
                            <Download size={15} />
                            PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredReports.length === 0 && (
                <div className="px-6 py-14 text-center">
                  <Search size={30} className="mx-auto text-[#A2A19A]" />
                  <p className="mt-3 font-extrabold">No reports found</p>
                  <p className="mt-1 text-xs text-[#7C7B74]">
                    Try changing your search or filter.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* DATABASE INFO */}
        <section className="mt-5 flex items-start gap-3 rounded-2xl border border-[#CCDCD3] bg-[#F5F8F5] p-4">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
            <CheckCircle size={17} className="text-[#2F7D5A]" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-[#343532]">
              Live database reports
            </p>
            <p className="mt-1 text-xs leading-5 text-[#6F7069]">
              Reports are loaded from the protected backend database and
              include results from URL and Message Scanner activity.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-10 bg-[#434341] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <Shield size={17} />
                </div>
                <span className="font-extrabold">ScamGuard AI</span>
              </div>
              <p className="mt-2 max-w-md text-xs leading-5 text-white/65">
                AI-assisted phishing and scam detection for safer digital
                communication.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {navItems.map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => onNavigate?.(id)}
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4 text-xs text-white/45">
            © {new Date().getFullYear()} ScamGuard AI. Security decisions are
            assisted by machine learning and rule-based analysis.
          </div>
        </div>
      </footer>

      {/* DETAIL MODAL */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#22231F]/45 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedReport(null);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-[#D4D1C9] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E3DE] p-5">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#87867F]">
                  Threat Report
                </p>
                <h2 className="mt-1 text-xl font-extrabold text-[#343532]">
                  {selectedReport.id}
                </h2>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#79786F] transition hover:bg-[#F0EFEB] hover:text-[#343532]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[68vh] space-y-5 overflow-y-auto p-5">
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <ShieldAlert size={17} className="text-[#434341]" />
                  <h3 className="text-sm font-extrabold">Scan Details</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailRow label="Target" value={selectedReport.target} />
                  <DetailRow label="Type" value={selectedReport.type} />
                  <DetailRow label="Category" value={selectedReport.category} />
                  <DetailRow
                    label="Risk Score"
                    value={`${selectedReport.risk} / 100`}
                  />
                  <DetailRow label="Status" value={selectedReport.status} />
                  <DetailRow
                    label="Detection Confidence"
                    value={`${selectedReport.confidence}%`}
                  />
                  <DetailRow label="Detected" value={selectedReport.date} />
                </div>
              </section>

              <section className="rounded-2xl bg-[#434341] p-4 text-white">
                <div className="mb-4 flex items-center gap-2">
                  <Brain size={18} />
                  <div>
                    <h3 className="text-sm font-extrabold">AI / ML Analysis</h3>
                    <p className="text-[10px] text-white/60">
                      Machine learning prediction
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-white/50">
                      Prediction
                    </p>
                    <p
                      className={`mt-2 text-lg font-extrabold uppercase ${
                        selectedReport.prediction === "phishing"
                          ? "text-[#FFB0B0]"
                          : selectedReport.prediction === "spam"
                          ? "text-[#E8C9A9]"
                          : "text-[#B9E0CC]"
                      }`}
                    >
                      {selectedReport.prediction || "Not available"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-wide text-white/50">
                      ML Confidence
                    </p>
                    <p className="mt-2 text-lg font-extrabold">
                      {selectedReport.confidence}%
                    </p>
                  </div>
                </div>
              </section>

              {selectedReport.type === "URL" &&
                selectedReport.features?.length > 0 && (
                  <section className="rounded-2xl border border-[#D9D6CF] bg-[#FAF9F7]">
                    <div className="flex items-center gap-2 border-b border-[#E2E0DB] p-4">
                      <BarChart3 size={17} className="text-[#434341]" />
                      <div>
                        <h3 className="text-sm font-extrabold">
                          URL Feature Analysis
                        </h3>
                        <p className="text-[10px] text-[#85847D]">
                          Features extracted for ML classification
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-2 p-4 sm:grid-cols-2">
                      {featureNames.map((name, index) => {
                        const value = selectedReport.features[index];

                        return (
                          <div
                            key={name}
                            className="flex items-center justify-between rounded-xl border border-[#E0DED8] bg-white px-3 py-2.5"
                          >
                            <span className="text-xs font-medium text-[#77766F]">
                              {name}
                            </span>
                            <span className="ml-3 text-xs font-extrabold text-[#434341]">
                              {value !== undefined
                                ? formatFeatureValue(name, value)
                                : "-"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

              {selectedReport.reasons?.length > 0 && (
                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <AlertTriangle size={17} className="text-[#8A7358]" />
                    <p className="text-sm font-extrabold">
                      Detection Findings
                    </p>
                  </div>

                  <div className="space-y-2">
                    {selectedReport.reasons.map((reason, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-[#DEDCD6] bg-[#FAF9F7] p-3 text-sm text-[#595952]"
                      >
                        <span className="mr-2 font-extrabold text-[#2F7D5A]">
                          •
                        </span>
                        {reason}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="border-t border-[#E5E3DE] p-5">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => downloadPDF(selectedReport)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#434341] py-3 text-sm font-extrabold text-white transition hover:bg-[#343532]"
                >
                  <Download size={18} />
                  Download PDF Report
                </button>

                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 rounded-xl border border-[#D3D0C8] bg-white py-3 text-sm font-extrabold text-[#434341] transition hover:bg-[#F4F2ED]"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SelectFilter({ value, onChange, icon, options, labels }) {
  return (
    <div className="relative w-full sm:w-auto">
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#8C8B84]">
          {icon}
        </span>
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-xl border border-[#D5D2CA] bg-white py-3 pr-10 text-sm font-semibold !text-[#4B4B46] outline-none transition focus:border-[#8E8C85] sm:w-auto ${
          icon ? "pl-9" : "pl-4"
        }`}
        style={{ color: "#4B4B46" }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option] || option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8B84]"
      />
    </div>
  );
}

function SummaryCard({ title, value, icon, tone }) {
  const styles = {
    charcoal: {
      icon: "bg-[#F0EFEB] text-[#434341]",
      value: "text-[#343532]",
    },
    red: {
      icon: "bg-[#F1E7E6] text-[#8B4D47]",
      value: "text-[#8B4D47]",
    },
    warm: {
      icon: "bg-[#F2EDE6] text-[#8A7358]",
      value: "text-[#665846]",
    },
    green: {
      icon: "bg-[#EAF4EE] text-[#2F7D5A]",
      value: "text-[#2F7D5A]",
    },
  };

  const active = styles[tone] || styles.charcoal;

  return (
    <div className="rounded-2xl border border-[#D4D1C9] bg-white p-5 shadow-[0_8px_25px_rgba(47,48,47,0.035)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#85847D]">
            {title}
          </p>
          <p className={`mt-2 text-3xl font-extrabold ${active.value}`}>
            {value}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${active.icon}`}>{icon}</div>
      </div>
    </div>
  );
}

function RiskBadge({ score }) {
  if (score >= 60) {
    return (
      <span className="rounded-lg bg-[#F1E7E6] px-3 py-1.5 text-xs font-extrabold text-[#8B4D47]">
        HIGH · {score}
      </span>
    );
  }

  if (score >= 30) {
    return (
      <span className="rounded-lg bg-[#F2EDE6] px-3 py-1.5 text-xs font-extrabold text-[#8A7358]">
        MEDIUM · {score}
      </span>
    );
  }

  return (
    <span className="rounded-lg bg-[#EAF4EE] px-3 py-1.5 text-xs font-extrabold text-[#2F7D5A]">
      LOW · {score}
    </span>
  );
}

function StatusBadge({ status }) {
  if (status === "Detected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F1E7E6] px-3 py-1.5 text-xs font-extrabold text-[#8B4D47]">
        <ShieldAlert size={13} />
        Detected
      </span>
    );
  }

  if (status === "Suspicious") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F2EDE6] px-3 py-1.5 text-xs font-extrabold text-[#8A7358]">
        <AlertTriangle size={13} />
        Suspicious
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#EAF4EE] px-3 py-1.5 text-xs font-extrabold text-[#2F7D5A]">
      <CheckCircle size={13} />
      Safe
    </span>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#85847D]">
        {label}
      </p>
      <p className="break-words rounded-xl border border-[#DEDCD6] bg-[#FAF9F7] p-3 text-sm font-semibold text-[#4B4B46]">
        {value}
      </p>
    </div>
  );
}

export default ThreatReports;
