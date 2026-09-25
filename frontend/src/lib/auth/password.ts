import bcrypt from "bcryptjs";

const ROUNDS = 12; // ~250ms; adjust down only if you profile real hardware

export async function hashPassword(plain: string): Promise<string> {
  if (plain.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
  return await bcrypt.hash(plain, ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(plain, hash);
}