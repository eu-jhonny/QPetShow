import { readCollection, writeCollection } from "./store";

export interface Banner {
  id: string;
  image: string; // caminho em /public ou URL
  alt: string;
  href: string;
  active: boolean;
  order: number;
}

const COLLECTION = "banners";

/** Banners iniciais (as imagens já vêm em /public/banners). */
const DEFAULTS: Banner[] = [
  {
    id: "b-areia-tapetes",
    image: "/banners/areia-tapetes.webp",
    alt: "Areia & Tapetes com até 40% OFF",
    href: "/categorias/areia-tapetes",
    active: true,
    order: 0,
  },
  {
    id: "b-saches-petiscos",
    image: "/banners/saches-petiscos.webp",
    alt: "Sachês & Petiscos com até 14% OFF",
    href: "/categorias/saches-petiscos",
    active: true,
    order: 1,
  },
  {
    id: "b-saches-petiscos-2",
    image: "/banners/saches-petiscos-2.webp",
    alt: "Sachês & Petiscos premium com até 14% OFF",
    href: "/categorias/saches-petiscos",
    active: true,
    order: 2,
  },
];

export async function getBanners(): Promise<Banner[]> {
  const stored = await readCollection<Banner>(COLLECTION);
  const list = stored.length === 0 ? DEFAULTS : stored;
  return [...list].sort((a, b) => a.order - b.order);
}

export async function getActiveBanners(): Promise<Banner[]> {
  return (await getBanners()).filter((b) => b.active);
}

export async function saveBanners(banners: Banner[]) {
  await writeCollection(COLLECTION, banners);
}

export async function addBanner(input: Omit<Banner, "id" | "order">): Promise<Banner> {
  const banners = await getBanners();
  const banner: Banner = {
    ...input,
    id: crypto.randomUUID(),
    order: banners.length,
  };
  await saveBanners([...banners, banner]);
  return banner;
}

export async function updateBanner(id: string, patch: Partial<Banner>): Promise<Banner | null> {
  const banners = await getBanners();
  const idx = banners.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  banners[idx] = { ...banners[idx], ...patch, id: banners[idx].id };
  await saveBanners(banners);
  return banners[idx];
}

export async function deleteBanner(id: string): Promise<void> {
  const banners = await getBanners();
  await saveBanners(banners.filter((b) => b.id !== id));
}
