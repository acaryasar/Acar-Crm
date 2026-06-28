"use client";

import { User } from "@prisma/client";
import { updateUser } from "@/features/users/actions/update-user";
import { Users, ShieldCheck, Save } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

const roleColors: Record<string, string> = {
  EMPLOYEE:   "text-slate-600",
  MANAGER:    "text-blue-600",
  SUPERVISOR: "text-emerald-600",
  ADMIN:      "text-violet-600",
};

export function UserEditForm({ user }: { user: User }) {
  return (
    <form action={(formData) => updateUser(user.id, formData)} className="max-w-xl space-y-5">

      {/* Personal Info */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} className="text-indigo-500" />
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Personal Information</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name</label>
            <input name="firstName" defaultValue={user.firstName} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input name="lastName" defaultValue={user.lastName} className={inputClass} required />
          </div>
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            defaultValue={user.email}
            className={inputClass + " opacity-60 cursor-not-allowed"}
            disabled
          />
          <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
        </div>
      </div>

      {/* Role */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={16} className="text-indigo-500" />
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Role & Permissions</h2>
        </div>

        <div>
          <label className={labelClass}>Role</label>
          <select name="role" defaultValue={user.role} className={inputClass}>
            <option value="EMPLOYEE">Employee</option>
            <option value="SUPERVISOR">Supervisor</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div className="flex gap-3 flex-wrap">
          {["EMPLOYEE", "SUPERVISOR", "MANAGER", "ADMIN"].map((role) => (
            <span key={role} className={`text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 ${roleColors[role]}`}>
              {role}
            </span>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors shadow-sm"
      >
        <Save size={16} />
        Save Changes
      </button>
    </form>
  );
}
