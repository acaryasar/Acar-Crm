import { getSession } from "@/lib/auth-guard";
import { SidebarNav } from "./sidebar-nav";

export async function Sidebar() {
  const session = await getSession();
  
  return (
    <aside className="w-56 bg-slate-950 text-white flex flex-col h-full">
      <div className="px-4 py-5 border-b border-slate-800 shrink-0">
        <div className="flex flex-col items-center gap-2">
          <img
            src="https://www.ndtservis.com/theme/ndt-servis-logo.svg"
            alt="NDT Servis Logo"
            className="h-8 w-auto object-contain"
          />
          <div className="text-center">
            <h2 className="font-bold text-sm">CRM ERP</h2>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto sidebar-scrollbar">
        <SidebarNav role={session?.user?.role} />
      </div>

      <div className="border-t border-slate-800 px-4 py-4 shrink-0">
        <div className="flex justify-center">
          <div className="text-center">
            <p className="text-sm font-medium">
              Acar Software
            </p>
            <p className="text-xs text-slate-400">
              İstanbul
            </p>
            <p className="text-xs text-slate-400">
              © 2026
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}