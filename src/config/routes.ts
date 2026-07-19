import type { Metadata } from "next";

export const routes = {
  // Public
  login: "/login",
  
  // Dashboard
  dashboard: {
    home: "/dashboard",
  },
  
  // Main pages (without dashboard prefix)
  inbox: "/inbox",
  customers: "/customers",
  companies: "/companies",
  tickets: "/tickets",
  appointments: "/appointments",
  users: "/users",
  quotes: "/quotes",
  invoices: "/invoices",
  notifications: "/notifications",
  
  // Product & Stock Management
  products: "/products",
  stock: "/stock",
  orders: "/orders",
  purchases: "/purchases",
  
  // Commission
  commission: {
    rules: "/commission-rules",
    calculation: "/commission-calculation",
    payment: "/commission-payment",
  },
  
  // Parameters
  parameters: {
    base: "/parameters",
    salesTypes: "/parameters/sales-types",
    currencies: "/parameters/currencies",
    customerTypes: "/parameters/customer-types",
    departments: "/parameters/departments",
    banks: "/parameters/banks",
    bankAccounts: "/parameters/bank-accounts",
    cargoFirms: "/parameters/cargo-firms",
    customerAuthorities: "/parameters/customer-authorities",
    employees: "/parameters/employees",
  },
  
  // AI Features
  ai: {
    whatsappDemo: "/whatsapp-demo",
    phoneCallDemo: "/phone-call-demo",
    emailDemo: "/email-demo",
    webChatDemo: "/web-chat-demo",
  },

  // Reports
  reports: {
    salesOrderReport: "/reports/sales-order-report",
    salesPersonnelDetailReport: "/reports/sales-personnel-detail-report",
  },
} as const;

// Route metadata tanımları
export const routeMetadata: Record<string, { titleKey: string; descriptionKey?: string }> = {
  [routes.dashboard.home]: {
    titleKey: "dashboard",
  },
  [routes.customers]: {
    titleKey: "customers",
  },
  [routes.tickets]: {
    titleKey: "tickets",
  },
  [routes.appointments]: {
    titleKey: "appointments",
  },
  [routes.users]: {
    titleKey: "users",
  },
  [routes.inbox]: {
    titleKey: "inbox",
  },
  [routes.companies]: {
    titleKey: "companies",
  },
  [routes.quotes]: {
    titleKey: "quotes",
  },
  [routes.invoices]: {
    titleKey: "invoices",
  },
  [routes.notifications]: {
    titleKey: "notifications",
  },
  [routes.products]: {
    titleKey: "products",
  },
  [routes.stock]: {
    titleKey: "stock",
  },
  [routes.orders]: {
    titleKey: "orders",
  },
  [routes.purchases]: {
    titleKey: "purchases",
  },
  [routes.parameters.base]: {
    titleKey: "parameters",
  },
  [routes.reports.salesOrderReport]: {
    titleKey: "salesOrderReport",
  },
  [routes.reports.salesPersonnelDetailReport]: {
    titleKey: "salesPersonnelDetailReport",
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
