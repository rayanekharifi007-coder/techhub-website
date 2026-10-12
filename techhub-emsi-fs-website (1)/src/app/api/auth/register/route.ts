import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { createSession, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!name || !email || password.length < 8) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing[0]) {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }

  const totalUsers = await db.select({ value: count(users.id) }).from(users);
  const role = (totalUsers[0]?.value ?? 0) === 0 ? "admin" : "member";

  const inserted = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash: hashPassword(password),
      role,
    })
    .returning({ id: users.id });

  await createSession(inserted[0].id);

  return NextResponse.json({ ok: true });
}
