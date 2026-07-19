import { EntityType } from "./entity-types";

export interface EntityConfig {
  getActions: (
    entityId: string,
    isActive: boolean,
    onDelete: (id: string) => void,
    onToggleStatus: (id: string) => void,
    t: any,
    userRole?: string
  ) => any[];
}

export const ENTITY_CONFIG: Record<string, EntityConfig> = {
  CUSTOMER: {
    getActions: (entityId, isActive, onDelete, onToggleStatus, t, userRole) => [
      {
        label: t("edit") || "Edit",
        icon: "edit",
        href: `/customers?mode=edit&id=${entityId}`,
      },
      {
        label: isActive ? (t("deactivate") || "Deactivate") : (t("activate") || "Activate"),
        icon: isActive ? "power-off" : "power",
        onClick: () => onToggleStatus(entityId),
      },
      {
        label: t("delete") || "Delete",
        icon: "trash",
        destructive: true,
        onClick: () => onDelete(entityId),
      },
    ],
  },
  USER: {
    getActions: (entityId, isActive, onDelete, onToggleStatus, t, userRole) => [
      {
        label: t("edit") || "Edit",
        icon: "edit",
        href: `/users?mode=edit&id=${entityId}`,
      },
      {
        label: isActive ? (t("deactivate") || "Deactivate") : (t("activate") || "Activate"),
        icon: isActive ? "power-off" : "power",
        onClick: () => onToggleStatus(entityId),
      },
      {
        label: t("delete") || "Delete",
        icon: "trash",
        destructive: true,
        onClick: () => onDelete(entityId),
      },
    ],
  },
  TICKET: {
    getActions: (entityId, isActive, onDelete, onToggleStatus, t, userRole) => [
      {
        label: t("view") || "View",
        icon: "more",
        href: `/tickets?mode=view&id=${entityId}`,
      },
      {
        label: isActive ? (t("close") || "Close") : (t("reopen") || "Reopen"),
        icon: isActive ? "power-off" : "power",
        onClick: () => onToggleStatus(entityId),
      },
      {
        label: t("delete") || "Delete",
        icon: "trash",
        destructive: true,
        onClick: () => onDelete(entityId),
      },
    ],
  },
  APPOINTMENT: {
    getActions: (entityId, isActive, onDelete, onToggleStatus, t, userRole) => [
      {
        label: t("edit") || "Edit",
        icon: "edit",
        href: `/appointments?mode=edit&id=${entityId}`,
      },
      {
        label: isActive ? (t("cancel") || "Cancel") : (t("reactivate") || "Reactivate"),
        icon: isActive ? "power-off" : "power",
        onClick: () => onToggleStatus(entityId),
      },
      {
        label: t("delete") || "Delete",
        icon: "trash",
        destructive: true,
        onClick: () => onDelete(entityId),
      },
    ],
  },
  QUOTE: {
    getActions: (entityId, isActive, onDelete, onToggleStatus, t, userRole) => [
      {
        label: t("edit") || "Edit",
        icon: "edit",
        href: `/quotes?mode=edit&id=${entityId}`,
      },
      {
        label: t("delete") || "Delete",
        icon: "trash",
        destructive: true,
        onClick: () => onDelete(entityId),
      },
    ],
  },
  INVOICE: {
    getActions: (entityId, isActive, onDelete, onToggleStatus, t, userRole) => [
      {
        label: t("edit") || "Edit",
        icon: "edit",
        href: `/invoices?mode=edit&id=${entityId}`,
      },
      {
        label: isActive ? (t("cancel") || "Cancel") : (t("reactivate") || "Reactivate"),
        icon: isActive ? "power-off" : "power",
        onClick: () => onToggleStatus(entityId),
      },
      {
        label: t("delete") || "Delete",
        icon: "trash",
        destructive: true,
        onClick: () => onDelete(entityId),
      },
    ],
  },
  COMMISSION_RULE: {
    getActions: (entityId, isActive, onDelete, onToggleStatus, t, userRole) => [
      {
        label: t("edit") || "Edit",
        icon: "edit",
        href: `/commission-rules?mode=edit&id=${entityId}`,
      },
      {
        label: isActive ? (t("deactivate") || "Deactivate") : (t("activate") || "Activate"),
        icon: isActive ? "power-off" : "power",
        onClick: () => onToggleStatus(entityId),
      },
      {
        label: t("delete") || "Delete",
        icon: "trash",
        destructive: true,
        onClick: () => onDelete(entityId),
      },
    ],
  },
  ORDER: {
    getActions: (entityId, isActive, onDelete, onToggleStatus, t, userRole) => [
      {
        label: t("edit") || "Edit",
        icon: "edit",
        href: `/orders?mode=edit&id=${entityId}`,
      },
      {
        label: isActive ? (t("cancel") || "Cancel") : (t("reactivate") || "Reactivate"),
        icon: isActive ? "power-off" : "power",
        onClick: () => onToggleStatus(entityId),
      },
      {
        label: t("delete") || "Delete",
        icon: "trash",
        destructive: true,
        onClick: () => onDelete(entityId),
      },
    ],
  },
  PRODUCT: {
    getActions: (entityId, isActive, onDelete, onToggleStatus, t, userRole) => [
      {
        label: t("edit") || "Edit",
        icon: "edit",
        href: `/products?mode=edit&id=${entityId}`,
      },
      {
        label: isActive ? (t("deactivate") || "Deactivate") : (t("activate") || "Activate"),
        icon: isActive ? "power-off" : "power",
        onClick: () => onToggleStatus(entityId),
      },
      {
        label: t("delete") || "Delete",
        icon: "trash",
        destructive: true,
        onClick: () => onDelete(entityId),
      },
    ],
  },
};
