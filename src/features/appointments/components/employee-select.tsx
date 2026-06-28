interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

interface Props {
  employees: Employee[];
}

export function EmployeeSelect({
  employees,
}: Props) {
  return (
    <select
      name="employeeId"
      className="border rounded p-2"
    >
      <option value="">
        Personel Seç
      </option>

      {employees.map((employee) => (
        <option
          key={employee.id}
          value={employee.id}
        >
          {employee.firstName}{" "}
          {employee.lastName}
        </option>
      ))}
    </select>
  );
}