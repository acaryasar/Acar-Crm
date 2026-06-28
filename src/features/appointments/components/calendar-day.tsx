import { AppointmentCard } from "./appointment-card";

interface Props {
  date: string;

  appointments: any[];
}

export function CalendarDay({
  date,
  appointments,
}: Props) {
  return (
    <div className="border rounded p-3">
      <h2 className="font-bold mb-3">
        {date}
      </h2>

      <div className="space-y-2">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
          />
        ))}
      </div>
    </div>
  );
}