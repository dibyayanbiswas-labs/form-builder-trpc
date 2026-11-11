"use client";

import { useState, type FormEvent } from "react";
import { useParams } from "next/navigation";

import { Button } from "~/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useGetFormById, useSubmitForm } from "~/hooks/api/form";

export default function PublicFormPage() {
  const { form_id: formId } = useParams<{ form_id: string }>();
  const { form, error, isError, isLoading } = useGetFormById(formId);
  const { submitForm, error: submissionError, isPending: isSubmitting } = useSubmitForm();
  const [submittedFormId, setSubmittedFormId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-2xl p-4 py-12">
        <p className="text-sm text-muted-foreground">Loading form...</p>
      </main>
    );
  }

  if (isError || !form) {
    return (
      <main className="mx-auto w-full max-w-2xl p-4 py-12">
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <h1 className="text-xl font-semibold">Form unavailable</h1>
          <p role="alert" className="mt-2 text-sm text-muted-foreground">
            {error?.message ?? "This form could not be found."}
          </p>
        </section>
      </main>
    );
  }

  const unsupportedFields = form.fields.filter((field) =>
    ["select", "radio", "file"].includes(field.fieldType),
  );
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = form.fields.map((field) => {
      if (field.fieldType === "checkbox") {
        return { formFieldId: field.id, value: String(formData.has(field.id)) };
      }

      const value = formData.get(field.id);
      return { formFieldId: field.id, value: typeof value === "string" ? value : "" };
    });

    submitForm({ formId: form.id, values }, { onSuccess: () => setSubmittedFormId(form.id) });
  };

  return (
    <main className="mx-auto w-full max-w-2xl p-4 py-12">
      <section className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        <header className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold">{form.title}</h1>
          {form.description && (
            <p className="whitespace-pre-wrap text-muted-foreground">{form.description}</p>
          )}
        </header>

        {submittedFormId === form.id ? (
          <p role="status" className="rounded-md border bg-muted p-4 text-sm">
            Your response has been submitted. Thank you.
          </p>
        ) : (
          <form onSubmit={onSubmit}>
            {form.fields.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                This form does not have any fields yet.
              </p>
            ) : (
              <div className="flex flex-col gap-6">
                {form.fields.map((field) => (
                  <Field key={field.id}>
                    {field.fieldType === "checkbox" ? (
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <input
                          id={field.id}
                          name={field.id}
                          type="checkbox"
                          required={field.isRequired}
                          className="size-4 rounded border-input accent-primary"
                        />
                        {field.label}
                        {field.isRequired && <span aria-hidden="true">*</span>}
                      </label>
                    ) : (
                      <>
                        <FieldLabel htmlFor={field.id}>
                          {field.label}
                          {field.isRequired && <span aria-hidden="true"> *</span>}
                        </FieldLabel>
                        {field.fieldType === "textarea" ? (
                          <Textarea
                            id={field.id}
                            name={field.id}
                            placeholder={field.placeholder ?? undefined}
                            required={field.isRequired}
                          />
                        ) : unsupportedFields.some(({ id }) => id === field.id) ? (
                          <p className="text-sm text-muted-foreground">
                            {field.fieldType === "file"
                              ? "File uploads are not available yet."
                              : "Options have not been configured for this field."}
                          </p>
                        ) : (
                          <Input
                            id={field.id}
                            name={field.id}
                            type={field.fieldType}
                            placeholder={field.placeholder ?? undefined}
                            required={field.isRequired}
                          />
                        )}
                      </>
                    )}
                    {field.description && <FieldDescription>{field.description}</FieldDescription>}
                  </Field>
                ))}
              </div>
            )}

            {unsupportedFields.length > 0 && (
              <p className="mt-6 text-sm text-muted-foreground">
                This form includes fields that are not supported yet, so it cannot be submitted.
              </p>
            )}
            {submissionError && (
              <p role="alert" className="mt-4 text-sm text-destructive">
                Could not submit form: {submissionError.message}
              </p>
            )}

            <div className="mt-8 border-t pt-6">
              <Button
                type="submit"
                disabled={isSubmitting || form.fields.length === 0 || unsupportedFields.length > 0}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
