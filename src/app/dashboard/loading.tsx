export default function DashboardLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 bg-slate-200 rounded-lg" />
        <div className="h-4 w-32 bg-slate-100 rounded-lg" />
      </div>

      {/* Cards skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl bg-white px-5 py-4 border border-slate-100 shadow-sm space-y-3">
            <div className="h-3 w-20 bg-slate-100 rounded" />
            <div className="h-7 w-16 bg-slate-200 rounded" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100">
          <div className="h-3 w-32 bg-slate-200 rounded" />
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-slate-100 flex items-center gap-4">
            <div className="h-9 w-9 rounded-full bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-40 bg-slate-200 rounded" />
              <div className="h-3 w-24 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
