import type { Metadata } from "next";

export const routes = {
  // Public
  login: "/login",
  
  // Dashboard
  dashboard: {
    home: "/dashboard",
    inbox: "/dashboard/inbox",
    customers: "/dashboard/customers",
    companies: "/dashboard/companies",
    tickets: "/dashboard/tickets",
    appointments: "/dashboard/appointments",
    users: "/dashboard/users",
    quotes: "/dashboard/quotes",
    invoices: "/dashboard/invoices",
    activityLogs: "/dashboard/activity-logs",
    notifications: "/dashboard/notifications",
    
    // Parameters
    parameters: {
      base: "/dashboard/parameters",
      salesTypes: "/dashboard/parameters/sales-types",
      currencies: "/dashboard/parameters/currencies",
      customerTypes: "/dashboard/parameters/customer-types",
      departments: "/dashboard/parameters/departments",
      banks: "/dashboard/parameters/banks",
      bankAccounts: "/dashboard/parameters/bank-accounts",
      cargoFirms: "/dashboard/parameters/cargo-firms",
      customerAuthorities: "/dashboard/parameters/customer-authorities",
      employees: "/dashboard/parameters/employees",
    },
    
    // AI Features
    ai: {
      whatsappDemo: "/dashboard/whatsapp-demo",
      phoneCallDemo: "/dashboard/phone-call-demo",
      emailDemo: "/dashboard/email-demo",
      webChatDemo: "/dashboard/web-chat-demo",
    },
  },
} as const;

// Route metadata tanımları
export const routeMetadata: Record<string, { titleKey: string; descriptionKey?: string }> = {
  [routes.dashboard.home]: {
    titleKey: "dashboard",
  },
  [routes.dashboard.customers]: {
    titleKey: "customers",
  },
  [routes.dashboard.tickets]: {
    titleKey: "tickets",
  },
  [routes.dashboard.appointments]: {
    titleKey: "appointments",
  },
  [routes.dashboard.users]: {
    titleKey: "users",
  },
  [routes.dashboard.inbox]: {
    titleKey: "inbox",
  },
  [routes.dashboard.companies]: {
    titleKey: "companies",
  },
  [routes.dashboard.quotes]: {
    titleKey: "quotes",
  },
  [routes.dashboard.invoices]: {
    titleKey: "invoices",
  },
  [routes.dashboard.activityLogs]: {
    titleKey: "activityLogs",
  },
  [routes.dashboard.notifications]: {
    titleKey: "notifications",
  },
};

// Metadata helper
export function createPageMetadata(titleKey: string, customTitle?: string): Metadata {
  const title = customTitle || titleKey;
  return {
    title: `${title} | Acar CRM`,
  };
}

// Type helper for route paths
export type RouteValue = string | { [key: string]: RouteValue };

export function getRouteValue(path: RouteValue): string {
  return typeof path === "string" ? path : "";
}
