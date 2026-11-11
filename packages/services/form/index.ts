import { db, eq, sql } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formFieldsTable } from "@repo/database/models/form-field";

import {
  createFieldInputSchema,
  createFormInputSchema,
  deleteFieldInputSchema,
  getFieldInputSchema,
  listFormsByUserIdInputSchema,
  updateFieldInputSchema,
  type CreateFieldInputSchemaType,
  type CreateFormInputSchemaType,
  type DeleteFieldInputSchemaType,
  type GetFieldInputSchemaType,
  type ListFormsByUserIdInputSchemaType,
  type UpdateFieldInputSchemaType,
} from "./model";

class FormService {
  public async createForm(payload: CreateFormInputSchemaType) {
    const { title, description, createdBy } = await createFormInputSchema.parseAsync(payload);

    const [form] = await db
      .insert(formsTable)
      .values({ title, description, createdBy })
      .returning({ id: formsTable.id });

    if (!form) {
      throw new Error("Something went wrong while creating the form");
    }

    return { id: form.id };
  }

  public async listFormsByUserId(userId: ListFormsByUserIdInputSchemaType) {
    const validatedUserId = await listFormsByUserIdInputSchema.parseAsync(userId);

    return db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
      })
      .from(formsTable)
      .where(eq(formsTable.createdBy, validatedUserId));
  }

  private async getNextIndex(formId: string) {
    const [result] = await db
      .select({
        index: sql<string>`COALESCE(MAX(${formFieldsTable.index}) + 1, 1)`,
      })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId));

    if (!result) {
      throw new Error("Could not determine the next form field index");
    }

    return result.index;
  }

  public async createField(payload: CreateFieldInputSchemaType) {
    const field = await createFieldInputSchema.parseAsync(payload);
    const labelKey = field.label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const index = await this.getNextIndex(field.formId);

    const [createdField] = await db
      .insert(formFieldsTable)
      .values({
        ...field,
        labelKey: labelKey || "field",
        index,
      })
      .returning({ id: formFieldsTable.id });

    if (!createdField) {
      throw new Error("Something went wrong while creating the form field");
    }

    return { id: createdField.id };
  }

  public async updateField(payload: UpdateFieldInputSchemaType) {
    const { id, ...updates } = await updateFieldInputSchema.parseAsync(payload);

    const [updatedField] = await db
      .update(formFieldsTable)
      .set(updates)
      .where(eq(formFieldsTable.id, id))
      .returning();

    if (!updatedField) {
      throw new Error(`Form field with id ${id} does not exist`);
    }

    return updatedField;
  }

  public async getField(id: GetFieldInputSchemaType) {
    const validatedId = await getFieldInputSchema.parseAsync(id);
    const [field] = await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.id, validatedId));

    if (!field) {
      throw new Error(`Form field with id ${validatedId} does not exist`);
    }

    return field;
  }

  public async deleteField(id: DeleteFieldInputSchemaType) {
    const validatedId = await deleteFieldInputSchema.parseAsync(id);
    const [deletedField] = await db
      .delete(formFieldsTable)
      .where(eq(formFieldsTable.id, validatedId))
      .returning({ id: formFieldsTable.id });

    if (!deletedField) {
      throw new Error(`Form field with id ${validatedId} does not exist`);
    }

    return { id: deletedField.id };
  }
}

export default FormService;
