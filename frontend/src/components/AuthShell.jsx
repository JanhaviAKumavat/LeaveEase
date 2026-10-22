import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  authInputClass,
  authInputWrapClass,
  authLabelClass,
} from "./authStyles";

const slides = [
  {
    title: "Request leave, easily",
    text: "Submit time-off requests in a few steps and let your team know when you will be away.",
  },
  {
    title: "Know where you stand",
    text: "Follow every request from pending to approved, so there are never any surprises.",
  },
  {
    title: "One organized workspace",
    text: "Your leave history, balances and approvals all live together in one calm place.",
  },
];

// Icon bubbles floating on the orbit rings of the left panel.
const orbitNodes = [
  { icon: CalendarDays, position: "left-[27%] top-[34px]", size: "h-12 w-12" },
  { icon: ShieldCheck, position: "right-[9%] top-[112px]", size: "h-12 w-12" },
  { icon: Clock3, position: "left-[7%] top-[176px]", size: "h-12 w-12" },
  { icon: Users, position: "left-[45%] top-[104px]", size: "h-11 w-11" },
  { icon: CheckCircle2, position: "right-[27%] top-[250px]", size: "h-11 w-11" },
];

const orbitDots = [
  "left-[50%] top-[40px]",
  "left-[84%] top-[178px]",
  "left-[7%] top-[96px]",
  "left-[22%] top-[270px]",
];

export function Field({
  id,
  label,
  type = "text",
  reveal = false,
  onReveal,
  hint,
  ...inputProps
}) {
  const isPassword = typeof onReveal === "function";

  return (
    <div>
      <label htmlFor={id} className={authLabelClass}>
        {label}
      </label>

      <div className={authInputWrapClass}>
        <input
          id={id}
          type={isPassword && reveal ? "text" : type}
          className={authInputClass}
          {...inputProps}
        />

        {isPassword && (
          <button
            type="button"
            onClick={onReveal}
            aria-label={reveal ? "Hide password" : "Show password"}
            className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-violet-50 hover:text-violet-700"
          >
            {reveal ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {hint && <p className="mt-1.5 pl-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export default function AuthShell({ mode, title, subtitle, children }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      5000
    );

    return () => clearInterval(timer);
  }, []);

  const tabClass = (isActive) =>
    `rounded-full px-7 py-2.5 text-sm font-medium transition duration-200 ${
      isActive
        ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
        : "text-slate-700 hover:text-violet-700"
    }`;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8">
      <div className="grid w-full max-w-[1120px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left: promo panel */}
        <div className="hidden lg:block">
          <section className="relative h-[620px] overflow-hidden rounded-[28px] bg-[linear-gradient(205deg,#8f80ff_0%,#6b4eff_38%,#6347fb_100%)] text-white shadow-2xl shadow-violet-700/20">
            <div className="relative z-10 px-10 pt-14 text-center">
              <div key={active} className="animate-[fadeIn_.5s_ease-out_both]">
                <h2 className="text-3xl font-semibold tracking-tight">
                  {slides[active].title}
                </h2>
                <p className="mx-auto mt-5 max-w-sm text-[15px] leading-7 text-violet-50/90">
                  {slides[active].text}
                </p>
              </div>
            </div>

            {/* Orbit visual */}
            <div
              className="absolute inset-x-0 bottom-0 h-[380px]"
              aria-hidden="true"
            >
              <div className="absolute left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-white/[0.07] ring-1 ring-white/10" />
              <div className="absolute left-1/2 top-[84px] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-white/[0.08] ring-1 ring-white/10" />
              <div className="absolute left-1/2 top-[178px] h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-white/[0.12]" />

              {orbitDots.map((position) => (
                <span
                  key={position}
                  className={`absolute h-3.5 w-3.5 rounded-full bg-white/50 ${position}`}
                />
              ))}

              {orbitNodes.map(({ icon: Icon, position, size }) => (
                <span
                  key={position}
                  className={`absolute flex items-center justify-center rounded-full border border-white/50 bg-white/20 shadow-lg shadow-violet-900/20 backdrop-blur-sm ${size} ${position}`}
                >
                  <Icon size={21} strokeWidth={2} />
                </span>
              ))}
            </div>
          </section>

          {/* Slide indicators */}
          <div className="mt-6 flex justify-center gap-2.5">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show slide ${index + 1}`}
                aria-current={index === active}
                className={`h-2.5 w-12 rounded-full transition-all duration-300 ${
                  index === active
                    ? "bg-violet-600"
                    : "bg-white/90 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div className="mx-auto w-full max-w-[440px] animate-[fadeIn_.5s_ease-out_both]">
          <div className="flex flex-col items-center text-center">
            <Link
              to="/login"
              aria-label="LeaveEase"
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-violet-400 to-violet-600 text-white shadow-lg shadow-violet-600/30"
            >
              <CalendarDays size={32} strokeWidth={2.2} />
            </Link>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-700/80">
                {subtitle}
              </p>
            )}

            {/* Sign in / Sign up switch */}
            <nav
              aria-label="Account"
              className="mt-6 inline-flex rounded-full bg-white/50 p-1 ring-1 ring-white/70 backdrop-blur"
            >
              <Link to="/login" className={tabClass(mode === "login")}>
                Sign In
              </Link>
              <Link to="/register" className={tabClass(mode === "register")}>
                Sign Up
              </Link>
            </nav>
          </div>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  );
}