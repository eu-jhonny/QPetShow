export interface Category {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  gradient: string; // classes tailwind para o tile da categoria
}

export const categories: Category[] = [
  {
    slug: "cachorros",
    name: "Cachorros",
    emoji: "🐶",
    description: "Rações, petiscos e tudo para o seu melhor amigo",
    gradient: "from-sun-400 to-sun-600",
  },
  {
    slug: "gatos",
    name: "Gatos",
    emoji: "🐱",
    description: "Alimentação, areia e diversão para felinos",
    gradient: "from-brand-400 to-brand-600",
  },
  {
    slug: "antipulgas",
    name: "Antipulgas",
    emoji: "🛡️",
    description: "Máxima proteção contra pulgas e carrapatos",
    gradient: "from-fire-400 to-fire-600",
  },
  {
    slug: "areia-tapetes",
    name: "Areia & Tapetes",
    emoji: "🧻",
    description: "Higiene prática para o dia a dia",
    gradient: "from-emerald-400 to-teal-600",
  },
  {
    slug: "saches-petiscos",
    name: "Sachês & Petiscos",
    emoji: "🍖",
    description: "Sabores irresistíveis para recompensar",
    gradient: "from-orange-400 to-fire-500",
  },
  {
    slug: "brinquedos",
    name: "Brinquedos",
    emoji: "🎾",
    description: "Diversão garantida para todos os pets",
    gradient: "from-sky-400 to-indigo-500",
  },
  {
    slug: "acessorios",
    name: "Acessórios",
    emoji: "🦴",
    description: "Coleiras, camas, comedouros e mais",
    gradient: "from-violet-400 to-purple-600",
  },
  {
    slug: "farmacia",
    name: "Farmácia Pet",
    emoji: "💊",
    description: "Saúde e bem-estar com uso veterinário",
    gradient: "from-rose-400 to-fire-600",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
