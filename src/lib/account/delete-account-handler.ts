import type { DeleteOwnAccountResult } from "./delete-own-account";

export interface DeleteAccountDeps {
  /** Id of the signed-in user, or null. Identity always comes from the session, never from the body. */
  getUserId: () => Promise<string | null>;
  /** Password-guessing throttle; returns false when the caller must wait. */
  allow: (userId: string, request: Request) => boolean;
  remove: (userId: string, password: string) => Promise<DeleteOwnAccountResult>;
}

export function createDeleteAccountHandler(deps: DeleteAccountDeps) {
  return async function handle(request: Request): Promise<Response> {
    const userId = await deps.getUserId();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    if (!deps.allow(userId, request)) {
      return Response.json({ error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    const password = typeof body?.password === "string" ? body.password : "";
    if (!password) return Response.json({ error: "Şifre gerekli." }, { status: 400 });

    const result = await deps.remove(userId, password);
    if (!result.ok) return Response.json({ error: result.error }, { status: result.status });
    return Response.json({ success: true });
  };
}
