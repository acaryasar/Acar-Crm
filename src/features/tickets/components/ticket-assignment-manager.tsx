"use client";

import { useState } from "react";
import { TicketAssignmentButton } from "./ticket-assignment-button";
import { TicketAssignmentInfo } from "./ticket-assignment-info";
import { TicketAssignmentDialog } from "./ticket-assignment-dialog";
import { TicketAssignmentEditDialog } from "./ticket-assignment-edit-dialog";
import { cancelTicketAssignment } from "../actions/assignUser-ticket";

interface Props {
  ticketId: string;
  customerId: string;
  companyId: string;
  status: string;
  assignedUser?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  appointment?: {
    id: string;
    startAt: string;
    endAt: string;
  } | null;
}

export function TicketAssignmentManager({
  ticketId,
  customerId,
  companyId,
  status,
  assignedUser,
  appointment,
}: Props) {
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleAssignmentSuccess = () => {
    window.location.reload();
  };

  const handleEditSuccess = () => {
    window.location.reload();
  };

  const handleCancelAssignment = async () => {
    if (!confirm("Atamayı iptal etmek istediğinize emin misiniz?")) {
      return;
    }

    setIsCancelling(true);
    try {
      await cancelTicketAssignment({
        ticketId,
        companyId,
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to cancel assignment:", error);
      alert("Atama iptal edilirken bir hata oluştu");
    } finally {
      setIsCancelling(false);
    }
  };

  // Show assignment button for NEW status
  if (status === "NEW" && !assignedUser) {
    return (
      <>
        <TicketAssignmentButton
          ticketId={ticketId}
          customerId={customerId}
          companyId={companyId}
          status={status}
        />
        <TicketAssignmentDialog
          ticketId={ticketId}
          customerId={customerId}
          companyId={companyId}
          isOpen={isAssignmentDialogOpen}
          onClose={() => setIsAssignmentDialogOpen(false)}
          onSuccess={handleAssignmentSuccess}
        />
      </>
    );
  }

  // Show assignment info for ASSIGNED status
  if (status === "ASSIGNED" && assignedUser) {
    return (
      <>
        <TicketAssignmentInfo
          assignment={{
            assignedUser,
            appointment: appointment || undefined,
          }}
          onEdit={() => setIsEditDialogOpen(true)}
          onCancel={handleCancelAssignment}
        />
        <TicketAssignmentEditDialog
          ticketId={ticketId}
          customerId={customerId}
          companyId={companyId}
          currentAssignedUserId={assignedUser.id}
          currentAppointment={appointment || undefined}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSuccess={handleEditSuccess}
        />
      </>
    );
  }

  return null;
}
