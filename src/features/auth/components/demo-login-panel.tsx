import { ShieldCheck, Users, Briefcase, UserCheck, Lock } from "lucide-react";
import { DEMO_ROLES } from "../demo-accounts";
import { demoLoginAction } from "../actions/demo-login-action";
import { type UserRole } from "@prisma/client";

const ROLE_STYLES: Record<
  UserRole,
  { icon: React.ComponentType<{ size?: number; className?: string }>; iconWrap: string; card: string }
> = {
  ADMIN: {
    icon: ShieldCheck,
    iconWrap: "bg-amber-100 text-amber-700",
    card: "bg-amber-50/70 hover:bg-amber-50 border-amber-100",
  },
  SUPERVISOR: {
    icon: Briefcase,
    iconWrap: "bg-slate-200 text-slate-700",
    card: "bg-slate-100/70 hover:bg-slate-100 border-slate-200",
  },
  MANAGER: {
    icon: Users,
    iconWrap: "bg-emerald-100 text-emerald-700",
    card: "bg-emerald-50/70 hover:bg-emerald-50 border-emerald-100",
  },
  EMPLOYEE: {
    icon: UserCheck,
    iconWrap: "bg-blue-100 text-blue-700",
    card: "bg-blue-50/70 hover:bg-blue-50 border-blue-100",
  },
};

export function DemoLoginPanel() {
  return (
    <div className="rounded-[20px] border border-white bg-white/90 p-4 shadow-xl backdrop-blur-xl sm:p-5">
      {/* Header */}
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Demo Hesapla Görüntüle</h3>

        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-slate-500">
          SALT OKUNUR
        </span>
      </div>

      <p className="mb-3 text-[11px] text-slate-500">
        Gerçek veri değildir; tüm ekranları tek tıkla görüntülemek için bir rol seçin.
      </p>

      {/* Role buttons */}
      <div className="grid grid-cols-2 gap-2">
        {DEMO_ROLES.map(({ role, label, description }) => {
          const style = ROLE_STYLES[role];
          const Icon = style.icon;

          return (
            <form key={role} action={demoLoginAction.bind(null, role)}>
              <button
                type="submit"
                className={`flex w-full flex-col items-start gap-1.5 rounded-xl border p-2.5 text-left transition ${style.card}`}
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${style.iconWrap}`}>
                  <Icon size={13} />
                </span>

                <span className="text-[11px] font-semibold text-slate-800">{label}</span>

                <span className="text-[9.5px] leading-tight text-slate-500">{description}</span>
              </button>
            </form>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mt-3 flex items-center justify-center gap-1.5 text-[9.5px] text-slate-400">
        <Lock size={10} />
        Güvenli ve şifreli bağlantı ile verileriniz korunur.
      </div>
    </div>
  );
}
