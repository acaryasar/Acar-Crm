import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function useEntityDelete(deleteAction: (id: string) => Promise<any>) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const t = useTranslations("dialogs");

  const handleDelete = async (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await deleteAction(deleteId);
      router.refresh();
      setDeleteId(null);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  return { handleDelete, isDeleting, deleteId, confirmDelete, cancelDelete };
}
