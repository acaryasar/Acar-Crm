"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Clock, User, Check, Edit } from "lucide-react";
import { updateTicketAssignment } from "../actions/assignUser-ticket";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Appointment {
  id: string;
  startAt: string;
  endAt: string;
}

interface Props {
  ticketId: string;
  customerId: string;
  currentAssignedUserId: string;
  currentAppointment?: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function TicketAssignmentEditDialog({
  ticketId,
  customerId,
  currentAssignedUserId,
  currentAppointment,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>(currentAssignedUserId);
  const [selectedDate, setSelectedDate] = useState<string>(
    currentAppointment ? new Date(currentAppointment.startAt).toISOString().split('T')[0] : ""
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    currentAppointment ? new Date(currentAppointment.startAt).toTimeString().slice(0, 5) : ""
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  // Fetch users when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      setSelectedUserId(currentAssignedUserId);
      if (currentAppointment) {
        setSelectedDate(new Date(currentAppointment.startAt).toISOString().split('T')[0]);
        setSelectedTime(new Date(currentAppointment.startAt).toTimeString().slice(0, 5));
      }
    }
  }, [isOpen, currentAssignedUserId, currentAppointment]);

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
    setLoading(true);
    try {
      const response = await fetch(
        `/api/appointments/timeline?date=${selectedDate}&userId=${selectedUserId}`
      );
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!selectedUserId || !selectedDate || !selectedTime) {
      setError("Lütfen tüm alanları doldurund");
      setSubmitting(false);
      return;
    }

    try {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const startAt = new Date(selectedDate);
      startAt.setHours(hours, minutes, 0, 0);
      
      const endAt = new Date(startAt);
      endAt.setHours(endAt.getHours() + 1);

      // Check if anything changed
      const userChanged = selectedUserId !== currentAssignedUserId;
      const timeChanged = 
        currentAppointment &&
        (new Date(currentAppointment.startAt).getTime() !== startAt.getTime() ||
         new Date(currentAppointment.endAt).getTime() !== endAt.getTime());

      if (!userChanged && !timeChanged) {
        setError("Değişiklik yapılmadı");
        setSubmitting(false);
        return;
      }

      await updateTicketAssignment({
        ticketId,
        newAssignedUserId: userChanged ? selectedUserId : undefined,
        newAppointmentStartAt: timeChanged ? startAt : undefined,
        newAppointmentEndAt: timeChanged ? endAt : undefined,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update assignment:", error);
      setError("Atama güncelleme işlemi başarısız oldu");
    } finally {
      setSubmitting(false);
    }
  };

  const isTimeSlotAvailable = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const slotStart = new Date(selectedDate);
    slotStart.setHours(hours, minutes, 0, 0);
    
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(slotEnd.getHours() + 1);

    // Allow the current appointment slot
    const currentStart = currentAppointment ? new Date(currentAppointment.startAt) : null;
    const currentEnd = currentAppointment ? new Date(currentAppointment.endAt) : null;

    return !appointments.some((apt) => {
      // Skip the current appointment
      if (currentAppointment && apt.id === currentAppointment.id) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Edit size={20} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Atamayı Düzenle</h2>
              <p className="text-sm text-slate-500">Personel veya randevu bilgilerini güncelleyin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* User Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Personel Seçin
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tarih Seçin
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {/* Time Selection */}
          {selectedUserId && selectedDate && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Saat Seçin
              </label>
              {loading ? (
                <div className="text-center py-8 text-slate-500">
                  Randevular yükleniyor...
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {generateTimeSlots().map((time) => {
                    const isAvailable = isTimeSlotAvailable(time);
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        disabled={!isAvailable}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedTime === time
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                            : isAvailable
                            ? "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                            : "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <Clock size={14} />
                          <span className="text-sm font-medium">{time}</span>
                        </div>
                        {!isAvailable && (
                          <div className="text-xs text-slate-400 mt-1">Dolu</div>
                        )}
                        {selectedTime === time && isAvailable && (
                          <div className="flex items-center justify-center mt-1">
                            <Check size={14} className="text-indigo-600" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedUserId || !selectedDate || !selectedTime}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Güncelleniyor...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Güncelle
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
