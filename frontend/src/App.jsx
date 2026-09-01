import { useEffect, useState } from "react";

import Home from "./pages/Home";
import URLScanner from "./pages/URLScanner";
import MessageScanner from "./pages/MessageScanner";
import Analytics from "./pages/Analytics";
import ThreatReports from "./pages/ThreatReports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";


function App() {
  const [page, setPage] = useState(
    window.history.state?.page || "home"
  );

  useEffect(() => {
    const handlePopState = (event) => {
      setPage(event.state?.page || "home");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigate = (nextPage) => {
    window.history.pushState(
      { page: nextPage },
      "",
      window.location.pathname
    );

    setPage(nextPage);
  };

  return (
    <div className="min-h-screen bg-transparent">

      {page === "home" && (
        <Home onNavigate={navigate} />
      )}

      {page === "url-scanner" && (
        <URLScanner onNavigate={navigate} />
      )}

      {page === "message-scanner" && (
        <MessageScanner onNavigate={navigate} />
      )}

      {page === "analytics" && (
        <Analytics onNavigate={navigate} />
      )}

      {page === "threat-reports" && (
        <ThreatReports onNavigate={navigate} />
      )}

      {page === "users" && (
  <Users onNavigate={setPage} />
)}
    {page === "settings" && (
  <Settings onNavigate={setPage} />
)}
    </div>
  );
}

export default App;