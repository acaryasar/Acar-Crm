"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const TEXT = {
  en: {
    open: "Delete my account",
    title: "Delete my account",
    body: "Your account and personal details are permanently removed and this cannot be undone. Company records you worked on (tickets, appointments, audit logs) stay without your identity. The last administrator account cannot be deleted.",
    password: "Your password to confirm",
    submit: "Permanently delete my account",
    failed: "The account could not be deleted.",
  },
  tr: {
    open: "Hesabımı sil",
    title: "Hesabımı sil",
    body: "Hesabınız ve kişisel bilgileriniz kalıcı olarak silinir; geri alınamaz. Üzerinde çalıştığınız şirket kayıtları (talepler, randevular, denetim kayıtları) kimliğiniz olmadan kalır. Son yönetici hesabı silinemez.",
    password: "Onay için şifreniz",
    submit: "Hesabımı kalıcı olarak sil",
    failed: "Hesap silinemedi.",
  },
} as const;

export function DeleteAccountButton({ locale }: { locale: string }) {
  const t = locale === "tr" ? TEXT.tr : TEXT.en;
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || t.failed);
        return;
      }
      await signOut({ callbackUrl: "/login" });
    } catch {
      setError(t.failed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Trash2 size={14} />
          <span className="hidden lg:inline">{t.open}</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.body}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.password}
            autoComplete="current-password"
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            disabled={busy}
            className="w-full rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold py-2"
          >
            {t.submit}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
