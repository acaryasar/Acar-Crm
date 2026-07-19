"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/notification";
import { logActivity } from "@/lib/entity/activity-log";
import { sendCustomerAssignmentNotification } from "@/lib/customer-notification";

interface AssignUserWithAppointmentInput {
  ticketId: string;
  assignedUserId: string;
  appointmentStartAt: Date;
  appointmentEndAt: Date;
}

export async function assignUserTicketWithAppointment(
  data: AssignUserWithAppointmentInput
) {
  const { ticketId, assignedUserId, appointmentStartAt, appointmentEndAt } = data;

  // Get ticket details
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { customer: true },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  // Get assigned user details
  const assignedUser = await prisma.user.findUnique({
    where: { id: assignedUserId },
  });

  if (!assignedUser) {
    throw new Error("Assigned user not found");
  }

  // Update ticket with assigned user and status
  const updatedTicket = await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      assignedUserId,
      status: "ASSIGNED",
    },
    include: { customer: true, assignedUser: true },
  });

  // Create appointment
  const appointment = await prisma.appointment.create({
    data: {
      customerId: ticket.customerId,
      employeeId: assignedUserId,
      title: `Ticket: ${ticket.title}`,
      description: ticket.description,
      status: "PLANNED",
      startAt: appointmentStartAt,
      endAt: appointmentEndAt,
    },
  });

  // Create notification for assigned user
  await createNotification({
    userId: assignedUserId,
    title: "Yeni Talep Atandı",
    message: `${ticket.customer.firstName} ${ticket.customer.lastName} müşterisinin "${ticket.title}" talebi size atandı. Randevu: ${appointmentStartAt.toLocaleString()}`,
    type: "INFO",
    entityType: "TICKET",
    entityId: ticketId,
  });

  // Send notification to customer
  await sendCustomerAssignmentNotification({
    customerId: ticket.customerId,
    ticketTitle: ticket.title,
    assignedUserName: `${assignedUser.firstName} ${assignedUser.lastName}`,
    appointmentDate: appointmentStartAt,
    ticketId,
  });

  await createNotification({
    title: "Müşteriye Bildirim Gönderildi",
    message: `${ticket.customer.firstName} ${ticket.customer.lastName} müşterisine atama ve randevu bilgileri gönderildi.`,
    type: "SUCCESS",
    entityType: "TICKET",
    entityId: ticketId,
  });

  // Log activity
  await logActivity({
    action: "TICKET_ASSIGNED",
    entityType: "TICKET",
    entityId: ticketId,
    metadata: {
      assignedUserId,
      appointmentId: appointment.id,
      appointmentStartAt: appointmentStartAt.toISOString(),
      appointmentEndAt: appointmentEndAt.toISOString(),
    },
  });

  revalidatePath("/tickets");
  revalidatePath(`/tickets/${ticketId}`);

  return { ticket: updatedTicket, appointment };
}

interface CancelAssignmentInput {
  ticketId: string;
}

export async function cancelTicketAssignment(
  data: CancelAssignmentInput
) {
  const { ticketId } = data;

  // Get ticket details with appointment
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { 
      customer: true, 
      assignedUser: true,
    },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  if (!ticket.assignedUserId) {
    throw new Error("Ticket has no assignment to cancel");
  }

  // Find and cancel the related appointment
  const appointment = await prisma.appointment.findFirst({
    where: {
      customerId: ticket.customerId,
      employeeId: ticket.assignedUserId,
      title: `Ticket: ${ticket.title}`,
      status: "PLANNED",
    },
  });

  if (appointment) {
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: "CANCELLED", is_active: false, },
    });
  }

  // Update ticket to remove assignment and reset status
  const updatedTicket = await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      assignedUserId: null,
      status: "NEW",
    },
    include: { customer: true, assignedUser: true },
  });

  // Notify the previously assigned user
  if (ticket.assignedUser) {
    await createNotification({
      userId: ticket.assignedUser.id,
      title: "Talep Ataması İptal Edildi",
      message: `${ticket.customer.firstName} ${ticket.customer.lastName} müşterisinin "${ticket.title}" talebinin ataması iptal edildi.`,
      type: "WARNING",
      entityType: "TICKET",
      entityId: ticketId,
    });
  }

  await createNotification({
    title: "Talep Ataması İptal Edildi",
    message: `${ticket.customer.firstName} ${ticket.customer.lastName} müşterisinin "${ticket.title}" talebinin ataması iptal edildi.`,
    type: "WARNING",
    entityType: "TICKET",
    entityId: ticketId,
  });

  // Log activity
  await logActivity({
    action: "TICKET_ASSIGNMENT_CANCELLED",
    entityType: "TICKET",
    entityId: ticketId,
    metadata: {
      previousAssignedUserId: ticket.assignedUserId,
      cancelledAppointmentId: appointment?.id,
    },
  });

  revalidatePath("/tickets");
  revalidatePath(`/tickets/${ticketId}`);

  return { ticket: updatedTicket };
}

interface UpdateAssignmentInput {
  ticketId: string;
  newAssignedUserId?: string;
  newAppointmentStartAt?: Date;
  newAppointmentEndAt?: Date;
}

export async function updateTicketAssignment(
  data: UpdateAssignmentInput
) {
  const { ticketId, newAssignedUserId, newAppointmentStartAt, newAppointmentEndAt } = data;

  // Get ticket details
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { customer: true, assignedUser: true },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  if (!ticket.assignedUserId) {
    throw new Error("Ticket has no assignment to update");
  }

  let userChanged = false;
  let appointmentChanged = false;
  let newAssignedUser = ticket.assignedUser;

  // Check if user is being changed
  if (newAssignedUserId && newAssignedUserId !== ticket.assignedUserId) {
    userChanged = true;
    newAssignedUser = await prisma.user.findUnique({
      where: { id: newAssignedUserId },
    });

    if (!newAssignedUser) {
      throw new Error("New assigned user not found");
    }
  }

  // Find existing appointment
  const appointment = await prisma.appointment.findFirst({
    where: {
      customerId: ticket.customerId,
      employeeId: ticket.assignedUserId,
      title: `Ticket: ${ticket.title}`,
      status: "PLANNED",
    },
  });

  // Check if appointment time is being changed
  if (newAppointmentStartAt && newAppointmentEndAt) {
    if (!appointment) {
      throw new Error("No appointment found to update");
    }
    appointmentChanged = true;
  }

  // Update ticket if user changed
  if (userChanged && newAssignedUserId) {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { assignedUserId: newAssignedUserId },
    });
  }

  // Update or create appointment
  let updatedAppointment = appointment;
  if (appointmentChanged && newAppointmentStartAt && newAppointmentEndAt && appointment) {
    // Cancel old appointment
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: "CANCELLED" },
    });

    // Create new appointment
    updatedAppointment = await prisma.appointment.create({
      data: {
        customerId: ticket.customerId,
        employeeId: newAssignedUserId || ticket.assignedUserId,
        title: `Ticket: ${ticket.title}`,
        description: ticket.description,
        status: "PLANNED",
        startAt: newAppointmentStartAt,
        endAt: newAppointmentEndAt,
      },
    });
  } else if (userChanged && newAssignedUserId) {
    // User changed but time didn't - cancel old appointment and create new one
    if (appointment) {
      await prisma.appointment.update({
        where: { id: appointment.id },
        data: { status: "CANCELLED" },
      });
    }

    // Create new appointment with same time if exists, or default time
    const startAt = appointment ? new Date(appointment.startAt) : new Date();
    const endAt = appointment ? new Date(appointment.endAt) : new Date(startAt.getTime() + 60 * 60 * 1000);

    updatedAppointment = await prisma.appointment.create({
      data: {
        customerId: ticket.customerId,
        employeeId: newAssignedUserId,
        title: `Ticket: ${ticket.title}`,
        description: ticket.description,
        status: "PLANNED",
        startAt,
        endAt,
      },
    });
  }

  // Notify old user if changed
  if (userChanged && ticket.assignedUser) {
    await createNotification({
      userId: ticket.assignedUser.id,
      title: "Talep Ataması Değiştirildi",
      message: `${ticket.customer.firstName} ${ticket.customer.lastName} müşterisinin "${ticket.title}" talebi başka personele atandı.`,
      type: "WARNING",
      entityType: "TICKET",
      entityId: ticketId,
    });
  }

  // Notify new user if changed
  if (userChanged && newAssignedUserId) {
    await createNotification({
      userId: newAssignedUserId,
      title: "Yeni Talep Atandı",
      message: `${ticket.customer.firstName} ${ticket.customer.lastName} müşterisinin "${ticket.title}" talebi size atandı. Randevu: ${updatedAppointment?.startAt?.toLocaleString() || "Belirlenmedi"}`,
      type: "INFO",
      entityType: "TICKET",
      entityId: ticketId,
    });
  }

  // Notify customer about changes
  if ((userChanged || appointmentChanged) && newAssignedUser) {
    await sendCustomerAssignmentNotification({
      customerId: ticket.customerId,
      ticketTitle: ticket.title,
      assignedUserName: `${newAssignedUser.firstName} ${newAssignedUser.lastName}`,
      appointmentDate: updatedAppointment?.startAt || new Date(),
      ticketId,
    });
  }

  await createNotification({
    title: "Talep Ataması Güncellendi",
    message: `${ticket.customer.firstName} ${ticket.customer.lastName} müşterisinin "${ticket.title}" talebinin ataması güncellendi.`,
    type: "INFO",
    entityType: "TICKET",
    entityId: ticketId,
  });

  // Log activity
  await logActivity({
    action: "TICKET_ASSIGNMENT_UPDATED",
    entityType: "TICKET",
    entityId: ticketId,
    metadata: {
      previousAssignedUserId: ticket.assignedUserId,
      newAssignedUserId: newAssignedUserId,
      userChanged,
      appointmentChanged,
      newAppointmentId: updatedAppointment?.id,
    },
  });

  revalidatePath("/tickets");
  revalidatePath(`/tickets/${ticketId}`);

  return { ticket, appointment: updatedAppointment };
}