import { readCollection, writeCollection } from "./store";

export interface InstagramPhoto {
  id: string;
  image: string; // caminho em /public ou URL
  href: string; // link do post/perfil
  order: number;
}

const COLLECTION = "instagram";

export async function getInstagramPhotos(): Promise<InstagramPhoto[]> {
  const photos = await readCollection<InstagramPhoto>(COLLECTION);
  return [...photos].sort((a, b) => a.order - b.order);
}

export async function addInstagramPhoto(input: Omit<InstagramPhoto, "id" | "order">): Promise<InstagramPhoto> {
  const photos = await getInstagramPhotos();
  const photo: InstagramPhoto = { ...input, id: crypto.randomUUID(), order: photos.length };
  await writeCollection(COLLECTION, [...photos, photo]);
  return photo;
}

export async function deleteInstagramPhoto(id: string): Promise<void> {
  const photos = await getInstagramPhotos();
  await writeCollection(COLLECTION, photos.filter((p) => p.id !== id));
}
