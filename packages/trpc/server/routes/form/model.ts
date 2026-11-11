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

export const getFormByIdInputModel = z
  .object({
    id: z.string().uuid().describe("ID of the form to retrieve"),
  })
  .describe("Input for retrieving a publicly shareable form");

export const getFormByIdOutputModel = z
  .object({
    id: z.string().uuid().describe("ID of the form"),
    title: z.string().describe("Title of the form"),
    description: z.string().nullable().describe("Description of the form"),
    fields: z
      .array(
        z
          .object({
            id: z.string().uuid().describe("ID of the field"),
            label: z.string().describe("Visible field label"),
            labelKey: z.string().describe("Slug generated from the field label"),
            description: z.string().nullable().describe("Description of the field"),
            placeholder: z.string().nullable().describe("Placeholder shown for the field"),
            isRequired: z.boolean().describe("Whether the field is required"),
            index: z.string().describe("Sort index of the field"),
            fieldType: fieldTypeModel.describe("Input type rendered for the field"),
          })
          .describe("A field included in the form"),
      )
      .describe("Fields in the form, ordered by their sort index"),
  })
  .describe("Publicly shareable form with its fields");

export const submitFormInputModel = z
  .object({
    formId: z.string().uuid().describe("ID of the form being submitted"),
    values: z
      .array(
        z.object({
          formFieldId: z.string().uuid().describe("ID of the submitted form field"),
          value: z.string().describe("Submitted value for the field"),
        }),
      )
      .describe("Submitted values keyed by form field ID"),
  })
  .describe("Input for submitting a public form");

export const submitFormOutputModel = z.object({
  id: z.string().uuid().describe("ID of the created submission"),
});

export const getFormSubmissionsInputModel = z.object({
  formId: z.string().uuid().describe("ID of the form whose submissions to retrieve"),
});

export const getFormSubmissionsOutputModel = z.array(
  z.object({
    id: z.string().uuid().describe("ID of the submission"),
    formId: z.string().uuid().nullable().describe("ID of the submitted form"),
    values: z
      .array(
        z.object({
          formFieldId: z.string().uuid().describe("ID of the submitted field"),
          value: z.string().describe("Submitted value"),
        }),
      )
      .nullable()
      .describe("Submitted values"),
    createdAt: z.string().nullable().describe("Timestamp when the submission was created"),
    updatedAt: z.string().nullable().describe("Timestamp when the submission was last updated"),
  }),
);

export const reorderFieldsInputModel = z
  .object({
    formId: z.string().uuid().describe("ID of the form whose fields should be reordered"),
    fieldIds: z
      .array(z.string().uuid())
      .min(1)
      .describe("Field IDs in their requested display order"),
  })
  .describe("Input for reordering form fields");

export const reorderFieldsOutputModel = z.object({
  formId: z.string().uuid().describe("ID of the reordered form"),
});
