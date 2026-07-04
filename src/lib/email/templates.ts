import { formatBRL } from "@/lib/utils";

/** Envelope visual padrão dos e-mails QPet Shop. */
function layout(opts: {
  headerBg?: string;
  emoji?: string;
  title: string;
  bodyHtml: string;
  footerNote?: string;
}) {
  const headerBg = opts.headerBg ?? "linear-gradient(135deg,#4caf2e,#2e6e1d)";
  return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f0f4ee;font-family:'Segoe UI',Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4ee;padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:${headerBg};border-radius:24px 24px 0 0;padding:32px;text-align:center;">
<div style="font-size:32px;font-weight:800;letter-spacing:-1px;">
<span style="color:#e5173f;">Q</span><span style="color:#ffc421;">Pet</span><span style="color:#ffffff;">Shop</span>
</div>
<p style="color:rgba(255,255,255,.8);margin:6px 0 0;font-size:11px;font-weight:700;letter-spacing:2px;">CARINHO Q FAZ A DIFERENÇA</p>
</td></tr>
<tr><td style="background:#ffffff;padding:40px 36px;">
${opts.emoji ? `<div style="text-align:center;font-size:52px;line-height:1;">${opts.emoji}</div>` : ""}
<h1 style="color:#17181c;font-size:24px;margin:16px 0 12px;text-align:center;">${opts.title}</h1>
${opts.bodyHtml}
</td></tr>
<tr><td style="background:#17181c;border-radius:0 0 24px 24px;padding:26px 36px;text-align:center;">
<p style="color:#9aa0a6;font-size:12px;line-height:1.6;margin:0;">
${opts.footerNote ?? "QPet Shop · Carinho Q faz a diferença"}<br/>
Av. dos Pets, 1234 — São Paulo/SP · CNPJ 00.000.000/0001-00
</p>
</td></tr>
</table></td></tr></table></body></html>`;
}

function button(href: string, label: string, bg = "#4caf2e", color = "#ffffff") {
  return `<div style="text-align:center;"><a href="${href}" style="display:inline-block;background:${bg};color:${color};text-decoration:none;font-weight:800;font-size:16px;padding:15px 38px;border-radius:999px;margin-top:24px;">${label}</a></div>`;
}

const site = () => process.env.APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export interface EmailContent {
  subject: string;
  html: string;
}

export function welcomeEmail(name: string): EmailContent {
  const body = `
    <p style="color:#555;font-size:15px;line-height:1.6;text-align:center;margin:0 0 20px;">
      Olá, <strong>${name}</strong>! Sua conta foi criada com sucesso. Agora você e seu pet fazem parte da família QPet Shop. 💚
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="background:#fff8e1;border:2px dashed #ffc421;border-radius:16px;padding:22px;text-align:center;">
        <p style="color:#925c0e;font-size:12px;font-weight:700;margin:0;">SEU CUPOM DE BOAS-VINDAS</p>
        <p style="color:#17181c;font-size:30px;font-weight:800;letter-spacing:3px;margin:6px 0;">BEMVINDO10</p>
        <p style="color:#925c0e;font-size:12px;margin:0;">10% de desconto na primeira compra</p>
      </td>
    </tr></table>
    ${button(site(), "Começar a comprar")}
  `;
  return { subject: "Bem-vindo(a) à QPet Shop! 🎉", html: layout({ emoji: "🎉", title: `Bem-vindo(a), ${name}!`, bodyHtml: body }) };
}

export function resetPasswordEmail(name: string, url: string): EmailContent {
  const body = `
    <p style="color:#555;font-size:15px;line-height:1.6;text-align:center;margin:0 0 8px;">
      ${name}, recebemos um pedido para redefinir a senha da sua conta.
    </p>
    <p style="color:#555;font-size:14px;line-height:1.6;text-align:center;margin:0;">
      Clique no botão abaixo para criar uma nova senha. O link expira em <strong>30 minutos</strong>.
    </p>
    ${button(url, "Criar nova senha")}
    <p style="color:#999;font-size:13px;line-height:1.6;text-align:center;margin:24px 0 0;">
      Se você não solicitou, ignore este e-mail — sua senha continua a mesma. 🔒
    </p>
  `;
  return { subject: "Redefinição de senha — QPet Shop", html: layout({ emoji: "🔑", title: "Redefinir sua senha", bodyHtml: body }) };
}

interface OrderItemLite { name: string; quantity: number; price: number; }
interface OrderLite {
  code: string;
  customerName: string;
  items: OrderItemLite[];
  total: number;
  paymentMethod?: string;
  address?: string;
}

function itemsTable(items: OrderItemLite[], total: number) {
  const rows = items
    .map(
      (i) => `<tr><td style="padding:12px 18px;border-bottom:1px solid #eee;color:#17181c;font-size:14px;">
        ${i.quantity}× ${i.name}
        <span style="float:right;color:#4caf2e;font-weight:700;">${formatBRL(i.price * i.quantity)}</span></td></tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:16px;overflow:hidden;margin:6px 0;">
    ${rows}
    <tr><td style="padding:14px 18px;color:#17181c;font-size:15px;font-weight:800;">Total
      <span style="float:right;color:#4caf2e;font-size:18px;">${formatBRL(total)}</span></td></tr>
  </table>`;
}

export function orderConfirmationEmail(order: OrderLite): EmailContent {
  const body = `
    <p style="color:#555;font-size:15px;line-height:1.6;text-align:center;margin:0 0 20px;">
      Olá, <strong>${order.customerName}</strong>! Recebemos o pedido
      <strong style="color:#4caf2e;">#${order.code}</strong> e já estamos preparando tudo com carinho.
    </p>
    ${itemsTable(order.items, order.total)}
    ${order.address ? `<p style="color:#666;font-size:13px;margin:16px 0 0;">📍 <strong>Entrega:</strong> ${order.address}</p>` : ""}
    ${button(`${site()}/conta/pedidos`, "Acompanhar pedido")}
  `;
  return { subject: `Pedido confirmado #${order.code} — QPet Shop`, html: layout({ emoji: "📦", title: "Pedido confirmado!", bodyHtml: body }) };
}

export function paymentApprovedEmail(order: OrderLite): EmailContent {
  const body = `
    <p style="color:#555;font-size:15px;line-height:1.6;text-align:center;margin:0 0 8px;">
      Boa notícia, <strong>${order.customerName}</strong>! O pagamento de
      <strong style="color:#4caf2e;">${formatBRL(order.total)}</strong> do pedido
      <strong>#${order.code}</strong> foi aprovado. Já vamos despachar! 🎁
    </p>
    ${button(`${site()}/conta/pedidos`, "Ver meu pedido")}
  `;
  return { subject: `Pagamento aprovado #${order.code} ✅`, html: layout({ emoji: "✅", title: "Pagamento aprovado!", bodyHtml: body }) };
}

export function paymentDeclinedEmail(order: OrderLite): EmailContent {
  const body = `
    <p style="color:#555;font-size:15px;line-height:1.6;text-align:center;margin:0 0 8px;">
      ${order.customerName}, o pagamento do pedido <strong>#${order.code}</strong> não foi autorizado.
    </p>
    <p style="color:#555;font-size:14px;line-height:1.6;text-align:center;margin:0;">
      Seus itens ficam reservados por <strong>24h</strong>. Tente novamente com outro cartão ou via PIX (5% OFF).
    </p>
    ${button(`${site()}/checkout`, "Tentar novamente", "#e5173f")}
  `;
  return { subject: `Problema no pagamento #${order.code}`, html: layout({ headerBg: "linear-gradient(135deg,#e5173f,#b10e2e)", emoji: "😿", title: "Pagamento não aprovado", bodyHtml: body }) };
}

export function orderShippedEmail(order: OrderLite, trackingCode: string): EmailContent {
  const body = `
    <p style="color:#555;font-size:15px;line-height:1.6;text-align:center;margin:0 0 16px;">
      ${order.customerName}, o pedido <strong>#${order.code}</strong> saiu para entrega! 🚚
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="background:#fff8e1;border-radius:16px;padding:18px;text-align:center;">
        <p style="color:#925c0e;font-size:12px;font-weight:700;margin:0;">CÓDIGO DE RASTREIO</p>
        <p style="color:#17181c;font-size:22px;font-weight:800;letter-spacing:2px;margin:6px 0 0;">${trackingCode}</p>
      </td>
    </tr></table>
    ${button(`${site()}/conta/pedidos`, "Rastrear entrega")}
  `;
  return { subject: `Seu pedido #${order.code} está a caminho! 🚚`, html: layout({ headerBg: "linear-gradient(135deg,#ffc421,#d99e06)", emoji: "🚚", title: "Pedido a caminho!", bodyHtml: body }) };
}

export function adminNewOrderEmail(order: OrderLite): EmailContent {
  const body = `
    <p style="color:#555;font-size:15px;line-height:1.6;text-align:center;margin:0 0 16px;">
      Novo pedido recebido de <strong>${order.customerName}</strong>.
    </p>
    ${itemsTable(order.items, order.total)}
    <p style="color:#666;font-size:13px;margin:12px 0 0;">Pagamento: <strong>${order.paymentMethod ?? "-"}</strong></p>
    ${order.address ? `<p style="color:#666;font-size:13px;margin:6px 0 0;">Entrega: ${order.address}</p>` : ""}
    ${button(`${site()}/admin/pedidos`, "Abrir no painel")}
  `;
  return { subject: `🛎️ Novo pedido #${order.code} — ${formatBRL(order.total)}`, html: layout({ emoji: "🛎️", title: "Novo pedido!", bodyHtml: body }) };
}

export function contactAckEmail(name: string): EmailContent {
  const body = `
    <p style="color:#555;font-size:15px;line-height:1.6;text-align:center;margin:0;">
      Olá, ${name}! Recebemos sua mensagem e responderemos em até <strong>24h úteis</strong>. 💬
    </p>
  `;
  return { subject: "Recebemos sua mensagem — QPet Shop", html: layout({ emoji: "💌", title: "Mensagem recebida!", bodyHtml: body }) };
}

export function adminContactEmail(data: { name: string; email: string; phone?: string; subject: string; message: string }): EmailContent {
  const body = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#333;">
      <tr><td style="padding:6px 0;"><strong>Nome:</strong> ${data.name}</td></tr>
      <tr><td style="padding:6px 0;"><strong>E-mail:</strong> ${data.email}</td></tr>
      ${data.phone ? `<tr><td style="padding:6px 0;"><strong>Telefone:</strong> ${data.phone}</td></tr>` : ""}
      <tr><td style="padding:6px 0;"><strong>Assunto:</strong> ${data.subject}</td></tr>
      <tr><td style="padding:12px 0 0;"><strong>Mensagem:</strong><br/>${data.message.replace(/\n/g, "<br/>")}</td></tr>
    </table>
  `;
  return { subject: `📨 Contato: ${data.subject}`, html: layout({ emoji: "📨", title: "Nova mensagem de contato", bodyHtml: body }) };
}

export function newsletterWelcomeEmail(): EmailContent {
  const body = `
    <p style="color:#555;font-size:15px;line-height:1.6;text-align:center;margin:0 0 20px;">
      Obrigado por assinar! Aqui está seu cupom de boas-vindas: 🎁
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="background:#fff8e1;border:2px dashed #ffc421;border-radius:16px;padding:22px;text-align:center;">
        <p style="color:#17181c;font-size:30px;font-weight:800;letter-spacing:3px;margin:0;">BEMVINDO10</p>
        <p style="color:#925c0e;font-size:12px;margin:6px 0 0;">10% OFF na primeira compra</p>
      </td>
    </tr></table>
    ${button(site(), "Aproveitar agora")}
  `;
  return { subject: "Seu cupom de 10% OFF chegou! 🎁", html: layout({ emoji: "🎁", title: "Cupom liberado!", bodyHtml: body }) };
}
