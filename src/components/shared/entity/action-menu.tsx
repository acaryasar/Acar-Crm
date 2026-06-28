"use client";

import Link from "next/link";

import {
  MoreHorizontal,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ActionItem {
  label: string;

  icon?: React.ReactNode;

  href?: string;

  onClick?: () => void;

  destructive?: boolean;
}

interface Props {
  items: ActionItem[];
}

export function ActionMenu({
  items,
}: Props) {
  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>
        <button
          className="
          h-8
          w-8
          rounded-lg
          hover:bg-slate-100
          flex
          items-center
          justify-center
          "
        >
          <MoreHorizontal size={16} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
      >
        {items.map((item) => {

          if (item.href) {
            return (
              <DropdownMenuItem
                key={item.label}
                asChild
              >
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            );
          }

          return (
            <DropdownMenuItem
              key={item.label}
              onClick={item.onClick}
              className={
                item.destructive
                  ? "text-red-600"
                  : ""
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>

    </DropdownMenu>
  );
}