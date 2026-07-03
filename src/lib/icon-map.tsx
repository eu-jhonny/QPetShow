import {
  Dog, Cat, ShieldCheck, Layers, Drumstick, Gamepad2, Bone, Pill,
  Beef, Bed, PawPrint, Droplets, Bath, Sparkles, Zap, Utensils,
  type LucideIcon,
} from "lucide-react";

/**
 * Mapa central de ícones da loja. Categorias e produtos referenciam
 * uma chave daqui em vez de emojis, mantendo o visual sofisticado e coeso.
 */
export const iconMap = {
  dog: Dog,
  cat: Cat,
  shield: ShieldCheck,
  layers: Layers,
  drumstick: Drumstick,
  toy: Gamepad2,
  bone: Bone,
  pill: Pill,
  beef: Beef,
  bed: Bed,
  paw: PawPrint,
  droplets: Droplets,
  bath: Bath,
  sparkles: Sparkles,
  zap: Zap,
  utensils: Utensils,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof iconMap;

export function BrandIcon({ name, className }: { name: IconKey; className?: string }) {
  const Icon = iconMap[name];
  return <Icon className={className} aria-hidden />;
}
