<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# QPetShop — E-commerce Pet Premium

Loja virtual da QPet Shop ("Carinho Q faz a diferença"). Next.js 16 + React 19 + TypeScript + Tailwind v4 + Framer Motion.

## Comandos

- `npm run dev` — servidor de desenvolvimento (http://localhost:3000)
- `npm run build` — build de produção
- `npm run lint` — ESLint

## Arquitetura

- `src/app` — App Router. Páginas: home, produtos, categorias/[slug], produto/[slug], busca, carrinho, checkout (3 etapas), login/cadastro/recuperar-senha, conta (perfil/pedidos/favoritos), admin, blog, faq, contato, politicas.
- `src/components` — `ui/` (botão, input, badge...), `layout/` (header, footer, mobile-nav), `home/` (hero-carousel, carrosséis), `product/`, `leads/` (newsletter + popup), `providers/` (carrinho, favoritos, toasts — Context + localStorage).
- `src/lib/data` — catálogo mock (produtos, categorias, marcas, FAQ). Em produção, substituir por Prisma (schema em `/prisma`).
- `src/lib/server` — auth (bcryptjs + JWT via jose, cookie HttpOnly `qps_session`), store JSON em `/data` (dev only), rate limiting em memória.
- `src/proxy.ts` — proteção de rotas (`/conta`, `/admin`) e headers de segurança (CSP, HSTS etc.).
- `/emails` — templates HTML transacionais com placeholders `{{variavel}}`.

## Identidade visual

Verde `brand-*` (primária), amarelo `sun-*` (destaques), vermelho `fire-*` (promos), preto `ink` (tipografia). Fontes: Baloo 2 (display) + Nunito (texto). Tokens definidos em `src/app/globals.css` via `@theme` (Tailwind v4 — não há tailwind.config). Dark mode por classe `.dark` (toggle no header). Cantos bem arredondados (`rounded-3xl`), sombras `shadow-soft`/`shadow-lift`, glassmorphism `.glass`.

## Convenções

- Textos da interface em pt-BR; código em inglês.
- Formulários validados com Zod (`src/lib/validators.ts`) no client E nas rotas de API.
- Imagens de produto: tiles ilustrados via `ProductImage`; para fotos reais, adicionar arquivo em `/public/products` e preencher `image` no produto.
- Segurança: nunca armazenar senha em texto puro, respostas de auth não revelam se e-mail existe, rate limiting em todas as rotas públicas de escrita.
- `AUTH_SECRET` obrigatório em produção (ver `.env.example`).
