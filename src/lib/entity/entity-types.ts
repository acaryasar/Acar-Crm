export type EntityType =
  | "CUSTOMER"
  | "USER"
  | "TICKET"
  | "APPOINTMENT"
  | "QUOTE"
  | "INVOICE"
  | "COMPANY";

export interface ActionItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  destructive?: boolean;
}  