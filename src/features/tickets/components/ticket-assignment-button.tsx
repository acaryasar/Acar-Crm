"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { TicketAssignmentDialog } from "./ticket-assignment-dialog";

interface Props {
  ticketId: string;
  customerId: string;
  companyId: string;
  status: string;
}

export function TicketAssignmentButton({
  ticketId,
  customerId,
  companyId,
  status,
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Only show assignment button for NEW status tickets
  if (status !== "NEW") {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
      >
        <UserPlus size={16} />
        Atama Yap
      </button>

      <TicketAssignmentDialog
        ticketId={ticketId}
        customerId={customerId}
        companyId={companyId}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => {
          setIsDialogOpen(false);
          window.location.reload();
        }}
      />
    </>
  );
}
