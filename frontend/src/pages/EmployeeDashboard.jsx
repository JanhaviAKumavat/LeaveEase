
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CalendarPlus,
  Clock3,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  TrendingUp,
  RefreshCw,
  Inbox,
  Sparkles,
  CalendarCheck,
} from "lucide-react";
import api from "../services/api";

const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-200",
};

function StatusBadge({ status }) {
  const normalized = String(status || "PENDING").toUpperCase();
  const style =
    STATUS_STYLES[normalized] ||
    "bg-slate-100 text-slate-600 ring-slate-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${style}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          normalized === "APPROVED"
            ? "bg-emerald-500"
            : normalized === "REJECTED"
              ? "bg-rose-500"
              : normalized === "PENDING"
                ? "bg-amber-500"
                : "bg-slate-400"
        }`}
      />
      {normalized.charAt(0) + normalized.slice(1).toLowerCase()}
    </span>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color, delay = 0 }) {
  const colors = {
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
  };

  return (
    <article
      style={{ animationDelay: `${delay}ms` }}
      className="group animate-[fadeIn_.45s_ease-out_both] rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-500">{subtitle}</p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 transition duration-300 group-hover:scale-110 ${colors[color]}`}
        >
          <Icon size={22} />
        </div>
      </div>
    </article>
  );
}

function formatDate(dateValue) {
  if (!dateValue) return "—";

  const date = new Date(`${String(dateValue).slice(0, 10)}T00:00:00`);

  if (Number.isNaN(date.getTime())) return String(dateValue);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function calculateDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;

  const start = new Date(`${String(startDate).slice(0, 10)}T00:00:00`);
  const end = new Date(`${String(endDate).slice(0, 10)}T00:00:00`);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  ) {
    return 0;
  }

  return Math.round((end - start) / 86400000) + 1;
}

export default function EmployeeDashboard({ user: userProp }) {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user =
    userProp ||
    (() => {
      try {
        return JSON.parse(localStorage.getItem("leaveEaseUser") || "null");
      } catch {
        return null;
      }
    })();

  const loadLeaves = useCallback(async () => {
    if (!user?.id) {
      setLeaves([]);
      setError("Please sign in to view your leave dashboard.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/leaves/user/${user.id}`);
      const data = response.data;

      setLeaves(Array.isArray(data) ? data : data?.content || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load your leave requests. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  const total = leaves.length;
  const pending = leaves.filter(
    (leave) => String(leave.status).toUpperCase() === "PENDING"
  ).length;
  const approved = leaves.filter(
    (leave) => String(leave.status).toUpperCase() === "APPROVED"
  ).length;
  const rejected = leaves.filter(
    (leave) => String(leave.status).toUpperCase() === "REJECTED"
  ).length;

  const approvedDays = leaves
    .filter((leave) => String(leave.status).toUpperCase() === "APPROVED")
    .reduce(
      (sum, leave) =>
        sum + calculateDays(leave.startDate, leave.endDate),
      0
    );

  const recentLeaves = [...leaves]
    .sort((a, b) => {
      const dateA = new Date(a.startDate || 0).getTime();
      const dateB = new Date(b.startDate || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-7 pb-8">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-violet-700 to-indigo-700 p-6 text-white shadow-xl shadow-violet-200/60 sm:p-8 lg:p-9">
        <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border-[42px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-28 right-1/4 h-64 w-64 rounded-full bg-indigo-400/10 blur-2xl" />

        <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-violet-100">
              <Sparkles size={14} />
              Your personal leave workspace
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              {greeting}
              {user?.name ? `, ${user.name.trim().split(/\s+/)[0]}` : ""}!
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-violet-100 sm:text-base">
              Your time matters. Plan your time off, submit leave requests, and
              stay up to date with your approvals.
            </p>

            <Link
              to="/apply-leave"
              className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-violet-50"
            >
              <CalendarPlus size={18} />
              Apply for leave
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="hidden shrink-0 items-center justify-center md:flex">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border border-white/15 bg-white/10 shadow-inner backdrop-blur-sm lg:h-44 lg:w-44">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 lg:h-32 lg:w-32">
                <CalendarCheck
                  size={64}
                  strokeWidth={1.2}
                  className="text-violet-100 transition duration-500 hover:rotate-6"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
            At a glance
          </p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Your leave overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            A summary of your submitted leave requests.
          </p>
        </div>

        <button
          type="button"
          onClick={loadLeaves}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div
          role="alert"
          className="flex flex-col justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center"
        >
          <p className="text-sm text-rose-700">{error}</p>
          <button
            type="button"
            onClick={loadLeaves}
            className="shrink-0 rounded-lg bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
          >
            Try again
          </button>
        </div>
      )}

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total requests"
          value={loading ? "—" : total}
          subtitle="All submitted requests"
          icon={BriefcaseBusiness}
          color="violet"
          delay={0}
        />

        <StatCard
          title="Pending requests"
          value={loading ? "—" : pending}
          subtitle="Waiting for a decision"
          icon={Clock3}
          color="amber"
          delay={70}
        />

        <StatCard
          title="Approved requests"
          value={loading ? "—" : approved}
          subtitle="Successfully approved"
          icon={CheckCircle2}
          color="emerald"
          delay={140}
        />

        <StatCard
          title="Rejected requests"
          value={loading ? "—" : rejected}
          subtitle="Requests not approved"
          icon={XCircle}
          color="rose"
          delay={210}
        />
      </section>

      {/* Secondary information */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:shadow-md sm:p-6 lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <CalendarDays size={18} className="text-violet-600" />
                Approved leave days
              </div>

              <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                {loading ? "—" : approvedDays}
                <span className="ml-2 text-sm font-medium text-slate-500">
                  {approvedDays === 1 ? "day" : "days"}
                </span>
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Calculated from the inclusive dates of your approved requests.
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp size={21} />
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700"
              style={{
                width: `${
                  total ? Math.min((approved / total) * 100, 100) : 0
                }%`,
              }}
            />
          </div>

          <div className="mt-2 flex justify-between gap-2 text-xs text-slate-500">
            <span>Approved requests</span>
            <span>
              {total ? Math.round((approved / total) * 100) : 0}%
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-5 shadow-sm transition duration-300 hover:shadow-md sm:p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm">
            <CalendarPlus size={21} />
          </div>

          <h3 className="mt-4 text-base font-bold text-slate-900">
            Need some time off?
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Send a new request and track its approval status from your dashboard.
          </p>

          <Link
            to="/apply-leave"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-violet-700 transition hover:gap-3"
          >
            Create request <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      {/* Recent requests table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
              Recent leave requests
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Your latest submitted requests and their statuses.
            </p>
          </div>

          <Link
            to="/my-leaves"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
          >
            View all <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 px-5 py-16 text-sm text-slate-500">
            <RefreshCw size={18} className="animate-spin text-violet-600" />
            Loading your leave requests...
          </div>
        ) : recentLeaves.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <Inbox size={26} />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-800">
              No leave requests yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Your requests will appear here once you submit your first leave
              application.
            </p>

            <Link
              to="/apply-leave"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
            >
              <CalendarPlus size={17} />
              Apply for leave
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Leave type</th>
                  <th className="px-6 py-4">Start date</th>
                  <th className="px-6 py-4">End date</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentLeaves.map((leave, index) => (
                  <tr
                    key={leave.id ?? `${leave.startDate}-${index}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-[fadeIn_.35s_ease-out_both] transition-colors hover:bg-violet-50/40"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-800">
                        {String(leave.leaveType || "Other")
                          .replaceAll("_", " ")
                          .replace(/\b\w/g, (letter) => letter.toUpperCase())}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {formatDate(leave.startDate)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {formatDate(leave.endDate)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-700">
                      {calculateDays(leave.startDate, leave.endDate)}{" "}
                      {calculateDays(leave.startDate, leave.endDate) === 1
                        ? "day"
                        : "days"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusBadge status={leave.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
