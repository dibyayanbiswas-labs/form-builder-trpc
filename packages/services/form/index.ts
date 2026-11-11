import { db } from "@repo/database";
import { formsTable } from "@repo/database/models/form";

import { createFormInputSchema, type CreateFormInputSchemaType } from "./model";

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
}

export default FormService;
