"use client";

import { loginAction } from "../actions/login-action";
import { useActionState, useState } from "react";
import { Mail, LockKeyhole, Eye, EyeOff, Check, ArrowRight, AlertCircle } from "lucide-react";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <form action={formAction} className="space-y-4">

      {/* Email */}
      <div>

        <label className="mb-1 block text-[11px] font-medium text-slate-700">
          Kullanıcı Adı veya E-posta
        </label>

        <div className="relative">

          <Mail
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            name="email"
            type="text"
            placeholder="ornek@firma.com"
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-[11px] outline-none transition focus:ring-4 focus:border-blue-500 focus:ring-blue-500/10"
            required
          />

        </div>

      </div>

      {/* Password */}
      <div>

        <label className="mb-1 block text-[11px] font-medium text-slate-700">
          Şifre
        </label>

        <div className="relative">

          <LockKeyhole
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-10 text-[11px] outline-none transition focus:ring-4 focus:border-blue-500 focus:ring-blue-500/10"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500"
          >
            {showPassword ? (
              <EyeOff size={14} />
            ) : (
              <Eye size={14} />
            )}
          </button>

        </div>

      </div>

      {/* Remember */}
      <div className="flex items-center justify-between">

        <label className="flex cursor-pointer items-center gap-2">

          <button
            type="button"
            onClick={() => setRememberMe(!rememberMe)}
            className={`flex h-3.5 w-3.5 items-center justify-center rounded border ${
              rememberMe
                ? "border-blue-500 bg-blue-500 text-white"
                : "border-slate-300"
            }`}
          >
            {rememberMe && (
              <Check size={9} strokeWidth={3} />
            )}
          </button>

          <span className="text-[10px] text-slate-500">
            Beni hatırla
          </span>

        </label>

        <button
          type="button"
          className="text-[10px] font-medium text-blue-500 hover:text-blue-600"
        >
          Şifremi Unuttum?
        </button>

      </div>

      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          <AlertCircle size={15} className="shrink-0" />
          {state.error}
        </div>
      )}

      {/* Login */}
      <button
        type="submit"
        disabled={pending}
        className="group flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-[11px] font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? (
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <>
            Giriş Yap
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </>
        )}
      </button>

      {/* Divider */}
      <div className="my-4 flex items-center gap-3">

        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-[9px] text-slate-400">
          veya
        </span>

        <div className="h-px flex-1 bg-slate-200" />

      </div>

      {/* SSO */}
      <div className="space-y-2">

        <button
          type="button"
          className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-[11px] font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <span className="font-bold">G</span>
          Google ile Giriş Yap
        </button>

        <button
          type="button"
          className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-[11px] font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <span className="grid h-3 w-3 grid-cols-2">
            <span className="bg-red-500" />
            <span className="bg-green-500" />
            <span className="bg-blue-500" />
            <span className="bg-yellow-500" />
          </span>

          Microsoft ile Giriş Yap
        </button>

      </div>

    </form>
  );
}
