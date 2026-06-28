import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function useEntityToggleStatus(toggleAction: (id: string) => Promise<any>) {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);
  
  const t = useTranslations("dialogs");

  const handleToggleStatus = async (id: string) => {
    try {
      setIsToggling(true);
      await toggleAction(id);
      router.refresh();
    } catch (error) {
      console.error("Status toggle error:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return { handleToggleStatus, isToggling };
}
