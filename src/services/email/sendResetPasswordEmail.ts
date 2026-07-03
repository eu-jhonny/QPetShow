import { getResend } from "@/lib/resend";

export async function sendResetPasswordEmail(
  email: string,
  token: string
) {
  const url = `${process.env.APP_URL}/reset-password?token=${token}`;

  return await getResend().emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Recuperação de senha",
    html: `
      <h1>Recuperação de senha</h1>

      <p>Recebemos uma solicitação para redefinir sua senha.</p>

      <p>
        <a href="${url}">
          Clique aqui para redefinir sua senha
        </a>
      </p>

      <p>Este link expira em 15 minutos.</p>

      <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
    `,
  });
}
