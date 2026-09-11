import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  ChevronDown,
  Clock,
  Search,
  Shield,
  UserCheck,
  Users as UsersIcon,
  UserX,
  X,
} from "lucide-react";

function Users({ onNavigate }) {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch users.");
        }

        const formattedUsers = data.users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: "User",
          status: "Active",
          lastActive: user.updatedAt
            ? new Date(user.updatedAt).toLocaleString()
            : "Not available",
        }));

        setUsersData(formattedUsers);
      } catch (err) {
        console.error("Users fetch error:", err);
        setError(err.message || "Unable to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return usersData.filter((user) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [search, statusFilter, roleFilter, usersData]);

  const totalUsers = usersData.length;
  const activeUsers = usersData.filter((user) => user.status === "Active").length;
  const inactiveUsers = usersData.filter(
    (user) => user.status === "Inactive"
  ).length;
  const admins = usersData.filter((user) => user.role === "Admin").length;

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
      <header className="sticky top-0 z-40 border-b border-[#DAD9D4] bg-[#FFFFFF]/95 backdrop-blur">
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
                  id === "users"
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
        {/* PAGE INTRO */}
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
                <UsersIcon size={22} className="text-[#434341]" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7A7972]">
                  Administration
                </p>
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Users
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B6B66]">
                  Manage registered users and review access activity across the
                  security platform.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#D4D1C9] bg-white px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#85847D]">
              Filtered
            </p>
            <p className="mt-1 text-lg font-extrabold">
              {filteredUsers.length}{" "}
              <span className="text-sm font-semibold text-[#7A7972]">
                of {totalUsers} users
              </span>
            </p>
          </div>
        </section>

        {/* SUMMARY CARDS */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <UserSummary
            title="Total Users"
            value={totalUsers}
            icon={<UsersIcon size={20} />}
            tone="charcoal"
          />
          <UserSummary
            title="Active Users"
            value={activeUsers}
            icon={<UserCheck size={20} />}
            tone="green"
          />
          <UserSummary
            title="Inactive Users"
            value={inactiveUsers}
            icon={<UserX size={20} />}
            tone="warm"
          />
          <UserSummary
            title="Administrators"
            value={admins}
            icon={<Shield size={20} />}
            tone="charcoal"
          />
        </section>

        {/* USERS PANEL */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-[#D4D1C9] bg-white shadow-[0_12px_35px_rgba(47,48,47,0.05)]">
          {/* FILTER BAR */}
          <div className="border-b border-[#E1DFDA] p-4 sm:p-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-extrabold">All Users</h2>
                <p className="mt-1 text-xs text-[#76766F]">
                  Search by name, email, or user ID.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
                <div className="relative w-full sm:min-w-[280px]">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#92928A]"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full rounded-xl border border-[#D5D2CA] bg-white py-3 pl-11 pr-4 text-sm font-medium !text-[#343532] caret-[#2F7D5A] outline-none transition placeholder:text-[#9A9A92] focus:border-[#8E8C85] selection:bg-[#DCEBE1] selection:text-[#343532]"
                    style={{
                      color: "#343532",
                      WebkitTextFillColor: "#343532",
                    }}
                  />
                </div>

                <FilterSelect
                  value={roleFilter}
                  onChange={setRoleFilter}
                  options={["All", "Admin", "Analyst", "User"]}
                  labels={{
                    All: "All Roles",
                    Admin: "Admin",
                    Analyst: "Analyst",
                    User: "User",
                  }}
                />

                <FilterSelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={["All", "Active", "Inactive"]}
                  labels={{
                    All: "All Status",
                    Active: "Active",
                    Inactive: "Inactive",
                  }}
                />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div id="users-table-scroll" className="relative overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead>
                <tr className="border-b border-[#E7E5E0] bg-[#FAF9F7] text-left">
                  <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#85847D]">
                    User
                  </th>
                  <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#85847D]">
                    Role
                  </th>
                  <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#85847D]">
                    Status
                  </th>
                  <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#85847D]">
                    Last Active
                  </th>
                  <th className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#85847D]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="5" className="px-5 py-12 text-center">
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#706F68]">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-[#2F7D5A]" />
                        Loading users...
                      </div>
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan="5" className="px-5 py-12 text-center">
                      <div className="mx-auto max-w-md rounded-2xl border border-[#E8C9C9] bg-[#FFF7F7] px-5 py-4 text-sm font-semibold text-[#A84C4C]">
                        {error}
                      </div>
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-[#ECEAE5] transition hover:bg-[#FCFBF8]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F0EFEB] text-sm font-extrabold text-[#434341]">
                            {user.name.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-extrabold text-[#343532]">
                              {user.name}
                            </p>
                            <p className="mt-1 truncate text-xs text-[#7C7B74]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <RoleBadge role={user.role} />
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={user.status} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-[#77766F]">
                          <Clock size={14} />
                          {user.lastActive}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="rounded-xl border border-[#D3D0C8] bg-white px-4 py-2 text-xs font-bold text-[#434341] transition hover:border-[#9F9D95] hover:bg-[#F4F2ED]"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {!loading && !error && filteredUsers.length === 0 && (
              <div className="px-6 py-14 text-center">
                <Search size={30} className="mx-auto text-[#A2A19A]" />
                <p className="mt-3 font-extrabold">No users found</p>
                <p className="mt-1 text-xs text-[#7C7B74]">
                  Try another search term or filter.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* SECURITY NOTICE */}
        <section className="mt-5 flex items-start gap-3 rounded-2xl border border-[#CCDCD3] bg-[#F5F8F5] p-4">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
            <Shield size={17} className="text-[#2F7D5A]" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-[#343532]">
              Protected user data
            </p>
            <p className="mt-1 text-xs leading-5 text-[#6F7069]">
              User records are loaded from the protected backend endpoint and
              can only be viewed from an authenticated session.
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

      {/* USER PROFILE MODAL */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#22231F]/45 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedUser(null);
          }}
        >
          <div className="max-h-[88vh] w-full max-w-lg overflow-hidden rounded-3xl border border-[#D4D1C9] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E3DE] p-5">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#87867F]">
                  User Profile
                </p>
                <h2 className="mt-1 text-xl font-extrabold text-[#343532]">
                  {selectedUser.name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#79786F] transition hover:bg-[#F0EFEB] hover:text-[#343532]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[62vh] overflow-y-auto p-5">
              <div className="rounded-2xl bg-[#F7F6F2] p-5 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-extrabold text-[#434341] shadow-sm">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>

                <h3 className="mt-3 text-lg font-extrabold text-[#343532]">
                  {selectedUser.name}
                </h3>

                <p className="mt-1 text-xs text-[#77766F]">
                  {selectedUser.email}
                </p>

                <div className="mt-4 flex justify-center gap-2">
                  <RoleBadge role={selectedUser.role} />
                  <StatusBadge status={selectedUser.status} />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <ProfileRow label="User ID" value={selectedUser.id} />
                <ProfileRow label="Role" value={selectedUser.role} />
                <ProfileRow label="Status" value={selectedUser.status} />
                <ProfileRow
                  label="Last Active"
                  value={selectedUser.lastActive}
                />
              </div>
            </div>

            <div className="border-t border-[#E5E3DE] p-5">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full rounded-xl bg-[#434341] py-3 text-sm font-extrabold text-white transition hover:bg-[#343532]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSelect({ value, onChange, options, labels }) {
  return (
    <div className="relative w-full sm:w-auto">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-[#D5D2CA] bg-white px-4 py-3 pr-10 text-sm font-semibold !text-[#4B4B46] outline-none transition focus:border-[#8E8C85] sm:w-auto"
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

function UserSummary({ title, value, icon, tone }) {
  const toneStyles = {
    charcoal: {
      icon: "bg-[#F0EFEB] text-[#434341]",
      value: "text-[#343532]",
    },
    green: {
      icon: "bg-[#EAF4EE] text-[#2F7D5A]",
      value: "text-[#2F7D5A]",
    },
    warm: {
      icon: "bg-[#F2EDE6] text-[#8A7358]",
      value: "text-[#665846]",
    },
  };

  const styles = toneStyles[tone] || toneStyles.charcoal;

  return (
    <div className="rounded-2xl border border-[#D4D1C9] bg-white p-5 shadow-[0_8px_25px_rgba(47,48,47,0.035)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#85847D]">
            {title}
          </p>
          <p className={`mt-2 text-3xl font-extrabold ${styles.value}`}>
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${styles.icon}`}>{icon}</div>
      </div>
    </div>
  );
}

function RoleBadge({ role }) {
  if (role === "Admin") {
    return (
      <span className="rounded-lg bg-[#F1E7E6] px-3 py-1.5 text-xs font-extrabold text-[#8B4D47]">
        Admin
      </span>
    );
  }

  if (role === "Analyst") {
    return (
      <span className="rounded-lg bg-[#E9EFED] px-3 py-1.5 text-xs font-extrabold text-[#46655A]">
        Analyst
      </span>
    );
  }

  return (
    <span className="rounded-lg bg-[#F0EFEB] px-3 py-1.5 text-xs font-extrabold text-[#64645D]">
      User
    </span>
  );
}

function StatusBadge({ status }) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#EAF4EE] px-3 py-1.5 text-xs font-extrabold text-[#2F7D5A]">
        <CheckCircle size={13} />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F2EDE6] px-3 py-1.5 text-xs font-extrabold text-[#8A7358]">
      <Clock size={13} />
      Inactive
    </span>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#85847D]">
        {label}
      </p>
      <div className="rounded-xl border border-[#DEDCD6] bg-[#FAF9F7] p-3.5 text-sm font-semibold text-[#4B4B46]">
        {value}
      </div>
    </div>
  );
}

export default Users;
