import { readCollection, writeCollection } from "./store";
import { storeInfo } from "@/lib/data/site";

export interface StoreSettings {
  name: string;
  slogan: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  instagramUrl: string;
  freeShippingMin: number;
  emailFrom: string;
  emailAdmin: string;
}

function defaults(): StoreSettings {
  return {
    name: storeInfo.name,
    slogan: storeInfo.slogan,
    whatsapp: storeInfo.whatsapp,
    email: storeInfo.email,
    address: storeInfo.address,
    instagram: storeInfo.instagram,
    instagramUrl: storeInfo.instagramUrl,
    freeShippingMin: storeInfo.freeShippingMin,
    emailFrom: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
    emailAdmin: process.env.EMAIL_ADMIN ?? "",
  };
}

const KEY = "settings";

export async function getSettings(): Promise<StoreSettings> {
  const stored = await readCollection<StoreSettings>(KEY);
  return { ...defaults(), ...(stored[0] ?? {}) };
}

export async function saveSettings(patch: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getSettings();
  const next = { ...current, ...patch };
  await writeCollection(KEY, [next]);
  return next;
}
