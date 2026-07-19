"use client";



import Link from "next/link";

import { usePathname } from "next/navigation";

import { useTranslations } from "next-intl";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { useState } from "react";

import {

  LayoutDashboard,

  Users,

  UserRound,

  Ticket,

  Calendar,

  Mail,

  FileText,

  Receipt,

  Building2,

  ListFilter,

  MessageCircle,

  Phone,

  ChevronDown,

  ChevronRight,

  Bot,

  Settings,

  Truck,

  Package,

  ShoppingCart,

  BarChart3,

  DollarSign,

} from "lucide-react";



interface NavItem {

  label: string;

  href?: string;

  icon: any;

  exact?: boolean;

  roles?: string[];

  children?: NavItem[];

  isWhatsApp?: boolean;

}



const items: NavItem[] = [

  { label: "dashboard",    href: "/dashboard",              icon: LayoutDashboard, exact: true },

  { label: "inbox",        href: "/inbox",                  icon: Mail },

  { label: "customers",    href: "/customers",              icon: UserRound, roles: ["ADMIN", "SUPERVISOR"]},

  { label: "products",     href: "/products",               icon: Package, roles: ["ADMIN", "SUPERVISOR", "MANAGER"] },

  { label: "stock",        href: "/stock",                  icon: BarChart3, roles: ["ADMIN", "SUPERVISOR", "MANAGER"] },

  { label: "orders",       href: "/orders",                 icon: ShoppingCart, roles: ["ADMIN", "SUPERVISOR", "MANAGER"] },

  { label: "purchases",    href: "/purchases",              icon: Truck, roles: ["ADMIN", "SUPERVISOR", "MANAGER"] },

  { label: "invoices",     href: "/invoices",               icon: Receipt, roles: ["ADMIN", "SUPERVISOR"] },

  {

    label: "commission",

    icon: DollarSign,

    roles: ["ADMIN", "SUPERVISOR", "MANAGER"],

    children: [

      { label: "commissionRules", href: "/commission-rules", icon: FileText },

      { label: "commissionCalculation", href: "/commission-calculation", icon: BarChart3 },

      { label: "commissionPayment", href: "/commission-payment", icon: Receipt },

    ]

  },

  { label: "tickets",      href: "/tickets",                icon: Ticket },

  { label: "appointments", href: "/appointments",            icon: Calendar },

  { label: "users",        href: "/users",                  icon: Users , roles: ["ADMIN", "SUPERVISOR"]},

  {

    label: "ai",

    icon: Bot,

    roles: ["ADMIN"],

    children: [

      { label: "whatsappDemo", href: "/whatsapp-demo", icon: MessageCircle, isWhatsApp: true },

      { label: "phoneCallDemo", href: "/phone-call-demo", icon: Phone },

      { label: "emailDemo", href: "/email-demo", icon: Mail },

      { label: "webChatDemo", href: "/web-chat-demo", icon: MessageCircle },

    ]

  },

  {

    label: "parameters",

    icon: Settings,

    roles: ["ADMIN", "SUPERVISOR", "MANAGER"],

    href: "/parameters",

    exact: true,

  },

  { label: "activityLogs", href: "/activity-logs", icon: ListFilter, roles: ["ADMIN", "SUPERVISOR"] },

];



export function SidebarNav({ role }: { role?: string }) {

  const pathname = usePathname();

  const t = useTranslations("sidebar");

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ ai: true, parameters: true, commission: true });



  const userRole = role;



  const isActive = (href: string, exact?: boolean) => {

    if (exact) return pathname === href;

    return pathname === href || pathname.startsWith(href + "/");

  };



  const isMenuActive = (item: NavItem) => {

    if (item.children) {

      return item.children.some(child => child.href && isActive(child.href, child.exact));

    }

    return item.href && isActive(item.href, item.exact);

  };



  const toggleMenu = (label: string) => {

    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));

  };



  return (

    <nav className="p-3 space-y-1">

      {items.map((item) => {

        // Role check

        if (item.roles && userRole && !item.roles.includes(userRole)) {

          return null;

        }



        const Icon = item.icon;

        const hasChildren = item.children && item.children.length > 0;

        const active = hasChildren ? isMenuActive(item) : (item.href && isActive(item.href, item.exact));

        const isOpen = openMenus[item.label];



        if (hasChildren) {

          return (

            <div key={item.label} className="space-y-1">

              <button

                onClick={() => toggleMenu(item.label)}

                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 w-full ${

                  active

                    ? "bg-indigo-600 text-white"

                    : "text-slate-400 hover:bg-slate-900 hover:text-white"

                }`}

              >

                <Icon size={16} className="shrink-0" />

                <span className="truncate flex-1 text-left">{t(item.label)}</span>

                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}

              </button>

              {isOpen && item.children && (

                <div className="pl-6 space-y-1">

                  {item.children.map((child) => {

                    if (child.roles && userRole && !child.roles.includes(userRole)) {

                      return null;

                    }



                    const ChildIcon = child.icon;

                    const childActive = child.href && isActive(child.href, child.exact);



                    return (

                      <TooltipProvider key={child.href}>

                        <Tooltip>

                          <TooltipTrigger asChild>

                            <Link

                              href={child.href!}

                              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${

                                childActive

                                  ? "bg-indigo-600 text-white"

                                  : "text-slate-400 hover:bg-slate-900 hover:text-white"

                              }`}

                            >

                              {child.isWhatsApp ? (

                                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">

                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>

                                </svg>

                              ) : (

                                <ChildIcon size={14} className="shrink-0" />

                              )}

                              <span className="truncate">{t(child.label)}</span>

                            </Link>

                          </TooltipTrigger>

                          <TooltipContent side="right" className="max-w-[220px] bg-slate-900 text-white">

                            <p>{t(`${child.label}Description`)}</p>

                          </TooltipContent>

                        </Tooltip>

                      </TooltipProvider>

                    );

                  })}

                </div>

              )}

            </div>

          );

        }



        return (

          <TooltipProvider key={item.href}>

            <Tooltip>

              <TooltipTrigger asChild>

                <Link

                  href={item.href!}

                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${

                    active

                      ? "bg-indigo-600 text-white"

                      : "text-slate-400 hover:bg-slate-900 hover:text-white"

                  }`}

                >

                  <Icon size={16} className="shrink-0" />

                  <span className="truncate">{t(item.label)}</span>

                </Link>

              </TooltipTrigger>

              <TooltipContent side="right" className="max-w-[220px] bg-slate-900 text-white">

                <p>{t(`${item.label}Description`)}</p>

              </TooltipContent>

            </Tooltip>

          </TooltipProvider>

        );

      })}

    </nav>

  );

}

