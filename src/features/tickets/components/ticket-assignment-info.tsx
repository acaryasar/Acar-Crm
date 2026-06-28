"use client";

import { User, Calendar, Clock, Edit, X } from "lucide-react";

interface AssignmentInfo {
  assignedUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  appointment?: {
    id: string;
    startAt: string;
    endAt: string;
  };
}

interface Props {
  assignment: AssignmentInfo;
  onEdit: () => void;
  onCancel: () => void;
}

export function TicketAssignmentInfo({ assignment, onEdit, onCancel }: Props) {
  const { assignedUser, appointment } = assignment;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <h3 className="font-semibold text-slate-800">Atama Bilgileri</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-600 hover:text-indigo-600"
            title="Atamayı Düzenle"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-600 hover:text-red-600"
            title="Atamayı İptal Et"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Assigned User */}
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
            {assignedUser.firstName[0]}{assignedUser.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-800 truncate">
              {assignedUser.firstName} {assignedUser.lastName}
            </p>
            <p className="text-sm text-slate-600 truncate">{assignedUser.email}</p>
          </div>
        </div>

        {/* Appointment Info */}
        {appointment && (
          <div className="pt-3 border-t border-indigo-200/50 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={14} className="text-indigo-600" />
              <span className="text-slate-700">
                {new Date(appointment.startAt).toLocaleDateString('tr-TR', {
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
                {new Date(appointment.startAt).toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                {" - "}
                {new Date(appointment.endAt).toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
