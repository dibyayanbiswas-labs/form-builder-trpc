import { z, zodUndefinedModel } from "../../schema";

export const createFormInputModel = z.object({
  title: z.string().trim().min(1).max(55).describe("Title of the form"),
  description: z.string().max(255).optional().describe("Description of the form"),
});

export const createFormOutputModel = z.object({
  id: z.string().uuid().describe("ID of the created form"),
});

export const listFormsInputModel = zodUndefinedModel;

export const listFormsOutputModel = z.array(
  z.object({
    id: z.string().uuid().describe("ID of the form"),
    title: z.string().describe("Title of the form"),
    description: z.string().nullable().describe("Description of the form"),
    createdAt: z.string().nullable().describe("Timestamp when the form was created"),
    updatedAt: z.string().nullable().describe("Timestamp when the form was last updated"),
  }),
);
