"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export function OrderSearch() {
  const router = useRouter();
  const t = useTranslations("orders");
  const [value, setValue] = useState("");
  const debounced = useDebounce(value);

  useEffect(() => {
    if (debounced) {
      router.push(`/dashboard/orders?search=${debounced}`);
    } else {
      router.push("/dashboard/orders");
    }
  }, [debounced, router]);

  return (
    <div className="relative w-80">
      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("search")}
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
      />
    </div>
  );
}
