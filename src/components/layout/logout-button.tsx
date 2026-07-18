"use client";

import { logoutAction } from "@/features/auth/actions/logout-action";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  label: string;
}

export function LogoutButton({ label }: LogoutButtonProps) {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
      >
        <LogOut size={14} />
        <span className="hidden sm:inline">{label}</span>
      </button>
    </form>
  );
}