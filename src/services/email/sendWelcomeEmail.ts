await getResend().emails.send({

export async function sendWelcomeEmail(
  name: string,
  email: string
) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "🐶 Bem-vindo à QPet!",
    html: `
      <div style="font-family:Arial;padding:40px;background:#f5f5f5">
        <div style="max-width:600px;background:#fff;padding:30px;margin:auto;border-radius:12px">

          <h1 style="color:#16a34a">
            Bem-vindo à QPet 🐶
          </h1>

          <p>Olá <b>${name}</b>,</p>

          <p>Seu cadastro foi realizado com sucesso.</p>

          <p>
            Agora você já pode acessar sua conta,
            agendar serviços,
            acompanhar seus pedidos
            e muito mais.
          </p>

          <br>

          <a
            href="https://qpetshop.com.br"
            style="
              background:#16a34a;
              color:#fff;
              padding:14px 25px;
              text-decoration:none;
              border-radius:8px;
              display:inline-block;
            "
          >
            Acessar minha conta
          </a>

          <br><br>

          <p>Equipe QPet ❤️</p>

        </div>
      </div>
    `,
  });
}
