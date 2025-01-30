"use server";

import { UserService } from "@/app/services/userService";
import { FormActionReturnTypeWithStatus } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import { z } from "zod";
import generatePosLoginLink from "./generatePosLoginLink";
import { User } from "@/app/db";

export default async function deletePosAction(
  prevState: Awaited<FormActionReturnTypeWithStatus>,
  posId: string
): FormActionReturnTypeWithStatus<{ data?: string }> {
    try {
        await UserService.deletePos(posId, (await getUserFromAuth()).id)
        return {
            status: 'success',
            errors: [],
        }
    }
    catch (e) {
        console.log(e)
        return {
            status: 'error',
            errors: [e as { field: string, message: string }]
        }
    }
}
