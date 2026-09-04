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

    // If user is not logged in, allow only login/register
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

    // Login/register navigation
    if (publicPages.includes(nextPage)) {
      window.history.pushState(
        { page: nextPage },
        "",
        window.location.pathname
      );

      setPage(nextPage);
      return;
    }

    // Protected page navigation
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
    <div className="min-h-screen bg-transparent">

      {!isLoggedIn && page === "login" && (
        <Login
          onNavigate={navigate}
          onLogin={handleLogin}
        />
      )}

      {!isLoggedIn && page === "register" && (
        <Register onNavigate={navigate} />
      )}

      {isLoggedIn && page === "home" && (
        <Home
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}

      {isLoggedIn && page === "url-scanner" && (
        <URLScanner onNavigate={navigate} />
      )}

      {isLoggedIn && page === "message-scanner" && (
        <MessageScanner onNavigate={navigate} />
      )}

      {isLoggedIn && page === "analytics" && (
        <Analytics onNavigate={navigate} />
      )}

      {isLoggedIn && page === "threat-reports" && (
        <ThreatReports onNavigate={navigate} />
      )}

      {isLoggedIn && page === "users" && (
        <Users onNavigate={navigate} />
      )}

      {isLoggedIn && page === "settings" && (
        <Settings onNavigate={navigate} 
        onLogout={handleLogout}/>
      )}

    </div>
  );
}

export default App;