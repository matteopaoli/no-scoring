import { z } from "zod";

const MAX_FILE_SIZE = 5000000;

const userSettingsSchema = z.object({
    firstName: z.string().trim().min(1, "Inserisci il nome"),
    lastName: z.string().trim().min(1, "Inserisci il cognome"),
    image: z.union([z.instanceof(Blob), z.undefined()]).refine((file) => (file?.size ?? 0) <= MAX_FILE_SIZE, `L'immagine non puó superare i 5MB.`),
    password: z
        .union([z.string().min(8, "La password deve essere lunga almeno 8 caratteri"), z.string().length(0)])
        .optional()
        .transform(e => e === "" ? undefined : e)
        .refine(value => {
            if (value === undefined) return true;
            return /(?=.*[a-z])/.test(value) && /(?=.*[A-Z])/.test(value) &&
                /(?=.*[0-9])/.test(value) && /(?=.*[!@#$%^&*(),.?":{}|<>])/.test(value);
        }, {
            message: "La password deve contenere almeno una lettera minuscola, una maiuscola, un numero e un simbolo speciale"
        }),
    repeatPassword: z
        .union([z.string().min(8, "La password deve essere lunga almeno 8 caratteri"), z.string().length(0)]) // Same for repeatPassword
        .optional()
        .transform(e => e === "" ? undefined : e)
        .refine(value => {
            if (value === undefined) return true;
            return /(?=.*[a-z])/.test(value) && /(?=.*[A-Z])/.test(value) &&
                /(?=.*[0-9])/.test(value) && /(?=.*[!@#$%^&*(),.?":{}|<>])/.test(value);
        }, {
            message: "La password deve contenere almeno una lettera minuscola, una maiuscola, un numero e un simbolo speciale"
        }),
}).refine((data) => {
    if (data.password || data.repeatPassword) {
        return data.password === data.repeatPassword;
    }
    return true;
}, {
    message: "Le password non corrispondono",
    path: ["repeatPassword"],
});

const validateUserSettings = (formData: FormData) => userSettingsSchema.safeParse(Object.fromEntries(formData.entries()))

export default validateUserSettings