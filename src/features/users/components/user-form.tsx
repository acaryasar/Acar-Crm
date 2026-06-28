"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Mail, ShieldCheck, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition";

const inputClassReadonly =
  "w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-600 outline-none";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

const roleColors: Record<string, string> = {
  EMPLOYEE:   "text-slate-600",
  MANAGER:    "text-blue-600",
  SUPERVISOR: "text-emerald-600",
  ADMIN:      "text-violet-600",
};

interface UserFormProps {
  mode?: "create" | "edit" | "view";
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export function UserForm({ mode = "create", user }: UserFormProps) {
  const router = useRouter();
  const t = useTranslations("users");
  const tRoles = useTranslations("roles");
  const [loading, setLoading] = useState(false);
  const isReadonly = mode === "view";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const body: any = {
      firstName: formData.get("firstName"),
      lastName:  formData.get("lastName"),
      email:     formData.get("email"),
      role:      formData.get("role"),
    };

    if (mode === "create") {
      body.password = formData.get("password");
    } else if (formData.get("password")) {
      body.password = formData.get("password");
    }

    const url = mode === "create" ? "/api/users" : `/api/users`;
    const method = mode === "create" ? "POST" : "POST"; // Using POST with action param

    if (mode === "create") {
      await fetch(url, {
        method,
        body: JSON.stringify(body),
      });
    } else {
      await fetch(url, {
        method,
        body: JSON.stringify({
          ...body,
          action: "update",
          id: user?.id,
        }),
      });
    }

    setLoading(false);
    router.push("/dashboard/users");
  }

  return (
    <form id="user-form" onSubmit={handleSubmit} className="space-y-5">
      {mode !== "create" && user && (
        <input type="hidden" name="id" value={user.id} />
      )}
      
      <div className="grid grid-cols-3 gap-5">
        {/* Left Column - Personal Info */}
        <div className="col-span-2 space-y-5">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{t("personalInformation")}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t("firstName")}</label>
                <input 
                  name="firstName" 
                  placeholder="John" 
                  defaultValue={user?.firstName}
                  className={isReadonly ? inputClassReadonly : inputClass} 
                  readOnly={isReadonly}
                  required={!isReadonly}
                />
              </div>
              <div>
                <label className={labelClass}>{t("lastName")}</label>
                <input 
                  name="lastName" 
                  placeholder="Doe" 
                  defaultValue={user?.lastName}
                  className={isReadonly ? inputClassReadonly : inputClass} 
                  readOnly={isReadonly}
                  required={!isReadonly}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5"><Mail size={12} />{t("email")}</span>
              </label>
              <input 
                name="email" 
                type="email" 
                placeholder="john@company.com" 
                defaultValue={user?.email}
                className={isReadonly ? inputClassReadonly : inputClass} 
                readOnly={isReadonly}
                required={!isReadonly}
              />
            </div>

            {mode !== "view" && (
              <div>
                <label className={labelClass}>{t("password")}</label>
                <input 
                  name="password" 
                  type="password" 
                  placeholder={mode === "create" ? "••••••••" : "Leave blank to keep current"}
                  className={inputClass} 
                  required={mode === "create"}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Security & Role */}
        <div className="col-span-1 space-y-5">

          {/* Role */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{t("rolePermissions")}</h2>
            </div>

            <div>
              <label className={labelClass}>{t("role")}</label>
              <select 
                name="role" 
                defaultValue={user?.role || "EMPLOYEE"} 
                className={isReadonly ? inputClassReadonly : inputClass}
                disabled={isReadonly}
              >
                <option value="EMPLOYEE">{tRoles("EMPLOYEE")}</option>
                <option value="SUPERVISOR">{tRoles("SUPERVISOR")}</option>
                <option value="MANAGER">{tRoles("MANAGER")}</option>
                <option value="ADMIN">{tRoles("ADMIN")}</option>
              </select>
            </div>

            <div className="flex gap-2 flex-wrap">
              {["EMPLOYEE", "SUPERVISOR", "MANAGER", "ADMIN"].map((role) => (
                <span key={role} className={`text-xs font-medium px-2 py-1 rounded-full bg-slate-100 ${roleColors[role]}`}>
                  {tRoles(role as keyof typeof roleColors)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
