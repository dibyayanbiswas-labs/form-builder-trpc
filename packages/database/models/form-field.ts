import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  numeric,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { formsTable } from "../schema";

export const fieldTypeEnum = pgEnum("field_type_enum", [
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

export const formFieldsTable = pgTable(
  "form_fields",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    label: varchar("label", { length: 100 }).notNull(),
    labelKey: varchar("label_key", { length: 255 }).notNull(),

    description: text("description"),

    placeholder: text("placeholder"),

    isRequired: boolean("is_required").default(false).notNull(),

    index: numeric("index", { scale: 2 }).notNull(),

    fieldType: fieldTypeEnum("field_type").notNull(),

    formId: uuid("form_id")
      .references(() => formsTable.id, { onDelete: "cascade" })
      .notNull(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => ({
    uniqueFormIdAndIndex: unique().on(table.formId, table.index),
  }),
);

export type SelectFormField = typeof formFieldsTable.$inferSelect;
export type InsertFormField = typeof formFieldsTable.$inferInsert;
