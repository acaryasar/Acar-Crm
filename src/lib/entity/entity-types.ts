export type EntityType =
  | "CUSTOMER"
  | "USER"
  | "TICKET"
  | "APPOINTMENT"
  | "QUOTE"
  | "INVOICE"
  | "COMPANY"
  | "COMMISSION_RULE";

export interface ActionItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  destructive?: boolean;
}  