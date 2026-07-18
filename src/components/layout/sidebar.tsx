import { getSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { SidebarNav } from "./sidebar-nav";

const getCompanyName = unstable_cache(
  async (companyId: string) => {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { name: true },
    });
    return company?.name ?? "CRM";
  },
  ["company-name"],
  { revalidate: 3600 }
);

export async function Sidebar() {
  const session = await getSession();
  
  const companyName = session?.user?.companyId ? await getCompanyName(session.user.companyId) : "CRM";
  
  return (
    <aside className="w-56 bg-slate-950 text-white flex flex-col h-full">
      <div className="px-4 py-5 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-xs shrink-0">
            AC
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm truncate">CRM</h2>
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