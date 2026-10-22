
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   CalendarDays,
//   Eye,
//   EyeOff,
//   Mail,
//   LockKeyhole,
//   ArrowRight,
//   ShieldCheck,
//   Clock3,
//   Sparkles,
//   LoaderCircle,
//   CheckCircle2,
// } from "lucide-react";
// import api from "../services/api";

// export default function Login({ onLogin }) {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     setFormData((previous) => ({
//       ...previous,
//       [name]: value,
//     }));

//     if (error) setError("");
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError("");

//     const email = formData.email.trim();

//     if (!email || !formData.password) {
//       setError("Please enter your email address and password.");
//       return;
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await api.post("/users/login", {
//         email,
//         password: formData.password,
//       });

//       const data = response.data;
//       const user = data?.user ?? data;

//       if (!user || user.id == null || !user.role) {
//         setError(
//           "Login response is missing user details. Please check your backend login response."
//         );
//         return;
//       }

//       const role = String(user.role)
//         .replace(/^ROLE_/i, "")
//         .toUpperCase();

//       const normalizedUser = {
//         ...user,
//         role,
//       };

//       // Store the user for page refreshes.
//       localStorage.setItem(
//         "leaveEaseUser",
//         JSON.stringify(normalizedUser)
//       );

//       // Store a token if your backend returns one.
//       const token = data?.token ?? data?.accessToken;

//       if (token) {
//         localStorage.setItem("leaveEaseToken", token);
//       }

//       // Update App.jsx immediately.
//       if (typeof onLogin === "function") {
//         onLogin(normalizedUser);
//       }

//       navigate(
//         role === "ADMIN" ? "/admin" : "/dashboard",
//         { replace: true }
//       );
//     } catch (err) {
//       const status = err.response?.status;

//       setError(
//         status === 401 || status === 403
//           ? "Invalid email or password. Please try again."
//           : err.response?.data?.message ||
//               err.response?.data?.error ||
//               err.message ||
//               "Unable to log in. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const features = [
//     {
//       icon: Clock3,
//       title: "Quick leave requests",
//       description: "Submit requests in just a few steps.",
//     },
//     {
//       icon: CheckCircle2,
//       title: "Clear approval status",
//       description: "Keep track of your leave requests.",
//     },
//     {
//       icon: ShieldCheck,
//       title: "One organized workspace",
//       description: "Keep your leave information together.",
//     },
//   ];

//   return (
//     <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
//       {/* Decorative background */}
//       <div className="pointer-events-none absolute inset-0 overflow-hidden">
//         <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-violet-200/50 blur-3xl" />
//         <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl" />
//         <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-100/40 blur-3xl" />
//       </div>

//       <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white bg-white shadow-2xl shadow-slate-300/40 lg:min-h-[660px] lg:grid-cols-2">
//         {/* Promotional panel */}
//         <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-700 via-violet-700 to-indigo-900 p-10 text-white lg:flex xl:p-14">
//           <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[42px] border-white/5" />
//           <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-white/5" />

//           <Link to="/login" className="relative flex items-center gap-3">
//             <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
//               <CalendarDays size={25} />
//             </div>

//             <div>
//               <h1 className="text-2xl font-extrabold tracking-tight">
//                 LeaveEase
//               </h1>
//               <p className="mt-0.5 text-xs text-violet-200">
//                 Employee leave management
//               </p>
//             </div>
//           </Link>

//           <div className="relative my-12">
//             <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-violet-100">
//               <Sparkles size={15} />
//               A simpler way to manage time off
//             </div>

//             <h2 className="max-w-lg text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
//               Your time matters.
//               <span className="mt-2 block text-violet-200">
//                 Manage it better.
//               </span>
//             </h2>

//             <p className="mt-6 max-w-md text-sm leading-7 text-indigo-100">
//               Request leave, track approvals, and stay organized with one
//               simple employee leave management workspace.
//             </p>

//             <div className="mt-9 space-y-4">
//               {features.map((item) => {
//                 const Icon = item.icon;

//                 return (
//                   <div
//                     key={item.title}
//                     className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:translate-x-1 hover:bg-white/10"
//                   >
//                     <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
//                       <Icon size={21} className="text-violet-200" />
//                     </div>

//                     <div>
//                       <p className="text-sm font-semibold">{item.title}</p>
//                       <p className="mt-1 text-xs text-indigo-200">
//                         {item.description}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           <p className="relative text-xs text-indigo-200">
//             © {new Date().getFullYear()} LeaveEase. All rights reserved.
//           </p>
//         </section>

//         {/* Login form */}
//         <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-16">
//           <div className="w-full max-w-md animate-[fadeIn_.5s_ease-out_both]">
//             {/* Mobile branding */}
//             <div className="mb-10 flex items-center gap-3 lg:hidden">
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200">
//                 <CalendarDays size={25} />
//               </div>

//               <div>
//                 <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
//                   Leave<span className="text-violet-600">Ease</span>
//                 </h1>
//                 <p className="text-xs text-slate-500">
//                   Employee leave management
//                 </p>
//               </div>
//             </div>

//             <div className="mb-8">
//               <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 ring-1 ring-violet-100">
//                 <LockKeyhole size={23} />
//               </div>

//               <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
//                 Welcome back
//               </p>

//               <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
//                 Sign in to your account
//               </h2>

//               <p className="mt-3 text-sm leading-6 text-slate-500">
//                 Enter your details below to access your LeaveEase workspace.
//               </p>
//             </div>

//             {error && (
//               <div
//                 role="alert"
//                 className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 animate-[fadeIn_.2s_ease-out_both]"
//               >
//                 <span className="mt-0.5 font-bold">!</span>
//                 <p>{error}</p>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div>
//                 <label
//                   htmlFor="login-email"
//                   className="mb-2 block text-sm font-semibold text-slate-700"
//                 >
//                   Email address
//                 </label>

//                 <div className="group flex items-center rounded-xl border border-slate-200 bg-white transition duration-200 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-100">
//                   <Mail
//                     size={19}
//                     className="ml-4 shrink-0 text-slate-400 transition group-focus-within:text-violet-600"
//                   />

//                   <input
//                     id="login-email"
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="you@example.com"
//                     autoComplete="email"
//                     required
//                     disabled={loading}
//                     className="w-full rounded-xl bg-transparent px-3 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label
//                   htmlFor="login-password"
//                   className="mb-2 block text-sm font-semibold text-slate-700"
//                 >
//                   Password
//                 </label>

//                 <div className="group flex items-center rounded-xl border border-slate-200 bg-white transition duration-200 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-100">
//                   <LockKeyhole
//                     size={19}
//                     className="ml-4 shrink-0 text-slate-400 transition group-focus-within:text-violet-600"
//                   />

//                   <input
//                     id="login-password"
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="Enter your password"
//                     autoComplete="current-password"
//                     required
//                     disabled={loading}
//                     className="w-full min-w-0 rounded-xl bg-transparent px-3 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60"
//                   />

//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((previous) => !previous)}
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                     className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-violet-50 hover:text-violet-700"
//                   >
//                     {showPassword ? (
//                       <EyeOff size={18} />
//                     ) : (
//                       <Eye size={18} />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition duration-300 hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
//               >
//                 {loading ? (
//                   <>
//                     <LoaderCircle size={19} className="animate-spin" />
//                     Signing in...
//                   </>
//                 ) : (
//                   <>
//                     Sign in
//                     <ArrowRight
//                       size={18}
//                       className="transition-transform duration-200 group-hover:translate-x-1"
//                     />
//                   </>
//                 )}
//               </button>
//             </form>

//             <div className="my-7 flex items-center gap-4">
//               <div className="h-px flex-1 bg-slate-200" />
//               <span className="text-xs text-slate-400">NEW TO LEAVEEASE?</span>
//               <div className="h-px flex-1 bg-slate-200" />
//             </div>

//             <p className="text-center text-sm text-slate-600">
//               Don't have an account?{" "}
//               <Link
//                 to="/register"
//                 className="font-bold text-violet-700 transition hover:text-indigo-700"
//               >
//                 Create account
//               </Link>
//             </p>

//             <p className="mt-8 text-center text-xs leading-5 text-slate-400">
//               By signing in, you agree to follow your organization's leave
//               management policies.
//             </p>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }





import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import api from "../services/api";
import AuthShell, { Field } from "../components/AuthShell";
import { authButtonClass, authErrorClass } from "../components/authStyles";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const email = formData.email.trim();

    if (!email || !formData.password) {
      setError("Please enter your email address and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/users/login", {
        email,
        password: formData.password,
      });

      const data = response.data;
      const user = data?.user ?? data;

      if (!user || user.id == null || !user.role) {
        setError(
          "Login response is missing user details. Please check your backend login response."
        );
        return;
      }

      const role = String(user.role)
        .replace(/^ROLE_/i, "")
        .toUpperCase();

      const normalizedUser = {
        ...user,
        role,
      };

      // Store the user for page refreshes.
      localStorage.setItem(
        "leaveEaseUser",
        JSON.stringify(normalizedUser)
      );

      // Store a token if your backend returns one.
      const token = data?.token ?? data?.accessToken;

      if (token) {
        localStorage.setItem("leaveEaseToken", token);
      }

      // Update App.jsx immediately.
      if (typeof onLogin === "function") {
        onLogin(normalizedUser);
      }

      navigate(
        role === "ADMIN" ? "/admin" : "/dashboard",
        { replace: true }
      );
    } catch (err) {
      const status = err.response?.status;

      setError(
        status === 401 || status === 403
          ? "Invalid email or password. Please try again."
          : err.response?.data?.message ||
              err.response?.data?.error ||
              err.message ||
              "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      mode="login"
      title="Welcome to LeaveEase"
      subtitle="Sign in to request leave and track your approvals."
    >
      {error && (
        <div role="alert" className={authErrorClass}>
          <span className="mt-0.5 font-bold">!</span>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field
          id="login-email"
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          autoComplete="email"
          required
          disabled={loading}
        />

        <Field
          id="login-password"
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          disabled={loading}
          reveal={showPassword}
          onReveal={() => setShowPassword((previous) => !previous)}
        />

        <div className="pt-2">
          <button type="submit" disabled={loading} className={authButtonClass}>
            {loading ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-xs leading-5 text-slate-600">
        By signing in, you agree to follow your organization's leave
        management policies.
      </p>
    </AuthShell>
  );
}