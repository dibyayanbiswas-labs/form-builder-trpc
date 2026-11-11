"use client";

import { useParams } from "next/navigation";

import { Button } from "~/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useGetFormById } from "~/hooks/api/form";

export default function PublicFormPage() {
  const { form_id: formId } = useParams<{ form_id: string }>();
  const { form, error, isError, isLoading } = useGetFormById(formId);

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

  return (
    <main className="mx-auto w-full max-w-2xl p-4 py-12">
      <section className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        <header className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold">{form.title}</h1>
          {form.description && (
            <p className="whitespace-pre-wrap text-muted-foreground">{form.description}</p>
          )}
        </header>

        {form.fields.length === 0 ? (
          <p className="text-sm text-muted-foreground">This form does not have any fields yet.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {form.fields.map((field) => (
              <Field key={field.id}>
                {field.fieldType === "checkbox" ? (
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      id={field.id}
                      name={field.labelKey}
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
                        name={field.labelKey}
                        placeholder={field.placeholder ?? undefined}
                        required={field.isRequired}
                      />
                    ) : field.fieldType === "select" || field.fieldType === "radio" ? (
                      <p className="text-sm text-muted-foreground">
                        Options have not been configured for this field.
                      </p>
                    ) : (
                      <Input
                        id={field.id}
                        name={field.labelKey}
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

        <div className="mt-8 border-t pt-6">
          <p className="mb-3 text-sm text-muted-foreground">
            Form responses are not available yet.
          </p>
          <Button type="button" disabled>
            Submit
          </Button>
        </div>
      </section>
    </main>
  );
}
