import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Políticas e privacidade",
  description: "Política de privacidade, trocas, devoluções e proteção de dados (LGPD) da QPet Shop.",
};

const sections = [
  {
    title: "1. Privacidade e proteção de dados (LGPD)",
    content:
      "A QPet Shop trata seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Coletamos apenas os dados necessários para processar pedidos, melhorar sua experiência e enviar comunicações autorizadas por você. Seus dados nunca são vendidos a terceiros. Você pode, a qualquer momento, solicitar acesso, correção, portabilidade ou exclusão dos seus dados pelo e-mail contato@qpetshop.com.br.",
  },
  {
    title: "2. Segurança das informações",
    content:
      "Todo o site opera sob HTTPS com criptografia SSL/TLS. Senhas são armazenadas com hash criptográfico (bcrypt) e nunca em texto puro. Dados de cartão de crédito são processados diretamente pelo gateway de pagamento certificado PCI-DSS e não são armazenados em nossos servidores. Aplicamos autenticação por tokens seguros (JWT em cookies HttpOnly), proteção contra CSRF e XSS, e limitação de tentativas de acesso.",
  },
  {
    title: "3. Cookies",
    content:
      "Utilizamos cookies essenciais para o funcionamento do site (sessão e carrinho) e, mediante seu consentimento, cookies analíticos para melhorar a experiência. Você pode gerenciar suas preferências no seu navegador a qualquer momento.",
  },
  {
    title: "4. Trocas e devoluções",
    content:
      "Conforme o Código de Defesa do Consumidor, você pode desistir da compra em até 7 dias corridos após o recebimento, com reembolso integral. Para trocas por defeito, o prazo é de 30 dias para produtos não duráveis e 90 dias para duráveis. O produto deve estar na embalagem original. Solicite pelo e-mail ou WhatsApp com o número do pedido.",
  },
  {
    title: "5. Entregas",
    content:
      "Prazos: 1 a 3 dias úteis para a região metropolitana e 3 a 10 dias úteis para as demais regiões, contados a partir da confirmação do pagamento. Frete grátis em pedidos acima de R$ 199,00. O código de rastreio é enviado por e-mail assim que o pedido é despachado.",
  },
  {
    title: "6. Pagamentos",
    content:
      "Aceitamos PIX (5% de desconto), cartões de crédito em até 3x sem juros e boleto bancário. Pedidos com boleto são confirmados em até 2 dias úteis após o pagamento. Em caso de pagamento recusado, você é notificado por e-mail para tentar novamente.",
  },
  {
    title: "7. Medicamentos veterinários",
    content:
      "Produtos de uso veterinário são vendidos conforme regulamentação do MAPA. Medicamentos controlados exigem receita veterinária válida. Siga sempre as orientações do médico veterinário do seu pet.",
  },
];

export default function PoliticasPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10 text-center">
        <span className="text-5xl" aria-hidden>🛡️</span>
        <h1 className="font-display mt-3 text-4xl font-extrabold">Políticas da loja</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Transparência e segurança em primeiro lugar. Última atualização: julho de 2026.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        {sections.map((section) => (
          <section key={section.title} className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
            <h2 className="font-display text-lg font-extrabold">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{section.content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
