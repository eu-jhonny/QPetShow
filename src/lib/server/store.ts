import { promises as fs } from "fs";
import path from "path";
import postgres from "postgres";

/**
 * Camada de armazenamento.
 * - Desenvolvimento (local): arquivos JSON em /data.
 * - Produção (Vercel) ou STORAGE=postgres: tabela KV `qps_store` no Postgres
 *   (Supabase). Isso é essencial na Vercel, cujo sistema de arquivos é
 *   somente leitura — sem banco, nenhuma gravação do admin funciona.
 */
const usePostgres =
  !!process.env.DATABASE_URL &&
  (process.env.VERCEL === "1" || process.env.STORAGE === "postgres");

// ---------- Postgres (KV) ----------
let sql: ReturnType<typeof postgres> | null = null;
let ready: Promise<void> | null = null;

function db() {
  if (!sql) {
    sql = postgres(process.env.DATABASE_URL!, {
      ssl: "require",
      prepare: false, // compatível com o pooler de transações do Supabase
      max: 3,
      idle_timeout: 20,
    });
  }
  return sql;
}

function ensureTable() {
  if (!ready) {
    ready = db()`CREATE TABLE IF NOT EXISTS qps_store (
      key text PRIMARY KEY,
      data jsonb NOT NULL DEFAULT '[]'::jsonb
    )`.then(() => undefined);
  }
  return ready;
}

// ---------- JSON (dev) ----------
const DATA_DIR = path.join(process.cwd(), "data");

export async function readCollection<T>(name: string): Promise<T[]> {
  if (usePostgres) {
    await ensureTable();
    const rows = await db()<{ data: T[] }[]>`SELECT data FROM qps_store WHERE key = ${name}`;
    return rows.length ? rows[0].data : [];
  }
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `${name}.json`), "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export async function writeCollection<T>(name: string, items: T[]): Promise<void> {
  if (usePostgres) {
    await ensureTable();
    await db()`
      INSERT INTO qps_store (key, data) VALUES (${name}, ${db().json(items as never)})
      ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data
    `;
    return;
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, `${name}.json`), JSON.stringify(items, null, 2), "utf-8");
}

export async function appendToCollection<T>(name: string, item: T): Promise<void> {
  if (usePostgres) {
    await ensureTable();
    // append atômico — evita perder itens em gravações concorrentes
    await db()`
      INSERT INTO qps_store (key, data) VALUES (${name}, ${db().json([item] as never)})
      ON CONFLICT (key) DO UPDATE SET data = qps_store.data || EXCLUDED.data
    `;
    return;
  }
  const items = await readCollection<T>(name);
  items.push(item);
  await writeCollection(name, items);
}
