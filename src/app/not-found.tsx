import Link from "next/link";
import { LogoFull } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-28 text-center">
      <LogoFull className="animate-float" />
      <div>
        <h1 className="font-display text-5xl font-extrabold">404</h1>
        <p className="font-display mt-2 text-2xl font-extrabold">Farejamos por aqui e nada...</p>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          A página que você procura não existe ou foi movida.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-full bg-brand-500 px-8 py-3.5 font-extrabold text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-lift"
      >
        Voltar para o início
      </Link>
    </div>
  );
}
