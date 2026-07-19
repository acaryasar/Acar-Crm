export type EntityType =
  | "CUSTOMER"
  | "USER"
  | "TICKET"
  | "APPOINTMENT"
  | "QUOTE"
  | "INVOICE"
  | "COMMISSION_RULE"
  | "ORDER"
  | "PRODUCT";

export interface ActionItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  destructive?: boolean;
}  