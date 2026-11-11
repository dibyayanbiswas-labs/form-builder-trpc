"use client";

import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useListForms } from "~/hooks/api/form";

export function FormsTable() {
  const { forms, error, isError, isLoading } = useListForms();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading forms...</p>;
  }

  if (isError) {
    return (
      <p role="alert" className="text-sm text-destructive">
        Could not load forms: {error?.message ?? "An unexpected error occurred."}
      </p>
    );
  }

  if (!forms?.length) {
    return <p className="text-sm text-muted-foreground">You haven&apos;t created any forms yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Last updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {forms.map((form) => (
          <TableRow key={form.id}>
            <TableCell>
              <Link href={`/dashboard/forms/${form.id}`} className="font-medium hover:underline">
                {form.title}
              </Link>
            </TableCell>
            <TableCell className="max-w-sm truncate">{form.description || "—"}</TableCell>
            <TableCell>
              {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "—"}
            </TableCell>
            <TableCell>
              {form.updatedAt ? new Date(form.updatedAt).toLocaleDateString() : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
