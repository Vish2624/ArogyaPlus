import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardList, FlaskConical, Package as PackageIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

import Logo from "@/components/common/Logo";
import Seo from "@/components/common/Seo";
import { getApiErrorMessage } from "@/services/api";
import { getCurrentAdmin, login } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { adminLoginSchema, type AdminLoginValues } from "@/utils/validation";

const FEATURES = [
  { icon: PackageIcon, text: "Manage packages and lab tests" },
  { icon: ClipboardList, text: "Track and update bookings in real time" },
  { icon: FlaskConical, text: "Keep pricing and offers current" },
];

export default function AdminLoginPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setSession = useAuthStore((s) => s.setSession);
  const setAdmin = useAuthStore((s) => s.setAdmin);
  const navigate = useNavigate();

  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({ resolver: zodResolver(adminLoginSchema) });

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const onSubmit = async (values: AdminLoginValues) => {
    setLoginError(null);
    try {
      const token = await login(values);
      setSession(token.access_token);
      const admin = await getCurrentAdmin();
      setAdmin(admin);
      navigate("/admin/dashboard");
    } catch (error) {
      setLoginError(getApiErrorMessage(error, "Invalid username or password."));
    }
  };

  return (
    <div className="flex min-h-screen">
      <Seo title="Admin Login" description="ArogyaPlus admin dashboard sign-in." path="/admin/login" noindex nofollow />
      <div className="hero-gradient relative hidden w-[42%] flex-col justify-between overflow-hidden p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex items-center gap-2.5 text-lg font-bold">
          <span className="rounded-lg bg-white/95 p-1.5 shadow-sm">
            <Logo className="h-8 w-auto" />
          </span>
          <span>Admin</span>
        </div>

        <div className="relative">
          <h1 className="text-3xl font-bold leading-tight text-white">
            Run your ArogyaPlus healthcare business from one dashboard.
          </h1>
          <ul className="mt-8 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-inset ring-white/20">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-sm text-primary-100">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-primary-200">&copy; {new Date().getFullYear()} ArogyaPlus Healthcare</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 text-lg font-bold text-primary-800 lg:hidden">
            <Logo className="h-10 w-auto" />
            <span>Admin</span>
          </div>

          <h2 className="text-xl font-bold text-slate-900">Sign in to your dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">Enter your administrator credentials to continue.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="username" className="form-label">Username or Email</label>
              <input id="username" className="form-input" autoComplete="username" {...register("username")} />
              {errors.username && <p className="form-error">{errors.username.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <input id="password" type="password" className="form-input" autoComplete="current-password" {...register("password")} />
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            {loginError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{loginError}</p>}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
