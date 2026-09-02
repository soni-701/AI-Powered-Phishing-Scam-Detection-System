import {
  AlertTriangle,
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  Globe,
  LayoutDashboard,
  Link as LinkIcon,
  Lock,
  Menu,
  MessageSquareWarning,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Target,
  Users,
  X,
} from "lucide-react";

import { useState } from "react";

function Home({onNavigate}) {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-transparent text-white">

      {/* ================= MOBILE MENU ================= */}

      {mobileMenu && (
        <div className="fixed inset-0 z-50 bg-[#07111F] lg:hidden">

          <div className="flex items-center justify-between border-b border-[#172D44] p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#102A43]">
                <Shield className="text-[#42B9FF]" size={22} />
              </div>

              <div>
                <h1 className="font-bold">
                  ScamShield{" "}
                  <span className="text-[#FF9F43]">AI</span>
                </h1>

                <p className="text-[9px] uppercase tracking-widest text-[#607D94]">
                  Security Center
                </p>
              </div>

            </div>

            <button
              onClick={() => setMobileMenu(false)}
              className="rounded-lg p-2 hover:bg-[#102A43]"
            >
              <X size={25} />
            </button>

          </div>

          <div className="space-y-3 p-5">

            <MobileNav
              icon={<LayoutDashboard size={19} />}
              text="Dashboard"
            />

            <MobileNav
              icon={<LinkIcon size={19} />}
              text="URL Scanner"
            />

            <MobileNav
              icon={<MessageSquareWarning size={19} />}
              text="Message Scanner"
            />

            <MobileNav
              icon={<BarChart3 size={19} />}
              text="Analytics"
            />

            <MobileNav
              icon={<ShieldAlert size={19} />}
              text="Threat Reports"
            />

            <MobileNav
              icon={<Settings size={19} />}
              text="Settings"
            />

          </div>

        </div>
      )}


      {/* ================= SIDEBAR ================= */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-[#172D44] bg-[#091624] lg:block">

        <div className="flex h-20 items-center gap-3 border-b border-[#172D44] px-6">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#235174] bg-[#102A43]">
            <Shield
              className="text-[#42B9FF]"
              size={22}
            />
          </div>

          <div>

            <h1 className="font-bold">
              ScamShield{" "}
              <span className="text-[#FF9F43]">
                AI
              </span>
            </h1>

            <p className="text-[9px] uppercase tracking-[0.2em] text-[#607D94]">
              Security Center
            </p>

          </div>

        </div>


        <div className="p-4">

          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-[#526B82]">
            Main Menu
          </p>

          <SidebarItem
            active
            icon={<LayoutDashboard size={18} />}
            text="Dashboard"
          />

          <SidebarItem
            icon={<LinkIcon size={18} />}
            text="URL Scanner"
            onClick={()=>onNavigate('url-scanner')}
          />

          <SidebarItem
            icon={<MessageSquareWarning size={18} />}
            text="Message Scanner"
            onClick={()=>onNavigate("message-scanner")}
          />

          <SidebarItem
            icon={<BarChart3 size={18} />}
            text="Analytics"
            onClick={()=>onNavigate('analytics')}
          />

          <SidebarItem
            icon={<ShieldAlert size={18} />}
            text="Threat Reports"
            onClick={()=>onNavigate('threat-reports')}
          />

         

          <p className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-widest text-[#526B82]">
            System
          </p>

          <SidebarItem
            icon={<Users size={18} />}
            text="Users"
            onClick={()=>onNavigate('users')}
          />

          <SidebarItem
            icon={<Settings size={18} />}
            text="Settings"
             onClick={() => onNavigate("settings")}
          />

        </div>


        <div className="absolute bottom-5 left-4 right-4 rounded-xl border border-[#1B354E] bg-[#0C1D2E] p-4">

          <div className="flex items-center gap-2">

            <span className="h-2.5 w-2.5 rounded-full bg-[#32D583] shadow-[0_0_10px_#32D583]" />

            <span className="text-sm font-semibold">
              AI Engine Online
            </span>

          </div>

          <p className="mt-2 text-xs text-[#607D94]">
            Detection services operational
          </p>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="lg:ml-64">

        {/* ================= TOP BAR ================= */}

        <header className="flex h-20 items-center justify-between border-b border-[#172D44] bg-[#091624] px-5 lg:px-8">

          <div className="flex items-center gap-4">

            <button
              onClick={() => setMobileMenu(true)}
              className="rounded-lg p-2 hover:bg-[#102A43] lg:hidden"
            >
              <Menu size={25} />
            </button>

            <div>

              <p className="text-xs text-[#607D94]">
                Security Center
              </p>

              <div className="flex items-center gap-2">

                <h2 className="text-lg font-bold">
                  Threat Detection
                </h2>

                <ChevronDown
                  size={16}
                  className="text-[#607D94]"
                />

              </div>

            </div>

          </div>


          <div className="flex items-center gap-3">

            <div className="hidden items-center gap-2 rounded-lg border border-[#1B354E] bg-[#0C1D2E] px-3 py-2 md:flex">

              <Search
                size={16}
                className="text-[#607D94]"
              />

              <input
                type="text"
                placeholder="Search threats..."
                className="w-32 bg-transparent text-sm outline-none placeholder:text-[#526B82]"
              />

            </div>


            <button className="relative rounded-lg border border-[#1B354E] bg-[#0C1D2E] p-2.5">

              <Bell size={18} />

              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#FF4D5E]" />

            </button>


            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#17344D] text-sm font-bold">
              SA
            </div>

          </div>

        </header>


        {/* ==================================================
            HOME HERO
        ================================================== */}

        <section className="relative min-h-[680px] overflow-hidden">

          {/* BACKGROUND IMAGE */}

          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('/backgroundcybercrime.jpg')",
            }}
          />


          {/* DARK OVERLAY */}

          <div className="absolute inset-0 bg-[#07111F]/65" />


          {/* BLUE GLOW */}

          <div className="absolute -right-40 top-10 h-[450px] w-[450px] rounded-full bg-[#42B9FF]/10 blur-[100px]" />


          {/* RED GLOW */}

          <div className="absolute -left-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#FF4D5E]/10 blur-[100px]" />


          {/* HERO CONTENT */}

          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">


            {/* ================= LEFT ================= */}

            <div>

              {/* Badge */}

              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#42B9FF]/40 bg-[#07111F]/75 px-4 py-2 text-sm font-semibold text-[#42B9FF] backdrop-blur-md">

                <span className="h-2 w-2 rounded-full bg-[#32D583] shadow-[0_0_10px_#32D583]" />

                AI-Powered Threat Detection

              </div>


              {/* Heading */}

              <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">

                Detect Phishing

                <span className="block text-[#FF9F43]">
                  & Scam Attacks
                </span>

                <span className="block text-white">
                  Before They Harm You
                </span>

              </h1>


              {/* Description */}

              <p className="mt-7 max-w-xl text-lg leading-8 text-[#D0DAE3]">

                Protect yourself from suspicious links, fake websites,
                scam messages and online fraud with AI-powered threat
                detection.

              </p>


              {/* Buttons */}

              <div className="mt-9 flex flex-wrap gap-4">

                <button className="flex items-center gap-2 rounded-xl bg-[#FF9F43] px-7 py-4 font-bold text-[#17100A] shadow-lg transition hover:bg-[#FFB66B]">

                  <Search size={18} />

                  Start Scanning

                </button>


                <button className="rounded-xl border border-white/30 bg-[#07111F]/60 px-7 py-4 font-bold text-white backdrop-blur-md transition hover:bg-white/10">

                  Learn More →

                </button>

              </div>


              {/* Features */}

              <div className="mt-9 flex flex-wrap gap-6 text-sm text-[#D0DAE3]">

                <div className="flex items-center gap-2">

                  <span className="text-[#32D583]">
                    ✓
                  </span>

                  AI Analysis

                </div>


                <div className="flex items-center gap-2">

                  <span className="text-[#32D583]">
                    ✓
                  </span>

                  Real-time Risk Score

                </div>


                <div className="flex items-center gap-2">

                  <span className="text-[#32D583]">
                    ✓
                  </span>

                  Threat Detection

                </div>

              </div>

            </div>


            {/* ================= RIGHT ================= */}

            <div className="relative">

              <div className="rounded-2xl border border-[#31516D] bg-[#07111F]/85 p-5 shadow-2xl backdrop-blur-md">


                {/* Card Header */}

                <div className="mb-5 flex items-center justify-between border-b border-[#1A344C] pb-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#102A43]">

                      <Shield
                        size={22}
                        className="text-[#42B9FF]"
                      />

                    </div>


                    <div>

                      <p className="font-bold">
                        Security Risk Score
                      </p>

                      <p className="text-xs text-[#607D94]">
                        AI Threat Analysis
                      </p>

                    </div>

                  </div>


                  <div className="flex items-center gap-2 text-xs text-[#32D583]">

                    <span className="h-2 w-2 rounded-full bg-[#32D583]" />

                    LIVE

                  </div>

                </div>


                {/* Score */}

                <div className="flex justify-center py-8">

                  <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-[14px] border-[#FF4D5E]/20">

                    <div className="absolute -inset-3 rounded-full border-[12px] border-transparent border-t-[#42B9FF] border-r-[#FF4D5E] rotate-[-35deg]" />

                    <div className="text-center">

                      <p className="text-6xl font-extrabold">
                        92
                      </p>

                      <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#FF4D5E]">
                        High Risk
                      </p>

                    </div>

                  </div>

                </div>


                {/* Risk boxes */}

                <div className="grid grid-cols-3 gap-3">

                  <RiskBox
                    value="09"
                    label="Critical"
                    type="red"
                  />

                  <RiskBox
                    value="17"
                    label="High Risk"
                    type="orange"
                  />

                  <RiskBox
                    value="28"
                    label="Suspicious"
                    type="blue"
                  />

                </div>

              </div>


              {/* Floating status */}

              <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-[#1B354E] bg-[#091624]/95 p-4 shadow-xl backdrop-blur-md sm:block">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B3028]">

                    <ShieldCheck
                      size={20}
                      className="text-[#32D583]"
                    />

                  </div>

                  <div>

                    <p className="text-xs text-[#607D94]">
                      AI Status
                    </p>

                    <p className="text-sm font-bold text-[#32D583]">
                      Detection Active
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            SECURITY OVERVIEW
        ================================================== */}

        <section className="bg-transparent px-5 py-10 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <div className="mb-6">

              <div className="flex items-center gap-2">

                <h2 className="text-2xl font-bold">
                  Security Overview
                </h2>

                <span className="rounded-md border border-[#174D6E] bg-[#0D2B40] px-2 py-1 text-[10px] font-bold uppercase text-[#42B9FF]">
                  Live
                </span>

              </div>

              <p className="mt-1 text-sm text-[#607D94]">
                Real-time phishing and scam monitoring
              </p>

            </div>


            {/* STAT CARDS */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <StatCard
                title="Total Scans"
                value="12,486"
                change="+18.4%"
                icon={<Target size={21} />}
                type="blue"
              />

              <StatCard
                title="Threats Detected"
                value="1,284"
                change="+12.7%"
                icon={<ShieldAlert size={21} />}
                type="red"
              />

              <StatCard
                title="Safe Content"
                value="10,742"
                change="+8.2%"
                icon={<ShieldCheck size={21} />}
                type="green"
              />

              <StatCard
                title="AI Accuracy"
                value="96.8%"
                change="+2.1%"
                icon={<Bot size={21} />}
                type="orange"
              />

            </div>


            {/* THREAT + RISK */}

            <div className="mt-5 grid gap-5 xl:grid-cols-3">

              <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90/90 xl:col-span-2">

                <PanelHeader
                  title="Top Threat Alerts"
                  icon={<AlertTriangle size={17} />}
                />

                <div className="p-4">

                  <ThreatRow
                    title="Phishing URL detected"
                    source="Suspicious domain"
                    severity="Critical"
                    time="1 min ago"
                    critical
                  />

                  <ThreatRow
                    title="Credential harvesting attempt"
                    source="Fake login page"
                    severity="Critical"
                    time="3 min ago"
                    critical
                  />

                  <ThreatRow
                    title="Suspicious payment message"
                    source="Financial scam"
                    severity="High"
                    time="7 min ago"
                  />

                  <ThreatRow
                    title="Malicious shortened URL"
                    source="Unknown redirect"
                    severity="High"
                    time="11 min ago"
                  />

                </div>

              </div>


              {/* RISK */}

              <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90">

                <PanelHeader
                  title="Security Risk Score"
                  icon={<Shield size={17} />}
                />

                <div className="p-5">

                  <div className="flex justify-center py-5">

                    <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[12px] border-[#FF4D5E]/20">

                      <div className="absolute -inset-3 rounded-full border-[12px] border-transparent border-t-[#42B9FF] border-r-[#FF4D5E] rotate-[-35deg]" />

                      <div className="text-center">

                        <p className="text-5xl font-extrabold">
                          92
                        </p>

                        <p className="text-xs uppercase tracking-widest text-[#FF4D5E]">
                          Critical
                        </p>

                      </div>

                    </div>

                  </div>


                  <div className="space-y-3">

                    <RiskItem
                      label="Critical Threats"
                      value="9"
                      color="red"
                    />

                    <RiskItem
                      label="High Risks"
                      value="17"
                      color="orange"
                    />

                    <RiskItem
                      label="Suspicious Items"
                      value="28"
                      color="yellow"
                    />

                  </div>

                </div>

              </div>

            </div>


            {/* DETECTION ACTIVITY */}

            <div className="mt-5 grid gap-5 xl:grid-cols-3">

              <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90 xl:col-span-2">

                <PanelHeader
                  title="Detection Activity"
                  icon={<BarChart3 size={17} />}
                />

                <div className="p-5">

                  <div className="mb-5 flex items-center justify-between">

                    <div>

                      <p className="text-2xl font-bold">
                        1,284
                      </p>

                      <p className="text-xs text-[#607D94]">
                        threats detected this month
                      </p>

                    </div>

                    <div className="rounded-md border border-[#145A47] bg-[#0C3027] px-2 py-1 text-xs font-semibold text-[#32D583]">
                      +14.8%
                    </div>

                  </div>


                  <div className="relative h-52 overflow-hidden rounded-lg border border-[#142C42] bg-[#081725]">

                    <div className="absolute inset-0 bg-[linear-gradient(#17344D_1px,transparent_1px),linear-gradient(90deg,#17344D_1px,transparent_1px)] bg-[size:60px_40px] opacity-40" />

                    <svg
                      viewBox="0 0 800 220"
                      className="absolute inset-0 h-full w-full"
                      preserveAspectRatio="none"
                    >

                      <path
                        d="M0 180 C80 165 90 140 150 155 S230 120 280 145 S350 100 410 125 S500 80 550 115 S650 70 700 90 S760 55 800 70"
                        fill="none"
                        stroke="#42B9FF"
                        strokeWidth="4"
                      />

                      <path
                        d="M0 195 C80 185 110 175 160 185 S240 155 300 175 S390 145 440 160 S530 125 590 150 S670 105 730 135 S770 110 800 120"
                        fill="none"
                        stroke="#FF4D5E"
                        strokeWidth="3"
                      />

                    </svg>


                    <div className="absolute bottom-3 left-4 right-4 flex justify-between text-[10px] text-[#526B82]">

                      <span>00:00</span>
                      <span>04:00</span>
                      <span>08:00</span>
                      <span>12:00</span>
                      <span>16:00</span>
                      <span>20:00</span>
                      <span>24:00</span>

                    </div>

                  </div>


                  <div className="mt-4 flex gap-5 text-xs">

                    <div className="flex items-center gap-2">

                      <span className="h-2 w-2 rounded-full bg-[#42B9FF]" />

                      Safe Scans

                    </div>


                    <div className="flex items-center gap-2">

                      <span className="h-2 w-2 rounded-full bg-[#FF4D5E]" />

                      Threats

                    </div>

                  </div>

                </div>

              </div>


              {/* RECENT SCANS */}

              <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90">

                <PanelHeader
                  title="Recent Scans"
                  icon={<Search size={17} />}
                />

                <div className="overflow-x-auto">

                  <table className="w-full text-left text-xs">

                    <thead className="border-b border-[#17344D] text-[#526B82]">

                      <tr>

                        <th className="px-4 py-3 font-medium">
                          TYPE
                        </th>

                        <th className="px-4 py-3 font-medium">
                          RISK
                        </th>

                        <th className="px-4 py-3 font-medium">
                          TIME
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      <RecentScan
                        type="Phishing URL"
                        risk="92"
                        time="1m"
                      />

                      <RecentScan
                        type="Scam Message"
                        risk="87"
                        time="3m"
                      />

                      <RecentScan
                        type="Safe URL"
                        risk="08"
                        time="5m"
                        safe
                      />

                      <RecentScan
                        type="Fake Login"
                        risk="96"
                        time="8m"
                      />

                      <RecentScan
                        type="Suspicious URL"
                        risk="74"
                        time="12m"
                      />

                    </tbody>

                  </table>

                </div>

              </div>

            </div>


            {/* BOTTOM CARDS */}

            <div className="mt-5 grid gap-5 lg:grid-cols-3">


              {/* THREAT DISTRIBUTION */}

              <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90">

                <PanelHeader
                  title="Threat Distribution"
                  icon={<BarChart3 size={17} />}
                />

                <div className="space-y-5 p-5">

                  <ProgressItem
                    label="Phishing URLs"
                    value="48%"
                    percentage={48}
                    color="bg-[#FF4D5E]"
                  />

                  <ProgressItem
                    label="Financial Scams"
                    value="27%"
                    percentage={27}
                    color="bg-[#FF9F43]"
                  />

                  <ProgressItem
                    label="Credential Theft"
                    value="16%"
                    percentage={16}
                    color="bg-[#42B9FF]"
                  />

                  <ProgressItem
                    label="Other Threats"
                    value="9%"
                    percentage={9}
                    color="bg-[#9B8AFB]"
                  />

                </div>

              </div>


              {/* AI ENGINE */}

              <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90">

                <PanelHeader
                  title="AI Detection Engine"
                  icon={<Bot size={17} />}
                />

                <div className="p-5">

                  <div className="rounded-xl border border-[#174D6E] bg-[#0A2437] p-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#103B59]">

                        <Bot
                          className="text-[#42B9FF]"
                          size={22}
                        />

                      </div>

                      <div>

                        <p className="font-bold">
                          Detection Model
                        </p>

                        <p className="text-xs text-[#607D94]">
                          Random Forest + NLP
                        </p>

                      </div>

                    </div>


                    <div className="mt-5 flex items-end justify-between">

                      <div>

                        <p className="text-3xl font-bold">
                          96.8%
                        </p>

                        <p className="text-xs text-[#607D94]">
                          Model accuracy
                        </p>

                      </div>


                      <span className="rounded-md bg-[#0B382B] px-2 py-1 text-xs font-bold text-[#32D583]">
                        ONLINE
                      </span>

                    </div>

                  </div>


                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <MiniStat
                      label="Scans/min"
                      value="42"
                    />

                    <MiniStat
                      label="Response"
                      value="82ms"
                    />

                  </div>

                </div>

              </div>


              {/* PROTECTION */}

              <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90">

                <PanelHeader
                  title="Protection Status"
                  icon={<Lock size={17} />}
                />

                <div className="space-y-3 p-5">

                  <ProtectionItem
                    icon={<Globe size={17} />}
                    title="URL Scanner"
                    status="Active"
                  />

                  <ProtectionItem
                    icon={<MessageSquareWarning size={17} />}
                    title="Message Analyzer"
                    status="Active"
                  />

                  <ProtectionItem
                    icon={<Bot size={17} />}
                    title="AI Detection"
                    status="Active"
                  />

                  <ProtectionItem
                    icon={<Shield size={17} />}
                    title="Threat Database"
                    status="Updated"
                  />

                </div>

              </div>

            </div>


            {/* FOOTER */}

            <footer className="mt-8 flex flex-col justify-between gap-3 border-t border-[#172D44] pt-6 text-xs text-[#526B82] md:flex-row">

              <p>
                © 2026 ScamShield AI
              </p>

              <p>
                AI-powered phishing & scam detection system
              </p>

              <div className="flex gap-4">

                <span className="cursor-pointer hover:text-white">
                  Privacy
                </span>

                <span className="cursor-pointer hover:text-white">
                  Security
                </span>

                <span className="cursor-pointer hover:text-white">
                  Help
                </span>

              </div>

            </footer>

          </div>

        </section>

      </main>

    </div>
  );
}


/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({ icon, text, active = false,onClick }) {

  return (

    <div
    onClick={onClick}
      className={`mb-1 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
        active
          ? "border border-[#174D6E] bg-[#0D2B40] text-[#42B9FF]"
          : "text-[#7891A6] hover:bg-[#0D2133] hover:text-white"
      }`}
    >

      {icon}

      <span>
        {text}
      </span>

    </div>

  );

}


/* =========================================================
   MOBILE NAV
========================================================= */

function MobileNav({ icon, text }) {

  return (

    <div className="flex items-center gap-3 rounded-lg bg-[#0D2133] p-4 text-[#B5C7D6]">

      {icon}

      {text}

    </div>

  );

}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  change,
  icon,
  type,
}) {

  const styles = {

    blue: {
      icon: "bg-[#0D2B40] text-[#42B9FF]",
      change: "text-[#42B9FF]",
    },

    red: {
      icon: "bg-[#3A1720] text-[#FF4D5E]",
      change: "text-[#FF6B78]",
    },

    green: {
      icon: "bg-[#0B3028] text-[#32D583]",
      change: "text-[#32D583]",
    },

    orange: {
      icon: "bg-[#392514] text-[#FF9F43]",
      change: "text-[#FF9F43]",
    },

  };


  return (

    <div className="rounded-xl border border-[#1A344C] bg-[#0B1B2B]/90 p-5 transition hover:border-[#31516D]">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs text-[#607D94]">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {value}
          </p>

        </div>


        <div
          className={`rounded-lg p-2.5 ${styles[type].icon}`}
        >
          {icon}
        </div>

      </div>


      <p
        className={`mt-4 text-xs font-semibold ${styles[type].change}`}
      >

        {change}

        <span className="font-normal text-[#526B82]">
          {" "}vs last month
        </span>

      </p>

    </div>

  );

}


/* =========================================================
   PANEL HEADER
========================================================= */

function PanelHeader({ title, icon }) {

  return (

    <div className="flex items-center justify-between border-b border-[#17344D] px-5 py-4">

      <div className="flex items-center gap-2">

        <span className="text-[#42B9FF]">
          {icon}
        </span>

        <h3 className="text-sm font-bold">
          {title}
        </h3>

      </div>


      <button className="text-xs text-[#526B82] hover:text-white">
        ⋮
      </button>

    </div>

  );

}


/* =========================================================
   THREAT ROW
========================================================= */

function ThreatRow({
  title,
  source,
  severity,
  time,
  critical = false,
}) {

  return (

    <div className="mb-2 flex items-center gap-3 rounded-lg border border-[#17344D] bg-[#0D2133] p-3">

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          critical
            ? "bg-[#3A1720] text-[#FF4D5E]"
            : "bg-[#392514] text-[#FF9F43]"
        }`}
      >

        <AlertTriangle size={17} />

      </div>


      <div className="min-w-0 flex-1">

        <p className="truncate text-sm font-semibold">
          {title}
        </p>

        <p className="mt-1 truncate text-[11px] text-[#607D94]">
          {source}
        </p>

      </div>


      <div className="hidden text-right sm:block">

        <p
          className={`text-xs font-bold ${
            critical
              ? "text-[#FF4D5E]"
              : "text-[#FF9F43]"
          }`}
        >
          {severity}
        </p>

        <p className="mt-1 text-[10px] text-[#526B82]">
          {time}
        </p>

      </div>

    </div>

  );

}


/* =========================================================
   RISK ITEM
========================================================= */

function RiskItem({
  label,
  value,
  color,
}) {

  const colors = {

    red: "bg-[#FF4D5E]",

    orange: "bg-[#FF9F43]",

    yellow: "bg-[#FFD166]",

  };


  return (

    <div className="flex items-center justify-between">

      <div className="flex items-center gap-2">

        <span
          className={`h-2 w-2 rounded-full ${colors[color]}`}
        />

        <span className="text-xs text-[#8BA0B2]">
          {label}
        </span>

      </div>


      <span className="text-sm font-bold">
        {value}
      </span>

    </div>

  );

}


/* =========================================================
   RISK BOX
========================================================= */

function RiskBox({
  value,
  label,
  type,
}) {

  const styles = {

    red: {
      box: "border-[#3A1720] bg-[#24131A]",
      text: "text-[#FF4D5E]",
    },

    orange: {
      box: "border-[#49351E] bg-[#241B12]",
      text: "text-[#FF9F43]",
    },

    blue: {
      box: "border-[#174D6E] bg-[#0D2638]",
      text: "text-[#42B9FF]",
    },

  };


  return (

    <div
      className={`rounded-lg border p-3 text-center ${styles[type].box}`}
    >

      <p
        className={`text-lg font-bold ${styles[type].text}`}
      >
        {value}
      </p>

      <p className="text-[10px] text-[#8094A5]">
        {label}
      </p>

    </div>

  );

}


/* =========================================================
   RECENT SCAN
========================================================= */

function RecentScan({
  type,
  risk,
  time,
  safe = false,
}) {

  return (

    <tr className="border-b border-[#142C42]">

      <td className="px-4 py-3">

        <div className="flex items-center gap-2">

          <span
            className={`h-1.5 w-1.5 rounded-full ${
              safe
                ? "bg-[#32D583]"
                : "bg-[#FF4D5E]"
            }`}
          />

          <span className="whitespace-nowrap">
            {type}
          </span>

        </div>

      </td>


      <td
        className={`px-4 py-3 font-bold ${
          safe
            ? "text-[#32D583]"
            : "text-[#FF4D5E]"
        }`}
      >
        {risk}
      </td>


      <td className="px-4 py-3 text-[#607D94]">
        {time}
      </td>

    </tr>

  );

}


/* =========================================================
   PROGRESS ITEM
========================================================= */

function ProgressItem({
  label,
  value,
  percentage,
  color,
}) {

  return (

    <div>

      <div className="mb-2 flex justify-between text-xs">

        <span className="text-[#8BA0B2]">
          {label}
        </span>

        <span className="font-bold">
          {value}
        </span>

      </div>


      <div className="h-2 overflow-hidden rounded-full bg-[#142C42]">

        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>

  );

}


/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  label,
  value,
}) {

  return (

    <div className="rounded-lg border border-[#17344D] bg-[#081725] p-3">

      <p className="text-[10px] uppercase tracking-wide text-[#526B82]">
        {label}
      </p>

      <p className="mt-1 font-bold">
        {value}
      </p>

    </div>

  );

}


/* =========================================================
   PROTECTION ITEM
========================================================= */

function ProtectionItem({
  icon,
  title,
  status,
}) {

  return (

    <div className="flex items-center justify-between rounded-lg border border-[#17344D] bg-[#081725] p-3">

      <div className="flex items-center gap-3">

        <div className="text-[#42B9FF]">
          {icon}
        </div>

        <span className="text-xs font-medium">
          {title}
        </span>

      </div>


      <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#32D583]">

        <span className="h-1.5 w-1.5 rounded-full bg-[#32D583]" />

        {status}

      </span>

    </div>

  );

}


export default Home;