import { z } from "zod"

export const signInSearchSchema = z.object({
  email: z
    .string()
    .optional()
    .nullable()
    .refine(e => {
      if (!e) return true
      return new RegExp(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(e)
    }),
})
export type SignInSearch = z.infer<typeof signInSearchSchema>
