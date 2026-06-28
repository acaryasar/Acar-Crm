import { Receipt } from "lucide-react";

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <Receipt size={20} className="text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Invoices</h1>
          <p className="text-sm text-slate-500">Manage invoices and payments</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 mb-4">
          <Receipt size={28} className="text-amber-500" />
        </div>
        <h2 className="text-lg font-semibold text-slate-700 mb-2">Invoices coming soon</h2>
        <p className="text-sm text-slate-400 max-w-xs mx-auto">
          The invoices module is under development. You'll be able to create and send invoices, track payments here.
        </p>
      </div>
    </div>
  );
}
