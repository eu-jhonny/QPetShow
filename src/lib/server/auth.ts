import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { readCollection, writeCollection } from "./store";

export interface SavedAddress {
  id: string;
  label: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  isDefault?: boolean;
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  avatar?: string;
  addresses?: SavedAddress[];
  createdAt: string;
}

export type PublicUser = Omit<StoredUser, "passwordHash">;

export function toPublicUser(u: StoredUser): PublicUser {
  const { passwordHash: _omit, ...rest } = u;
  void _omit;
  return rest;
}

export async function getUserById(id: string): Promise<StoredUser | null> {
  const users = await readCollection<StoredUser>("users");
  return users.find((u) => u.id === id) ?? null;
}

export async function updateUser(id: string, patch: Partial<StoredUser>): Promise<StoredUser | null> {
  const users = await readCollection<StoredUser>("users");
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...patch, id: users[idx].id, email: users[idx].email, passwordHash: users[idx].passwordHash };
  await writeCollection("users", users);
  return users[idx];
}

export interface SessionPayload {
  sub: string;
  name: string;
  email: string;
}

const SESSION_COOKIE = "qps_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 dias

function getSecret() {
  const secret = process.env.AUTH_SECRET ?? "dev-secret-qpetshop-trocar-em-producao";
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function findUserByEmail(email: string) {
  const users = await readCollection<StoredUser>("users");
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function createUser(name: string, email: string, password: string): Promise<StoredUser> {
  const users = await readCollection<StoredUser>("users");
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await writeCollection("users", users);
  return user;
}

export async function createSessionToken(user: Pick<StoredUser, "id" | "name" | "email">) {
  return new SignJWT({ name: user.name, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      sub: payload.sub as string,
      name: payload.name as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** Lista de e-mails com acesso ao painel administrativo (env ADMIN_EMAILS). */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const list = adminEmails();
  // Em dev, se nenhum admin configurado, qualquer usuário logado é admin.
  if (list.length === 0) return true;
  return list.includes(email.toLowerCase());
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session || !isAdminEmail(session.email)) return null;
  return session;
}

export { SESSION_COOKIE };
