
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   CalendarDays,
//   UserRound,
//   Mail,
//   LockKeyhole,
//   Eye,
//   EyeOff,
//   ArrowRight,
//   CheckCircle2,
//   Sparkles,
//   LoaderCircle,
//   ShieldCheck,
// } from "lucide-react";
// import api from "../services/api";

// export default function Register() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     setFormData((previous) => ({
//       ...previous,
//       [name]: value,
//     }));

//     setError("");
//     setSuccess("");
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError("");
//     setSuccess("");

//     const name = formData.name.trim();
//     const email = formData.email.trim();

//     if (!name || !email || !formData.password || !formData.confirmPassword) {
//       setError("Please complete all fields.");
//       return;
//     }

//     if (name.length < 2) {
//       setError("Please enter a name with at least 2 characters.");
//       return;
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError("Your password must contain at least 6 characters.");
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setError("Your passwords do not match.");
//       return;
//     }

//     try {
//       setLoading(true);

//       await api.post("/users/register", {
//         name,
//         email,
//         password: formData.password,
//         role: "EMPLOYEE",
//       });

//       setSuccess("Your account was created successfully. You can now sign in.");

//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//       });

//       setTimeout(() => {
//         navigate("/login", { replace: true });
//       }, 1200);
//     } catch (err) {
//       const status = err.response?.status;

//       setError(
//         status === 409
//           ? "An account with this email may already exist."
//           : err.response?.data?.message ||
//               err.response?.data?.error ||
//               err.message ||
//               "Unable to create your account. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-8 sm:px-6">
//       {/* Background decoration */}
//       <div className="pointer-events-none absolute inset-0 overflow-hidden">
//         <div className="absolute -left-28 top-0 h-72 w-72 rounded-full bg-violet-200/50 blur-3xl" />
//         <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl" />
//       </div>

//       <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white bg-white shadow-2xl shadow-slate-300/40 lg:grid-cols-2">
//         {/* Left branding panel */}
//         <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-700 via-violet-700 to-indigo-950 p-10 text-white lg:flex xl:p-14">
//           <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[40px] border-white/5" />
//           <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-white/5" />

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
//               Your next chapter starts here
//             </div>

//             <h2 className="max-w-lg text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
//               Make room for
//               <span className="mt-2 block text-violet-200">
//                 what matters.
//               </span>
//             </h2>

//             <p className="mt-6 max-w-md text-sm leading-7 text-indigo-100">
//               Create your account to submit leave requests, follow approval
//               progress, and keep your time off organized.
//             </p>

//             <div className="mt-9 space-y-4">
//               {[
//                 "Submit leave requests with ease",
//                 "Track your request status",
//                 "Keep your leave details organized",
//               ].map((item) => (
//                 <div key={item} className="flex items-center gap-3">
//                   <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-violet-200">
//                     <CheckCircle2 size={16} />
//                   </span>
//                   <span className="text-sm text-indigo-50">{item}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <p className="relative text-xs text-indigo-200">
//             © {new Date().getFullYear()} LeaveEase. All rights reserved.
//           </p>
//         </section>

//         {/* Registration form */}
//         <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-16">
//           <div className="w-full max-w-md animate-[fadeIn_.5s_ease-out_both]">
//             {/* Mobile brand */}
//             <div className="mb-8 flex items-center gap-3 lg:hidden">
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

//             <div className="mb-7">
//               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 ring-1 ring-violet-100">
//                 <UserRound size={23} />
//               </div>

//               <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
//                 Get started
//               </p>

//               <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
//                 Create your account
//               </h2>

//               <p className="mt-3 text-sm leading-6 text-slate-500">
//                 Join LeaveEase and manage your leave requests in one place.
//               </p>
//             </div>

//             {error && (
//               <div
//                 role="alert"
//                 className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700 animate-[fadeIn_.2s_ease-out_both]"
//               >
//                 {error}
//               </div>
//             )}

//             {success && (
//               <div
//                 role="status"
//                 className="mb-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-700 animate-[fadeIn_.2s_ease-out_both]"
//               >
//                 <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
//                 <span>{success}</span>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Full name */}
//               <div>
//                 <label
//                   htmlFor="register-name"
//                   className="mb-2 block text-sm font-semibold text-slate-700"
//                 >
//                   Full name
//                 </label>

//                 <div className="group flex items-center rounded-xl border border-slate-200 bg-white transition duration-200 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-100">
//                   <UserRound
//                     size={19}
//                     className="ml-4 shrink-0 text-slate-400 transition group-focus-within:text-violet-600"
//                   />

//                   <input
//                     id="register-name"
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     placeholder="Enter your full name"
//                     autoComplete="name"
//                     minLength={2}
//                     maxLength={100}
//                     required
//                     disabled={loading}
//                     className="w-full rounded-xl bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60"
//                   />
//                 </div>
//               </div>

//               {/* Email */}
//               <div>
//                 <label
//                   htmlFor="register-email"
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
//                     id="register-email"
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="you@example.com"
//                     autoComplete="email"
//                     maxLength={150}
//                     required
//                     disabled={loading}
//                     className="w-full rounded-xl bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60"
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label
//                   htmlFor="register-password"
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
//                     id="register-password"
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="At least 6 characters"
//                     autoComplete="new-password"
//                     minLength={6}
//                     required
//                     disabled={loading}
//                     className="w-full min-w-0 rounded-xl bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60"
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

//                 <p className="mt-1.5 text-xs text-slate-400">
//                   Use at least 6 characters.
//                 </p>
//               </div>

//               {/* Confirm password */}
//               <div>
//                 <label
//                   htmlFor="register-confirm-password"
//                   className="mb-2 block text-sm font-semibold text-slate-700"
//                 >
//                   Confirm password
//                 </label>

//                 <div className="group flex items-center rounded-xl border border-slate-200 bg-white transition duration-200 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-100">
//                   <ShieldCheck
//                     size={19}
//                     className="ml-4 shrink-0 text-slate-400 transition group-focus-within:text-violet-600"
//                   />

//                   <input
//                     id="register-confirm-password"
//                     type={showConfirmPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     placeholder="Re-enter your password"
//                     autoComplete="new-password"
//                     required
//                     disabled={loading}
//                     className="w-full min-w-0 rounded-xl bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60"
//                   />

//                   <button
//                     type="button"
//                     onClick={() =>
//                       setShowConfirmPassword((previous) => !previous)
//                     }
//                     aria-label={
//                       showConfirmPassword
//                         ? "Hide confirm password"
//                         : "Show confirm password"
//                     }
//                     className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-violet-50 hover:text-violet-700"
//                   >
//                     {showConfirmPassword ? (
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
//                 className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition duration-300 hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
//               >
//                 {loading ? (
//                   <>
//                     <LoaderCircle size={19} className="animate-spin" />
//                     Creating account...
//                   </>
//                 ) : (
//                   <>
//                     Create account
//                     <ArrowRight
//                       size={18}
//                       className="transition-transform duration-200 group-hover:translate-x-1"
//                     />
//                   </>
//                 )}
//               </button>
//             </form>

//             <p className="mt-6 text-center text-sm text-slate-600">
//               Already have an account?{" "}
//               <Link
//                 to="/login"
//                 className="font-bold text-violet-700 transition hover:text-indigo-700"
//               >
//                 Sign in
//               </Link>
//             </p>

//             <p className="mt-6 text-center text-xs leading-5 text-slate-400">
//               Registration creates a standard employee account. Administrator
//               privileges should only be assigned by an authorized backend process.
//             </p>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import api from "../services/api";
import AuthShell, { Field } from "../components/AuthShell";
import {
  authButtonClass,
  authErrorClass,
  authSuccessClass,
} from "../components/authStyles";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name || !email || !formData.password || !formData.confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (name.length < 2) {
      setError("Please enter a name with at least 2 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Your password must contain at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/users/register", {
        name,
        email,
        password: formData.password,
        role: "EMPLOYEE",
      });

      setSuccess("Your account was created successfully. You can now sign in.");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      const status = err.response?.status;

      setError(
        status === 409
          ? "An account with this email may already exist."
          : err.response?.data?.message ||
              err.response?.data?.error ||
              err.message ||
              "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      mode="register"
      title="Create your account"
      subtitle="Join LeaveEase and manage your leave in one place."
    >
      {error && (
        <div role="alert" className={authErrorClass}>
          <span className="mt-0.5 font-bold">!</span>
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div role="status" className={authSuccessClass}>
          <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          id="register-name"
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          autoComplete="name"
          minLength={2}
          maxLength={100}
          required
          disabled={loading}
        />

        <Field
          id="register-email"
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          autoComplete="email"
          maxLength={150}
          required
          disabled={loading}
        />

        <Field
          id="register-password"
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="At least 6 characters"
          autoComplete="new-password"
          minLength={6}
          required
          disabled={loading}
          reveal={showPassword}
          onReveal={() => setShowPassword((previous) => !previous)}
        />

        <Field
          id="register-confirm-password"
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
          disabled={loading}
          reveal={showConfirmPassword}
          onReveal={() => setShowConfirmPassword((previous) => !previous)}
        />

        <div className="pt-3">
          <button type="submit" disabled={loading} className={authButtonClass}>
            {loading ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-xs leading-5 text-slate-600">
        Registration creates a standard employee account. Administrator
        privileges should only be assigned by an authorized backend process.
      </p>
    </AuthShell>
  );
}