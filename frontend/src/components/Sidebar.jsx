// import React from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   CalendarPlus,
//   CalendarDays,
//   Users,
//   ClipboardCheck,
//   Clock3,
//   CheckCircle2,
//   X,
//   LogOut,
//   Sparkles,
//   ChevronRight,
//   ShieldCheck,
// } from "lucide-react";

// const employeeLinks = [
//   {
//     label: "Overview",
//     path: "/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     label: "Apply for Leave",
//     path: "/apply-leave",
//     icon: CalendarPlus,
//   },
//   {
//     label: "My Leaves",
//     path: "/my-leaves",
//     icon: CalendarDays,
//   },
// ];

// const adminLinks = [
//   {
//     label: "Overview",
//     path: "/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     label: "Manage Leaves",
//     path: "/admin/leaves",
//     icon: ClipboardCheck,
//   },
//   {
//     label: "Employees",
//     path: "/admin/employees",
//     icon: Users,
//   },
// ];

// export default function Sidebar({
//   user,
//   isOpen = false,
//   onClose,
//   onLogout,
// }) {
//   const location = useLocation();
//   const isAdmin = user?.role?.toUpperCase() === "ADMIN";
//   const links = isAdmin ? adminLinks : employeeLinks;

//   const getGreetingName = () => {
//     const name = user?.name?.trim();
//     return name ? name.split(/\s+/)[0] : "there";
//   };

//   return (
//     <>
//       {/* Mobile backdrop */}
//       <div
//         onClick={onClose}
//         className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
//           isOpen
//             ? "pointer-events-auto opacity-100"
//             : "pointer-events-none opacity-0"
//         }`}
//         aria-hidden="true"
//       />

//       {/* Sidebar */}
//       <aside
//         aria-label="Main navigation"
//         className={`fixed inset-y-0 left-0 z-50 flex w-[278px] flex-col overflow-y-auto border-r border-white/50 bg-white/60 backdrop-blur-xl transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:translate-x-0 ${
//           isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
//         }`}
//       >
//         {/* Brand */}
//         <div className="flex min-h-[84px] items-center justify-between border-b border-slate-100 px-6">
//           <NavLink
//             to="/dashboard"
//             onClick={onClose}
//             className="group flex items-center gap-3"
//           >
//             <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200 transition duration-300 group-hover:rotate-[-6deg] group-hover:scale-105">
//               <CalendarDays size={23} strokeWidth={2.2} />
//             </div>

//             <div>
//               <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
//                 Leave<span className="text-violet-600">Ease</span>
//               </h1>
//               <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
//                 Leave management
//               </p>
//             </div>
//           </NavLink>

//           <button
//             type="button"
//             onClick={onClose}
//             aria-label="Close navigation"
//             className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
//           >
//             <X size={19} />
//           </button>
//         </div>

//         {/* Welcome card */}
//         <div className="px-4 pt-6">
//           <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-700 p-4 text-white shadow-lg shadow-violet-200/60">
//             <div className="absolute -right-7 -top-8 h-24 w-24 rounded-full border-[12px] border-white/10" />
//             <div className="absolute -bottom-10 right-8 h-24 w-24 rounded-full bg-white/5" />

//             <div className="relative flex items-center gap-2">
//               <Sparkles size={16} className="text-violet-200" />
//               <span className="text-xs font-semibold text-violet-100">
//                 {isAdmin ? "Admin workspace" : "Your workspace"}
//               </span>
//             </div>

//             <p className="relative mt-3 text-lg font-bold">
//               Hi, {getGreetingName()}!
//             </p>

//             <p className="relative mt-1 text-xs leading-5 text-violet-100">
//               {isAdmin
//                 ? "Manage your team and leave requests in one place."
//                 : "Plan your time off and keep your leave requests organized."}
//             </p>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-4 py-7">
//           <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
//             Workspace
//           </p>

//           <div className="space-y-1.5">
//             {links.map((item, index) => {
//               const Icon = item.icon;

//               return (
//                 <NavLink
//                   key={item.path}
//                   to={item.path}
//                   onClick={onClose}
//                   style={{ animationDelay: `${index * 60}ms` }}
//                   className={({ isActive }) => {
//                     const active =
//                       isActive &&
//                       (item.path !== "/dashboard" ||
//                         location.pathname === "/dashboard");

//                     return `group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-[13px] font-semibold transition-all duration-200 animate-[fadeIn_.35s_ease-out_both] ${
//                       active
//                         ? "bg-white text-violet-700 shadow-sm shadow-violet-200/60"
//                         : "text-slate-600 hover:translate-x-1 hover:bg-white/60 hover:text-slate-900"
//                     }`;
//                   }}
//                 >
//                   {({ isActive }) => {
//                     const active =
//                       isActive &&
//                       (item.path !== "/dashboard" ||
//                         location.pathname === "/dashboard");

//                     return (
//                       <>
//                         {active && (
//                           <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-violet-600" />
//                         )}

//                         <span
//                           className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
//                             active
//                               ? "bg-violet-600 text-white shadow-md shadow-violet-200"
//                               : "bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-700"
//                           }`}
//                         >
//                           <Icon size={18} strokeWidth={2} />
//                         </span>

//                         <span className="flex-1">{item.label}</span>

//                         <ChevronRight
//                           size={16}
//                           className={`transition-all duration-200 ${
//                             active
//                               ? "translate-x-0 text-violet-500 opacity-100"
//                               : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
//                           }`}
//                         />
//                       </>
//                     );
//                   }}
//                 </NavLink>
//               );
//             })}
//           </div>

//           <div className="my-6 border-t border-slate-100" />

//           <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
//             Account
//           </p>

//           <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm ring-1 ring-slate-200/70">
//                 {isAdmin ? (
//                   <ShieldCheck size={19} />
//                 ) : (
//                   <Clock3 size={19} />
//                 )}
//               </div>

//               <div className="min-w-0">
//                 <p className="truncate text-xs font-bold text-slate-800">
//                   {isAdmin ? "Administrator" : "Employee account"}
//                 </p>
//                 <p className="mt-1 text-[11px] text-slate-500">
//                   {isAdmin ? "Team management" : "Leave tracking"}
//                 </p>
//               </div>

//               <CheckCircle2
//                 size={16}
//                 className="ml-auto shrink-0 text-emerald-500"
//               />
//             </div>
//           </div>
//         </nav>

//         {/* Bottom profile and logout */}
//         <div className="border-t border-slate-100 p-4">
//           <div className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50">
//             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-sm font-extrabold text-violet-700">
//               {getGreetingName().charAt(0).toUpperCase()}
//             </div>

//             <div className="min-w-0 flex-1">
//               <p className="truncate text-sm font-bold text-slate-800">
//                 {user?.name || "User"}
//               </p>
//               <p className="truncate text-[11px] text-slate-500">
//                 {user?.email || "Signed in"}
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={onLogout}
//               title="Log out"
//               aria-label="Log out"
//               className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition duration-200 hover:bg-rose-50 hover:text-rose-600"
//             >
//               <LogOut size={17} />
//             </button>
//           </div>

//           <p className="mt-3 text-center text-[10px] text-slate-400">
//             LeaveEase · Employee Leave Portal
//           </p>
//         </div>
//       </aside>
//     </>
//   );
// }














import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarPlus,
  CalendarDays,
  Users,
  ClipboardCheck,
  Clock3,
  CheckCircle2,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const employeeLinks = [
  {
    label: "Overview",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Apply for Leave",
    path: "/apply-leave",
    icon: CalendarPlus,
  },
  {
    label: "My Leaves",
    path: "/my-leaves",
    icon: CalendarDays,
  },
];

const adminLinks = [
  {
    label: "Overview",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Manage Leaves",
    path: "/admin/leaves",
    icon: ClipboardCheck,
  },
  {
    label: "Employees",
    path: "/admin/employees",
    icon: Users,
  },
];

export default function Sidebar({
  user,
  isOpen = false,
  onClose,
  onLogout,
}) {
  const location = useLocation();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const links = isAdmin ? adminLinks : employeeLinks;

  const getGreetingName = () => {
    const name = user?.name?.trim();
    return name ? name.split(/\s+/)[0] : "there";
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-[278px] flex-col overflow-y-auto border-r border-white/50 bg-white/60 backdrop-blur-xl transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Welcome card */}
        <div className="px-4 pt-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-700 p-4 text-white shadow-lg shadow-violet-200/60">
            <div className="absolute -right-7 -top-8 h-24 w-24 rounded-full border-[12px] border-white/10" />
            <div className="absolute -bottom-10 right-8 h-24 w-24 rounded-full bg-white/5" />

            <div className="relative flex items-center gap-2">
              <Sparkles size={16} className="text-violet-200" />
              <span className="text-xs font-semibold text-violet-100">
                {isAdmin ? "Admin workspace" : "Your workspace"}
              </span>
            </div>

            <p className="relative mt-3 text-lg font-bold">
              Hi, {getGreetingName()}!
            </p>

            <p className="relative mt-1 text-xs leading-5 text-violet-100">
              {isAdmin
                ? "Manage your team and leave requests in one place."
                : "Plan your time off and keep your leave requests organized."}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>

          <div className="space-y-1.5">
            {links.map((item, index) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  style={{ animationDelay: `${index * 60}ms` }}
                  className={({ isActive }) => {
                    const active =
                      isActive &&
                      (item.path !== "/dashboard" ||
                        location.pathname === "/dashboard");

                    return `group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-[13px] font-semibold transition-all duration-200 animate-[fadeIn_.35s_ease-out_both] ${
                      active
                        ? "bg-white text-violet-700 shadow-sm shadow-violet-200/60"
                        : "text-slate-600 hover:translate-x-1 hover:bg-white/60 hover:text-slate-900"
                    }`;
                  }}
                >
                  {({ isActive }) => {
                    const active =
                      isActive &&
                      (item.path !== "/dashboard" ||
                        location.pathname === "/dashboard");

                    return (
                      <>
                        {active && (
                          <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-violet-600" />
                        )}

                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                            active
                              ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                              : "bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-700"
                          }`}
                        >
                          <Icon size={18} strokeWidth={2} />
                        </span>

                        <span className="flex-1">{item.label}</span>

                        <ChevronRight
                          size={16}
                          className={`transition-all duration-200 ${
                            active
                              ? "translate-x-0 text-violet-500 opacity-100"
                              : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          }`}
                        />
                      </>
                    );
                  }}
                </NavLink>
              );
            })}
          </div>

          <div className="my-6 border-t border-slate-100" />

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Account
          </p>

          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm ring-1 ring-slate-200/70">
                {isAdmin ? (
                  <ShieldCheck size={19} />
                ) : (
                  <Clock3 size={19} />
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-800">
                  {isAdmin ? "Administrator" : "Employee account"}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {isAdmin ? "Team management" : "Leave tracking"}
                </p>
              </div>

              <CheckCircle2
                size={16}
                className="ml-auto shrink-0 text-emerald-500"
              />
            </div>
          </div>
        </nav>

        {/* Bottom profile and logout */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-sm font-extrabold text-violet-700">
              {getGreetingName().charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-800">
                {user?.name || "User"}
              </p>
              <p className="truncate text-[11px] text-slate-500">
                {user?.email || "Signed in"}
              </p>
            </div>

            <button
              type="button"
              onClick={onLogout}
              title="Log out"
              aria-label="Log out"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition duration-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut size={17} />
            </button>
          </div>

          <p className="mt-3 text-center text-[10px] text-slate-400">
            LeaveEase · Employee Leave Portal
          </p>
        </div>
      </aside>
    </>
  );
}