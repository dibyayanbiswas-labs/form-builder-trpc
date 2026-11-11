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

const fieldTypeModel = z.enum([
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
]);

export const createFieldInputModel = z.object({
  formId: z.string().uuid(),
  label: z.string().trim().min(1).max(100),
  description: z.string().nullable().optional(),
  placeholder: z.string().nullable().optional(),
  isRequired: z.boolean().optional().default(false),
  fieldType: fieldTypeModel,
});

export const updateFieldInputModel = z
  .object({
    id: z.string().uuid(),
    label: z.string().trim().min(1).max(100).optional(),
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    isRequired: z.boolean().optional(),
    fieldType: fieldTypeModel.optional(),
  })
  .refine(
    ({ id: _id, ...updates }) => Object.values(updates).some((value) => value !== undefined),
    "At least one field property must be provided",
  );

export const getFieldInputModel = z.object({
  id: z.string().uuid(),
});

export const deleteFieldInputModel = getFieldInputModel;

export const formFieldOutputModel = z.object({
  id: z.string().uuid(),
  label: z.string(),
  labelKey: z.string(),
  description: z.string().nullable(),
  placeholder: z.string().nullable(),
  isRequired: z.boolean(),
  index: z.string(),
  fieldType: fieldTypeModel,
  formId: z.string().uuid(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export const createFieldOutputModel = z.object({
  id: z.string().uuid(),
});

export const deleteFieldOutputModel = createFieldOutputModel;

export const listFieldsInputModel = z.object({
  formId: z.string().uuid(),
});

export const listFieldsOutputModel = z.array(formFieldOutputModel);
