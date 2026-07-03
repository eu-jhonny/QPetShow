import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Informe seu e-mail")
  .email("E-mail inválido")
  .max(254);

export const newsletterSchema = z.object({
  email: emailSchema,
  name: z.string().trim().max(100).optional(),
  source: z.enum(["popup", "footer", "home", "checkout"]).default("home"),
  consent: z.literal(true, { message: "É necessário aceitar a política de privacidade" }),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  email: emailSchema,
  phone: z
    .string()
    .trim()
    .regex(/^\(?\d{2}\)?[\s-]?9?\d{4}-?\d{4}$/, "Telefone inválido")
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().min(3, "Informe o assunto").max(120),
  message: z.string().trim().min(10, "Escreva pelo menos 10 caracteres").max(2000),
});

export const passwordSchema = z
  .string()
  .min(8, "Mínimo de 8 caracteres")
  .max(72)
  .regex(/[a-z]/, "Inclua uma letra minúscula")
  .regex(/[A-Z]/, "Inclua uma letra maiúscula")
  .regex(/\d/, "Inclua um número");

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome completo").max(100),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    consent: z.literal(true, { message: "É necessário aceitar os termos" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Informe sua senha"),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const checkoutAddressSchema = z.object({
  fullName: z.string().trim().min(3, "Informe o nome completo").max(100),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  street: z.string().trim().min(3, "Informe a rua").max(150),
  number: z.string().trim().min(1, "Nº").max(10),
  complement: z.string().trim().max(80).optional().or(z.literal("")),
  neighborhood: z.string().trim().min(2, "Informe o bairro").max(80),
  city: z.string().trim().min(2, "Informe a cidade").max(80),
  state: z.string().length(2, "UF"),
  phone: z.string().regex(/^\(?\d{2}\)?[\s-]?9?\d{4}-?\d{4}$/, "Telefone inválido"),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CheckoutAddressInput = z.infer<typeof checkoutAddressSchema>;
