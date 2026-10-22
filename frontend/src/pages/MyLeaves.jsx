
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../services/api";

// export default function MyLeaves({ userProp }) {
//   const [leaves, setLeaves] = useState([]);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [deletingId, setDeletingId] = useState(null);

//   const user = useMemo(() => {
//     if (userProp) return userProp;

//     try {
//       return JSON.parse(localStorage.getItem("leaveEaseUser") || "null");
//     } catch {
//       return null;
//     }
//   }, [userProp]);

//   const fetchLeaves = useCallback(async () => {
//     if (!user?.id) {
//       setError("User information not found. Please log in again.");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const response = await api.get(`/leaves/user/${user.id}`);
//       const data = response.data;

//       const list = Array.isArray(data)
//         ? data
//         : Array.isArray(data?.content)
//           ? data.content
//           : Array.isArray(data?.leaves)
//             ? data.leaves
//             : [];

//       setLeaves(list);
//     } catch (err) {
//       console.error("Failed to fetch leave requests:", err);
//       setError(
//         err.response?.data?.message ||
//           "Unable to load your leave requests. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);

//   useEffect(() => {
//     fetchLeaves();
//   }, [fetchLeaves]);

//   const handleCancel = async (leaveId) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to cancel this leave request?"
//     );

//     if (!confirmed) return;

//     try {
//       setDeletingId(leaveId);
//       setError("");

//       await api.delete(`/leaves/${leaveId}`);

//       setLeaves((previous) =>
//         previous.filter((leave) => leave.id !== leaveId)
//       );
//     } catch (err) {
//       console.error("Failed to cancel leave:", err);
//       setError(
//         err.response?.data?.message ||
//           "Unable to cancel this request. Please try again."
//       );
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const formatDate = (date) => {
//     if (!date) return "—";

//     const parsedDate = new Date(`${date}`.slice(0, 10) + "T00:00:00");

//     if (Number.isNaN(parsedDate.getTime())) return date;

//     return parsedDate.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const getStatus = (status) =>
//     String(status || "PENDING").toUpperCase();

//   const getStatusStyle = (status) => {
//     switch (getStatus(status)) {
//       case "APPROVED":
//         return "bg-emerald-100 text-emerald-700";
//       case "REJECTED":
//         return "bg-rose-100 text-rose-700";
//       case "CANCELLED":
//         return "bg-gray-100 text-gray-600";
//       default:
//         return "bg-amber-100 text-amber-700";
//     }
//   };

//   const filteredLeaves = leaves.filter((leave) => {
//     const matchesStatus =
//       statusFilter === "ALL" ||
//       getStatus(leave.status) === statusFilter;

//     const query = search.toLowerCase().trim();

//     const matchesSearch =
//       !query ||
//       String(leave.leaveType || "").toLowerCase().includes(query) ||
//       String(leave.reason || "").toLowerCase().includes(query) ||
//       getStatus(leave.status).toLowerCase().includes(query);

//     return matchesStatus && matchesSearch;
//   });

//   const pendingCount = leaves.filter(
//     (leave) => getStatus(leave.status) === "PENDING"
//   ).length;

//   const approvedCount = leaves.filter(
//     (leave) => getStatus(leave.status) === "APPROVED"
//   ).length;

//   const rejectedCount = leaves.filter(
//     (leave) => getStatus(leave.status) === "REJECTED"
//   ).length;

//   return (
//     <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl">
//         {/* Page heading */}
//         <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//           <div>
//             <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
//               Employee Portal
//             </p>

//             <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
//               My Leave Requests
//             </h1>

//             <p className="mt-2 text-sm text-slate-500 sm:text-base">
//               Track your leave applications and check their status.
//             </p>
//           </div>

//           <Link
//             to="/apply-leave"
//             className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
//           >
//             <span className="text-xl">+</span>
//             Apply for Leave
//           </Link>
//         </div>

//         {/* Statistics */}
//         <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//           <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
//             <p className="text-sm font-medium text-slate-500">Total Requests</p>
//             <div className="mt-3 flex items-center justify-between">
//               <p className="text-3xl font-bold text-slate-900">
//                 {leaves.length}
//               </p>
//               <span className="rounded-xl bg-indigo-50 p-3 text-xl">📋</span>
//             </div>
//           </div>

//           <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
//             <p className="text-sm font-medium text-slate-500">Pending</p>
//             <div className="mt-3 flex items-center justify-between">
//               <p className="text-3xl font-bold text-amber-600">
//                 {pendingCount}
//               </p>
//               <span className="rounded-xl bg-amber-50 p-3 text-xl">⏳</span>
//             </div>
//           </div>

//           <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
//             <p className="text-sm font-medium text-slate-500">Approved</p>
//             <div className="mt-3 flex items-center justify-between">
//               <p className="text-3xl font-bold text-emerald-600">
//                 {approvedCount}
//               </p>
//               <span className="rounded-xl bg-emerald-50 p-3 text-xl">✓</span>
//             </div>
//           </div>

//           <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
//             <p className="text-sm font-medium text-slate-500">Rejected</p>
//             <div className="mt-3 flex items-center justify-between">
//               <p className="text-3xl font-bold text-rose-600">
//                 {rejectedCount}
//               </p>
//               <span className="rounded-xl bg-rose-50 p-3 text-xl">✕</span>
//             </div>
//           </div>
//         </div>

//         {/* Requests panel */}
//         <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
//           <div className="border-b border-slate-100 p-5 sm:p-6">
//             <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//               <div>
//                 <h2 className="text-xl font-bold text-slate-900">
//                   Leave History
//                 </h2>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Search and filter your applications.
//                 </p>
//               </div>

//               <div className="flex flex-col gap-3 sm:flex-row">
//                 <input
//                   type="text"
//                   value={search}
//                   onChange={(event) => setSearch(event.target.value)}
//                   placeholder="Search leave type or reason..."
//                   className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:w-64"
//                 />

//                 <select
//                   value={statusFilter}
//                   onChange={(event) => setStatusFilter(event.target.value)}
//                   className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
//                 >
//                   <option value="ALL">All Statuses</option>
//                   <option value="PENDING">Pending</option>
//                   <option value="APPROVED">Approved</option>
//                   <option value="REJECTED">Rejected</option>
//                 </select>

//                 <button
//                   type="button"
//                   onClick={fetchLeaves}
//                   disabled={loading}
//                   className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
//                 >
//                   {loading ? "Loading..." : "Refresh"}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {error && (
//             <div className="m-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
//               {error}
//             </div>
//           )}

//           {loading ? (
//             <div className="flex flex-col items-center justify-center px-6 py-20">
//               <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
//               <p className="mt-4 text-sm text-slate-500">
//                 Loading your leave requests...
//               </p>
//             </div>
//           ) : filteredLeaves.length === 0 ? (
//             <div className="px-6 py-20 text-center">
//               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
//                 📅
//               </div>

//               <h3 className="mt-5 text-lg font-bold text-slate-900">
//                 {leaves.length === 0
//                   ? "No leave requests yet"
//                   : "No matching requests"}
//               </h3>

//               <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
//                 {leaves.length === 0
//                   ? "Your leave applications will appear here after you submit one."
//                   : "Try changing your search or status filter."}
//               </p>

//               {leaves.length === 0 && (
//                 <Link
//                   to="/apply-leave"
//                   className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
//                 >
//                   Apply for Leave
//                 </Link>
//               )}
//             </div>
//           ) : (
//             <>
//               {/* Desktop table */}
//               <div className="hidden overflow-x-auto md:block">
//                 <table className="w-full text-left">
//                   <thead className="bg-slate-50">
//                     <tr>
//                       <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
//                         Leave Type
//                       </th>
//                       <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
//                         Start Date
//                       </th>
//                       <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
//                         End Date
//                       </th>
//                       <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
//                         Reason
//                       </th>
//                       <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
//                         Status
//                       </th>
//                       <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-slate-100">
//                     {filteredLeaves.map((leave) => (
//                       <tr
//                         key={leave.id}
//                         className="transition hover:bg-slate-50"
//                       >
//                         <td className="whitespace-nowrap px-6 py-5">
//                           <span className="font-semibold text-slate-800">
//                             {String(leave.leaveType || "Other").replaceAll(
//                               "_",
//                               " "
//                             )}
//                           </span>
//                         </td>

//                         <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-600">
//                           {formatDate(leave.startDate)}
//                         </td>

//                         <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-600">
//                           {formatDate(leave.endDate)}
//                         </td>

//                         <td className="max-w-xs px-6 py-5 text-sm text-slate-600">
//                           <p className="line-clamp-2">
//                             {leave.reason || "—"}
//                           </p>
//                         </td>

//                         <td className="whitespace-nowrap px-6 py-5">
//                           <span
//                             className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
//                               leave.status
//                             )}`}
//                           >
//                             {getStatus(leave.status)}
//                           </span>
//                         </td>

//                         <td className="whitespace-nowrap px-6 py-5 text-right">
//                           {getStatus(leave.status) === "PENDING" ? (
//                             <button
//                               type="button"
//                               onClick={() => handleCancel(leave.id)}
//                               disabled={deletingId === leave.id}
//                               className="rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
//                             >
//                               {deletingId === leave.id
//                                 ? "Cancelling..."
//                                 : "Cancel"}
//                             </button>
//                           ) : (
//                             <span className="text-sm text-slate-400">—</span>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Mobile cards */}
//               <div className="space-y-4 p-4 md:hidden">
//                 {filteredLeaves.map((leave) => (
//                   <div
//                     key={leave.id}
//                     className="rounded-xl border border-slate-100 p-4 transition hover:border-indigo-200"
//                   >
//                     <div className="flex items-start justify-between gap-3">
//                       <div>
//                         <h3 className="font-bold text-slate-900">
//                           {String(leave.leaveType || "Other").replaceAll(
//                             "_",
//                             " "
//                           )}
//                         </h3>
//                         <p className="mt-1 text-xs text-slate-500">
//                           {formatDate(leave.startDate)} –{" "}
//                           {formatDate(leave.endDate)}
//                         </p>
//                       </div>

//                       <span
//                         className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
//                           leave.status
//                         )}`}
//                       >
//                         {getStatus(leave.status)}
//                       </span>
//                     </div>

//                     <div className="mt-4">
//                       <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
//                         Reason
//                       </p>
//                       <p className="mt-1 break-words text-sm text-slate-600">
//                         {leave.reason || "—"}
//                       </p>
//                     </div>

//                     {getStatus(leave.status) === "PENDING" && (
//                       <button
//                         type="button"
//                         onClick={() => handleCancel(leave.id)}
//                         disabled={deletingId === leave.id}
//                         className="mt-4 w-full rounded-lg border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
//                       >
//                         {deletingId === leave.id
//                           ? "Cancelling..."
//                           : "Cancel Request"}
//                       </button>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}

//           {!loading && filteredLeaves.length > 0 && (
//             <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
//               Showing {filteredLeaves.length} of {leaves.length} requests
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function MyLeaves({ userProp }) {
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const user = useMemo(() => {
    if (userProp) return userProp;

    try {
      return JSON.parse(localStorage.getItem("leaveEaseUser") || "null");
    } catch {
      return null;
    }
  }, [userProp]);

  const fetchLeaves = useCallback(async () => {
    if (!user?.id) {
      setError("User information not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/leaves/user/${user.id}`);
      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data?.leaves)
            ? data.leaves
            : [];

      setLeaves(list);
    } catch (err) {
      console.error("Failed to fetch leave requests:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load your leave requests. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleCancel = async (leaveId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this leave request?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(leaveId);
      setError("");

      await api.delete(`/leaves/${leaveId}`);

      setLeaves((previous) =>
        previous.filter((leave) => leave.id !== leaveId)
      );
    } catch (err) {
      console.error("Failed to cancel leave:", err);
      setError(
        err.response?.data?.message ||
          "Unable to cancel this request. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(`${date}`.slice(0, 10) + "T00:00:00");

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatus = (status) =>
    String(status || "PENDING").toUpperCase();

  const getStatusStyle = (status) => {
    switch (getStatus(status)) {
      case "APPROVED":
        return "bg-emerald-100 text-emerald-700";
      case "REJECTED":
        return "bg-rose-100 text-rose-700";
      case "CANCELLED":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    const matchesStatus =
      statusFilter === "ALL" ||
      getStatus(leave.status) === statusFilter;

    const query = search.toLowerCase().trim();

    const matchesSearch =
      !query ||
      String(leave.leaveType || "").toLowerCase().includes(query) ||
      String(leave.reason || "").toLowerCase().includes(query) ||
      getStatus(leave.status).toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const pendingCount = leaves.filter(
    (leave) => getStatus(leave.status) === "PENDING"
  ).length;

  const approvedCount = leaves.filter(
    (leave) => getStatus(leave.status) === "APPROVED"
  ).length;

  const rejectedCount = leaves.filter(
    (leave) => getStatus(leave.status) === "REJECTED"
  ).length;

  return (
    <div className="px-0 py-2">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Employee Portal
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Leave Requests
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Track your leave applications and check their status.
            </p>
          </div>

          <Link
            to="/apply-leave"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            <span className="text-xl">+</span>
            Apply for Leave
          </Link>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Requests</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-3xl font-bold text-slate-900">
                {leaves.length}
              </p>
              <span className="rounded-xl bg-indigo-50 p-3 text-xl">📋</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Pending</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-3xl font-bold text-amber-600">
                {pendingCount}
              </p>
              <span className="rounded-xl bg-amber-50 p-3 text-xl">⏳</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Approved</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-3xl font-bold text-emerald-600">
                {approvedCount}
              </p>
              <span className="rounded-xl bg-emerald-50 p-3 text-xl">✓</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Rejected</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-3xl font-bold text-rose-600">
                {rejectedCount}
              </p>
              <span className="rounded-xl bg-rose-50 p-3 text-xl">✕</span>
            </div>
          </div>
        </div>

        {/* Requests panel */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Leave History
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search and filter your applications.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search leave type or reason..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:w-64"
                />

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>

                <button
                  type="button"
                  onClick={fetchLeaves}
                  disabled={loading}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Refresh"}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="m-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center px-6 py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
              <p className="mt-4 text-sm text-slate-500">
                Loading your leave requests...
              </p>
            </div>
          ) : filteredLeaves.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
                📅
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                {leaves.length === 0
                  ? "No leave requests yet"
                  : "No matching requests"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {leaves.length === 0
                  ? "Your leave applications will appear here after you submit one."
                  : "Try changing your search or status filter."}
              </p>

              {leaves.length === 0 && (
                <Link
                  to="/apply-leave"
                  className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                >
                  Apply for Leave
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Leave Type
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Start Date
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        End Date
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Reason
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredLeaves.map((leave) => (
                      <tr
                        key={leave.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="whitespace-nowrap px-6 py-5">
                          <span className="font-semibold text-slate-800">
                            {String(leave.leaveType || "Other").replaceAll(
                              "_",
                              " "
                            )}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-600">
                          {formatDate(leave.startDate)}
                        </td>

                        <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-600">
                          {formatDate(leave.endDate)}
                        </td>

                        <td className="max-w-xs px-6 py-5 text-sm text-slate-600">
                          <p className="line-clamp-2">
                            {leave.reason || "—"}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                              leave.status
                            )}`}
                          >
                            {getStatus(leave.status)}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5 text-right">
                          {getStatus(leave.status) === "PENDING" ? (
                            <button
                              type="button"
                              onClick={() => handleCancel(leave.id)}
                              disabled={deletingId === leave.id}
                              className="rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                            >
                              {deletingId === leave.id
                                ? "Cancelling..."
                                : "Cancel"}
                            </button>
                          ) : (
                            <span className="text-sm text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-4 p-4 md:hidden">
                {filteredLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="rounded-xl border border-slate-100 p-4 transition hover:border-indigo-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          {String(leave.leaveType || "Other").replaceAll(
                            "_",
                            " "
                          )}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(leave.startDate)} –{" "}
                          {formatDate(leave.endDate)}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                          leave.status
                        )}`}
                      >
                        {getStatus(leave.status)}
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Reason
                      </p>
                      <p className="mt-1 break-words text-sm text-slate-600">
                        {leave.reason || "—"}
                      </p>
                    </div>

                    {getStatus(leave.status) === "PENDING" && (
                      <button
                        type="button"
                        onClick={() => handleCancel(leave.id)}
                        disabled={deletingId === leave.id}
                        className="mt-4 w-full rounded-lg border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                      >
                        {deletingId === leave.id
                          ? "Cancelling..."
                          : "Cancel Request"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && filteredLeaves.length > 0 && (
            <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
              Showing {filteredLeaves.length} of {leaves.length} requests
            </div>
          )}
        </div>
      </div>
    </div>
  );
}