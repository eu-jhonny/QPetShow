import Link from "next/link";
import { Camera, Mail, MapPin, MessageCircle, ShieldCheck, CreditCard, Truck, RotateCcw } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { categories } from "@/lib/data/categories";
import { storeInfo } from "@/lib/data/site";
import { NewsletterForm } from "@/components/leads/newsletter-form";

const trustItems = [
  { icon: Truck, title: "Frete grátis", text: "acima de R$ 199" },
  { icon: ShieldCheck, title: "Compra segura", text: "criptografia SSL" },
  { icon: CreditCard, title: "Até 3x sem juros", text: "ou 5% OFF no PIX" },
  { icon: RotateCcw, title: "Troca fácil", text: "em até 7 dias" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-black/5 bg-white pb-24 md:pb-0 dark:border-white/10 dark:bg-[#0b110d]">
      {/* Selos de confiança */}
      <div className="border-b border-black/5 dark:border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4">
          {trustItems.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-extrabold text-ink dark:text-white">{title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Colunas */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{storeInfo.slogan}</p>
          <ul className="mt-5 flex flex-col gap-2.5 text-sm">
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <MessageCircle className="size-4 text-brand-500" aria-hidden /> {storeInfo.whatsapp}
            </li>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Mail className="size-4 text-brand-500" aria-hidden /> {storeInfo.email}
            </li>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <MapPin className="size-4 text-brand-500" aria-hidden /> {storeInfo.address}
            </li>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Camera className="size-4 text-brand-500" aria-hidden /> {storeInfo.instagram}
            </li>
          </ul>
        </div>

        <nav aria-label="Categorias">
          <h3 className="font-display text-base font-extrabold text-ink dark:text-white">Categorias</h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/categorias/${cat.slug}`}
                  className="text-sm text-gray-600 transition hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-300"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Institucional">
          <h3 className="font-display text-base font-extrabold text-ink dark:text-white">Institucional</h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {[
              { href: "/conta", label: "Minha conta" },
              { href: "/conta/pedidos", label: "Meus pedidos" },
              { href: "/blog", label: "Blog" },
              { href: "/faq", label: "Dúvidas frequentes" },
              { href: "/contato", label: "Fale conosco" },
              { href: "/politicas", label: "Políticas e privacidade" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-gray-600 transition hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="font-display text-base font-extrabold text-ink dark:text-white">
            Receba ofertas exclusivas 🎁
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Cupons, novidades e dicas de cuidado pet direto no seu e-mail.
          </p>
          <div className="mt-4">
            <NewsletterForm source="footer" compact />
          </div>
        </div>
      </div>

      <div className="border-t border-black/5 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-gray-500 md:flex-row dark:text-gray-400">
          <p>© {new Date().getFullYear()} {storeInfo.name} — Todos os direitos reservados. CNPJ 00.000.000/0001-00</p>
          <p>Pagamentos processados com segurança 🔒 · Dados protegidos conforme a LGPD</p>
        </div>
      </div>
    </footer>
  );
}
