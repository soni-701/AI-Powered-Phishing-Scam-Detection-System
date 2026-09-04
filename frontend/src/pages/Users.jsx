import { useEffect, useMemo, useState } from "react";
import {
//   Activity,
  CheckCircle,
  Clock,
  Search,
  Shield,
  UserCheck,
  Users as UsersIcon,
  UserX,
} from "lucide-react";

const usersData = [
  {
    id: "USR-001",
    name: "Admin User",
    email: "admin@scamshield.ai",
    role: "Admin",
    status: "Active",
    lastActive: "Just now",
  },
  {
    id: "USR-002",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    role: "Analyst",
    status: "Active",
    lastActive: "5 min ago",
  },
  {
    id: "USR-003",
    name: "Priya Singh",
    email: "priya@example.com",
    role: "Analyst",
    status: "Active",
    lastActive: "18 min ago",
  },
  {
    id: "USR-004",
    name: "Aman Verma",
    email: "aman@example.com",
    role: "User",
    status: "Inactive",
    lastActive: "2 hours ago",
  },
  {
    id: "USR-005",
    name: "Neha Gupta",
    email: "neha@example.com",
    role: "User",
    status: "Active",
    lastActive: "35 min ago",
  },
  {
    id: "USR-006",
    name: "Vikash Kumar",
    email: "vikash@example.com",
    role: "User",
    status: "Inactive",
    lastActive: "Yesterday",
  },
];

function Users() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  useEffect(() => {
    const tableContainer = document.getElementById("users-table-scroll");

    if (!tableContainer) return;

    const handleScroll = () => {
      if (tableContainer.scrollLeft > 10) {
        setShowSwipeHint(false);
      }
    };

    tableContainer.addEventListener("scroll", handleScroll);

    return () => {
      tableContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const filteredUsers = useMemo(() => {
    return usersData.filter((user) => {
      const query = search.toLowerCase();

      const matchesSearch =
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        user.status === statusFilter;

      const matchesRole =
        roleFilter === "All" ||
        user.role === roleFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRole
      );
    });
  }, [search, statusFilter, roleFilter]);

  const totalUsers = usersData.length;

  const activeUsers = usersData.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveUsers = usersData.filter(
    (user) => user.status === "Inactive"
  ).length;

  const admins = usersData.filter(
    (user) => user.role === "Admin"
  ).length;

  return (
    <div className="min-h-screen bg-transparent text-white">

      <div className="mx-auto max-w-7xl px-3 py-5 sm:px-5 sm:py-8 lg:px-8">

        {/* HEADER */}

        <div className="mb-6 sm:mb-8">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#174D6E] bg-[#0D2B40] sm:h-12 sm:w-12">
              <UsersIcon
                size={20}
                className="text-[#42B9FF] sm:h-6 sm:w-6"
              />
            </div>

            <div>

              <h1 className="text-2xl font-bold sm:text-3xl">
                Users
              </h1>

              <p className="mt-1 text-xs leading-5 text-[#607D94] sm:text-sm">
                Manage users and access to the security platform
              </p>

            </div>

          </div>

        </div>


        {/* SUMMARY CARDS */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <UserSummary
            title="Total Users"
            value={totalUsers}
            icon={<UsersIcon size={20} />}
            type="blue"
          />

          <UserSummary
            title="Active Users"
            value={activeUsers}
            icon={<UserCheck size={20} />}
            type="green"
          />

          <UserSummary
            title="Inactive Users"
            value={inactiveUsers}
            icon={<UserX size={20} />}
            type="orange"
          />

          <UserSummary
            title="Administrators"
            value={admins}
            icon={<Shield size={20} />}
            type="red"
          />

        </div>


        {/* USERS TABLE */}

        <div className="mt-6 rounded-2xl border border-[#1A344C] bg-[#0B1B2B]/90">

          {/* FILTER BAR */}

          <div className="flex flex-col gap-3 border-b border-[#17344D] p-4 sm:gap-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">

            {/* SEARCH */}

            <div className="relative w-full xl:max-w-md">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#607D94]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full rounded-xl border border-[#25445D] bg-[#081725] py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-[#42B9FF]"
              />

            </div>


            {/* FILTERS */}

            <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-row">

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full rounded-xl border border-[#25445D] bg-[#081725] px-4 py-3 text-sm text-[#C4D0DB] outline-none focus:border-[#42B9FF] sm:w-auto"
              >

                <option value="All">
                  All Roles
                </option>

                <option value="Admin">
                  Admin
                </option>

                <option value="Analyst">
                  Analyst
                </option>

                <option value="User">
                  User
                </option>

              </select>


              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full rounded-xl border border-[#25445D] bg-[#081725] px-4 py-3 text-sm text-[#C4D0DB] outline-none focus:border-[#42B9FF] sm:w-auto"
              >

                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

          </div>


          {/* TABLE */}

          <div
            id="users-table-scroll"
            className="relative overflow-x-auto"
          >

            {showSwipeHint && (
              <div className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 lg:hidden">
                <div className="rounded-full border border-[#25445D] bg-[#081725]/95 px-3 py-2 text-[10px] font-bold text-[#42B9FF] shadow-lg">
                  Swipe →
                </div>
              </div>
            )}

            <div className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-12 bg-gradient-to-l from-[#0B1B2B] to-transparent lg:hidden" />

            <table className="w-full min-w-[900px]">

              <thead>

                <tr className="border-b border-[#17344D] text-left">

                  <th className="px-5 py-4 text-xs font-semibold text-[#607D94]">
                    USER
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold text-[#607D94]">
                    ROLE
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold text-[#607D94]">
                    STATUS
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold text-[#607D94]">
                    LAST ACTIVE
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold text-[#607D94]">
                    ACTION
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredUsers.map((user) => (

                  <tr
                    key={user.id}
                    className="border-b border-[#142C42] transition hover:bg-[#102236]"
                  >

                    {/* USER */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#25445D] bg-[#102A43] font-bold text-[#42B9FF]">
                          {user.name.charAt(0)}
                        </div>

                        <div>

                          <p className="text-sm font-bold">
                            {user.name}
                          </p>

                          <p className="mt-1 text-xs text-[#607D94]">
                            {user.email}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* ROLE */}

                    <td className="px-5 py-4">

                      <RoleBadge role={user.role} />

                    </td>


                    {/* STATUS */}

                    <td className="px-5 py-4">

                      <StatusBadge status={user.status} />

                    </td>


                    {/* LAST ACTIVE */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2 text-xs text-[#607D94]">

                        <Clock size={14} />

                        {user.lastActive}

                      </div>

                    </td>


                    {/* ACTION */}

                    <td className="px-5 py-4">

                      <button
                        onClick={() => setSelectedUser(user)}
                        className="rounded-lg border border-[#25445D] px-4 py-2 text-xs font-semibold text-[#A7BAC9] transition hover:border-[#42B9FF] hover:bg-[#102A43] hover:text-white"
                      >
                        View Profile
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>


            {/* EMPTY */}

            {filteredUsers.length === 0 && (

              <div className="p-12 text-center">

                <Search
                  size={30}
                  className="mx-auto mb-3 text-[#526B82]"
                />

                <p className="font-semibold">
                  No users found
                </p>

                <p className="mt-1 text-xs text-[#607D94]">
                  Try another search or filter.
                </p>

              </div>

            )}

          </div>

        </div>


        {/* SECURITY NOTICE */}

        <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#174D6E] bg-[#0D2B40]/80 p-4">

          <Shield
            size={18}
            className="shrink-0 text-[#42B9FF]"
          />

          <p className="text-xs leading-5 text-[#8BA0B2]">

            User management and permissions will be connected
            to the backend authentication system later.

          </p>

        </div>

      </div>


      {/* USER PROFILE MODAL */}

      {selectedUser && (

        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-3 sm:p-5">

          <div className="my-3 w-full max-w-md rounded-2xl border border-[#25445D] bg-[#091624] shadow-2xl sm:my-5">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-[#17344D] p-4 sm:p-5">

              <div>

                <p className="text-xs text-[#607D94]">
                  User Profile
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  {selectedUser.name}
                </h2>

              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg px-3 py-2 text-[#607D94] hover:bg-[#102A43] hover:text-white"
              >
                ✕
              </button>

            </div>


            {/* PROFILE */}

            <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-5">

              <div className="mb-6 flex flex-col items-center">

                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#25445D] bg-[#102A43] text-3xl font-bold text-[#42B9FF]">
                  {selectedUser.name.charAt(0)}
                </div>

                <h3 className="mt-3 text-lg font-bold">
                  {selectedUser.name}
                </h3>

                <p className="text-xs text-[#607D94]">
                  {selectedUser.email}
                </p>

              </div>


              <div className="space-y-4">

                <ProfileRow
                  label="User ID"
                  value={selectedUser.id}
                />

                <ProfileRow
                  label="Role"
                  value={selectedUser.role}
                />

                <ProfileRow
                  label="Status"
                  value={selectedUser.status}
                />

                <ProfileRow
                  label="Last Active"
                  value={selectedUser.lastActive}
                />

              </div>

            </div>


            {/* CLOSE */}

            <div className="border-t border-[#17344D] p-4 sm:p-5">

              <button
                onClick={() => setSelectedUser(null)}
                className="w-full rounded-xl bg-[#FF9F43] py-3 font-bold text-[#17100A] hover:bg-[#FFB66B]"
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


/* =========================================================
   USER SUMMARY
========================================================= */

function UserSummary({
  title,
  value,
  icon,
  type,
}) {

  const styles = {

    blue: "bg-[#0D2B40] text-[#42B9FF]",

    green: "bg-[#0B3028] text-[#32D583]",

    orange: "bg-[#392514] text-[#FF9F43]",

    red: "bg-[#3A1720] text-[#FF4D5E]",

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

        <div className={`rounded-lg p-3 ${styles[type]}`}>
          {icon}
        </div>

      </div>

    </div>

  );
}


/* =========================================================
   ROLE BADGE
========================================================= */

function RoleBadge({ role }) {

  if (role === "Admin") {

    return (
      <span className="rounded-lg bg-[#3A1720] px-3 py-1.5 text-xs font-bold text-[#FF4D5E]">
        Admin
      </span>
    );

  }

  if (role === "Analyst") {

    return (
      <span className="rounded-lg bg-[#0D2B40] px-3 py-1.5 text-xs font-bold text-[#42B9FF]">
        Analyst
      </span>
    );

  }

  return (
    <span className="rounded-lg bg-[#142C42] px-3 py-1.5 text-xs font-bold text-[#A7BAC9]">
      User
    </span>
  );

}


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {

  if (status === "Active") {

    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B3028] px-3 py-1.5 text-xs font-bold text-[#32D583]">
        <CheckCircle size={13} />
        Active
      </span>
    );

  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#392514] px-3 py-1.5 text-xs font-bold text-[#FF9F43]">
      <Clock size={13} />
      Inactive
    </span>
  );

}


/* =========================================================
   PROFILE ROW
========================================================= */

function ProfileRow({ label, value }) {

  return (

    <div>

      <p className="mb-1 text-xs text-[#607D94]">
        {label}
      </p>

      <div className="rounded-lg border border-[#17344D] bg-[#081725] p-3 text-sm text-[#C4D0DB]">
        {value}
      </div>

    </div>

  );

}


export default Users;