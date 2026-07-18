import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { SessionProvider } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="h-screen flex bg-slate-100">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />

          <main className="flex-1 overflow-auto p-6 custom-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}