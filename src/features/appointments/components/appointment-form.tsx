import { EmployeeSelect } from "./employee-select";

interface Props {
  employees: {
    id: string;
    firstName: string;
    lastName: string;
  }[];
}

export function AppointmentForm({
  employees,
}: Props) {
  return (
    <form className="space-y-4">
      <input
        name="title"
        placeholder="Başlık"
        className="border p-2 rounded w-full"
      />

      <textarea
        name="description"
        placeholder="Açıklama"
        className="border p-2 rounded w-full"
      />

      <EmployeeSelect
        employees={employees}
      />

      <input
        type="datetime-local"
        name="startAt"
      />

      <input
        type="datetime-local"
        name="endAt"
      />

      <button
        className="border rounded px-4 py-2"
      >
        Kaydet
      </button>
    </form>
  );
}