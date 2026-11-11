import { z } from "zod";

export const createFormInputSchema = z.object({
  title: z.string().trim().min(1).max(55),
  description: z.string().max(255).optional(),
  createdBy: z.uuid(),
});

export type CreateFormInputSchemaType = z.infer<typeof createFormInputSchema>;
