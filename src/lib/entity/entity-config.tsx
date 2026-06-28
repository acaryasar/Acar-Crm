import { EntityType, ActionItem } from "./entity-types";
import { Pencil, Trash2, Lock, History } from "lucide-react";

type UserRole = "ADMIN" | "SUPERVISOR" | "MANAGER" | "EMPLOYEE";

export interface EntityConfig {
  route: string;
  hasStatus: boolean;
  canDelete: boolean;
  canEdit: boolean;
  canView: boolean;
  canShowActivityLog: boolean;
  getActions: (
    entityId: string,
    isActive: boolean,
    onDelete: (id: string) => void,
    onToggleStatus: (id: string) => void,
    t: (key: string) => string, // Çeviri fonksiyonu için yer tutucu
    userRole?: UserRole // Kullanıcı rolü için parametre
  ) => ActionItem[];
}

// Silme işlemi için rol kontrolü
const canDelete = (userRole?: UserRole): boolean => {
  return userRole === "ADMIN" || userRole === "SUPERVISOR";
};

export const ENTITY_CONFIG: Record<EntityType, EntityConfig> = {
  COMPANY: {
    route: "/dashboard/companies",
    hasStatus: true,
    canDelete: true,
    canEdit: true,
    canView: true,
    canShowActivityLog: true,
    getActions: (entityId, isActive, onDelete, onToggleStatus, t, userRole) => {
      const actions: ActionItem[] = [
        {
          label: t("edit"),
          icon: <Pencil size={15} />,
          href: `/dashboard/companies?mode=edit&id=${entityId}`,
        },
        {
          label: isActive ? t("deactivateTitle") : t("activateTitle"),
          icon: <Lock size={15} />,
          onClick: () => onToggleStatus(entityId),
        },
        {
          label: t("activityLog"),
          icon: <History size={15} />,
          href: `/dashboard/activity-log?entityType=COMPANY&entityId=${entityId}`,
        },
      ];

      if (canDelete(userRole)) {
        actions.push({
          label: t("delete"),
          icon: <Trash2 size={15} />,
          destructive: true,
          onClick: () => onDelete(entityId),
        });
      }

      return actions;
    },
  },
  CUSTOMER: {
    route: "/dashboard/customers",
    hasStatus: true,
    canDelete: true,
    canEdit: true,
    canView: true,
    canShowActivityLog: true,
    getActions: (entityId, isActive, onDelete, onToggleStatus, t, userRole) => {
      const actions: ActionItem[] = [
        {
          label: t("edit"),
          icon: <Pencil size={15} />,
          href: `/dashboard/customers?mode=edit&id=${entityId}`,
        },
        {
          label: isActive ? t("deactivateTitle") : t("activateTitle"),
          icon: <Lock size={15} />,
          onClick: () => onToggleStatus(entityId),
        },
        {
          label: t("activityLog"),
          icon: <History size={15} />,
          href: `/dashboard/activity-log?entityType=CUSTOMER&entityId=${entityId}`,
        },
      ];

      if (canDelete(userRole)) {
        actions.push({
          label: t("delete"),
          icon: <Trash2 size={15} />,
          destructive: true,
          onClick: () => onDelete(entityId),
        });
      }

      return actions;
    },
  },
  USER: {
    route: "/dashboard/users",
    hasStatus: true,
    canDelete: true,
    canEdit: true,
    canView: true,
    canShowActivityLog: true,
    getActions: (entityId, isActive, onDelete, onToggleStatus, t, userRole) => {
      const actions: ActionItem[] = [
        {
          label: t("edit"),
          icon: <Pencil size={15} />,
          href: `/dashboard/users?mode=edit&id=${entityId}`,
        },
        {
          label: isActive ? t("deactivateTitle") : t("activateTitle"),
          icon: <Lock size={15} />,
          onClick: () => onToggleStatus(entityId),
        },
        {
          label: t("activityLog"),
          icon: <History size={15} />,
          href: `/dashboard/activity-log?entityType=USER&entityId=${entityId}`,
        },
      ];

      if (canDelete(userRole)) {
        actions.push({
          label: t("delete"),
          icon: <Trash2 size={15} />,
          destructive: true,
          onClick: () => onDelete(entityId),
        });
      }

      return actions;
    },
  },
  TICKET: {
    route: "/dashboard/tickets",
    hasStatus: false,
    canDelete: true,
    canEdit: true,
    canView: true,
    canShowActivityLog: true,
    getActions: (entityId, isActive, onDelete, onToggleStatus, t, userRole) => {
      const actions: ActionItem[] = [
        {
          label: t("edit"),
          icon: <Pencil size={15} />,
          href: `/dashboard/tickets?mode=edit&id=${entityId}`,
        },
        {
          label: t("activityLog"),
          icon: <History size={15} />,
          href: `/dashboard/activity-log?entityType=TICKET&entityId=${entityId}`,
        },
      ];

      if (canDelete(userRole)) {
        actions.push({
          label: t("delete"),
          icon: <Trash2 size={15} />,
          destructive: true,
          onClick: () => onDelete(entityId),
        });
      }

      return actions;
    },
  },
  APPOINTMENT: {
    route: "/dashboard/appointments",
    hasStatus: false,
    canDelete: true,
    canEdit: true,
    canView: true,
    canShowActivityLog: true,
    getActions: (entityId, isActive, onDelete, onToggleStatus, t, userRole) => {
      const actions: ActionItem[] = [
        {
          label: t("edit"),
          icon: <Pencil size={15} />,
          href: `/dashboard/appointments/${entityId}/edit`,
        },
        {
          label: t("activityLog"),
          icon: <History size={15} />,
          href: `/dashboard/activity-log?entityType=APPOINTMENT&entityId=${entityId}`,
        },
      ];

      if (canDelete(userRole)) {
        actions.push({
          label: t("delete"),
          icon: <Trash2 size={15} />,
          destructive: true,
          onClick: () => onDelete(entityId),
        });
      }

      return actions;
    },
  },
  QUOTE: {
    route: "/dashboard/quotes",
    hasStatus: true,
    canDelete: true,
    canEdit: true,
    canView: true,
    canShowActivityLog: true,
    getActions: (entityId, isActive, onDelete, onToggleStatus, t, userRole) => {
      const actions: ActionItem[] = [
        {
          label: t("edit"),
          icon: <Pencil size={15} />,
          href: `/dashboard/quotes/${entityId}/edit`,
        },
        {
          label: isActive ? t("deactivateTitle") : t("activateTitle"),
          icon: <Lock size={15} />,
          onClick: () => onToggleStatus(entityId),
        },
        {
          label: t("activityLog"),
          icon: <History size={15} />,
          href: `/dashboard/activity-log?entityType=QUOTE&entityId=${entityId}`,
        },
      ];

      if (canDelete(userRole)) {
        actions.push({
          label: t("delete"),
          icon: <Trash2 size={15} />,
          destructive: true,
          onClick: () => onDelete(entityId),
        });
      }

      return actions;
    },
  },
  INVOICE: {
    route: "/dashboard/invoices",
    hasStatus: false,
    canDelete: true,
    canEdit: true,
    canView: true,
    canShowActivityLog: true,
    getActions: (entityId, isActive, onDelete, onToggleStatus, t, userRole) => {
      const actions: ActionItem[] = [
        {
          label: t("edit"),
          icon: <Pencil size={15} />,
          href: `/dashboard/invoices/${entityId}/edit`,
        },
        {
          label: t("activityLog"),
          icon: <History size={15} />,
          href: `/dashboard/activity-log?entityType=INVOICE&entityId=${entityId}`,
        },
      ];

      if (canDelete(userRole)) {
        actions.push({
          label: t("delete"),
          icon: <Trash2 size={15} />,
          destructive: true,
          onClick: () => onDelete(entityId),
        });
      }

      return actions;
    },
  },
};
