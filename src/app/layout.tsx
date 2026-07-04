import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/providers/cart-provider";
import { FavoritesProvider } from "@/components/providers/favorites-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { HideOnAdmin } from "@/components/layout/store-chrome";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NewsletterPopup } from "@/components/leads/newsletter-popup";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "QPet Shop — Carinho Q faz a diferença",
    template: "%s | QPet Shop",
  },
  description:
    "Pet shop online com rações, antipulgas, sachês, brinquedos e acessórios. Frete grátis acima de R$ 199, até 3x sem juros e 5% OFF no PIX. Carinho Q faz a diferença!",
  keywords: ["pet shop", "ração", "antipulgas", "petiscos", "cachorro", "gato", "QPet Shop"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "QPet Shop",
    title: "QPet Shop — Carinho Q faz a diferença",
    description: "Tudo para o seu pet com os melhores preços e entrega rápida.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4caf2e" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1410" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeInitScript = `
try {
  const stored = localStorage.getItem("qps_theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (stored === "dark" || (!stored && prefersDark)) document.documentElement.classList.add("dark");
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${baloo.variable} ${nunito.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <ToastProvider>
          <CartProvider>
            <FavoritesProvider>
              <HideOnAdmin><Header /></HideOnAdmin>
              <main id="conteudo" className="flex-1">
                {children}
              </main>
              <HideOnAdmin>
                <Footer />
                <MobileNav />
                <NewsletterPopup />
                <WhatsAppButton />
              </HideOnAdmin>
            </FavoritesProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
