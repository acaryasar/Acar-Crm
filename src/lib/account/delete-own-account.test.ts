import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { deleteOwnAccount } from "./delete-own-account";

// A real SQLite database built from prisma/schema.prisma (`prisma db push`), so the test runs the
// actual queries. Run with: npm test
const dir = mkdtempSync(join(tmpdir(), "crm-delete-"));
const url = `file:${join(dir, "test.db").split(String.fromCharCode(92)).join("/")}`;
let prisma: PrismaClient;

async function addUser(email: string, role: "ADMIN" | "EMPLOYEE", extra: Record<string, unknown> = {}) {
  return prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash("Sifre1234!", 4),
      firstName: "Ayşe",
      lastName: "Yılmaz",
      role,
      phone: "0500",
      nationalId: "12345678901",
      dateOfBirth: new Date("1990-01-01"),
      gender: "F",
      profilePicture: "a.png",
      username: email.split("@")[0],
      department: "Satış",
      position: "Uzman",
      workplace: "Merkez",
      manager: "Ali",
      description: "not",
      ...extra,
    },
  });
}

before(() => {
  execFileSync(process.execPath, [join("node_modules", "prisma", "build", "index.js"), "db", "push", "--skip-generate"], {
    env: { ...process.env, DATABASE_URL: url },
    stdio: "ignore",
  });
  prisma = new PrismaClient({ adapter: new PrismaLibSQL({ url }) });
});

after(async () => {
  await prisma.$disconnect();
  try {
    rmSync(dir, { recursive: true, force: true });
  } catch {
    // Windows may keep the file locked briefly; the OS temp folder cleans it up.
  }
});

describe("deleteOwnAccount", () => {
  it("rejects a wrong password and leaves the account untouched", async () => {
    const u = await addUser("wrong@test.com", "EMPLOYEE");
    assert.deepEqual(await deleteOwnAccount(prisma, u.id, "yanlis"), { ok: false, status: 400, error: "Şifre hatalı." });
    const after = await prisma.user.findUnique({ where: { id: u.id } });
    assert.equal(after?.email, "wrong@test.com");
    assert.equal(after?.deletedAt, null);
  });

  it("returns 404 for an unknown user and for an already deleted one", async () => {
    assert.equal((await deleteOwnAccount(prisma, "nope", "x")).ok, false);
    const u = await addUser("twice@test.com", "EMPLOYEE");
    assert.deepEqual(await deleteOwnAccount(prisma, u.id, "Sifre1234!"), { ok: true });
    assert.deepEqual(await deleteOwnAccount(prisma, u.id, "Sifre1234!"), { ok: false, status: 404, error: "Hesap bulunamadı." });
  });

  it("anonymises every personal field and disables the account", async () => {
    const u = await addUser("uye@test.com", "EMPLOYEE");
    await prisma.notification.create({ data: { userId: u.id, title: "Merhaba", type: "INFO" } });
    await prisma.activityLog.create({ data: { userId: u.id, action: "LOGIN", entityType: "User", entityId: u.id } });
    assert.deepEqual(await deleteOwnAccount(prisma, u.id, "Sifre1234!"), { ok: true });

    const d = (await prisma.user.findUnique({ where: { id: u.id } }))!;
    assert.equal(d.email, `silinmis-${u.id}@deleted.invalid`);
    assert.equal(d.firstName, "Silinmiş");
    assert.equal(d.lastName, "Kullanıcı");
    for (const f of ["phone", "nationalId", "dateOfBirth", "gender", "profilePicture", "username", "department", "position", "workplace", "manager", "description"] as const) {
      assert.equal(d[f], null, `${f} should be cleared`);
    }
    assert.equal(d.accountStatus, false);
    assert.equal(d.is_active, false);
    assert.notEqual(d.deletedAt, null);
    assert.notEqual(d.password, u.password);
    assert.equal(await bcrypt.compare("Sifre1234!", d.password), false);
    assert.equal(await prisma.notification.count({ where: { userId: u.id } }), 0, "personal notifications are removed");
    assert.equal(await prisma.activityLog.count({ where: { userId: u.id } }), 1, "audit log rows stay");
  });

  it("two deleted accounts do not collide on the unique e-mail", async () => {
    const a = await addUser("a@test.com", "EMPLOYEE");
    const b = await addUser("b@test.com", "EMPLOYEE");
    assert.deepEqual(await deleteOwnAccount(prisma, a.id, "Sifre1234!"), { ok: true });
    assert.deepEqual(await deleteOwnAccount(prisma, b.id, "Sifre1234!"), { ok: true });
  });

  it("refuses demo accounts", async () => {
    const u = await addUser("demo@test.com", "EMPLOYEE", { isDemo: true });
    assert.deepEqual(await deleteOwnAccount(prisma, u.id, "Sifre1234!"), {
      ok: false,
      status: 403,
      error: "Demo hesaplar silinemez.",
    });
  });

  it("refuses to delete the last active admin, allows it when another admin exists", async () => {
    const only = await addUser("only-admin@test.com", "ADMIN");
    const r = await deleteOwnAccount(prisma, only.id, "Sifre1234!");
    assert.equal(r.ok, false);
    assert.equal(!r.ok && r.status, 409);
    assert.equal((await prisma.user.findUnique({ where: { id: only.id } }))?.deletedAt, null);

    await addUser("second-admin@test.com", "ADMIN");
    assert.deepEqual(await deleteOwnAccount(prisma, only.id, "Sifre1234!"), { ok: true });
  });
});
