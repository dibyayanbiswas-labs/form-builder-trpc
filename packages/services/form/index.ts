import { and, db, eq, sql } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formFieldsTable } from "@repo/database/models/form-field";

import {
  createFieldInputSchema,
  createFormInputSchema,
  deleteFieldInputSchema,
  getFormByIdInputSchema,
  getFieldInputSchema,
  listFieldsByFormIdInputSchema,
  listFormsByUserIdInputSchema,
  reorderFieldsInputSchema,
  updateFieldInputSchema,
  type CreateFieldInputSchemaType,
  type CreateFormInputSchemaType,
  type DeleteFieldInputSchemaType,
  type GetFormByIdInputSchemaType,
  type GetFieldInputSchemaType,
  type ListFieldsByFormIdInputSchemaType,
  type ListFormsByUserIdInputSchemaType,
  type ReorderFieldsInputSchemaType,
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

  private async getOwnedField(id: string, userId: string) {
    const [result] = await db
      .select({ field: formFieldsTable })
      .from(formFieldsTable)
      .innerJoin(formsTable, eq(formFieldsTable.formId, formsTable.id))
      .where(and(eq(formFieldsTable.id, id), eq(formsTable.createdBy, userId)));

    if (!result) {
      throw new Error(`Form field with id ${id} does not exist`);
    }

    return result.field;
  }

  public async createField(payload: CreateFieldInputSchemaType, userId: string) {
    const field = await createFieldInputSchema.parseAsync(payload);
    return db.transaction(async (tx) => {
      const [ownedForm] = await tx
        .select({ id: formsTable.id })
        .from(formsTable)
        .where(and(eq(formsTable.id, field.formId), eq(formsTable.createdBy, userId)))
        .for("update");

      if (!ownedForm) {
        throw new Error(`Form with id ${field.formId} does not exist`);
      }

      const labelKey = field.label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const [nextIndex] = await tx
        .select({
          index: sql<string>`COALESCE(MAX(${formFieldsTable.index}) + 1, 1)`,
        })
        .from(formFieldsTable)
        .where(eq(formFieldsTable.formId, field.formId));

      if (!nextIndex) {
        throw new Error("Could not determine the next form field index");
      }

      const [createdField] = await tx
        .insert(formFieldsTable)
        .values({
          ...field,
          labelKey: labelKey || "field",
          index: nextIndex.index,
        })
        .returning({ id: formFieldsTable.id });

      if (!createdField) {
        throw new Error("Something went wrong while creating the form field");
      }

      return { id: createdField.id };
    });
  }

  public async updateField(payload: UpdateFieldInputSchemaType, userId: string) {
    const { id, ...updates } = await updateFieldInputSchema.parseAsync(payload);
    await this.getOwnedField(id, userId);
    const updateData =
      updates.label !== undefined
        ? {
            ...updates,
            labelKey:
              updates.label
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "") || "field",
          }
        : updates;

    const [updatedField] = await db
      .update(formFieldsTable)
      .set(updateData)
      .where(eq(formFieldsTable.id, id))
      .returning();

    if (!updatedField) {
      throw new Error(`Form field with id ${id} does not exist`);
    }

    return updatedField;
  }

  public async getField(id: GetFieldInputSchemaType, userId: string) {
    const validatedId = await getFieldInputSchema.parseAsync(id);
    return this.getOwnedField(validatedId, userId);
  }

  public async deleteField(id: DeleteFieldInputSchemaType, userId: string) {
    const validatedId = await deleteFieldInputSchema.parseAsync(id);
    await this.getOwnedField(validatedId, userId);

    const [deletedField] = await db
      .delete(formFieldsTable)
      .where(eq(formFieldsTable.id, validatedId))
      .returning({ id: formFieldsTable.id });

    if (!deletedField) {
      throw new Error(`Form field with id ${validatedId} does not exist`);
    }

    return { id: deletedField.id };
  }

  public async listFieldsByFormId(formId: ListFieldsByFormIdInputSchemaType, userId: string) {
    const validatedFormId = await listFieldsByFormIdInputSchema.parseAsync(formId);
    const [ownedForm] = await db
      .select({ id: formsTable.id })
      .from(formsTable)
      .where(and(eq(formsTable.id, validatedFormId), eq(formsTable.createdBy, userId)));

    if (!ownedForm) {
      throw new Error(`Form with id ${validatedFormId} does not exist`);
    }

    return db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, validatedFormId))
      .orderBy(sql`${formFieldsTable.index} ASC`);
  }

  public async getFormById(id: GetFormByIdInputSchemaType) {
    const formId = await getFormByIdInputSchema.parseAsync(id);
    const rows = await db
      .select({
        form: {
          id: formsTable.id,
          title: formsTable.title,
          description: formsTable.description,
        },
        field: {
          id: formFieldsTable.id,
          label: formFieldsTable.label,
          labelKey: formFieldsTable.labelKey,
          description: formFieldsTable.description,
          placeholder: formFieldsTable.placeholder,
          isRequired: formFieldsTable.isRequired,
          index: formFieldsTable.index,
          fieldType: formFieldsTable.fieldType,
        },
      })
      .from(formsTable)
      .leftJoin(formFieldsTable, eq(formFieldsTable.formId, formsTable.id))
      .where(eq(formsTable.id, formId))
      .orderBy(sql`${formFieldsTable.index} ASC`);
    const firstRow = rows[0];

    if (!firstRow) {
      throw new Error(`Form with id ${formId} does not exist`);
    }

    return {
      ...firstRow.form,
      fields: rows.map(({ field }) => field).filter((field) => field !== null),
    };
  }

  public async reorderFields(payload: ReorderFieldsInputSchemaType, userId: string) {
    const { formId, fieldIds } = await reorderFieldsInputSchema.parseAsync(payload);

    return db.transaction(async (tx) => {
      const [ownedForm] = await tx
        .select({ id: formsTable.id })
        .from(formsTable)
        .where(and(eq(formsTable.id, formId), eq(formsTable.createdBy, userId)))
        .for("update");

      if (!ownedForm) {
        throw new Error(`Form with id ${formId} does not exist`);
      }

      const fields = await tx
        .select({ id: formFieldsTable.id, index: formFieldsTable.index })
        .from(formFieldsTable)
        .where(eq(formFieldsTable.formId, formId))
        .for("update");
      const existingIds = new Set(fields.map(({ id }) => id));

      if (
        fieldIds.length !== fields.length ||
        new Set(fieldIds).size !== fieldIds.length ||
        fieldIds.some((id) => !existingIds.has(id))
      ) {
        throw new Error("The requested field order does not match the fields in this form");
      }

      const minIndex = Math.min(...fields.map(({ index }) => Number(index)));
      for (const [position, field] of fields.entries()) {
        await tx
          .update(formFieldsTable)
          .set({ index: String(minIndex - fields.length - position - 1) })
          .where(eq(formFieldsTable.id, field.id));
      }

      for (const [position, id] of fieldIds.entries()) {
        await tx
          .update(formFieldsTable)
          .set({ index: String(position + 1) })
          .where(eq(formFieldsTable.id, id));
      }

      return { formId };
    });
  }
}

export default FormService;
