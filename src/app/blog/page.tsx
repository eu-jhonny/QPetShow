import type { Metadata } from "next";
import { blogPosts } from "@/lib/data/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Dicas de saúde, comportamento e bem-estar para cães e gatos, escritas com carinho pela equipe QPet Shop.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10 text-center">
        <span className="text-5xl" aria-hidden>📝</span>
        <h1 className="font-display mt-3 text-4xl font-extrabold">Blog QPet</h1>
        <p className="mx-auto mt-2 max-w-xl text-gray-500 dark:text-gray-400">
          Dicas de especialistas para cuidar de quem cuida do seu coração.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="group flex flex-col overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift dark:border-white/10 dark:bg-white/5"
          >
            <div className={cn("paw-pattern flex aspect-[16/10] items-center justify-center bg-gradient-to-br text-7xl", post.gradient)} aria-hidden>
              <span className="transition-transform duration-500 group-hover:scale-110">{post.emoji}</span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="rounded-full bg-brand-100 px-3 py-1 text-brand-700 dark:bg-brand-900 dark:text-brand-300">{post.category}</span>
                <span className="text-gray-400">{post.readTime} de leitura</span>
              </div>
              <h2 className="font-display mt-3 text-xl font-extrabold leading-snug transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-300">
                {post.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-gray-500 dark:text-gray-400">{post.excerpt}</p>
              <time dateTime={post.date} className="mt-4 text-xs font-semibold text-gray-400">
                {new Date(`${post.date}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
              </time>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-gray-400">
        Novos artigos toda semana. Assine a newsletter para não perder nenhum! 💌
      </p>
    </div>
  );
}
