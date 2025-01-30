'use server'

import { UserService } from "@/app/services/userService";
import { FormActionReturnTypeWithStatus } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import { z } from "zod";
import generatePosLoginLink from "./generatePosLoginLink";

export default async function createPosAction(prevState: Awaited<FormActionReturnTypeWithStatus<{ data?: string }>>, formData: FormData): FormActionReturnTypeWithStatus<{ data?: string }> {
    const validator = z.object({
        posName: z.string().max(50, { message: 'Name cannot be longer than 50 characters' }),
        email: z
        .string()
        .min(1, "Inserire un indirizzo email valido")
        .email("Inserire un indirizzo email valido") // Add email format validation
        .trim()
        .transform((email) => email.toLowerCase())
        .refine(async (email) => !(await UserService.getUserByEmail(email)), {
          message: "L'utente esiste già",
        }),
    }) 
    const validation = await validator.safeParseAsync({ posName: formData.get('posName'), email: formData.get('email') });
    if (!validation.success) {
        return {
            status: "error",
            errors: formatZodErrors(validation),
            data: ''
        }
    }
    const { posName, email } = validation.data;

    const user = await getUserFromAuth();
    const store = (await UserService.getStores(user))?.[0]; // to adjust when a user can manage multiple stores
    const pos =  await UserService.createPOS(posName, store.id, email);
    return {
        status: 'success',
        data: await generatePosLoginLink(pos.id),
        errors: [],
    }
}