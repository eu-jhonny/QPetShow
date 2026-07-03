await getResend().emails.send({
import { NextResponse } from "next/server";

export async function GET() {
  try {
const { data, error } = await getResend().emails.send({      
  from: process.env.EMAIL_FROM!,
      to: ["vitaofernandes72@gmail.com"], // coloque seu e-mail
      subject: "Teste da QPet 🐶",
      html: `
        <h1>Funcionou!</h1>
        <p>Seu sistema da QPet está enviando e-mails com sucesso.</p>
      `,
    });

    if (error) {
      return NextResponse.json(error, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao enviar e-mail." },
      { status: 500 }
    );
  }
}
