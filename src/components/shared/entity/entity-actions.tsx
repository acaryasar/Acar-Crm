// src/components/shared/entity/entity-actions.tsx
"use client";

import { useTranslations } from "next-intl";
import { ActionMenu } from "./action-menu";
import { ENTITY_CONFIG } from "@/lib/entity/entity-config";
import { EntityType } from "@/lib/entity/entity-types";
import { DeleteDialog } from "./delete-dialog";

type UserRole = "ADMIN" | "SUPERVISOR" | "MANAGER" | "EMPLOYEE";

interface Props {
  entityType: EntityType;
  entityId: string;
  isActive?: boolean;
  onDelete?: (entityId: string) => void;
  onToggleStatus?: (entityId: string) => void;
  deleteId?: string | null;
  confirmDelete?: () => Promise<void>;
  cancelDelete?: () => void;
  userRole?: UserRole;
  // Opsiyonel: Dışarıdan ekstra aksiyon eklemek isterseniz
  extraActions?: any[];
}

export function EntityActions({
  entityType,
  entityId,
  isActive = true,
  onDelete,
  onToggleStatus,
  deleteId,
  confirmDelete,
  cancelDelete,
  userRole,
}: Props) {
  const t = useTranslations("dialogs"); // Veya ilgili namespace
  const config = ENTITY_CONFIG[entityType];

  // Config içindeki generic fonksiyonu çağırıyoruz
  const actions = config.getActions(
    entityId,
    isActive,
    (id) => onDelete?.(id),
    (id) => onToggleStatus?.(id),
    t,
    userRole
  );

  // Modify delete action to trigger dialog instead of direct delete
  const modifiedActions = actions.map((action) => {
    if (action.destructive && action.onClick) {
      return {
        ...action,
        onClick: () => onDelete?.(entityId),
      };
    }
    return action;
  });

  return (
    <>
      <ActionMenu items={modifiedActions} />
      {deleteId === entityId && (
        <DeleteDialog
          trigger={<div />}
          onConfirm={confirmDelete || (async () => {})}
          title={t("deleteTitle")}
          description={t("deleteDescription")}
          open={true}
          onOpenChange={(open) => !open && cancelDelete?.()}
        />
      )}
    </>
  );
}
