"use client";

type Props = {
  value: string;
};

export function RoleSelect({
  value,
}: Props) {
  return (
    <select
      defaultValue={value}
      className="rounded border p-2"
    >
      <option value="ADMIN">
        ADMIN
      </option>

      <option value="MANAGER">
        MANAGER
      </option>

      <option value="EMPLOYEE">
        EMPLOYEE
      </option>
    </select>
  );
}