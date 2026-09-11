import { useEffect, useState } from "react";

import Home from "./pages/Home";
import URLScanner from "./pages/URLScanner";
import MessageScanner from "./pages/MessageScanner";
import Analytics from "./pages/Analytics";
import ThreatReports from "./pages/ThreatReports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [page, setPage] = useState(
    localStorage.getItem("token")
      ? window.history.state?.page || "home"
      : "login"
  );

  useEffect(() => {
    const handlePopState = (event) => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoggedIn(false);
        setPage("login");
        return;
      }

      setPage(event.state?.page || "home");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigate = (nextPage) => {
    const publicPages = ["login", "register"];
    const token = localStorage.getItem("token");

    if (!token && !publicPages.includes(nextPage)) {
      window.history.pushState(
        { page: "login" },
        "",
        window.location.pathname
      );

      setIsLoggedIn(false);
      setPage("login");
      return;
    }

    window.history.pushState(
      { page: nextPage },
      "",
      window.location.pathname
    );

    setPage(nextPage);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);

    window.history.pushState(
      { page: "login" },
      "",
      window.location.pathname
    );

    setPage("login");
  };

  return (
    <div className="min-h-screen bg-[#EDECE7]">

      {/* LOGIN */}

      {!isLoggedIn && page === "login" && (
        <Login
          onNavigate={navigate}
          onLogin={handleLogin}
        />
      )}

      {/* REGISTER */}

      {!isLoggedIn && page === "register" && (
        <Register
          onNavigate={navigate}
        />
      )}

      {/* HOME */}

      {isLoggedIn && page === "home" && (
        <Home
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}

      {/* URL SCANNER */}

      {isLoggedIn && page === "url-scanner" && (
        <URLScanner
          onNavigate={navigate}
        />
      )}

      {/* MESSAGE SCANNER */}

      {isLoggedIn && page === "message-scanner" && (
        <MessageScanner
          onNavigate={navigate}
        />
      )}

      {/* ANALYTICS */}

      {isLoggedIn && page === "analytics" && (
        <Analytics
          onNavigate={navigate}
        />
      )}

      {/* THREAT REPORTS */}

      {isLoggedIn && page === "threat-reports" && (
        <ThreatReports
          onNavigate={navigate}
        />
      )}

      {/* USERS */}

      {isLoggedIn && page === "users" && (
        <Users
          onNavigate={navigate}
        />
      )}

      {/* SETTINGS */}

      {isLoggedIn && page === "settings" && (
        <Settings
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}

    </div>
  );
}

export default App;