interface Props {
  appointment: {
    title: string;
    startAt: Date;
    endAt: Date;
    status: string;
  };
}

export function AppointmentCard({
  appointment,
}: Props) {
  return (
    <div className="border rounded p-4">
      <h3 className="font-semibold">
        {appointment.title}
      </h3>

      <p>
        {appointment.startAt.toLocaleString()}
      </p>

      <p>
        {appointment.endAt.toLocaleString()}
      </p>

      <p>{appointment.status}</p>
    </div>
  );
}