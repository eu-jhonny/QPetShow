# 🚀 Guia completo para colocar a QPet Shop no ar

Este guia leva você do projeto local até a loja funcionando em produção, com
**e-mails reais, pagamentos e painel administrativo**. Siga na ordem.

> Resumo rápido: (1) configure o `.env`, (2) verifique um domínio no Resend para
> os e-mails saírem, (3) suba para a Vercel, (4) ative o Mercado Pago para
> pagamento real. Sem os passos 2 e 4, a loja funciona em **modo demonstração**
> (e-mails só para o dono da conta Resend, pagamento simulado).

---

## 1. Pré-requisitos

- Conta no **GitHub** (para versionar e conectar na Vercel)
- Conta na **Vercel** (hospedagem) — https://vercel.com
- Conta no **Resend** (e-mails) — https://resend.com
- Conta no **Mercado Pago** (pagamentos) — https://mercadopago.com.br
- (Opcional) **Supabase** (banco Postgres) — https://supabase.com
- (Opcional) **Cloudinary** (imagens) — https://cloudinary.com

---

## 2. Variáveis de ambiente (`.env`)

Copie `.env.example` para `.env` e preencha. **Os valores reais ficam só no `.env`
(que está no `.gitignore`) — nunca comite segredos.**

| Variável | Para que serve | Obrigatória? |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública (SEO, e-mails) | ✅ |
| `APP_URL` | Base para links nos e-mails | ✅ |
| `AUTH_SECRET` | Assina os tokens de sessão (JWT) | ✅ |
| `ADMIN_EMAILS` | E-mails com acesso ao `/admin` (vírgula) | ✅ |
| `RESEND_API_KEY` | Envio de e-mails | ✅ p/ e-mails |
| `EMAIL_FROM` | Remetente dos e-mails | ✅ p/ e-mails |
| `EMAIL_ADMIN` | Recebe avisos de pedidos/contato | ✅ p/ e-mails |
| `MERCADOPAGO_ACCESS_TOKEN` | Pagamento real (PIX) | opcional |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Checkout no front | opcional |
| `DATABASE_URL` | Banco Postgres (Prisma) | opcional* |
| `CLOUDINARY_*` | Upload de imagens | opcional |
| `REDIS_URL` | Rate limit distribuído | opcional |

\* Em desenvolvimento a loja usa arquivos JSON na pasta `/data`. Para produção
séria, migre para o Postgres (seção 6).

Gere um `AUTH_SECRET` forte:
```bash
node -e "console.log(crypto.randomBytes(48).toString('hex'))"
```

---

## 3. E-mails com o Resend (passo mais importante)

Hoje o `.env` usa `EMAIL_FROM=onboarding@resend.dev`. **Esse remetente de teste só
entrega e-mails para o endereço dono da conta Resend.** Ou seja: cadastros de
clientes reais NÃO recebem e-mail até você verificar um domínio.

### Para os e-mails funcionarem para qualquer cliente:

1. Acesse **Resend → Domains → Add Domain** e informe `qpetshop.com.br`
   (ou o domínio que você tiver).
2. O Resend mostra registros **DNS** (TXT/CNAME/MX). Adicione-os no seu provedor
   de domínio (Registro.br, GoDaddy, Cloudflare…).
3. Aguarde a verificação (alguns minutos a algumas horas).
4. No `.env`, troque:
   ```
   EMAIL_FROM=contato@qpetshop.com.br
   ```
5. Pegue sua API key em **Resend → API Keys** e ponha em `RESEND_API_KEY`.

### Testar o envio
Com o servidor rodando, acesse no navegador:
```
http://localhost:3000/api/teste-email?to=SEU_EMAIL@dominio.com
```
Se retornar `{ "ok": true }`, os e-mails estão funcionando. 🎉

### E-mails que o sistema dispara automaticamente
| Evento | Quem recebe |
|---|---|
| Cadastro de conta | Cliente (boas-vindas + cupom BEMVINDO10) |
| Assinar newsletter / pop-up | Cliente (cupom) |
| Novo pedido | Cliente (confirmação) **e** admin (aviso) |
| Pagamento aprovado (cartão / admin confirma) | Cliente |
| Pedido marcado como "enviado" no admin | Cliente (com rastreio) |
| Recuperação de senha | Cliente |
| Mensagem de contato | Cliente (confirmação) **e** admin |

---

## 4. Pagamentos com o Mercado Pago

Sem credenciais, o checkout roda em **modo simulado** (cartão aprova na hora;
PIX/boleto geram código fictício). Para pagamento real:

1. Acesse **Mercado Pago → Suas integrações → Criar aplicação**.
2. Copie o **Access Token** de produção → `MERCADOPAGO_ACCESS_TOKEN` no `.env`.
3. Copie a **Public Key** → `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`.
4. Pronto: o PIX passa a gerar QR Code real via API do Mercado Pago.

> Para cartão e boleto reais e confirmação automática de PIX, configure também um
> **webhook** do Mercado Pago apontando para `SEU_SITE/api/mercadopago/webhook`
> (esse endpoint pode ser adicionado depois — hoje o admin confirma o pagamento
> manualmente na aba **Pedidos**).

---

## 5. Painel administrativo `/admin`

1. Crie uma conta normal na loja (`/cadastro`) com o e-mail que estará em
   `ADMIN_EMAILS`.
2. Acesse `/admin`. Se o e-mail estiver na lista, você entra no painel.
3. Abas disponíveis:
   - **Dashboard** — receita, pedidos, ticket médio, leads, estoque baixo
   - **Pedidos** — ver, filtrar e mudar status (dispara e-mail ao cliente)
   - **Produtos** — criar, editar, excluir (reflete na loja na hora)
   - **Leads** — contatos capturados + exportar CSV
   - **Clientes** — cadastros + total gasto
   - **Cupons** — criar/ativar/excluir códigos de desconto
   - **Mensagens** — contatos recebidos

> Segurança: `/admin` e `/conta` são protegidos pelo `src/proxy.ts`. Só e-mails
> em `ADMIN_EMAILS` acessam o painel. Em dev, se a lista estiver vazia, qualquer
> usuário logado é admin (apenas para facilitar testes).

---

## 6. Banco de dados na Vercel (Supabase) — OBRIGATÓRIO

Em desenvolvimento a loja grava em arquivos JSON (`/data`). Na **Vercel** o
sistema de arquivos é **somente leitura**, então sem banco **nada que grava
funciona** (cadastro, pedido, cancelar, editar produto, etc.).

O projeto já vem pronto para isso: quando roda na Vercel (ou com
`STORAGE=postgres`), o armazenamento usa automaticamente uma tabela
`qps_store` no **Postgres do Supabase** (criada sozinha na primeira gravação).
Você **não precisa** rodar migração — só configurar a conexão:

1. No **Supabase** → **Connect** (botão no topo) → aba **Connection string** →
   escolha **Transaction pooler** (recomendado para serverless/Vercel).
   A string tem este formato:
   ```
   postgresql://postgres.SEU_REF:SUA_SENHA@aws-0-REGIAO.pooler.supabase.com:6543/postgres
   ```
   > Use o **pooler** (`...pooler.supabase.com:6543`), NÃO a conexão direta
   > (`db.xxx.supabase.co:5432`), que não funciona bem na Vercel.
2. Na **Vercel** → seu projeto → **Settings → Environment Variables**, coloque
   essa string em `DATABASE_URL` (URL-encode a senha: `@` vira `%40`).
3. Redeploy. Pronto — pedidos, produtos, leads e tudo o mais passam a persistir.

> Para testar localmente contra o Supabase: no `.env` local, ponha a mesma
> `DATABASE_URL` (pooler) e adicione `STORAGE=postgres`. Sem isso, o local
> continua usando os arquivos JSON (mais rápido para desenvolver).

O `prisma/schema.prisma` continua disponível caso queira migrar para um modelo
relacional no futuro, mas **não é necessário** — a tabela KV já resolve.

---

## 7. Imagens de produto (Cloudinary)

- Por padrão, produtos sem foto mostram um **tile com ícone** da marca.
- Para foto real: no admin, cole a **URL da imagem** no campo do produto, ou
  suba o arquivo em `public/products/` e use `/products/arquivo.png`.
- Para upload direto no painel, configure `CLOUDINARY_*` no `.env`.

---

## 8. Logo oficial

O logo atual é vetorial (a cabeça-Q + "PetShop"). Para usar a arte oficial:

1. Salve o arquivo em `public/logo.png` (ou `.svg`/`.webp`).
2. Abra `src/components/ui/logo.tsx` e mude `USE_IMAGE_LOGO` para `true`.

---

## 9. Deploy na Vercel

1. Suba o projeto para um repositório no GitHub.
2. Na Vercel: **New Project → Import** o repositório.
3. Em **Environment Variables**, cole TODAS as variáveis do seu `.env`.
4. Deploy. A Vercel detecta Next.js automaticamente.
5. Configure seu domínio em **Settings → Domains** e atualize
   `NEXT_PUBLIC_SITE_URL` e `APP_URL` para a URL final.

---

## 10. Checklist final antes de divulgar

- [ ] `AUTH_SECRET` forte e único em produção
- [ ] Domínio verificado no Resend e `EMAIL_FROM` com o domínio próprio
- [ ] `/api/teste-email` retornando `ok: true`
- [ ] `ADMIN_EMAILS` com o seu e-mail; consegue entrar em `/admin`
- [ ] Fez um pedido de teste e recebeu o e-mail de confirmação
- [ ] Mercado Pago com Access Token de produção (se for cobrar de verdade)
- [ ] Banco Postgres configurado (para não perder dados na Vercel)
- [ ] `NEXT_PUBLIC_SITE_URL` apontando para o domínio final
- [ ] Testou em celular (layout mobile)

---

### Comandos úteis
```bash
npm run dev      # desenvolvimento (localhost:3000)
npm run build    # build de produção
npm run start    # roda o build localmente
npm run lint     # verificação de código
```

Qualquer dúvida, o código é modular e comentado em português. Bons negócios! 🐾
