"use client";

import { useState, useEffect } from "react";
import { Sparkles, Ticket, UserRound, AlignLeft, BarChart2, Activity, Loader2, Calendar, Clock, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { createTicket } from "../actions/create-ticket";
import { updateTicket } from "../actions/update-ticket";
import { assignUserTicketWithAppointment, cancelTicketAssignment } from "../actions/assignUser-ticket";
import { useRouter } from "next/navigation";
import { DeleteDialog } from "@/components/shared/entity/delete-dialog";

interface Customer {
  id: string;
  name: string;
}

interface TicketFormProps {
  mode?: "create" | "edit" | "view";
  customers: Customer[];
  ticket?: {
    id: string;
    customerId: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    assignedUser?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
    appointments?: Array<{
      id: string;
      startAt: string;
      endAt: string;
    }>;
  };
  hideAiSection?: boolean;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition";

const inputClassReadonly =
  "w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-600 outline-none";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export function TicketForm({ mode = "create", customers, ticket, hideAiSection = false }: TicketFormProps) {
  const t = useTranslations("tickets");
  const tDialogs = useTranslations("dialogs");
  const router = useRouter();
  const [loading, setLoading]     = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [mailText, setMailText]   = useState("");
  const isReadonly = mode === "view";

  // Assignment state
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>(ticket?.assignedUser?.id || "");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [assignmentSubmitting, setAssignmentSubmitting] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [form, setForm] = useState({
    customerId:  ticket?.customerId || "",
    title:       ticket?.title || "",
    description: ticket?.description || "",
    priority:    ticket?.priority || "MEDIUM",
    status:      ticket?.status || "NEW",
  });

  // Fetch users for assignment
  useEffect(() => {
    fetchUsers();
    // Pre-fill appointment data if exists
    if (ticket?.appointments && ticket.appointments.length > 0) {
      const apt = ticket.appointments[0];
      setSelectedDate(new Date(apt.startAt).toISOString().split('T')[0]);
      setSelectedTime(new Date(apt.startAt).toTimeString().slice(0, 5));
    }
  }, [ticket]);

  // Fetch appointments when user and date are selected
  useEffect(() => {
    if (selectedUserId && selectedDate) {
      fetchAppointments();
    }
  }, [selectedUserId, selectedDate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchAppointments = async () => {
    setAssignmentLoading(true);
    try {
      const response = await fetch(
        `/api/appointments/timeline?date=${selectedDate}&userId=${selectedUserId}`
      );
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setAssignmentLoading(false);
    }
  };

  const handleAssignUser = async () => {
    if (!selectedUserId || !selectedDate || !selectedTime || !ticket) {
      alert("Lütfen tüm atama alanlarını doldurun");
      return;
    }

    setAssignmentSubmitting(true);
    try {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const startAt = new Date(selectedDate);
      startAt.setHours(hours, minutes, 0, 0);
      
      const endAt = new Date(startAt);
      endAt.setHours(endAt.getHours() + 1);

      await assignUserTicketWithAppointment({
        ticketId: ticket.id,
        assignedUserId: selectedUserId,
        appointmentStartAt: startAt,
        appointmentEndAt: endAt,
      });

      window.location.reload();
    } catch (error) {
      console.error("Failed to assign user:", error);
      alert("Atama işlemi başarısız oldu");
    } finally {
      setAssignmentSubmitting(false);
    }
  };

  const handleCancelAssignment = async () => {
    setShowCancelConfirm(true);
  };

  const confirmCancelAssignment = async () => {
    if (!ticket) return;

    try {
      setIsCancelling(true);
      await cancelTicketAssignment({
        ticketId: ticket.id,
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to cancel assignment:", error);
      alert(t("cancelAssignmentError") || "Atama iptal edilirken bir hata oluştu");
    } finally {
      setIsCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  const isTimeSlotAvailable = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const slotStart = new Date(selectedDate);
    slotStart.setHours(hours, minutes, 0, 0);
    
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(slotEnd.getHours() + 1);

    // Allow the current appointment slot
    const currentStart = ticket?.appointments?.[0] ? new Date(ticket.appointments[0].startAt) : null;
    const currentEnd = ticket?.appointments?.[0] ? new Date(ticket.appointments[0].endAt) : null;

    return !appointments.some((apt) => {
      // Skip the current appointment
      if (ticket?.appointments?.[0] && apt.id === ticket.appointments[0].id) {
        return false;
      }

      const aptStart = new Date(apt.startAt);
      const aptEnd = new Date(apt.endAt);
      return (
        (slotStart >= aptStart && slotStart < aptEnd) ||
        (slotEnd > aptStart && slotEnd <= aptEnd) ||
        (slotStart <= aptStart && slotEnd >= aptEnd)
      );
    });
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        slots.push(timeStr);
      }
    }
    return slots;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      if (mode === "create") {
        await createTicket({
          customerId: form.customerId,
          title: form.title,
          description: form.description,
          priority: form.priority as any,
          status: form.status as any,
        });
        router.push("/tickets");
      } else if (mode === "edit" && ticket) {
        await updateTicket({
          ticketId: ticket.id,
          title: form.title,
          description: form.description,
          priority: form.priority as any,
          status: form.status as any,
        });
        router.push(`/tickets?mode=view&id=${ticket.id}`);
      }
    } catch (error) {
      console.error("Failed to save ticket:", error);
      alert("Talep kaydedilirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  async function generateWithAI() {
    if (!mailText.trim()) return;
    try {
      setAiLoading(true);
      const response = await fetch("/api/ai/extract-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: mailText }),
      });
      const data = await response.json();
      setForm((prev) => ({
        ...prev,
        title:       data.title       || "",
        description: data.description || "",
        priority:    data.priority    || "MEDIUM",
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <form id="ticket-form" onSubmit={handleSubmit} className="space-y-5">
      {mode !== "create" && ticket && (
        <input type="hidden" name="id" value={ticket.id} />
      )}

      {/* Main Fields and Assignment Details Grid */}
      <div className="grid grid-cols-2 gap-5">
        {/* Left Column - Personal Info & Notes */}
        <div className="col-span-1 space-y-5">
          {/* Ticket Details */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Ticket size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{t("ticketDetails")}</h2>
            </div>

            {/* Customer */}
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5"><UserRound size={12} />{t("customer")}</span>
              </label>
              <select
                name="customerId"
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                className={isReadonly ? inputClassReadonly : inputClass}
                disabled={isReadonly}
                required={!isReadonly}
              >
                <option value="">{t("selectCustomer")}</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className={labelClass}>{t("title")}</label>
              <input
                name="title"
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={isReadonly ? inputClassReadonly : inputClass}
                placeholder={t("briefSummary")}
                readOnly={isReadonly}
                required={!isReadonly}
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5"><AlignLeft size={12} />{t("description")}</span>
              </label>
              <textarea
                name="description"
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={(isReadonly ? inputClassReadonly : inputClass) + " resize-none"}
                placeholder={t("detailedDescription")}
                readOnly={isReadonly}
                required={!isReadonly}
              />
            </div>

            {/* Priority & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5"><BarChart2 size={12} />{t("priority")}</span>
                </label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className={isReadonly ? inputClassReadonly : inputClass}
                  disabled={isReadonly}
                >
                  <option value="LOW">{t("priorities.LOW")}</option>
                  <option value="MEDIUM">{t("priorities.MEDIUM")}</option>
                  <option value="HIGH">{t("priorities.HIGH")}</option>
                  <option value="URGENT">{t("priorities.URGENT")}</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5"><Activity size={12} />{t("status")}</span>
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className={isReadonly ? inputClassReadonly : inputClass}
                  disabled={isReadonly}
                >
                  <option value="NEW">New</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column - Address */}
        <div className="col-span-1">
          {/* Assignment Details Section */}
          {mode !== "create" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <UserRound size={16} className="text-indigo-500" />
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Atama Detayları</h2>
              </div>

              {/* Assigned User Info */}
              {ticket?.assignedUser && (
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl border border-indigo-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-semibold">
                        {ticket.assignedUser.firstName[0]}{ticket.assignedUser.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {ticket.assignedUser.firstName} {ticket.assignedUser.lastName}
                        </p>
                        <p className="text-sm text-slate-600">{ticket.assignedUser.email}</p>
                      </div>
                    </div>
                    {!isReadonly && (
                      <button
                        onClick={handleCancelAssignment}
                        className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-600 hover:text-red-600"
                        title={t("cancelAssignmentTitle")}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* Appointment Info */}
                  {ticket.appointments && ticket.appointments.length > 0 && (
                    <div className="pt-3 border-t border-indigo-200/50 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={14} className="text-indigo-600" />
                        <span className="text-slate-700">
                          {new Date(ticket.appointments[0].startAt).toLocaleDateString('tr-TR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={14} className="text-indigo-600" />
                        <span className="text-slate-700">
                          {new Date(ticket.appointments[0].startAt).toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {" - "}
                          {new Date(ticket.appointments[0].endAt).toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Assignment Form - Only for edit mode or view mode without assignment */}
                <div className="space-y-4">
                  {/* User Selection */}
                  <div>
                    <label className={labelClass}>Personel Seçin</label>
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Personel seçin</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className={labelClass}>Tarih Seçin</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className={inputClass}
                    />
                  </div>

                  {/* Time Selection */}
                  {selectedUserId && selectedDate && (
                    <div>
                      <label className={labelClass}>Saat Seçin</label>
                      {assignmentLoading ? (
                        <div className="text-center py-8 text-slate-500">
                          Randevular yükleniyor...
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {generateTimeSlots().map((time) => {
                            const isAvailable = isTimeSlotAvailable(time);
                            return (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setSelectedTime(time)}
                                disabled={!isAvailable}
                                className={`p-2 rounded-lg border-2 transition-all ${
                                  selectedTime === time
                                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                    : isAvailable
                                    ? "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                                    : "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                                }`}
                              >
                                <div className="flex items-center justify-center gap-1">
                                  <Clock size={12} />
                                  <span className="text-xs font-medium">{time}</span>
                                </div>
                                {!isAvailable && (
                                  <div className="text-xs text-slate-400 mt-1">Dolu</div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Assign Button */}
                  {selectedUserId && selectedDate && selectedTime && (
                    <button
                      type="button"
                      onClick={handleAssignUser}
                      disabled={assignmentSubmitting}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {assignmentSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Atanıyor...
                        </>
                      ) : (
                        "Atamayı Yap"
                      )}
                    </button>
                  )}
                </div>
              
            </div>
          )}
        </div>
      </div>

      {/* Cancel Assignment Confirmation Dialog */}
      {showCancelConfirm && (
        <DeleteDialog
          trigger={<div />}
          onConfirm={confirmCancelAssignment}
          title={t("cancelAssignmentTitle")}
          description={t("cancelAssignmentDescription")}
          open={showCancelConfirm}
          onOpenChange={setShowCancelConfirm}
        />
      )}
    </form>
  );
}
