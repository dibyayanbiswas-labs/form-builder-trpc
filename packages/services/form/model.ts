import { z } from "zod";

export const createFormInputSchema = z
  .object({
    title: z.string().trim().min(1).max(55).describe("Form title"),
    description: z.string().max(255).optional().describe("Form description"),
    createdBy: z.uuid().describe("ID of the user who created the form"),
  })
  .describe("Input for creating a form");

export type CreateFormInputSchemaType = z.infer<typeof createFormInputSchema>;

export const listFormsByUserIdInputSchema = z
  .uuid()
  .describe("ID of the user whose forms should be listed");

export type ListFormsByUserIdInputSchemaType = z.infer<typeof listFormsByUserIdInputSchema>;

const fieldTypeEnumSchema = z
  .enum([
    "text",
    "number",
    "email",
    "password",
    "checkbox",
    "radio",
    "select",
    "textarea",
    "date",
    "time",
    "datetime-local",
    "file",
  ])
  .describe("Input type rendered for the form field");

export const createFieldInputSchema = z
  .object({
    label: z.string().trim().min(1).max(100).describe("Visible field label"),
    description: z.string().nullable().optional().describe("Field description"),
    placeholder: z.string().nullable().optional().describe("Field placeholder"),
    isRequired: z.boolean().optional().describe("Whether the field is required"),
    formId: z.uuid().describe("ID of the form containing the field"),
    fieldType: fieldTypeEnumSchema.describe("Input type rendered for the form field"),
  })
  .describe("Input for creating a form field");

export type CreateFieldInputSchemaType = z.infer<typeof createFieldInputSchema>;

export const updateFieldInputSchema = z
  .object({
    id: z.uuid().describe("ID of the field to update"),
    label: z.string().trim().min(1).max(100).optional().describe("Visible field label"),
    description: z.string().nullable().optional().describe("Field description"),
    placeholder: z.string().nullable().optional().describe("Field placeholder"),
    isRequired: z.boolean().optional().describe("Whether the field is required"),
    fieldType: fieldTypeEnumSchema.optional().describe("Input type rendered for the form field"),
  })
  .refine(
    ({ id: _id, ...updates }) => Object.values(updates).some((value) => value !== undefined),
    "At least one field property must be provided",
  );

export type UpdateFieldInputSchemaType = z.infer<typeof updateFieldInputSchema>;

export const getFieldInputSchema = z.uuid().describe("ID of the field to retrieve");

export type GetFieldInputSchemaType = z.infer<typeof getFieldInputSchema>;

export const deleteFieldInputSchema = z.uuid().describe("ID of the field to delete");

export type DeleteFieldInputSchemaType = z.infer<typeof deleteFieldInputSchema>;
