import { useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  ChevronRight,
  FileWarning,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareWarning,
  Search,
  Settings,
  Shield,
  UserCircle,
  Users,
  X,
  Link as LinkIcon,
} from "lucide-react";

function DashboardLayout({
  children,
  currentPage,
  onNavigate,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userData = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const userName = userData.name || "User";
  const userEmail = userData.email || "";

  const menuItems = [
    {
      id: "home",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "url-scanner",
      label: "URL Scanner",
      icon: LinkIcon,
    },
    {
      id: "message-scanner",
      label: "Message Scanner",
      icon: MessageSquareWarning,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      id: "threat-reports",
      label: "Threat Reports",
      icon: FileWarning,
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const handleNavigate = (page) => {
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  return (
    <div className="relative flex min-h-screen bg-[#0D0F0F] text-[#F3F4F6]">

      {/* =========================================
          SUBTLE BACKGROUND
      ========================================= */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.035]"
          style={{
            backgroundImage:
              "url('/backgroundcybercrime.jpg')",
          }}
        />

        <div className="absolute left-[15%] top-[10%] h-72 w-72 rounded-full bg-[#10B981]/[0.04] blur-3xl" />

        <div className="absolute bottom-[10%] right-[10%] h-80 w-80 rounded-full bg-[#34D399]/[0.03] blur-3xl" />
      </div>

      {/* =========================================
          DESKTOP SIDEBAR
      ========================================= */}

      <aside className="relative z-30 hidden w-[250px] shrink-0 border-r border-[#26302F] bg-[#111313]/95 lg:flex lg:flex-col">

        {/* LOGO */}

        <div className="flex h-[76px] items-center border-b border-[#26302F] px-6">

          <button
            onClick={() => handleNavigate("home")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#10B981]/30 bg-[#10B981]/10">
              <Shield
                size={21}
                className="text-[#10B981]"
              />
            </div>

            <div className="text-left">
              <p className="text-sm font-bold tracking-wide text-white">
                ScamGuard AI
              </p>

              <p className="text-[10px] text-[#6F7C7A]">
                Threat Intelligence
              </p>
            </div>
          </button>

        </div>

        {/* NAVIGATION */}

        <div className="flex-1 overflow-y-auto px-3 py-5">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5F6B69]">
            Main Menu
          </p>

          <nav className="space-y-1">

            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() =>
                    handleNavigate(item.id)
                  }
                  className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#10B981]/10 text-[#34D399]"
                      : "text-[#879390] hover:bg-[#171A1A] hover:text-white"
                  }`}
                >

                  {active && (
                    <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-[#10B981]" />
                  )}

                  <Icon
                    size={18}
                    className={
                      active
                        ? "text-[#10B981]"
                        : "text-[#65716F] group-hover:text-[#AAB5B2]"
                    }
                  />

                  <span>{item.label}</span>

                  {active && (
                    <ChevronRight
                      size={14}
                      className="ml-auto text-[#10B981]"
                    />
                  )}

                </button>
              );
            })}

          </nav>

        </div>

        {/* SECURITY STATUS */}

        <div className="mx-4 mb-4 rounded-xl border border-[#26302F] bg-[#171A1A] p-3">

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.65)]" />

            <span className="text-xs font-semibold text-[#B8C3C0]">
              Detection Engine
            </span>

          </div>

          <p className="mt-1 text-[10px] text-[#687572]">
            AI services operational
          </p>

        </div>

        {/* USER */}

        <div className="border-t border-[#26302F] p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#10B981]/10 text-sm font-bold text-[#34D399]">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate text-xs font-bold text-white">
                {userName}
              </p>

              <p className="truncate text-[10px] text-[#687572]">
                {userEmail || "Authenticated user"}
              </p>

            </div>

            <button
              onClick={onLogout}
              title="Logout"
              className="rounded-lg p-2 text-[#697572] transition hover:bg-[#211717] hover:text-[#EF4444]"
            >
              <LogOut size={16} />
            </button>

          </div>

        </div>

      </aside>

      {/* =========================================
          MOBILE SIDEBAR
      ========================================= */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <button
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/70"
          />

          <aside className="relative flex h-full w-[280px] flex-col border-r border-[#26302F] bg-[#111313] shadow-2xl">

            {/* MOBILE LOGO */}

            <div className="flex h-[76px] items-center justify-between border-b border-[#26302F] px-5">

              <button
                onClick={() =>
                  handleNavigate("home")
                }
                className="flex items-center gap-3"
              >

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#10B981]/30 bg-[#10B981]/10">
                  <Shield
                    size={21}
                    className="text-[#10B981]"
                  />
                </div>

                <div className="text-left">
                  <p className="text-sm font-bold text-white">
                    ScamGuard AI
                  </p>

                  <p className="text-[10px] text-[#6F7C7A]">
                    Threat Intelligence
                  </p>
                </div>

              </button>

              <button
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="rounded-lg p-2 text-[#697572] hover:bg-[#171A1A] hover:text-white"
              >
                <X size={19} />
              </button>

            </div>

            {/* MOBILE NAV */}

            <div className="flex-1 overflow-y-auto px-3 py-5">

              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5F6B69]">
                Main Menu
              </p>

              <nav className="space-y-1">

                {menuItems.map((item) => {

                  const Icon = item.icon;
                  const active =
                    currentPage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() =>
                        handleNavigate(item.id)
                      }
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                        active
                          ? "bg-[#10B981]/10 text-[#34D399]"
                          : "text-[#879390] hover:bg-[#171A1A] hover:text-white"
                      }`}
                    >

                      <Icon
                        size={18}
                        className={
                          active
                            ? "text-[#10B981]"
                            : "text-[#65716F]"
                        }
                      />

                      <span>{item.label}</span>

                    </button>
                  );

                })}

              </nav>

            </div>

            {/* MOBILE LOGOUT */}

            <div className="border-t border-[#26302F] p-4">

              <button
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#879390] transition hover:bg-[#211717] hover:text-[#EF4444]"
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>

          </aside>

        </div>
      )}

      {/* =========================================
          MAIN AREA
      ========================================= */}

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">

        {/* =========================================
            TOPBAR
        ========================================= */}

        <header className="sticky top-0 z-20 h-[76px] border-b border-[#26302F] bg-[#0D0F0F]/90 backdrop-blur-xl">

          <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

            {/* MOBILE MENU BUTTON */}

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl border border-[#26302F] bg-[#171A1A] p-2.5 text-[#A0AAA7] transition hover:border-[#10B981]/40 hover:text-[#34D399] lg:hidden"
            >
              <Menu size={19} />
            </button>

            {/* SEARCH */}

            <div className="relative hidden w-full max-w-md md:block">

              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F6B69]"
              />

              <input
                type="text"
                placeholder="Search security tools..."
                className="w-full rounded-xl border border-[#26302F] bg-[#171A1A] py-2.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-[#586461] transition focus:border-[#10B981]/50"
              />

            </div>

            {/* RIGHT SIDE */}

            <div className="ml-auto flex items-center gap-2">

              {/* SYSTEM STATUS */}

              <div className="hidden items-center gap-2 rounded-xl border border-[#26302F] bg-[#171A1A] px-3 py-2 sm:flex">

                <span className="h-2 w-2 rounded-full bg-[#22C55E]" />

                <span className="text-xs font-medium text-[#8C9895]">
                  System Online
                </span>

              </div>

              {/* NOTIFICATION */}

              <button
                title="Notifications"
                className="relative rounded-xl border border-[#26302F] bg-[#171A1A] p-2.5 text-[#879390] transition hover:border-[#10B981]/40 hover:text-[#34D399]"
              >

                <Bell size={18} />

                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#EF4444]" />

              </button>

              {/* PROFILE */}

              <button
                onClick={() =>
                  handleNavigate("settings")
                }
                className="flex items-center gap-2 rounded-xl border border-[#26302F] bg-[#171A1A] px-2 py-1.5 transition hover:border-[#10B981]/40"
              >

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10B981]/10 text-xs font-bold text-[#34D399]">
                  {userName.charAt(0).toUpperCase()}
                </div>

                <div className="hidden text-left sm:block">

                  <p className="max-w-[120px] truncate text-xs font-bold text-white">
                    {userName}
                  </p>

                  <p className="text-[9px] text-[#687572]">
                    Account
                  </p>

                </div>

              </button>

            </div>

          </div>

        </header>

        {/* =========================================
            PAGE CONTENT
        ========================================= */}

        <main className="flex-1">
          {children}
        </main>

        {/* =========================================
            FOOTER
        ========================================= */}

        <footer className="border-t border-[#26302F] bg-[#111313]/80">

          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

            <div className="grid gap-8 md:grid-cols-[1.6fr_1fr_1fr_1fr]">

              {/* BRAND */}

              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#10B981]/25 bg-[#10B981]/10">
                    <Shield
                      size={18}
                      className="text-[#10B981]"
                    />
                  </div>

                  <span className="font-bold text-white">
                    ScamGuard AI
                  </span>

                </div>

                <p className="mt-3 max-w-sm text-xs leading-5 text-[#697572]">
                  AI-powered phishing and scam detection
                  platform designed to identify digital
                  threats before they cause harm.
                </p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#26302F] bg-[#171A1A] px-3 py-2">

                  <Activity
                    size={14}
                    className="text-[#10B981]"
                  />

                  <span className="text-[10px] font-semibold text-[#889491]">
                    Hybrid AI Detection Active
                  </span>

                </div>

              </div>

              {/* PRODUCT */}

              <div>

                <p className="text-xs font-bold text-white">
                  Product
                </p>

                <div className="mt-4 space-y-2">

                  <FooterLink
                    label="URL Scanner"
                    onClick={() =>
                      handleNavigate("url-scanner")
                    }
                  />

                  <FooterLink
                    label="Message Scanner"
                    onClick={() =>
                      handleNavigate(
                        "message-scanner"
                      )
                    }
                  />

                  <FooterLink
                    label="Analytics"
                    onClick={() =>
                      handleNavigate("analytics")
                    }
                  />

                  <FooterLink
                    label="Threat Reports"
                    onClick={() =>
                      handleNavigate(
                        "threat-reports"
                      )
                    }
                  />

                </div>

              </div>

              {/* SECURITY */}

              <div>

                <p className="text-xs font-bold text-white">
                  Security
                </p>

                <div className="mt-4 space-y-2">

                  <FooterLink
                    label="Secure Authentication"
                  />

                  <FooterLink
                    label="AI Threat Detection"
                  />

                  <FooterLink
                    label="Privacy"
                  />

                  <FooterLink
                    label="Security"
                  />

                </div>

              </div>

              {/* ACCOUNT */}

              <div>

                <p className="text-xs font-bold text-white">
                  Account
                </p>

                <div className="mt-4 space-y-2">

                  <FooterLink
                    label="Profile"
                    onClick={() =>
                      handleNavigate("settings")
                    }
                  />

                  <FooterLink
                    label="Settings"
                    onClick={() =>
                      handleNavigate("settings")
                    }
                  />

                  <FooterLink
                    label="Users"
                    onClick={() =>
                      handleNavigate("users")
                    }
                  />

                  <FooterLink
                    label="Logout"
                    onClick={onLogout}
                  />

                </div>

              </div>

            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-[#26302F] pt-5 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-[10px] text-[#5F6B69]">
                © 2026 ScamGuard AI. All rights reserved.
              </p>

              <div className="flex items-center gap-4 text-[10px] text-[#5F6B69]">

                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                  Services operational
                </span>

                <span>AI-powered security platform</span>

              </div>

            </div>

          </div>

        </footer>

      </div>
    </div>
  );
}


/* =========================================
   FOOTER LINK
========================================= */

function FooterLink({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="block text-left text-xs text-[#6F7C79] transition hover:text-[#34D399]"
    >
      {label}
    </button>
  );
}

export default DashboardLayout;