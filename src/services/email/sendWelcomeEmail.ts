import { getResend } from "@/lib/resend";

export async function sendWelcomeEmail(
  name: string,
  email: string
) {
  return await getResend().emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "🐶 Bem-vindo à QPet!",
    html: `
      <h1>Olá, ${name}!</h1>
      <p>Seu cadastro foi realizado com sucesso.</p>
    `,
  });
}
