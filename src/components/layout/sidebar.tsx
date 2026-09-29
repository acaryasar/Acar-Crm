import { getSession } from "@/lib/auth-guard";
import { SidebarNav } from "./sidebar-nav";

export async function Sidebar() {
  const session = await getSession();
  
  return (
    <aside className="w-56 bg-slate-950 text-white flex flex-col h-full">
      <div className="px-4 py-5 border-b border-slate-800 shrink-0">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
            <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M8.96 16.96 14.08 22.08 23.68 10.56" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="font-bold text-sm">iyiCRM</h2>
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
              Yaşar Acar
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