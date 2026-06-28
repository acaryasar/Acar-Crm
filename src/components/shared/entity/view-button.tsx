"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

interface ViewButtonProps {
  href: string;
  title?: string;
}

export function ViewButton({ href, title = "View" }: ViewButtonProps) {
  return (
    <Link href={href} title={title} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition">
      <Eye size={16} />
    </Link>
  );
}