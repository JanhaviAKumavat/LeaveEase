
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Coffee,
  HeartPulse,
  Send,
  Sparkles,
  LoaderCircle,
  Info,
  BriefcaseBusiness,
  CircleHelp,
  ShieldCheck,
} from "lucide-react";
import api from "../services/api";

const LEAVE_TYPES = [
  {
    value: "CASUAL",
    label: "Casual Leave",
    description: "Personal plans and time away",
    icon: Coffee,
    color: "violet",
  },
  {
    value: "SICK",
    label: "Sick Leave",
    description: "Rest and recovery",
    icon: HeartPulse,
    color: "rose",
  },
  {
    value: "ANNUAL",
    label: "Annual Leave",
    description: "Planned vacation time",
    icon: CalendarDays,
    color: "emerald",
  },
  {
    value: "PERSONAL",
    label: "Personal Leave",
    description: "Important personal matters",
    icon: BriefcaseBusiness,
    color: "amber",
  },
  {
    value: "OTHER",
    label: "Other",
    description: "Another leave requirement",
    icon: CircleHelp,
    color: "slate",
  },
];

const TYPE_COLORS = {
  violet: {
    selected: "border-violet-500 bg-violet-50 ring-2 ring-violet-100",
    icon: "bg-violet-100 text-violet-700",
    radio: "border-violet-600 bg-violet-600",
  },
  rose: {
    selected: "border-rose-500 bg-rose-50 ring-2 ring-rose-100",
    icon: "bg-rose-100 text-rose-700",
    radio: "border-rose-600 bg-rose-600",
  },
  emerald: {
    selected: "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100",
    icon: "bg-emerald-100 text-emerald-700",
    radio: "border-emerald-600 bg-emerald-600",
  },
  amber: {
    selected: "border-amber-500 bg-amber-50 ring-2 ring-amber-100",
    icon: "bg-amber-100 text-amber-700",
    radio: "border-amber-600 bg-amber-600",
  },
  slate: {
    selected: "border-slate-500 bg-slate-50 ring-2 ring-slate-100",
    icon: "bg-slate-100 text-slate-700",
    radio: "border-slate-600 bg-slate-600",
  },
};

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value) {
  if (!value) return "Select a date";

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

function calculateDuration(startDate, endDate) {
  if (!startDate || !endDate || endDate < startDate) return 0;

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  return Math.round((end - start) / 86400000) + 1;
}

export default function ApplyLeave({ user: userProp }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const user = useMemo(() => {
    if (userProp) return userProp;

    try {
      return JSON.parse(localStorage.getItem("leaveEaseUser") || "null");
    } catch {
      return null;
    }
  }, [userProp]);

  const duration = calculateDuration(formData.startDate, formData.endDate);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => {
      const next = { ...previous, [name]: value };

      if (name === "startDate" && next.endDate && next.endDate < value) {
        next.endDate = value;
      }

      return next;
    });

    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (!user?.id) {
      setError("Please sign in before submitting a leave request.");
      return;
    }

    if (!formData.leaveType) {
      setError("Please select a leave type.");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError("Please select both the start date and end date.");
      return;
    }

    if (formData.startDate < getToday()) {
      setError("The start date cannot be in the past.");
      return;
    }

    if (formData.endDate < formData.startDate) {
      setError("The end date cannot be earlier than the start date.");
      return;
    }

    const reason = formData.reason.trim();

    if (reason.length < 5) {
      setError("Please provide a reason with at least 5 characters.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/leaves", {
        user: { id: user.id },
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason,
      });

      setSuccess(true);

      setFormData({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });

      // Allow the user to see the confirmation before navigating.
      window.setTimeout(() => {
        navigate("/my-leaves");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unable to submit your leave request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-10">
      {/* Page heading */}
      <div className="animate-[fadeIn_.35s_ease-out_both]">
        <Link
          to="/dashboard"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-violet-700"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
              Time off
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Apply for leave
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Fill in your leave details below. Your request will be submitted
              for review.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 sm:self-auto">
            <ShieldCheck size={19} className="text-emerald-600" />
            <div>
              <p className="text-xs font-bold text-emerald-800">
                Simple and organized
              </p>
              <p className="mt-0.5 text-[11px] text-emerald-700">
                Track your request status
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation */}
      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 animate-[fadeIn_.25s_ease-out_both]"
        >
          <CheckCircle2 size={21} className="mt-0.5 shrink-0 text-emerald-600" />
          <div>
            <p className="font-bold">Leave request submitted!</p>
            <p className="mt-1 text-emerald-700">
              Your request was sent successfully. Opening your leave requests...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 animate-[fadeIn_.25s_ease-out_both]"
        >
          <Info size={19} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Application form */}
        <form
          onSubmit={handleSubmit}
          className="min-w-0 space-y-6 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7 lg:p-8"
        >
          {/* Leave type */}
          <section>
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <CalendarCheck size={20} />
              </div>

              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Choose leave type
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Select the category that best matches your request.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {LEAVE_TYPES.map((type, index) => {
                const Icon = type.icon;
                const selected = formData.leaveType === type.value;
                const colors = TYPE_COLORS[type.color];

                return (
                  <button
                    key={type.value}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setFormData((previous) => ({
                        ...previous,
                        leaveType: type.value,
                      }));
                      setError("");
                    }}
                    style={{ animationDelay: `${index * 50}ms` }}
                    aria-pressed={selected}
                    className={`group flex min-h-[94px] items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200 animate-[fadeIn_.35s_ease-out_both] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${
                      selected
                        ? `${colors.selected} shadow-sm`
                        : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/40"
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition duration-200 group-hover:scale-105 ${colors.icon}`}
                    >
                      <Icon size={21} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-slate-800">
                        {type.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        {type.description}
                      </span>
                    </span>

                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                        selected
                          ? `${colors.radio} text-white`
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {selected && <CheckCircle2 size={13} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Date selection */}
          <section>
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <CalendarDays size={20} />
              </div>

              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Select your dates
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Choose when your leave will begin and end.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="startDate"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Start date <span className="text-rose-500">*</span>
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="startDate"
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={getToday()}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-50"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  {formatDisplayDate(formData.startDate)}
                </p>
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  End date <span className="text-rose-500">*</span>
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="endDate"
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate || getToday()}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-50"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  {formatDisplayDate(formData.endDate)}
                </p>
              </div>
            </div>

            {duration > 0 && (
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50/70 p-4 animate-[fadeIn_.25s_ease-out_both]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm">
                  <CalendarClock size={20} />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-bold text-violet-900">
                    {duration} {duration === 1 ? "day" : "days"} requested
                  </p>
                  <p className="mt-1 text-xs text-violet-700">
                    Calendar days, including both the start and end dates.
                  </p>
                </div>
              </div>
            )}
          </section>

          <div className="border-t border-slate-100" />

          {/* Reason */}
          <section>
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <BriefcaseBusiness size={20} />
              </div>

              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Reason for leave
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Provide a short explanation for your request.
                </p>
              </div>
            </div>

            <label
              htmlFor="reason"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Your reason <span className="text-rose-500">*</span>
            </label>

            <textarea
              id="reason"
              name="reason"
              rows={5}
              value={formData.reason}
              onChange={handleChange}
              placeholder="Briefly explain why you need leave..."
              minLength={5}
              maxLength={1000}
              required
              disabled={loading}
              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-50"
            />

            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-400">
                Keep your explanation clear and professional.
              </p>
              <span className="shrink-0 text-xs tabular-nums text-slate-400">
                {formData.reason.length}/1000
              </span>
            </div>
          </section>

          {/* Form actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setFormData({
                  leaveType: "",
                  startDate: "",
                  endDate: "",
                  reason: "",
                });
                setError("");
                setSuccess(false);
              }}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Clear form
            </button>

            <button
              type="submit"
              disabled={loading || success}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition duration-300 hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={17} />
                  Submit request
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right information panel */}
        <aside className="space-y-5 lg:sticky lg:top-24">
          <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-violet-700 to-indigo-900 p-6 text-white shadow-lg shadow-violet-200/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <Sparkles size={23} className="text-violet-100" />
            </div>

            <h2 className="mt-5 text-xl font-extrabold">
              Your time, your way.
            </h2>

            <p className="mt-3 text-sm leading-6 text-violet-100">
              Complete the form carefully so your leave request can be reviewed
              by your administrator.
            </p>

            <div className="mt-6 border-t border-white/15 pt-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Clock3 size={19} />
                </div>

                <div>
                  <p className="text-sm font-bold">Request tracking</p>
                  <p className="mt-1 text-xs text-violet-200">
                    Check progress under My Leaves.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Info size={20} />
              </div>

              <h3 className="text-base font-extrabold text-slate-900">
                Before you submit
              </h3>
            </div>

            <ul className="mt-5 space-y-4">
              {[
                "Double-check your start and end dates.",
                "Choose the correct leave category.",
                "Explain your reason clearly.",
                "Review the request status after submitting.",
              ].map((item, index) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-50 text-xs font-bold text-violet-700">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-slate-600">{item}</p>
                </li>
              ))}
            </ul>
          </section>

          <Link
            to="/my-leaves"
            className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 hover:border-violet-200 hover:bg-violet-50/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CalendarCheck size={20} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  My leave requests
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  View your previous applications
                </p>
              </div>
            </div>

            <ArrowRight
              size={18}
              className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-violet-600"
            />
          </Link>
        </aside>
      </div>
    </div>
  );
}
