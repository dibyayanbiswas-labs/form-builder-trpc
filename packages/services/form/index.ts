import { db, eq } from "@repo/database";
import { formsTable } from "@repo/database/models/form";

import {
  createFormInputSchema,
  listFormsByUserIdInputSchema,
  type CreateFormInputSchemaType,
  type ListFormsByUserIdInputSchemaType,
} from "./model";

class FormService {
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
}

export default FormService;
