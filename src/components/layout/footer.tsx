import Link from "next/link";
import { Mail, MapPin, MessageCircle, ShieldCheck, CreditCard, Truck, RotateCcw, Camera } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { categories } from "@/lib/data/categories";
import { getSettings } from "@/lib/server/settings";
import { NewsletterForm } from "@/components/leads/newsletter-form";
import { FooterSection } from "./footer-section";

const trustItems = [
  { icon: Truck, title: "Frete grátis", text: "acima de R$ 199" },
  { icon: ShieldCheck, title: "Compra segura", text: "criptografia SSL" },
  { icon: CreditCard, title: "Até 3x sem juros", text: "ou 5% OFF no PIX" },
  { icon: RotateCcw, title: "Troca fácil", text: "em até 7 dias" },
];

const institutional = [
  { href: "/conta", label: "Minha conta" },
  { href: "/conta/pedidos", label: "Meus pedidos" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "Dúvidas frequentes" },
  { href: "/contato", label: "Fale conosco" },
  { href: "/politicas", label: "Políticas e privacidade" },
];

export async function Footer() {
  const s = await getSettings();
  const linkCls = "text-sm text-gray-600 transition hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-300";

  return (
    <footer className="mt-16 border-t border-black/5 bg-white pb-24 md:mt-20 md:pb-0 dark:border-white/10 dark:bg-[#0b110d]">
      {/* Selos de confiança */}
      <div className="border-b border-black/5 dark:border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4 md:gap-6 md:py-8">
          {trustItems.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-2.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 md:size-11 dark:bg-brand-900 dark:text-brand-300">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-extrabold text-ink md:text-sm dark:text-white">{title}</p>
                <p className="text-[11px] text-gray-500 md:text-xs dark:text-gray-400">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marca + contato (sempre visível) */}
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{s.slogan}</p>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              <li>
                <a href={`https://wa.me/${s.whatsapp.replace(/\D/g, "").replace(/^/, "55")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 transition hover:text-brand-600 dark:text-gray-300">
                  <MessageCircle className="size-4 shrink-0 text-brand-500" aria-hidden /> {s.whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Mail className="size-4 shrink-0 text-brand-500" aria-hidden /> {s.email}
              </li>
              <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden /> {s.address}
              </li>
              <li>
                <a href={s.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 transition hover:text-brand-600 dark:text-gray-300">
                  <Camera className="size-4 shrink-0 text-brand-500" aria-hidden /> {s.instagram}
                </a>
              </li>
            </ul>
          </div>

          {/* Colunas recolhíveis no mobile */}
          <nav aria-label="Categorias">
            <FooterSection title="Categorias">
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/categorias/${cat.slug}`} className={linkCls}>{cat.name}</Link>
              ))}
            </FooterSection>
          </nav>

          <nav aria-label="Institucional">
            <FooterSection title="Institucional">
              {institutional.map((item) => (
                <Link key={item.href} href={item.href} className={linkCls}>{item.label}</Link>
              ))}
            </FooterSection>
          </nav>

          <div className="pt-2 md:pt-0">
            <h3 className="font-display text-base font-extrabold text-ink dark:text-white">Ofertas exclusivas</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Cupons e novidades no seu e-mail.</p>
            <div className="mt-3">
              <NewsletterForm source="footer" compact />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-black/5 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1.5 px-4 py-5 text-center text-[11px] text-gray-500 md:flex-row md:text-xs dark:text-gray-400">
          <p>© {new Date().getFullYear()} {s.name} — Todos os direitos reservados.</p>
          <p>Pagamento seguro · Dados protegidos conforme a LGPD</p>
        </div>
      </div>
    </footer>
  );
}
