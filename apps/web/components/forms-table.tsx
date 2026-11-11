"use client";

import Link from "next/link";
import { IconPencil } from "@tabler/icons-react";

import { Button } from "~/components/ui/button";
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
          <TableHead className="w-12">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {forms.map((form) => (
          <TableRow key={form.id}>
            <TableCell>
              <span className="font-medium">{form.title}</span>
            </TableCell>
            <TableCell className="max-w-sm truncate">{form.description || "—"}</TableCell>
            <TableCell>
              {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "—"}
            </TableCell>
            <TableCell>
              {form.updatedAt ? new Date(form.updatedAt).toLocaleDateString() : "—"}
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/dashboard/forms/${form.id}`} aria-label={`Edit ${form.title}`}>
                  <IconPencil />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
