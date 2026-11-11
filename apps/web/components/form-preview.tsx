"use client";

import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useListFields, useListForms } from "~/hooks/api/form";

export function FormPreview({ formId }: { formId: string }) {
  const {
    forms,
    error: formsError,
    isError: isFormsError,
    isLoading: isFormsLoading,
  } = useListForms();
  const {
    fields,
    error: fieldsError,
    isError: isFieldsError,
    isLoading: isFieldsLoading,
  } = useListFields(formId);
  const form = forms?.find((item) => item.id === formId);

  if (isFormsLoading || isFieldsLoading) {
    return <p className="text-sm text-muted-foreground">Loading preview...</p>;
  }

  if (isFormsError || isFieldsError || !form || !fields) {
    return (
      <p role="alert" className="text-sm text-destructive">
        Could not load preview:{" "}
        {formsError?.message ?? fieldsError?.message ?? "Form not found or access denied."}
      </p>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Preview only. This form is not being submitted.
        </p>
        <Button variant="outline" asChild>
          <Link href={`/dashboard/forms/${formId}`}>Back to builder</Link>
        </Button>
      </div>
      <section className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        <header className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold">{form.title}</h1>
          {form.description && (
            <p className="whitespace-pre-wrap text-muted-foreground">{form.description}</p>
          )}
        </header>

        {fields.length === 0 ? (
          <p className="text-sm text-muted-foreground">This form does not have any fields yet.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {fields.map((field) => (
              <Field key={field.id}>
                {field.fieldType === "checkbox" ? (
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      disabled
                      className="size-4 rounded border-input accent-primary"
                    />
                    {field.label}
                    {field.isRequired && <span aria-hidden="true">*</span>}
                  </label>
                ) : (
                  <>
                    <FieldLabel>
                      {field.label}
                      {field.isRequired && <span aria-hidden="true"> *</span>}
                    </FieldLabel>
                    {field.fieldType === "textarea" ? (
                      <Textarea placeholder={field.placeholder ?? undefined} disabled />
                    ) : field.fieldType === "select" || field.fieldType === "radio" ? (
                      <p className="text-sm text-muted-foreground">
                        Options have not been configured for this field.
                      </p>
                    ) : field.fieldType === "file" ? (
                      <Input type="file" disabled />
                    ) : (
                      <Input
                        type={field.fieldType}
                        placeholder={field.placeholder ?? undefined}
                        disabled
                      />
                    )}
                  </>
                )}
                {field.description && <FieldDescription>{field.description}</FieldDescription>}
              </Field>
            ))}
          </div>
        )}

        <div className="mt-8 border-t pt-6">
          <Button type="button" disabled>
            Submit
          </Button>
        </div>
      </section>
    </div>
  );
}
