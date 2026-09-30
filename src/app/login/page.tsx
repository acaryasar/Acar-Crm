import type { JSX } from "react";
import { LoginForm } from "@/features/auth/components/login-form";
import { DemoLoginPanel } from "@/features/auth/components/demo-login-panel";

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const FileTextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14,2 14,8 20,8" />
  </svg>
);

const PackageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const WalletIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);

const BarChart3Icon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

const Building2Icon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
  </svg>
);

const iconMap: Record<string, () => JSX.Element> = {
  Users: UsersIcon,
  FileText: FileTextIcon,
  Package: PackageIcon,
  Wallet: WalletIcon,
  BarChart3: BarChart3Icon,
  Building2: Building2Icon,
};

export default function LoginPage() {
  return (
    <div className="h-screen w-full overflow-hidden bg-slate-100">
      <div className="flex h-full w-full">

        {/* =====================================================
            LEFT PANEL
        ====================================================== */}
        <section className="relative hidden h-full w-1/2 overflow-hidden bg-[#071426] lg:flex">

          {/* Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(37,99,235,0.28),transparent_35%),radial-gradient(circle_at_30%_80%,rgba(124,58,237,0.18),transparent_30%)]" />

          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="absolute -bottom-40 right-0 h-[450px] w-[450px] rounded-full bg-violet-500/10 blur-3xl" />

          {/* Content */}
          <div className="relative z-10 flex h-full min-h-0 w-full flex-col px-6 py-6 xl:px-8 xl:py-7">

            {/* Logo */}
            <div className="flex shrink-0 items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
                <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none" aria-hidden="true">
                  <path d="M8.96 16.96 14.08 22.08 23.68 10.56" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div>
                <h1 className="text-base font-bold tracking-tight text-white">
                  iyiCRM
                </h1>

                <p className="text-[10px] text-slate-400">
                  Kurumsal Yönetim Platformu
                </p>
              </div>

            </div>

            {/* Hero */}
            <div className="mt-8 shrink-0 max-w-lg">

              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-1 text-[11px] text-blue-300">
                <span className="h-1 w-1 rounded-full bg-blue-400" />
                Yeni nesil işletme yönetimi
              </div>

              <h2 className="text-[clamp(1.5rem,2.5vw,2.2rem)] font-bold leading-[1.15] text-white">

                Müşterilerinizi daha
                <br />

                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  yakından tanıyın,
                </span>

                <br />

                işinizi büyütün.

              </h2>

              <p className="mt-3 max-w-md text-xs leading-5 text-slate-400">
                Satış, müşteri yönetimi, finans, stok, insan kaynakları
                ve daha fazlasını tek bir platform üzerinden yönetin.
              </p>

            </div>

            {/* Features */}
            <div className="mt-6 grid shrink-0 max-w-xl grid-cols-2 gap-x-4 gap-y-3 xl:gap-x-5 xl:gap-y-3.5">

              {[
                {
                  icon: "Users",
                  title: "Müşteri Yönetimi",
                  description: "Müşterilerinizi ve fırsatları yönetin",
                },
                {
                  icon: "FileText",
                  title: "Satış & Teklif",
                  description: "Tekliften faturaya kadar tüm süreç",
                },
                {
                  icon: "Package",
                  title: "Stok & Tedarik",
                  description: "Stok ve tedarik süreçlerini yönetin",
                },
                {
                  icon: "Wallet",
                  title: "Finans & Muhasebe",
                  description: "Mali süreçlerinizi kolaylaştırın",
                },
                {
                  icon: "BarChart3",
                  title: "Raporlama & Analiz",
                  description: "Veriye dayalı kararlar alın",
                },
                {
                  icon: "Building2",
                  title: "İnsan Kaynakları",
                  description: "Ekibinizi verimli yönetin",
                },
              ].map((feature) => {
                const IconComponent = iconMap[feature.icon];
                return (
                <div
                  key={feature.title}
                  className="group flex items-center gap-2.5"
                >

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-400/10 text-blue-400 transition group-hover:bg-blue-400/20">
                    <IconComponent />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-[11px] font-semibold text-white xl:text-xs">
                      {feature.title}
                    </h3>

                    <p className="mt-0.5 truncate text-[9px] text-slate-500 xl:text-[10px]">
                      {feature.description}
                    </p>
                  </div>

                </div>
                );
              })}

            </div>

            {/* Dashboard Preview */}
            <div className="mt-auto min-h-0 pt-4">

              <div className="relative mx-auto max-w-[400px]">

                <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-2xl" />

                <div className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-900/90 shadow-xl">

                  {/* Browser */}
                  <div className="flex h-5 items-center gap-1 border-b border-white/5 px-2">

                    <span className="h-1.5 w-1.5 rounded-full bg-red-400/60" />
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-400/60" />
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400/60" />

                  </div>

                  <div className="flex h-[90px]">

                    {/* Sidebar */}
                    <div className="w-10 border-r border-white/5 bg-slate-950/70 p-1.5">

                      <div className="mx-auto h-4 w-4 rounded-md bg-gradient-to-br from-blue-500 to-violet-500" />

                      <div className="mt-3 space-y-2">
                        {[1, 2, 3, 4].map((item) => (
                          <div
                            key={item}
                            className={`mx-auto h-1 rounded ${
                              item === 1
                                ? "w-5 bg-blue-500/70"
                                : "w-3 bg-slate-700"
                            }`}
                          />
                        ))}
                      </div>

                    </div>

                    {/* Dashboard */}
                    <div className="flex-1 p-2">

                      <div className="flex justify-between">
                        <div>
                          <div className="h-1.5 w-16 rounded bg-slate-700" />
                          <div className="mt-1 h-1 w-20 rounded bg-slate-800" />
                        </div>

                        <div className="h-4 w-10 rounded bg-blue-500/20" />
                      </div>

                      <div className="mt-2 grid grid-cols-3 gap-1.5">

                        {[1, 2, 3].map((item) => (
                          <div
                            key={item}
                            className="rounded border border-white/5 bg-slate-800/70 p-1.5"
                          >
                            <div className="h-1 w-6 rounded bg-slate-600" />
                            <div className="mt-1.5 h-2 w-8 rounded bg-slate-500" />
                          </div>
                        ))}

                      </div>

                      {/* Chart */}
                      <div className="mt-2 flex h-6 items-end gap-0.5">

                        {[30, 50, 35, 65, 45, 75, 60, 90, 70, 95].map(
                          (height, index) => (
                            <div
                              key={index}
                              style={{ height: `${height}%` }}
                              className="flex-1 rounded-t bg-gradient-to-t from-blue-600/50 to-violet-400/70"
                            />
                          )
                        )}

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              <p className="mt-2 text-[10px] italic text-slate-600">
                Daha akıllı bir gelecek için...
              </p>

            </div>

          </div>
        </section>

        {/* =====================================================
            RIGHT PANEL
        ====================================================== */}
        <section className="relative flex h-full w-1/2 min-w-0 items-center justify-center overflow-hidden px-5 py-5 sm:px-8 bg-gradient-to-br from-slate-100 via-white to-blue-50">

          {/* Login Container */}
          <div className="w-full max-w-[400px]">

            {/* Card */}
            <div className="rounded-[20px] border border-white bg-white/90 p-5 shadow-2xl backdrop-blur-xl sm:p-6 shadow-slate-300/40">

              {/* Logo */}
              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
                  <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none" aria-hidden="true">
                  <path d="M8.96 16.96 14.08 22.08 23.68 10.56" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    iyiCRM
                  </h2>

                  <p className="text-[10px] text-slate-500">
                    Kurumsal Yönetim Platformu
                  </p>
                </div>

              </div>

              {/* Heading */}
              <div className="mb-4">

                <h3 className="text-lg font-bold text-slate-900">
                  Tekrar hoş geldiniz!
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Hesabınıza giriş yaparak işlerinize devam edin.
                </p>

              </div>

              {/* Form */}
              <LoginForm />

              {/* Bottom */}
              <div className="mt-4 flex items-center justify-between">

                <div className="flex items-center gap-1">

                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>

                  <span className="text-[9px] text-slate-400">
                    Güvenli bağlantı
                  </span>

                </div>

                <span className="text-[9px] text-slate-400">
                  v1.0.0
                </span>

              </div>

            </div>

            <div className="mt-3">
              <DemoLoginPanel />
            </div>

            {/* Footer */}
            <p className="mt-3 text-center text-[10px] text-slate-400">
              © 2026 iyiCRM. Tüm hakları saklıdır.
            </p>

          </div>
        </section>

        {/* =====================================================
            MOBILE LOGIN
        ====================================================== */}
        <section className="flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-white to-blue-50 px-4 py-4 lg:hidden">

          <div className="w-full max-w-[380px]">

            <div className="rounded-[20px] border border-white bg-white/90 p-4 shadow-2xl sm:p-5">

              {/* Mobile Logo */}
              <div className="mb-4 flex items-center justify-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600">
                  <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none" aria-hidden="true">
                  <path d="M8.96 16.96 14.08 22.08 23.68 10.56" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                </div>

                <div>
                  <h1 className="text-lg font-bold text-slate-900">
                    iyiCRM
                  </h1>

                  <p className="text-[10px] text-slate-500">
                    Kurumsal Yönetim Platformu
                  </p>
                </div>

              </div>

              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  Tekrar hoş geldiniz!
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Hesabınıza giriş yaparak işlerinize devam edin.
                </p>
              </div>

              <LoginForm />

            </div>

            <div className="mt-3">
              <DemoLoginPanel />
            </div>

            <p className="mt-3 text-center text-[10px] text-slate-400">
              © 2026 iyiCRM
            </p>

          </div>

        </section>

      </div>
    </div>
  );
}
