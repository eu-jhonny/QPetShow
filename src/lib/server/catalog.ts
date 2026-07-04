import { readCollection, writeCollection } from "./store";
import { products as seedProducts, type Product } from "@/lib/data/products";

const COLLECTION = "products";

/**
 * Catálogo persistido em /data/products.json.
 * Na primeira leitura, semeia com o catálogo base (src/lib/data/products.ts).
 * O admin edita este catálogo e as mudanças aparecem na loja.
 */
export async function getCatalog(): Promise<Product[]> {
  const stored = await readCollection<Product>(COLLECTION);
  if (stored.length === 0) {
    await writeCollection(COLLECTION, seedProducts);
    return seedProducts;
  }
  return stored;
}

export async function saveCatalog(products: Product[]) {
  await writeCollection(COLLECTION, products);
}

export async function getCatalogProduct(slug: string): Promise<Product | null> {
  const all = await getCatalog();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getCatalogByCategory(category: string): Promise<Product[]> {
  const all = await getCatalog();
  return all.filter((p) => p.category === category);
}

export async function searchCatalog(query: string): Promise<Product[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const all = await getCatalog();
  return all.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}

export async function upsertProduct(product: Product): Promise<Product> {
  const all = await getCatalog();
  const idx = all.findIndex((p) => p.id === product.id);
  if (idx === -1) all.push(product);
  else all[idx] = product;
  await saveCatalog(all);
  return product;
}

export async function deleteProduct(id: string): Promise<void> {
  const all = await getCatalog();
  await saveCatalog(all.filter((p) => p.id !== id));
}
