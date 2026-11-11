"use client";

import { useListFields, useGetFormSubmissions } from "~/hooks/api/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

type Fields = NonNullable<ReturnType<typeof useListFields>["fields"]>;

function FormSubmissionResults({ formId, fields }: { formId: string; fields: Fields }) {
  const { submissions, error, isError, isLoading } = useGetFormSubmissions(formId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading submissions...</p>;
  }

  if (isError) {
    return (
      <p role="alert" className="text-sm text-destructive">
        Could not load submissions: {error?.message ?? "An unexpected error occurred."}
      </p>
    );
  }

  if (!submissions?.length) {
    return <p className="text-sm text-muted-foreground">No responses have been submitted yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Submitted</TableHead>
          {fields.map((field) => (
            <TableHead key={field.id}>{field.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission) => {
          const values = new Map(
            (submission.values ?? []).map(({ formFieldId, value }) => [formFieldId, value]),
          );

          return (
            <TableRow key={submission.id}>
              <TableCell>
                {submission.createdAt ? new Date(submission.createdAt).toLocaleString() : "Unknown"}
              </TableCell>
              {fields.map((field) => {
                const value = values.get(field.id);
                const displayValue =
                  field.fieldType === "checkbox" && value !== undefined
                    ? value === "true"
                      ? "Yes"
                      : "No"
                    : value?.trim() || "—";

                return (
                  <TableCell key={field.id} className="max-w-xs whitespace-pre-wrap">
                    {displayValue}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export function FormSubmissionsTable({ formId }: { formId: string }) {
  const { fields, error, isError, isLoading } = useListFields(formId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading form fields...</p>;
  }

  if (isError || !fields) {
    return (
      <p role="alert" className="text-sm text-destructive">
        Could not load form fields: {error?.message ?? "An unexpected error occurred."}
      </p>
    );
  }

  return <FormSubmissionResults formId={formId} fields={fields} />;
}
