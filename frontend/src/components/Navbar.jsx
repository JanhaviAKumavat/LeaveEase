import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  LayoutDashboard,
  FileText,
  CalendarPlus,
  Users,
  Menu,
  X,
  LogOut,
  UserRound,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("leaveEaseUser");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const getRole = (user) =>
  String(user?.role || "EMPLOYEE")
    .replace(/^ROLE_/i, "")
    .toUpperCase();

const getInitials = (name) => {
  if (!name) return "U";

  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const employeeLinks = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Apply Leave",
    to: "/apply-leave",
    icon: CalendarPlus,
  },
  {
    label: "My Leaves",
    to: "/my-leaves",
    icon: FileText,
  },
];

const adminLinks = [
  {
    label: "Admin Dashboard",
    to: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Employees",
    to: "/admin/employees",
    icon: Users,
  },
];

export default function Navbar({ user: userProp, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => userProp ?? getStoredUser());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    setUser(userProp ?? getStoredUser());
  }, [userProp]);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const role = getRole(user);
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";
  const links = isAdmin ? adminLinks : employeeLinks;

  const displayName = user?.name || user?.fullName || "User";
  const email = user?.email || "";
  const initials = getInitials(displayName);

  const handleLogout = () => {
    setMobileOpen(false);
    setProfileOpen(false);

    localStorage.removeItem("leaveEaseUser");
    localStorage.removeItem("leaveEaseToken");
    localStorage.removeItem("token");

    setUser(null);

    if (typeof onLogout === "function") {
      onLogout();
    } else {
      navigate("/login", { replace: true });
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-medium transition duration-200 ${
      isActive
        ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
        : "text-slate-700 hover:bg-white/70 hover:text-violet-700"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/55 shadow-sm shadow-violet-900/5 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          to={isAdmin ? "/admin" : "/dashboard"}
          onClick={() => setMobileOpen(false)}
          className="group flex shrink-0 items-center gap-3"
          aria-label="LeaveEase home"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20 transition duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <CalendarDays size={23} strokeWidth={2.2} />
          </div>

          <div>
            <span className="block text-xl font-extrabold tracking-tight text-slate-900">
              Leave<span className="text-violet-600">Ease</span>
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:block">
              Leave management
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        {user && (
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map(({ label, to, icon: Icon }) => (
              <NavLink key={to} to={to} className={navLinkClass}>
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Right section */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {/* Role badge */}
              <div className="hidden items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 sm:flex">
                <ShieldCheck size={15} />
                {isAdmin ? "Administrator" : "Employee"}
              </div>

              {/* Profile dropdown */}
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  aria-expanded={profileOpen}
                  aria-label="Open profile menu"
                  className="flex items-center gap-2 rounded-2xl border border-transparent p-1.5 pr-2.5 transition hover:border-slate-200 hover:bg-slate-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
                    {initials}
                  </div>

                  <div className="hidden max-w-32 text-left xl:block">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {displayName}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {email || (isAdmin ? "Administrator" : "Employee")}
                    </p>
                  </div>

                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close profile menu"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setProfileOpen(false)}
                    />

                    <div className="absolute right-0 top-full z-50 mt-3 w-72 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                      <div className="border-b border-slate-100 px-3 py-3">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {displayName}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {email}
                        </p>
                        <span className="mt-2 inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
                          {isAdmin ? "Administrator" : "Employee"}
                        </span>
                      </div>

                      <div className="p-1">
                        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600">
                          <UserRound
                            size={17}
                            className="text-slate-400"
                          />
                          <span className="break-all">
                            Signed in as {displayName}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                        >
                          <LogOut size={17} />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileOpen((open) => !open)}
                aria-label={
                  mobileOpen ? "Close navigation" : "Open navigation"
                }
                aria-expanded={mobileOpen}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
              >
                {mobileOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-600/30 transition hover:bg-violet-700"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      {user && mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pb-5 pt-3 shadow-lg sm:px-6 lg:hidden">
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">
                {displayName}
              </p>
              <p className="truncate text-xs text-slate-500">
                {email || (isAdmin ? "Administrator" : "Employee")}
              </p>
            </div>

            <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold text-violet-700">
              {isAdmin ? "ADMIN" : "EMPLOYEE"}
            </span>
          </div>

          <nav className="space-y-1">
            {links.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}