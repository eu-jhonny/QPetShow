import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import { FaqAccordion } from "@/components/home/faq-accordion";
import { faqItems } from "@/lib/data/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dúvidas frequentes",
  description: "Tire suas dúvidas sobre entrega, pagamento, trocas e segurança na QPet Shop.",
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mb-10 text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-300" aria-hidden>
          <HelpCircle className="size-8" />
        </span>
        <h1 className="font-display mt-3 text-4xl font-extrabold">Dúvidas frequentes</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Tudo o que você precisa saber sobre compras, entregas e segurança.
        </p>
      </header>
      <FaqAccordion items={faqItems} />
      <div className="mt-10 rounded-3xl bg-brand-50 p-6 text-center dark:bg-brand-950">
        <p className="font-bold">Não encontrou sua resposta?</p>
        <Link href="/contato" className="mt-2 inline-block rounded-full bg-brand-500 px-6 py-2.5 text-sm font-extrabold text-white transition hover:bg-brand-600">
          Falar com o atendimento
        </Link>
      </div>
    </div>
  );
}
