"use client";

import { useState } from "react";
import Link from "next/link";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";

import { CreateFieldDialog, EditFieldDialog } from "~/components/field-editor-dialog";
import { Button } from "~/components/ui/button";
import { useDeleteField, useListFields } from "~/hooks/api/form";

export function FormFieldsBuilder({ formId }: { formId: string }) {
  const [editingFieldId, setEditingFieldId] = useState<string>();
  const { fields, error, isError, isLoading } = useListFields(formId);
  const { deleteField, error: deleteError, isPending: isDeleting } = useDeleteField();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Form fields</h2>
          <p className="text-muted-foreground">Add and configure the fields in this form.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/forms/${formId}/preview`}>
              <IconEye />
              Preview
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/forms/${formId}/submissions`}>View submissions</Link>
          </Button>
          <CreateFieldDialog formId={formId} />
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading fields...</p>}
      {isError && (
        <p role="alert" className="text-sm text-destructive">
          Could not load fields: {error?.message ?? "An unexpected error occurred."}
        </p>
      )}
      {deleteError && (
        <p role="alert" className="text-sm text-destructive">
          Could not delete field: {deleteError.message}
        </p>
      )}
      {!isLoading && !isError && !fields?.length && (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          This form has no fields yet.
        </p>
      )}
      {!!fields?.length && (
        <ol className="flex flex-col gap-3">
          {fields.map((field) => (
            <li
              key={field.id}
              className="flex items-start justify-between gap-4 rounded-lg border p-4"
            >
              <div className="min-w-0">
                <p className="font-medium">{field.label}</p>
                <p className="text-sm text-muted-foreground">
                  {field.fieldType}
                  {field.isRequired ? " · Required" : ""}
                </p>
                {field.description && <p className="mt-2 text-sm">{field.description}</p>}
                {field.placeholder && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Placeholder: {field.placeholder}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  Label key: <code>{field.labelKey}</code>
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label={`Edit ${field.label}`}
                  onClick={() => setEditingFieldId(field.id)}
                >
                  <IconPencil />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label={`Delete ${field.label}`}
                  disabled={isDeleting}
                  onClick={() => {
                    if (window.confirm(`Delete "${field.label}"?`)) {
                      deleteField({ id: field.id });
                    }
                  }}
                >
                  <IconTrash />
                </Button>
              </div>
            </li>
          ))}
        </ol>
      )}

      {editingFieldId && (
        <EditFieldDialog fieldId={editingFieldId} onClose={() => setEditingFieldId(undefined)} />
      )}
    </div>
  );
}
