export type FormActionReturnType = Promise<{ field: string; message: string }[]>

export type FormActionReturnTypeWithStatus = Promise<{ status?: "success" | 'error', errors?: Awaited<FormActionReturnType> }>