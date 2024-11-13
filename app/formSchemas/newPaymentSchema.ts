import { z } from "zod";

const newPaymentSchema = z.object({
  amount: z
    .string()
    .min(1, "L'importo è obbligatorio")
    .regex(
      /^\d+(,\d{1,2})?$/,
      "L'importo deve essere un numero valido (es. 1000,00)"
    )
    .refine(
      (value) => {
        // Replace comma as a decimal separator
        const numericValue = parseFloat(value.replace(",", "."));
        return numericValue > 0 && numericValue <= 5000;
      },
      {
        message: "L'importo deve essere maggiore di 0 e non superare 5000",
      }
    )
    .transform((value) => Number(value.replace(",", "."))),
  includeCommission: z
    .string()
    .optional()
    .transform((value) => value === "true"),
});

const validateNewPayment = (formData: FormData) =>
  newPaymentSchema.safeParse(Object.fromEntries(formData.entries()));

export default validateNewPayment;
