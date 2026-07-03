import { getResend } from "@/lib/resend";

export async function sendResetPasswordEmail(
  email: string,
  token: string
) {
  const url = `${process.env.APP_URL}/reset-password?token=${token}`;

  return resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Recuperação de senha",
    html: `
      <h1>Recuperação de senha</h1>

      <p>Clique no botão abaixo.</p>

      <a href="${url}">
        Alterar senha
      </a>

      <p>Este link expira em 15 minutos.</p>
    `,
  });
}
