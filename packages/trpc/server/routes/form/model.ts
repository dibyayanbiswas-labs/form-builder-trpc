import { z } from "../../schema";

export const createFormInputModel = z.object({
  title: z.string().trim().min(1).max(55),
  description: z.string().max(255).optional(),
});

export const createFormOutputModel = z.object({
  id: z.string().uuid(),
});
