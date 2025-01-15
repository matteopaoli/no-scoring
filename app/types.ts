export type FormActionReturnType = Promise<{ field: string; message: string }[]>

export type FormActionReturnTypeWithStatus<T = {}> = Promise<{ status?: "success" | 'error', errors?: Awaited<FormActionReturnType> } & T>