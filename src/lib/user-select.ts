/**
 * Prisma `select` for exposing a User record (or a User relation) to API
 * responses safely. Never spread/include a full User record in a response
 * without this (or an equivalent) — the User model has a bcrypt `password`
 * hash plus sensitive PII (nationalId, dateOfBirth) that must never reach
 * the client.
 */
export const safeUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
} as const;
