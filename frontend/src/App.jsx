import { useCallback, useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import ApplyLeave from "./pages/ApplyLeave.jsx";
import MyLeaves from "./pages/MyLeaves.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

const USER_STORAGE_KEY = "leaveEaseUser";

function readStoredUser() {
  try {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

function normalizeRole(user) {
  return String(user?.role ?? "EMPLOYEE")
    .replace(/^ROLE_/i, "")
    .toUpperCase();
}

function dashboardFor(user) {
  return normalizeRole(user) === "ADMIN" ? "/admin" : "/dashboard";
}

function GuestOnly({ user, children }) {
  if (user) {
    return <Navigate to={dashboardFor(user)} replace />;
  }

  return children;
}

function RequireAuth({ user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function RequireAdmin({ user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (normalizeRole(user) !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

function MainLayout({ user, onLogout }) {
  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={onLogout} />

      <div className="mx-auto flex w-full max-w-[1600px]">
        <Sidebar user={user} />

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEmployees() {
      try {
        const response = await fetch("/api/users");

        if (!response.ok) {
          throw new Error("Unable to load employees.");
        }

        const data = await response.json();

        if (active) {
          setEmployees(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load employees.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEmployees();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="page-enter mx-auto max-w-6xl">
      <div className="mb-6">
        <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Administration
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Employees
        </h1>

        <p className="mt-2 text-slate-500">
          View registered employees in LeaveEase.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading employees...
          </div>
        ) : error ? (
          <div role="alert" className="p-8 text-center text-red-600">
            {error}
          </div>
        ) : employees.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No employees found.
          </div>
        ) : (
          <>
            <div className="border-b border-slate-100 px-5 py-4">
              <p className="font-semibold text-slate-800">
                Registered employees
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {employees.length} account
                {employees.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3">Role</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {employees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="transition-colors hover:bg-indigo-50/40"
                    >
                      <td className="px-5 py-4 font-medium text-slate-800">
                        {employee.name || "—"}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {employee.email || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                          {normalizeRole(employee)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function AppRoutes({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogin = useCallback(
    (loggedInUser) => {
      setUser(loggedInUser);
    },
    [setUser]
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem("leaveEaseToken");
    localStorage.removeItem("token");

    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate, setUser]);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestOnly user={user}>
            <Login onLogin={handleLogin} />
          </GuestOnly>
        }
      />

      <Route
        path="/register"
        element={
          <GuestOnly user={user}>
            <Register />
          </GuestOnly>
        }
      />

      <Route element={<RequireAuth user={user} />}>
        <Route element={<MainLayout user={user} onLogout={handleLogout} />}>
          <Route
            path="/dashboard"
            element={
              normalizeRole(user) === "ADMIN" ? (
                <Navigate to="/admin" replace />
              ) : (
                <EmployeeDashboard userProp={user} />
              )
            }
          />

          <Route
            path="/apply-leave"
            element={<ApplyLeave userProp={user} />}
          />

          <Route
            path="/my-leaves"
            element={<MyLeaves userProp={user} />}
          />
        </Route>
      </Route>

      <Route element={<RequireAdmin user={user} />}>
        <Route element={<MainLayout user={user} onLogout={handleLogout} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/employees" element={<EmployeesPage />} />
        </Route>
      </Route>

      <Route
        path="/"
        element={
          <Navigate
            to={user ? dashboardFor(user) : "/login"}
            replace
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to={user ? dashboardFor(user) : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}

export default function App() {
  const [user, setUser] = useState(readStoredUser);

  return <AppRoutes user={user} setUser={setUser} />;
}