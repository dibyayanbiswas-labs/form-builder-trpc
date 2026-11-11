import { and, db, desc, eq } from "@repo/database";
import { formFieldsTable } from "@repo/database/models/form-field";
import { formsTable } from "@repo/database/models/form";
import { formSubmissionsTable } from "@repo/database/models/form-submission";

import {
  getSubmissionsByFormIdInputSchema,
  submitFormInputSchema,
  type GetSubmissionsByFormIdInputSchemaType,
  type SubmitFormInputSchemaType,
} from "./model";

class FormSubmissionService {
  public async submitForm(payload: SubmitFormInputSchemaType) {
    const { formId, values } = await submitFormInputSchema.parseAsync(payload);
    const fieldIds = values.map(({ formFieldId }) => formFieldId);

    if (new Set(fieldIds).size !== fieldIds.length) {
      throw new Error("A form field can only be submitted once");
    }

    const [form] = await db
      .select({ id: formsTable.id })
      .from(formsTable)
      .where(eq(formsTable.id, formId));

    if (!form) {
      throw new Error(`Form with id ${formId} does not exist`);
    }

    const fields = await db
      .select({
        id: formFieldsTable.id,
        isRequired: formFieldsTable.isRequired,
        fieldType: formFieldsTable.fieldType,
      })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId));

    const formFieldIds = new Set(fields.map(({ id }) => id));

    if (fieldIds.some((fieldId) => !formFieldIds.has(fieldId))) {
      throw new Error("One or more submitted fields do not belong to this form");
    }

    const submittedValues = new Map(values.map(({ formFieldId, value }) => [formFieldId, value]));
    const missingRequiredField = fields.find((field) => {
      if (!field.isRequired) {
        return false;
      }

      const value = submittedValues.get(field.id);
      return field.fieldType === "checkbox" ? value !== "true" : !value?.trim();
    });

    if (missingRequiredField) {
      throw new Error("Please provide a value for every required field");
    }

    const [submission] = await db
      .insert(formSubmissionsTable)
      .values({
        formId,
        values,
      })
      .returning({ id: formSubmissionsTable.id });

    if (!submission) {
      throw new Error("Something went wrong while submitting the form");
    }

    return { id: submission.id };
  }

  public async getSubmissionsByFormId(
    formId: GetSubmissionsByFormIdInputSchemaType,
    userId: string,
  ) {
    const validatedFormId = await getSubmissionsByFormIdInputSchema.parseAsync(formId);
    const [ownedForm] = await db
      .select({ id: formsTable.id })
      .from(formsTable)
      .where(and(eq(formsTable.id, validatedFormId), eq(formsTable.createdBy, userId)));

    if (!ownedForm) {
      throw new Error(`Form with id ${validatedFormId} does not exist`);
    }

    return await db
      .select({
        id: formSubmissionsTable.id,
        formId: formSubmissionsTable.formId,
        values: formSubmissionsTable.values,
        createdAt: formSubmissionsTable.createdAt,
        updatedAt: formSubmissionsTable.updatedAt,
      })
      .from(formSubmissionsTable)
      .where(eq(formSubmissionsTable.formId, validatedFormId))
      .orderBy(desc(formSubmissionsTable.createdAt));
  }
}

export default FormSubmissionService;
