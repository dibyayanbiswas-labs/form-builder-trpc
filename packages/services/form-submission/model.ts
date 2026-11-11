import { z } from "zod";

export const submitFormInputSchema = z
  .object({
    formId: z.uuid().describe("ID of the form being submitted"),
    values: z
      .array(
        z.object({
          formFieldId: z.uuid().describe("ID of the submitted form field"),
          value: z.string().describe("Submitted value for the field"),
        }),
      )
      .describe("Submitted values keyed by form field ID"),
  })
  .describe("Input for submitting a public form");

export type SubmitFormInputSchemaType = z.infer<typeof submitFormInputSchema>;

export const getSubmissionsByFormIdInputSchema = z
  .uuid()
  .describe("ID of the form whose submissions should be retrieved");

export type GetSubmissionsByFormIdInputSchemaType = z.infer<
  typeof getSubmissionsByFormIdInputSchema
>;
