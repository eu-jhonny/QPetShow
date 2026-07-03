import { promises as fs } from "fs";
import path from "path";

/**
 * Armazenamento simples em JSON para desenvolvimento local.
 * Em produção, substituir por Prisma + PostgreSQL (schema em /prisma).
 */
const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readCollection<T>(name: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `${name}.json`), "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export async function writeCollection<T>(name: string, items: T[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(path.join(DATA_DIR, `${name}.json`), JSON.stringify(items, null, 2), "utf-8");
}

export async function appendToCollection<T>(name: string, item: T): Promise<void> {
  const items = await readCollection<T>(name);
  items.push(item);
  await writeCollection(name, items);
}
