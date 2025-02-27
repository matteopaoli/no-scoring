'use server'

import { UserService } from "@/app/services/userService";
import { FormActionReturnTypeWithStatus } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import { z } from "zod";
import generatePosLoginLink from "./generatePosLoginLink";

export default async function createPosAction(prevState: Awaited<FormActionReturnTypeWithStatus<{ data?: string }>>, payload: FormData): FormActionReturnTypeWithStatus<{ data?: string }> {
    // const nameValidator = z.string().max(50, { message: 'Name cannot be longer than 50 characters' });
    // const validation = nameValidator.safeParse(payload.get('posName'));
    // if (!validation.success) {
    //     return {
    //         status: "error",
    //         errors: formatZodErrors(validation),
    //         data: ''
    //     }
    // }
    // const user = await getUserFromAuth();
    // const store = (await UserService.getStores(user))?.[0]; // to adjust when a user can manage multiple stores
    // const pos =  await UserService.createPOS(validation.data, store.id);
    // return {
    //     status: 'success',
    //     data: await generatePosLoginLink(pos.id),
    //     errors: [],
    // }
}