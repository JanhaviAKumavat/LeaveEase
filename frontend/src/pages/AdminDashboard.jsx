
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Activity,
//   AlertCircle,
//   ArrowDownRight,
//   ArrowUpRight,
//   CalendarDays,
//   Check,
//   CheckCircle2,
//   Clock3,
//   Filter,
//   LoaderCircle,
//   RefreshCw,
//   Search,
//   ShieldCheck,
//   Users,
//   X,
//   XCircle,
//   Eye,
//   FileText,
// } from "lucide-react";
// import api from "../services/api";

// const STATUS_CONFIG = {
//   PENDING: {
//     label: "Pending",
//     icon: Clock3,
//     badge: "bg-amber-50 text-amber-700 ring-amber-200",
//     dot: "bg-amber-500",
//   },
//   APPROVED: {
//     label: "Approved",
//     icon: CheckCircle2,
//     badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
//     dot: "bg-emerald-500",
//   },
//   REJECTED: {
//     label: "Rejected",
//     icon: XCircle,
//     badge: "bg-rose-50 text-rose-700 ring-rose-200",
//     dot: "bg-rose-500",
//   },
// };

// const STATUS_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

// const normalizeStatus = (status) =>
//   String(status || "PENDING").toUpperCase();

// const getLeaveId = (leave) => leave?.id ?? leave?._id;

// const getEmployee = (leave) => {
//   if (leave?.user && typeof leave.user === "object") {
//     return leave.user;
//   }

//   return {};
// };

// const formatDate = (value) => {
//   if (!value) return "—";

//   const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);

//   if (Number.isNaN(date.getTime())) return String(value);

//   return date.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const getDuration = (startDate, endDate) => {
//   if (!startDate || !endDate) return 0;

//   const start = new Date(`${String(startDate).slice(0, 10)}T00:00:00`);
//   const end = new Date(`${String(endDate).slice(0, 10)}T00:00:00`);

//   if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
//     return 0;
//   }

//   return Math.max(
//     0,
//     Math.round((end.getTime() - start.getTime()) / 86400000) + 1
//   );
// };

// const formatLeaveType = (type) => {
//   if (!type) return "Other";

//   return String(type)
//     .toLowerCase()
//     .replace(/[_-]/g, " ")
//     .replace(/\b\w/g, (letter) => letter.toUpperCase());
// };

// function StatusBadge({ status }) {
//   const normalized = normalizeStatus(status);
//   const config = STATUS_CONFIG[normalized] || STATUS_CONFIG.PENDING;
//   const Icon = config.icon;

//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${config.badge}`}
//     >
//       <Icon size={14} />
//       {config.label}
//     </span>
//   );
// }

// function StatCard({ title, value, description, icon: Icon, color, percent }) {
//   const themes = {
//     violet: {
//       icon: "bg-violet-100 text-violet-700",
//       bar: "bg-violet-500",
//     },
//     amber: {
//       icon: "bg-amber-100 text-amber-700",
//       bar: "bg-amber-500",
//     },
//     emerald: {
//       icon: "bg-emerald-100 text-emerald-700",
//       bar: "bg-emerald-500",
//     },
//     rose: {
//       icon: "bg-rose-100 text-rose-700",
//       bar: "bg-rose-500",
//     },
//   };

//   const theme = themes[color] || themes.violet;

//   return (
//     <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
//       <div className="flex items-start justify-between gap-3">
//         <div>
//           <p className="text-sm font-medium text-slate-500">{title}</p>
//           <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//             {value}
//           </p>
//           <p className="mt-2 text-xs leading-5 text-slate-500">
//             {description}
//           </p>
//         </div>

//         <div
//           className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition duration-300 group-hover:rotate-6 ${theme.icon}`}
//         >
//           <Icon size={23} />
//         </div>
//       </div>

//       <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
//         <div
//           className={`h-full rounded-full transition-all duration-700 ${theme.bar}`}
//           style={{ width: `${Math.min(100, Math.max(0, percent || 0))}%` }}
//         />
//       </div>
//     </div>
//   );
// }

// export default function AdminDashboard() {
//   const [leaves, setLeaves] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState("");
//   const [employeeWarning, setEmployeeWarning] = useState("");
//   const [search, setSearch] = useState("");
//   const [activeFilter, setActiveFilter] = useState("ALL");
//   const [processingId, setProcessingId] = useState(null);
//   const [selectedLeave, setSelectedLeave] = useState(null);

//   const fetchDashboard = useCallback(async (isRefresh = false) => {
//     if (isRefresh) {
//       setRefreshing(true);
//     } else {
//       setLoading(true);
//     }

//     setError("");
//     setEmployeeWarning("");

//     try {
//       // Load leave requests. This endpoint must return all requests to the admin.
//       const leaveResponse = await api.get("/leaves");
//       const leaveData = leaveResponse.data;

//       const leaveRecords = Array.isArray(leaveData)
//         ? leaveData
//         : Array.isArray(leaveData?.content)
//           ? leaveData.content
//           : Array.isArray(leaveData?.data)
//             ? leaveData.data
//             : [];

//       setLeaves(leaveRecords);

//       // Employee information is optional for the dashboard.
//       try {
//         const employeeResponse = await api.get("/users");
//         const employeeData = employeeResponse.data;

//         const employeeRecords = Array.isArray(employeeData)
//           ? employeeData
//           : Array.isArray(employeeData?.content)
//             ? employeeData.content
//             : Array.isArray(employeeData?.data)
//               ? employeeData.data
//               : [];

//         setEmployees(employeeRecords);
//       } catch {
//         setEmployees([]);
//         setEmployeeWarning(
//           "Employee count is unavailable. Check the GET /api/users endpoint."
//         );
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Unable to load the admin dashboard. Please check your backend."
//       );
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchDashboard();
//   }, [fetchDashboard]);

//   const stats = useMemo(() => {
//     const result = {
//       total: leaves.length,
//       pending: 0,
//       approved: 0,
//       rejected: 0,
//       approvedDays: 0,
//     };

//     leaves.forEach((leave) => {
//       const status = normalizeStatus(leave.status);

//       if (status === "PENDING") result.pending += 1;
//       if (status === "APPROVED") {
//         result.approved += 1;
//         result.approvedDays += getDuration(leave.startDate, leave.endDate);
//       }
//       if (status === "REJECTED") result.rejected += 1;
//     });

//     return result;
//   }, [leaves]);

//   const filteredLeaves = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     return [...leaves]
//       .filter((leave) => {
//         const status = normalizeStatus(leave.status);
//         const matchesStatus =
//           activeFilter === "ALL" || status === activeFilter;

//         const employee = getEmployee(leave);

//         const searchable = [
//           employee.name,
//           employee.email,
//           leave.leaveType,
//           leave.reason,
//           leave.status,
//           leave.startDate,
//           leave.endDate,
//           getLeaveId(leave),
//         ]
//           .filter(Boolean)
//           .join(" ")
//           .toLowerCase();

//         return matchesStatus && searchable.includes(query);
//       })
//       .sort((a, b) => {
//         // Pending requests appear first, followed by newest start dates.
//         const statusA = normalizeStatus(a.status) === "PENDING" ? 0 : 1;
//         const statusB = normalizeStatus(b.status) === "PENDING" ? 0 : 1;

//         if (statusA !== statusB) return statusA - statusB;

//         return (
//           new Date(b.startDate || 0).getTime() -
//           new Date(a.startDate || 0).getTime()
//         );
//       });
//   }, [leaves, search, activeFilter]);

//   const handleDecision = async (leave, decision) => {
//     const id = getLeaveId(leave);

//     if (!id) {
//       setError("This leave request does not have a valid ID.");
//       return;
//     }

//     if (normalizeStatus(leave.status) !== "PENDING") {
//       setError("Only pending leave requests can be reviewed.");
//       return;
//     }

//     const action = decision === "approve" ? "approve" : "reject";
//     const confirmed = window.confirm(
//       `Are you sure you want to ${action} this leave request?`
//     );

//     if (!confirmed) return;

//     setProcessingId(id);
//     setError("");

//     try {
//       await api.put(`/leaves/${id}/${action}`);

//       // Update the local list after the API call succeeds.
//       setLeaves((current) =>
//         current.map((item) =>
//           String(getLeaveId(item)) === String(id)
//             ? {
//                 ...item,
//                 status: decision === "approve" ? "APPROVED" : "REJECTED",
//               }
//             : item
//         )
//       );

//       setSelectedLeave((current) =>
//         current && String(getLeaveId(current)) === String(id)
//           ? {
//               ...current,
//               status: decision === "approve" ? "APPROVED" : "REJECTED",
//             }
//           : current
//       );
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           `Unable to ${action} this request. Please try again.`
//       );
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   const filterCount = (filter) => {
//     if (filter === "ALL") return leaves.length;

//     return leaves.filter(
//       (leave) => normalizeStatus(leave.status) === filter
//     ).length;
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl animate-[fadeIn_.35s_ease-out]">
//         {/* Header */}
//         <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
//           <div>
//             <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700">
//               <ShieldCheck size={14} />
//               ADMINISTRATION
//             </div>

//             <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
//               Admin Dashboard
//             </h1>

//             <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
//               Review employee leave requests, manage decisions, and monitor
//               leave activity from one place.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={() => fetchDashboard(true)}
//             disabled={refreshing || loading}
//             className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
//           >
//             <RefreshCw
//               size={17}
//               className={refreshing ? "animate-spin" : ""}
//             />
//             Refresh Data
//           </button>
//         </div>

//         {/* Errors */}
//         {error && (
//           <div
//             role="alert"
//             className="mb-6 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between"
//           >
//             <div className="flex items-start gap-3">
//               <AlertCircle size={19} className="mt-0.5 shrink-0" />
//               <span>{error}</span>
//             </div>

//             <button
//               type="button"
//               onClick={() => fetchDashboard(true)}
//               className="shrink-0 self-start font-semibold underline underline-offset-4 sm:self-center"
//             >
//               Try again
//             </button>
//           </div>
//         )}

//         {employeeWarning && !loading && (
//           <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
//             <AlertCircle size={18} className="mt-0.5 shrink-0" />
//             <span>{employeeWarning}</span>
//           </div>
//         )}

//         {/* Welcome banner */}
//         <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-violet-600 to-indigo-600 p-6 text-white shadow-xl shadow-violet-600/15 sm:p-8">
//           <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
//           <div className="pointer-events-none absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-indigo-400/20 blur-2xl" />

//           <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
//             <div className="max-w-2xl">
//               <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-100">
//                 <Activity size={17} />
//                 Leave management overview
//               </div>

//               <h2 className="text-2xl font-bold sm:text-3xl">
//                 Keep your team moving.
//               </h2>

//               <p className="mt-2 text-sm leading-6 text-violet-100 sm:text-base">
//                 You have{" "}
//                 <span className="font-bold text-white">
//                   {stats.pending} pending{" "}
//                   {stats.pending === 1 ? "request" : "requests"}
//                 </span>{" "}
//                 waiting for review. Check the queue and take action when ready.
//               </p>
//             </div>

//             <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
//                 <Clock3 size={25} />
//               </div>
//               <div>
//                 <p className="text-sm text-violet-100">Awaiting review</p>
//                 <p className="text-3xl font-bold">{stats.pending}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//           <StatCard
//             title="Total Requests"
//             value={stats.total}
//             description="All submitted leave applications"
//             icon={FileText}
//             color="violet"
//             percent={100}
//           />
//           <StatCard
//             title="Pending Review"
//             value={stats.pending}
//             description="Requests waiting for a decision"
//             icon={Clock3}
//             color="amber"
//             percent={stats.total ? (stats.pending / stats.total) * 100 : 0}
//           />
//           <StatCard
//             title="Approved"
//             value={stats.approved}
//             description={`${stats.approvedDays} approved calendar leave days`}
//             icon={CheckCircle2}
//             color="emerald"
//             percent={stats.total ? (stats.approved / stats.total) * 100 : 0}
//           />
//           <StatCard
//             title="Rejected"
//             value={stats.rejected}
//             description="Requests declined by the admin"
//             icon={XCircle}
//             color="rose"
//             percent={stats.total ? (stats.rejected / stats.total) * 100 : 0}
//           />
//         </div>

//         {/* Employee overview */}
//         <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
//           <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
//             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
//               <Users size={23} />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-slate-500">
//                 Registered Employees
//               </p>
//               <p className="mt-1 text-2xl font-bold text-slate-900">
//                 {loading ? "—" : employees.length}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
//             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
//               <ArrowUpRight size={23} />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-slate-500">
//                 Approval Rate
//               </p>
//               <p className="mt-1 text-2xl font-bold text-slate-900">
//                 {stats.total
//                   ? `${Math.round((stats.approved / stats.total) * 100)}%`
//                   : "0%"}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
//             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
//               <CalendarDays size={23} />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-slate-500">
//                 Approved Leave Days
//               </p>
//               <p className="mt-1 text-2xl font-bold text-slate-900">
//                 {stats.approvedDays}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Leave requests */}
//         <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
//           <div className="border-b border-slate-100 p-5 sm:p-6">
//             <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
//               <div>
//                 <h2 className="text-lg font-bold text-slate-900">
//                   Leave Requests
//                 </h2>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Review employee applications and update their status.
//                 </p>
//               </div>

//               <div className="relative w-full xl:max-w-sm">
//                 <Search
//                   size={18}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                 />
//                 <input
//                   type="search"
//                   value={search}
//                   onChange={(event) => setSearch(event.target.value)}
//                   placeholder="Search employee, type, or reason..."
//                   aria-label="Search leave requests"
//                   className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
//                 />
//               </div>
//             </div>

//             <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
//               {STATUS_FILTERS.map((filter) => {
//                 const active = activeFilter === filter;

//                 return (
//                   <button
//                     key={filter}
//                     type="button"
//                     onClick={() => setActiveFilter(filter)}
//                     className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
//                       active
//                         ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
//                         : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
//                     }`}
//                   >
//                     {filter === "ALL"
//                       ? "All Requests"
//                       : filter.charAt(0) + filter.slice(1).toLowerCase()}

//                     <span
//                       className={`rounded-lg px-2 py-0.5 text-xs ${
//                         active
//                           ? "bg-white/20 text-white"
//                           : "bg-white text-slate-500"
//                       }`}
//                     >
//                       {filterCount(filter)}
//                     </span>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {loading ? (
//             <div className="flex min-h-72 flex-col items-center justify-center p-10 text-center">
//               <LoaderCircle
//                 size={32}
//                 className="mb-4 animate-spin text-violet-600"
//               />
//               <p className="font-semibold text-slate-800">
//                 Loading dashboard...
//               </p>
//               <p className="mt-1 text-sm text-slate-500">
//                 Fetching leave request information.
//               </p>
//             </div>
//           ) : filteredLeaves.length === 0 ? (
//             <div className="flex min-h-72 flex-col items-center justify-center px-5 py-16 text-center">
//               <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-50 text-violet-600">
//                 <Search size={29} />
//               </div>
//               <h3 className="text-lg font-bold text-slate-900">
//                 No leave requests found
//               </h3>
//               <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
//                 {search || activeFilter !== "ALL"
//                   ? "Try changing your search term or status filter."
//                   : "Employee leave applications will appear here when submitted."}
//               </p>
//               {(search || activeFilter !== "ALL") && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setSearch("");
//                     setActiveFilter("ALL");
//                   }}
//                   className="mt-5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//                 >
//                   Clear filters
//                 </button>
//               )}
//             </div>
//           ) : (
//             <>
//               {/* Desktop table */}
//               <div className="hidden overflow-x-auto md:block">
//                 <table className="w-full min-w-[1050px] text-left">
//                   <thead>
//                     <tr className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
//                       <th className="px-5 py-4 font-semibold">Employee</th>
//                       <th className="px-5 py-4 font-semibold">Leave Type</th>
//                       <th className="px-5 py-4 font-semibold">Dates</th>
//                       <th className="px-5 py-4 font-semibold">Duration</th>
//                       <th className="px-5 py-4 font-semibold">Status</th>
//                       <th className="px-5 py-4 font-semibold">Details</th>
//                       <th className="px-5 py-4 text-right font-semibold">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-slate-100">
//                     {filteredLeaves.map((leave) => {
//                       const employee = getEmployee(leave);
//                       const id = getLeaveId(leave);
//                       const status = normalizeStatus(leave.status);
//                       const isProcessing =
//                         String(processingId) === String(id);

//                       return (
//                         <tr
//                           key={id ?? `${leave.startDate}-${leave.leaveType}`}
//                           className="transition hover:bg-violet-50/40"
//                         >
//                           <td className="px-5 py-5">
//                             <div className="flex items-center gap-3">
//                               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
//                                 {(employee.name || "E")
//                                   .trim()
//                                   .charAt(0)
//                                   .toUpperCase()}
//                               </div>
//                               <div className="max-w-48">
//                                 <p className="truncate text-sm font-semibold text-slate-800">
//                                   {employee.name || "Employee"}
//                                 </p>
//                                 <p className="mt-1 truncate text-xs text-slate-400">
//                                   {employee.email || "Email unavailable"}
//                                 </p>
//                               </div>
//                             </div>
//                           </td>

//                           <td className="px-5 py-5">
//                             <span className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
//                               {formatLeaveType(leave.leaveType)}
//                             </span>
//                           </td>

//                           <td className="px-5 py-5">
//                             <p className="whitespace-nowrap text-sm font-medium text-slate-700">
//                               {formatDate(leave.startDate)}
//                             </p>
//                             <p className="mt-1 whitespace-nowrap text-xs text-slate-400">
//                               to {formatDate(leave.endDate)}
//                             </p>
//                           </td>

//                           <td className="px-5 py-5 text-sm font-semibold text-slate-700">
//                             {getDuration(leave.startDate, leave.endDate)}{" "}
//                             {getDuration(leave.startDate, leave.endDate) === 1
//                               ? "day"
//                               : "days"}
//                           </td>

//                           <td className="px-5 py-5">
//                             <StatusBadge status={status} />
//                           </td>

//                           <td className="px-5 py-5">
//                             <button
//                               type="button"
//                               onClick={() => setSelectedLeave(leave)}
//                               className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
//                             >
//                               <Eye size={15} />
//                               View
//                             </button>
//                           </td>

//                           <td className="px-5 py-5">
//                             {status === "PENDING" ? (
//                               <div className="flex justify-end gap-2">
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleDecision(leave, "approve")
//                                   }
//                                   disabled={isProcessing}
//                                   className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
//                                 >
//                                   {isProcessing ? (
//                                     <LoaderCircle
//                                       size={14}
//                                       className="animate-spin"
//                                     />
//                                   ) : (
//                                     <Check size={14} />
//                                   )}
//                                   Approve
//                                 </button>

//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleDecision(leave, "reject")
//                                   }
//                                   disabled={isProcessing}
//                                   className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
//                                 >
//                                   <X size={14} />
//                                   Reject
//                                 </button>
//                               </div>
//                             ) : (
//                               <div className="text-right text-xs text-slate-400">
//                                 Reviewed
//                               </div>
//                             )}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Mobile request cards */}
//               <div className="space-y-4 p-4 md:hidden">
//                 {filteredLeaves.map((leave) => {
//                   const employee = getEmployee(leave);
//                   const id = getLeaveId(leave);
//                   const status = normalizeStatus(leave.status);
//                   const isProcessing =
//                     String(processingId) === String(id);

//                   return (
//                     <article
//                       key={id ?? `${leave.startDate}-${leave.leaveType}`}
//                       className="rounded-2xl border border-slate-200 p-4 transition hover:border-violet-200 hover:shadow-md"
//                     >
//                       <div className="flex items-start gap-3">
//                         <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
//                           {(employee.name || "E")
//                             .trim()
//                             .charAt(0)
//                             .toUpperCase()}
//                         </div>

//                         <div className="min-w-0 flex-1">
//                           <h3 className="truncate font-bold text-slate-900">
//                             {employee.name || "Employee"}
//                           </h3>
//                           <p className="mt-1 break-all text-xs text-slate-500">
//                             {employee.email || "Email unavailable"}
//                           </p>
//                           <div className="mt-2">
//                             <StatusBadge status={status} />
//                           </div>
//                         </div>
//                       </div>

//                       <div className="my-4 rounded-xl bg-slate-50 p-3">
//                         <div className="flex items-center justify-between gap-3">
//                           <span className="text-xs text-slate-500">
//                             Leave type
//                           </span>
//                           <span className="text-sm font-semibold text-violet-700">
//                             {formatLeaveType(leave.leaveType)}
//                           </span>
//                         </div>

//                         <div className="mt-3 flex items-center justify-between gap-3">
//                           <span className="text-xs text-slate-500">
//                             Start date
//                           </span>
//                           <span className="text-sm font-medium text-slate-800">
//                             {formatDate(leave.startDate)}
//                           </span>
//                         </div>

//                         <div className="mt-2 flex items-center justify-between gap-3">
//                           <span className="text-xs text-slate-500">
//                             End date
//                           </span>
//                           <span className="text-sm font-medium text-slate-800">
//                             {formatDate(leave.endDate)}
//                           </span>
//                         </div>

//                         <div className="mt-2 flex items-center justify-between gap-3">
//                           <span className="text-xs text-slate-500">
//                             Duration
//                           </span>
//                           <span className="text-sm font-semibold text-slate-800">
//                             {getDuration(leave.startDate, leave.endDate)}{" "}
//                             {getDuration(leave.startDate, leave.endDate) === 1
//                               ? "day"
//                               : "days"}
//                           </span>
//                         </div>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={() => setSelectedLeave(leave)}
//                         className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                       >
//                         <Eye size={16} />
//                         View Details
//                       </button>

//                       {status === "PENDING" && (
//                         <div className="grid grid-cols-2 gap-2">
//                           <button
//                             type="button"
//                             onClick={() => handleDecision(leave, "approve")}
//                             disabled={isProcessing}
//                             className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
//                           >
//                             {isProcessing ? (
//                               <LoaderCircle
//                                 size={16}
//                                 className="animate-spin"
//                               />
//                             ) : (
//                               <Check size={16} />
//                             )}
//                             Approve
//                           </button>

//                           <button
//                             type="button"
//                             onClick={() => handleDecision(leave, "reject")}
//                             disabled={isProcessing}
//                             className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-3 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
//                           >
//                             <X size={16} />
//                             Reject
//                           </button>
//                         </div>
//                       )}
//                     </article>
//                   );
//                 })}
//               </div>
//             </>
//           )}

//           {!loading && filteredLeaves.length > 0 && (
//             <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
//               <p>
//                 Showing {filteredLeaves.length} of {leaves.length} requests
//               </p>
//               <p className="flex items-center gap-1.5">
//                 <span className="h-2 w-2 rounded-full bg-amber-500" />
//                 Pending requests require review.
//               </p>
//             </div>
//           )}
//         </section>

//         {/* Leave details modal */}
//         {selectedLeave && (
//           <div
//             className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
//             onClick={(event) => {
//               if (event.target === event.currentTarget) {
//                 setSelectedLeave(null);
//               }
//             }}
//           >
//             <div
//               role="dialog"
//               aria-modal="true"
//               aria-labelledby="leave-details-title"
//               className="w-full max-w-lg animate-[fadeIn_.2s_ease-out] overflow-hidden rounded-3xl bg-white shadow-2xl"
//             >
//               <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-violet-700 to-indigo-600 p-6 text-white">
//                 <div>
//                   <p className="text-xs font-semibold uppercase tracking-wider text-violet-100">
//                     Leave application
//                   </p>
//                   <h2
//                     id="leave-details-title"
//                     className="mt-2 text-xl font-bold"
//                   >
//                     Request Details
//                   </h2>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => setSelectedLeave(null)}
//                   aria-label="Close leave details"
//                   className="rounded-xl bg-white/10 p-2 transition hover:bg-white/20"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="space-y-5 p-6">
//                 <div className="flex items-center justify-between gap-3">
//                   <div>
//                     <p className="text-xs font-medium text-slate-500">
//                       Employee
//                     </p>
//                     <p className="mt-1 font-semibold text-slate-900">
//                       {getEmployee(selectedLeave).name || "Employee"}
//                     </p>
//                     <p className="mt-1 break-all text-sm text-slate-500">
//                       {getEmployee(selectedLeave).email || "Email unavailable"}
//                     </p>
//                   </div>

//                   <StatusBadge status={selectedLeave.status} />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="rounded-xl bg-slate-50 p-4">
//                     <p className="text-xs text-slate-500">Leave type</p>
//                     <p className="mt-1 font-semibold text-slate-900">
//                       {formatLeaveType(selectedLeave.leaveType)}
//                     </p>
//                   </div>

//                   <div className="rounded-xl bg-slate-50 p-4">
//                     <p className="text-xs text-slate-500">Duration</p>
//                     <p className="mt-1 font-semibold text-slate-900">
//                       {getDuration(
//                         selectedLeave.startDate,
//                         selectedLeave.endDate
//                       )}{" "}
//                       days
//                     </p>
//                   </div>

//                   <div className="rounded-xl bg-slate-50 p-4">
//                     <p className="text-xs text-slate-500">Start date</p>
//                     <p className="mt-1 text-sm font-semibold text-slate-900">
//                       {formatDate(selectedLeave.startDate)}
//                     </p>
//                   </div>

//                   <div className="rounded-xl bg-slate-50 p-4">
//                     <p className="text-xs text-slate-500">End date</p>
//                     <p className="mt-1 text-sm font-semibold text-slate-900">
//                       {formatDate(selectedLeave.endDate)}
//                     </p>
//                   </div>
//                 </div>

//                 <div>
//                   <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
//                     Reason for leave
//                   </p>
//                   <p className="mt-2 whitespace-pre-wrap break-words rounded-xl border border-slate-100 bg-white p-4 text-sm leading-6 text-slate-700">
//                     {selectedLeave.reason || "No reason provided."}
//                   </p>
//                 </div>

//                 {normalizeStatus(selectedLeave.status) === "PENDING" && (
//                   <div className="grid grid-cols-2 gap-3">
//                     <button
//                       type="button"
//                       disabled={
//                         String(processingId) ===
//                         String(getLeaveId(selectedLeave))
//                       }
//                       onClick={() => handleDecision(selectedLeave, "approve")}
//                       className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
//                     >
//                       <Check size={17} />
//                       Approve
//                     </button>

//                     <button
//                       type="button"
//                       disabled={
//                         String(processingId) ===
//                         String(getLeaveId(selectedLeave))
//                       }
//                       onClick={() => handleDecision(selectedLeave, "reject")}
//                       className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
//                     >
//                       <X size={17} />
//                       Reject
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Filter,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  X,
  XCircle,
  Eye,
  FileText,
} from "lucide-react";
import api from "../services/api";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    icon: Clock3,
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    badge: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-500",
  },
};

const STATUS_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

const normalizeStatus = (status) =>
  String(status || "PENDING").toUpperCase();

const getLeaveId = (leave) => leave?.id ?? leave?._id;

const getEmployee = (leave) => {
  if (leave?.user && typeof leave.user === "object") {
    return leave.user;
  }

  return {};
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(`${String(startDate).slice(0, 10)}T00:00:00`);
  const end = new Date(`${String(endDate).slice(0, 10)}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  return Math.max(
    0,
    Math.round((end.getTime() - start.getTime()) / 86400000) + 1
  );
};

const formatLeaveType = (type) => {
  if (!type) return "Other";

  return String(type)
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

function StatusBadge({ status }) {
  const normalized = normalizeStatus(status);
  const config = STATUS_CONFIG[normalized] || STATUS_CONFIG.PENDING;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${config.badge}`}
    >
      <Icon size={14} />
      {config.label}
    </span>
  );
}

function StatCard({ title, value, description, icon: Icon, color, percent }) {
  const themes = {
    violet: {
      icon: "bg-violet-100 text-violet-700",
      bar: "bg-violet-500",
    },
    amber: {
      icon: "bg-amber-100 text-amber-700",
      bar: "bg-amber-500",
    },
    emerald: {
      icon: "bg-emerald-100 text-emerald-700",
      bar: "bg-emerald-500",
    },
    rose: {
      icon: "bg-rose-100 text-rose-700",
      bar: "bg-rose-500",
    },
  };

  const theme = themes[color] || themes.violet;

  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition duration-300 group-hover:rotate-6 ${theme.icon}`}
        >
          <Icon size={23} />
        </div>
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${theme.bar}`}
          style={{ width: `${Math.min(100, Math.max(0, percent || 0))}%` }}
        />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [employeeWarning, setEmployeeWarning] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [processingId, setProcessingId] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");
    setEmployeeWarning("");

    try {
      // Load leave requests. This endpoint must return all requests to the admin.
      const leaveResponse = await api.get("/leaves");
      const leaveData = leaveResponse.data;

      const leaveRecords = Array.isArray(leaveData)
        ? leaveData
        : Array.isArray(leaveData?.content)
          ? leaveData.content
          : Array.isArray(leaveData?.data)
            ? leaveData.data
            : [];

      setLeaves(leaveRecords);

      // Employee information is optional for the dashboard.
      try {
        const employeeResponse = await api.get("/users");
        const employeeData = employeeResponse.data;

        const employeeRecords = Array.isArray(employeeData)
          ? employeeData
          : Array.isArray(employeeData?.content)
            ? employeeData.content
            : Array.isArray(employeeData?.data)
              ? employeeData.data
              : [];

        setEmployees(employeeRecords);
      } catch {
        setEmployees([]);
        setEmployeeWarning(
          "Employee count is unavailable. Check the GET /api/users endpoint."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load the admin dashboard. Please check your backend."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const stats = useMemo(() => {
    const result = {
      total: leaves.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      approvedDays: 0,
    };

    leaves.forEach((leave) => {
      const status = normalizeStatus(leave.status);

      if (status === "PENDING") result.pending += 1;
      if (status === "APPROVED") {
        result.approved += 1;
        result.approvedDays += getDuration(leave.startDate, leave.endDate);
      }
      if (status === "REJECTED") result.rejected += 1;
    });

    return result;
  }, [leaves]);

  const filteredLeaves = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...leaves]
      .filter((leave) => {
        const status = normalizeStatus(leave.status);
        const matchesStatus =
          activeFilter === "ALL" || status === activeFilter;

        const employee = getEmployee(leave);

        const searchable = [
          employee.name,
          employee.email,
          leave.leaveType,
          leave.reason,
          leave.status,
          leave.startDate,
          leave.endDate,
          getLeaveId(leave),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return matchesStatus && searchable.includes(query);
      })
      .sort((a, b) => {
        // Pending requests appear first, followed by newest start dates.
        const statusA = normalizeStatus(a.status) === "PENDING" ? 0 : 1;
        const statusB = normalizeStatus(b.status) === "PENDING" ? 0 : 1;

        if (statusA !== statusB) return statusA - statusB;

        return (
          new Date(b.startDate || 0).getTime() -
          new Date(a.startDate || 0).getTime()
        );
      });
  }, [leaves, search, activeFilter]);

  const handleDecision = async (leave, decision) => {
    const id = getLeaveId(leave);

    if (!id) {
      setError("This leave request does not have a valid ID.");
      return;
    }

    if (normalizeStatus(leave.status) !== "PENDING") {
      setError("Only pending leave requests can be reviewed.");
      return;
    }

    const action = decision === "approve" ? "approve" : "reject";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this leave request?`
    );

    if (!confirmed) return;

    setProcessingId(id);
    setError("");

    try {
      await api.put(`/leaves/${id}/${action}`);

      // Update the local list after the API call succeeds.
      setLeaves((current) =>
        current.map((item) =>
          String(getLeaveId(item)) === String(id)
            ? {
                ...item,
                status: decision === "approve" ? "APPROVED" : "REJECTED",
              }
            : item
        )
      );

      setSelectedLeave((current) =>
        current && String(getLeaveId(current)) === String(id)
          ? {
              ...current,
              status: decision === "approve" ? "APPROVED" : "REJECTED",
            }
          : current
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Unable to ${action} this request. Please try again.`
      );
    } finally {
      setProcessingId(null);
    }
  };

  const filterCount = (filter) => {
    if (filter === "ALL") return leaves.length;

    return leaves.filter(
      (leave) => normalizeStatus(leave.status) === filter
    ).length;
  };

  return (
    <div className="px-0 py-2">
      <div className="mx-auto max-w-7xl animate-[fadeIn_.35s_ease-out]">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700">
              <ShieldCheck size={14} />
              ADMINISTRATION
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Review employee leave requests, manage decisions, and monitor
              leave activity from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchDashboard(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh Data
          </button>
        </div>

        {/* Errors */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={() => fetchDashboard(true)}
              className="shrink-0 self-start font-semibold underline underline-offset-4 sm:self-center"
            >
              Try again
            </button>
          </div>
        )}

        {employeeWarning && !loading && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{employeeWarning}</span>
          </div>
        )}

        {/* Welcome banner */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-violet-600 to-indigo-600 p-6 text-white shadow-xl shadow-violet-600/15 sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-indigo-400/20 blur-2xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-100">
                <Activity size={17} />
                Leave management overview
              </div>

              <h2 className="text-2xl font-bold sm:text-3xl">
                Keep your team moving.
              </h2>

              <p className="mt-2 text-sm leading-6 text-violet-100 sm:text-base">
                You have{" "}
                <span className="font-bold text-white">
                  {stats.pending} pending{" "}
                  {stats.pending === 1 ? "request" : "requests"}
                </span>{" "}
                waiting for review. Check the queue and take action when ready.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                <Clock3 size={25} />
              </div>
              <div>
                <p className="text-sm text-violet-100">Awaiting review</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Requests"
            value={stats.total}
            description="All submitted leave applications"
            icon={FileText}
            color="violet"
            percent={100}
          />
          <StatCard
            title="Pending Review"
            value={stats.pending}
            description="Requests waiting for a decision"
            icon={Clock3}
            color="amber"
            percent={stats.total ? (stats.pending / stats.total) * 100 : 0}
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            description={`${stats.approvedDays} approved calendar leave days`}
            icon={CheckCircle2}
            color="emerald"
            percent={stats.total ? (stats.approved / stats.total) * 100 : 0}
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            description="Requests declined by the admin"
            icon={XCircle}
            color="rose"
            percent={stats.total ? (stats.rejected / stats.total) * 100 : 0}
          />
        </div>

        {/* Employee overview */}
        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <Users size={23} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Registered Employees
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {loading ? "—" : employees.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <ArrowUpRight size={23} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Approval Rate
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {stats.total
                  ? `${Math.round((stats.approved / stats.total) * 100)}%`
                  : "0%"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <CalendarDays size={23} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Approved Leave Days
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {stats.approvedDays}
              </p>
            </div>
          </div>
        </div>

        {/* Leave requests */}
        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Leave Requests
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review employee applications and update their status.
                </p>
              </div>

              <div className="relative w-full xl:max-w-sm">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search employee, type, or reason..."
                  aria-label="Search leave requests"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {STATUS_FILTERS.map((filter) => {
                const active = activeFilter === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                        : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                    }`}
                  >
                    {filter === "ALL"
                      ? "All Requests"
                      : filter.charAt(0) + filter.slice(1).toLowerCase()}

                    <span
                      className={`rounded-lg px-2 py-0.5 text-xs ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-white text-slate-500"
                      }`}
                    >
                      {filterCount(filter)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-72 flex-col items-center justify-center p-10 text-center">
              <LoaderCircle
                size={32}
                className="mb-4 animate-spin text-violet-600"
              />
              <p className="font-semibold text-slate-800">
                Loading dashboard...
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Fetching leave request information.
              </p>
            </div>
          ) : filteredLeaves.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-5 py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-50 text-violet-600">
                <Search size={29} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No leave requests found
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {search || activeFilter !== "ALL"
                  ? "Try changing your search term or status filter."
                  : "Employee leave applications will appear here when submitted."}
              </p>
              {(search || activeFilter !== "ALL") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveFilter("ALL");
                  }}
                  className="mt-5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[1050px] text-left">
                  <thead>
                    <tr className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-4 font-semibold">Employee</th>
                      <th className="px-5 py-4 font-semibold">Leave Type</th>
                      <th className="px-5 py-4 font-semibold">Dates</th>
                      <th className="px-5 py-4 font-semibold">Duration</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Details</th>
                      <th className="px-5 py-4 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredLeaves.map((leave) => {
                      const employee = getEmployee(leave);
                      const id = getLeaveId(leave);
                      const status = normalizeStatus(leave.status);
                      const isProcessing =
                        String(processingId) === String(id);

                      return (
                        <tr
                          key={id ?? `${leave.startDate}-${leave.leaveType}`}
                          className="transition hover:bg-violet-50/40"
                        >
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
                                {(employee.name || "E")
                                  .trim()
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <div className="max-w-48">
                                <p className="truncate text-sm font-semibold text-slate-800">
                                  {employee.name || "Employee"}
                                </p>
                                <p className="mt-1 truncate text-xs text-slate-400">
                                  {employee.email || "Email unavailable"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <span className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                              {formatLeaveType(leave.leaveType)}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <p className="whitespace-nowrap text-sm font-medium text-slate-700">
                              {formatDate(leave.startDate)}
                            </p>
                            <p className="mt-1 whitespace-nowrap text-xs text-slate-400">
                              to {formatDate(leave.endDate)}
                            </p>
                          </td>

                          <td className="px-5 py-5 text-sm font-semibold text-slate-700">
                            {getDuration(leave.startDate, leave.endDate)}{" "}
                            {getDuration(leave.startDate, leave.endDate) === 1
                              ? "day"
                              : "days"}
                          </td>

                          <td className="px-5 py-5">
                            <StatusBadge status={status} />
                          </td>

                          <td className="px-5 py-5">
                            <button
                              type="button"
                              onClick={() => setSelectedLeave(leave)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
                            >
                              <Eye size={15} />
                              View
                            </button>
                          </td>

                          <td className="px-5 py-5">
                            {status === "PENDING" ? (
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDecision(leave, "approve")
                                  }
                                  disabled={isProcessing}
                                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {isProcessing ? (
                                    <LoaderCircle
                                      size={14}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Check size={14} />
                                  )}
                                  Approve
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDecision(leave, "reject")
                                  }
                                  disabled={isProcessing}
                                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <X size={14} />
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <div className="text-right text-xs text-slate-400">
                                Reviewed
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile request cards */}
              <div className="space-y-4 p-4 md:hidden">
                {filteredLeaves.map((leave) => {
                  const employee = getEmployee(leave);
                  const id = getLeaveId(leave);
                  const status = normalizeStatus(leave.status);
                  const isProcessing =
                    String(processingId) === String(id);

                  return (
                    <article
                      key={id ?? `${leave.startDate}-${leave.leaveType}`}
                      className="rounded-2xl border border-slate-200 p-4 transition hover:border-violet-200 hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
                          {(employee.name || "E")
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-bold text-slate-900">
                            {employee.name || "Employee"}
                          </h3>
                          <p className="mt-1 break-all text-xs text-slate-500">
                            {employee.email || "Email unavailable"}
                          </p>
                          <div className="mt-2">
                            <StatusBadge status={status} />
                          </div>
                        </div>
                      </div>

                      <div className="my-4 rounded-xl bg-slate-50 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs text-slate-500">
                            Leave type
                          </span>
                          <span className="text-sm font-semibold text-violet-700">
                            {formatLeaveType(leave.leaveType)}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="text-xs text-slate-500">
                            Start date
                          </span>
                          <span className="text-sm font-medium text-slate-800">
                            {formatDate(leave.startDate)}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-3">
                          <span className="text-xs text-slate-500">
                            End date
                          </span>
                          <span className="text-sm font-medium text-slate-800">
                            {formatDate(leave.endDate)}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-3">
                          <span className="text-xs text-slate-500">
                            Duration
                          </span>
                          <span className="text-sm font-semibold text-slate-800">
                            {getDuration(leave.startDate, leave.endDate)}{" "}
                            {getDuration(leave.startDate, leave.endDate) === 1
                              ? "day"
                              : "days"}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedLeave(leave)}
                        className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Eye size={16} />
                        View Details
                      </button>

                      {status === "PENDING" && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleDecision(leave, "approve")}
                            disabled={isProcessing}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <LoaderCircle
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <Check size={16} />
                            )}
                            Approve
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDecision(leave, "reject")}
                            disabled={isProcessing}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-3 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                          >
                            <X size={16} />
                            Reject
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          )}

          {!loading && filteredLeaves.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p>
                Showing {filteredLeaves.length} of {leaves.length} requests
              </p>
              <p className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Pending requests require review.
              </p>
            </div>
          )}
        </section>

        {/* Leave details modal */}
        {selectedLeave && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedLeave(null);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="leave-details-title"
              className="w-full max-w-lg animate-[fadeIn_.2s_ease-out] overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-violet-700 to-indigo-600 p-6 text-white">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-100">
                    Leave application
                  </p>
                  <h2
                    id="leave-details-title"
                    className="mt-2 text-xl font-bold"
                  >
                    Request Details
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedLeave(null)}
                  aria-label="Close leave details"
                  className="rounded-xl bg-white/10 p-2 transition hover:bg-white/20"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Employee
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {getEmployee(selectedLeave).name || "Employee"}
                    </p>
                    <p className="mt-1 break-all text-sm text-slate-500">
                      {getEmployee(selectedLeave).email || "Email unavailable"}
                    </p>
                  </div>

                  <StatusBadge status={selectedLeave.status} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Leave type</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {formatLeaveType(selectedLeave.leaveType)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Duration</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {getDuration(
                        selectedLeave.startDate,
                        selectedLeave.endDate
                      )}{" "}
                      days
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Start date</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {formatDate(selectedLeave.startDate)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">End date</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {formatDate(selectedLeave.endDate)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Reason for leave
                  </p>
                  <p className="mt-2 whitespace-pre-wrap break-words rounded-xl border border-slate-100 bg-white p-4 text-sm leading-6 text-slate-700">
                    {selectedLeave.reason || "No reason provided."}
                  </p>
                </div>

                {normalizeStatus(selectedLeave.status) === "PENDING" && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={
                        String(processingId) ===
                        String(getLeaveId(selectedLeave))
                      }
                      onClick={() => handleDecision(selectedLeave, "approve")}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <Check size={17} />
                      Approve
                    </button>

                    <button
                      type="button"
                      disabled={
                        String(processingId) ===
                        String(getLeaveId(selectedLeave))
                      }
                      onClick={() => handleDecision(selectedLeave, "reject")}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                    >
                      <X size={17} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}