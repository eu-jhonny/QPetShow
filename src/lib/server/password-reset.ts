import crypto from "crypto";

type ResetToken = {
  email: string;
  expiresAt: number;
};

const tokens = new Map<string, ResetToken>();

export function createPasswordReset(email: string) {
  const token = crypto.randomBytes(32).toString("hex");

  tokens.set(token, {
    email,
    expiresAt: Date.now() + 1000 * 60 * 15,
  });

  return token;
}

export function validatePasswordReset(token: string) {
  const item = tokens.get(token);

  if (!item) return null;

  if (item.expiresAt < Date.now()) {
    tokens.delete(token);
    return null;
  }

  return item.email;
}

export function removePasswordReset(token: string) {
  tokens.delete(token);
}
