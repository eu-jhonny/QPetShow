import type { IconKey } from "@/lib/icon-map";
export const brands = [
  "Golden", "Premier", "Bravecto", "NexGard", "Scalibor", "Whiskas",
  "Pipicat", "Zee.Pad", "Tapeco", "Finotrato", "KONG", "PetProb",
];

export interface Testimonial {
  name: string;
  pet: string;
  avatar: string;
  rating: number;
  text: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Mariana Silva",
    pet: "tutora do Thor",
    avatar: "MS",
    rating: 5,
    text: "Entrega super rápida e o preço do Bravecto foi o melhor que encontrei. O Thor nem percebeu que era remédio!",
  },
  {
    name: "Carlos Eduardo",
    pet: "tutor da Mel",
    avatar: "CE",
    rating: 5,
    text: "A areia Pipicat chegou em perfeito estado e o atendimento pelo WhatsApp foi nota 10. Virei cliente fiel!",
  },
  {
    name: "Fernanda Costa",
    pet: "tutora do Bob e da Luna",
    avatar: "FC",
    rating: 5,
    text: "Site lindo e fácil de usar. Comprei ração, petiscos e tapete higiênico com desconto. Recomendo demais!",
  },
  {
    name: "Ricardo Almeida",
    pet: "tutor do Simba",
    avatar: "RA",
    rating: 4,
    text: "Ótima variedade de sachês. Meu gato é exigente e aqui sempre encontro os sabores que ele ama.",
  },
  {
    name: "Juliana Rocha",
    pet: "tutora da Nina",
    avatar: "JR",
    rating: 5,
    text: "O peitoral anti-puxão mudou nossos passeios! Qualidade excelente e chegou antes do prazo.",
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "Qual o prazo de entrega?",
    answer:
      "Entregamos em todo o Brasil. Para a região metropolitana, o prazo é de 1 a 3 dias úteis. Demais regiões, de 3 a 10 dias úteis. Você acompanha tudo pelo painel 'Meus Pedidos'.",
  },
  {
    question: "Quais formas de pagamento vocês aceitam?",
    answer:
      "Aceitamos PIX (com 5% de desconto), cartões de crédito em até 3x sem juros e boleto bancário. Todos os pagamentos são processados com criptografia de ponta a ponta.",
  },
  {
    question: "Posso trocar ou devolver um produto?",
    answer:
      "Sim! Você tem até 7 dias corridos após o recebimento para solicitar troca ou devolução, conforme o Código de Defesa do Consumidor. O produto deve estar lacrado e sem uso.",
  },
  {
    question: "Os medicamentos exigem receita veterinária?",
    answer:
      "Antipulgas e vermífugos de venda livre não exigem receita. Medicamentos controlados exigem receita veterinária, que pode ser enviada durante o checkout.",
  },
  {
    question: "Existe frete grátis?",
    answer:
      "Sim! Compras acima de R$ 199,00 têm frete grátis para todo o Brasil. Acompanhe também nossos cupons de frete grátis na newsletter.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Totalmente. Usamos criptografia SSL/TLS, seus dados de pagamento nunca são armazenados em nossos servidores e seguimos rigorosamente a LGPD. Você pode solicitar a exclusão dos seus dados a qualquer momento.",
  },
];

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  icon: IconKey;
  gradient: string;
  date: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "como-escolher-antipulgas-ideal",
    title: "Como escolher o antipulgas ideal para o seu cão",
    excerpt: "Comprimido, coleira ou pipeta? Entenda as diferenças e descubra qual proteção combina com a rotina do seu pet.",
    category: "Saúde",
    icon: "shield",
    gradient: "from-brand-400 to-brand-600",
    date: "2026-06-28",
    readTime: "5 min",
  },
  {
    slug: "gato-bebendo-pouca-agua",
    title: "Seu gato bebe pouca água? Veja 6 dicas para hidratá-lo",
    excerpt: "A hidratação é essencial para a saúde renal dos felinos. Fontes, sachês e truques que realmente funcionam.",
    category: "Gatos",
    icon: "droplets",
    gradient: "from-sky-400 to-cyan-600",
    date: "2026-06-20",
    readTime: "4 min",
  },
  {
    slug: "adestramento-positivo-petiscos",
    title: "Adestramento positivo: como usar petiscos do jeito certo",
    excerpt: "Recompensar na hora certa acelera o aprendizado. Aprenda a técnica usada por adestradores profissionais.",
    category: "Comportamento",
    icon: "sparkles",
    gradient: "from-sun-400 to-orange-500",
    date: "2026-06-12",
    readTime: "6 min",
  },
];

export const storeInfo = {
  name: "QPet Shop",
  slogan: "Carinho Q faz a diferença.",
  whatsapp: "(11) 91508-5219",
  whatsappDigits: "5511915085219",
  email: "contato@qpetshop.com.br",
  address: "Av. Aimara, 592 — Parque Pirajussara, Embu das Artes/SP",
  instagram: "@qpetshop.oficial",
  instagramUrl: "https://instagram.com/qpetshop.oficial",
  freeShippingMin: 199,
};
