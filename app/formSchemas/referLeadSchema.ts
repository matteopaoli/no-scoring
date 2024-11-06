import { z } from "zod";
import { getLeadByEmail, getUser } from "../db";

const referLeadSchema = z.object({
  firstName: z
    .string()
    .min(1, "Il nome è obbligatorio")
    .max(50, "Il nome non può superare i 50 caratteri"),

  lastName: z
    .string()
    .min(1, "Il cognome è obbligatorio")
    .max(50, "Il cognome non può superare i 50 caratteri"),

  businessName: z
    .string()
    .min(1, "Il nome dell'attività è obbligatorio")
    .max(100, "Il nome dell'attività non può superare i 100 caratteri"),

  sector: z
    .string()
    .min(1, "Il settore è obbligatorio")
    .max(100, "Il settore non può superare i 100 caratteri"),

  email: z
    .string()
    .min(1, "L'indirizzo email è obbligatorio")
    .email("Inserisci un indirizzo email valido")
    .max(100, "L'indirizzo email non può superare i 100 caratteri")
    .refine(async (email) => !(await getLeadByEmail(email)), {
      message: "Questo profilo è già stato segnalato",
    })
    .refine(async (email) => !(await getUser(email)), {
      message: "Email non valida",
    }),

  phoneNumber: z
    .string()
    .min(1, "Il numero di telefono è obbligatorio")
    .regex(/^\+?[0-9]{7,15}$/, "Inserisci un numero di telefono valido"),
});

const validateLead = (formData: FormData) =>
  referLeadSchema.safeParseAsync(Object.fromEntries(formData.entries()));

export default validateLead;
