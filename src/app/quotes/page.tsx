import { FileText } from "lucide-react";

export default function QuotesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center">
          <FileText size={20} className="text-sky-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quotes</h1>
          <p className="text-sm text-slate-500">Manage your quotes and estimates</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 mb-4">
          <FileText size={28} className="text-sky-500" />
        </div>
        <h2 className="text-lg font-semibold text-slate-700 mb-2">Quotes coming soon</h2>
        <p className="text-sm text-slate-400 max-w-xs mx-auto">
          The quotes module is under development. You'll be able to create, send and track quotes here.
        </p>
      </div>
    </div>
  );
}
