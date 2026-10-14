import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createDeleteAccountHandler } from "./delete-account-handler";
import type { DeleteOwnAccountResult } from "./delete-own-account";

const post = (body: unknown) =>
  new Request("http://localhost/api/account/delete", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

function setup(opts: { userId?: string | null; allowed?: boolean; result?: DeleteOwnAccountResult } = {}) {
  const calls: Array<[string, string]> = [];
  const handler = createDeleteAccountHandler({
    getUserId: async () => (opts.userId === undefined ? "u1" : opts.userId),
    allow: () => opts.allowed ?? true,
    remove: async (id, pw) => {
      calls.push([id, pw]);
      return opts.result ?? { ok: true };
    },
  });
  return { handler, calls };
}

describe("delete-account handler", () => {
  it("returns 401 without a session and never touches the account", async () => {
    const { handler, calls } = setup({ userId: null });
    assert.equal((await handler(post({ password: "x" }))).status, 401);
    assert.equal(calls.length, 0);
  });

  it("returns 429 when the rate limit is hit, before checking the password", async () => {
    const { handler, calls } = setup({ allowed: false });
    assert.equal((await handler(post({ password: "x" }))).status, 429);
    assert.equal(calls.length, 0);
  });

  it("returns 400 for a missing password or an unreadable body", async () => {
    const { handler, calls } = setup();
    assert.equal((await handler(post({}))).status, 400);
    assert.equal((await handler(post("not json"))).status, 400);
    assert.equal(calls.length, 0);
  });

  it("deletes the signed-in user, ignoring any userId in the body", async () => {
    const { handler, calls } = setup({ userId: "u7" });
    const res = await handler(post({ password: "Sifre1234!", userId: "someone-else" }));
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { success: true });
    assert.deepEqual(calls, [["u7", "Sifre1234!"]]);
  });

  it("passes failure status and message through", async () => {
    const { handler } = setup({ result: { ok: false, status: 409, error: "Son yönetici hesabı silinemez." } });
    const res = await handler(post({ password: "Sifre1234!" }));
    assert.equal(res.status, 409);
    assert.deepEqual(await res.json(), { error: "Son yönetici hesabı silinemez." });
  });
});
