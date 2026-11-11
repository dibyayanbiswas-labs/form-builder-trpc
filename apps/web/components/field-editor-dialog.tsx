"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Field, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useCreateField, useGetField, useUpdateField } from "~/hooks/api/form";

const fieldTypes = [
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
] as const;

type FieldType = (typeof fieldTypes)[number];

type FieldValues = {
  label: string;
  description: string;
  placeholder: string;
  isRequired: boolean;
  fieldType: FieldType;
};

const emptyField: FieldValues = {
  label: "",
  description: "",
  placeholder: "",
  isRequired: false,
  fieldType: "text",
};

function FieldForm({
  initialValues,
  error,
  isPending,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initialValues: FieldValues;
  error?: string;
  isPending: boolean;
  submitLabel: string;
  onSubmit: (values: FieldValues) => void;
  onCancel: () => void;
}) {
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="field-label">Label</FieldLabel>
        <Input
          id="field-label"
          maxLength={100}
          required
          {...register("label", { required: true, maxLength: 100 })}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="field-type">Type</FieldLabel>
        <select
          id="field-type"
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          {...register("fieldType")}
        >
          {fieldTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </Field>
      <Field>
        <FieldLabel htmlFor="field-description">Description</FieldLabel>
        <Textarea id="field-description" {...register("description")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="field-placeholder">Placeholder</FieldLabel>
        <Input id="field-placeholder" {...register("placeholder")} />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("isRequired")} />
        Required
      </label>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function CreateFieldDialog({ formId }: { formId: string }) {
  const [open, setOpen] = useState(false);
  const { createField, error, isPending, reset } = useCreateField();

  const close = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (values: FieldValues) => {
    createField(
      {
        formId,
        ...values,
        description: values.description || undefined,
        placeholder: values.placeholder || undefined,
      },
      { onSuccess: close },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? setOpen(true) : close())}>
      <DialogTrigger asChild>
        <Button type="button">Add field</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a field</DialogTitle>
          <DialogDescription>
            Choose the field label and how it should appear in the form.
          </DialogDescription>
        </DialogHeader>
        <FieldForm
          initialValues={emptyField}
          error={error?.message}
          isPending={isPending}
          submitLabel="Add field"
          onSubmit={onSubmit}
          onCancel={close}
        />
      </DialogContent>
    </Dialog>
  );
}

export function EditFieldDialog({ fieldId, onClose }: { fieldId: string; onClose: () => void }) {
  const { field, error: loadError, isLoading } = useGetField(fieldId);
  const { updateField, error: updateError, isPending, reset } = useUpdateField();

  const initialValues = useMemo<FieldValues | undefined>(
    () =>
      field
        ? {
            label: field.label,
            description: field.description ?? "",
            placeholder: field.placeholder ?? "",
            isRequired: field.isRequired,
            fieldType: field.fieldType,
          }
        : undefined,
    [field],
  );

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: FieldValues) => {
    updateField(
      {
        id: fieldId,
        ...values,
        description: values.description || null,
        placeholder: values.placeholder || null,
      },
      { onSuccess: close },
    );
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit field</DialogTitle>
          <DialogDescription>Update this field&apos;s label and settings.</DialogDescription>
        </DialogHeader>
        {isLoading && <p className="text-sm text-muted-foreground">Loading field...</p>}
        {!isLoading && loadError && (
          <p role="alert" className="text-sm text-destructive">
            Could not load field: {loadError.message}
          </p>
        )}
        {initialValues && (
          <FieldForm
            key={fieldId}
            initialValues={initialValues}
            error={updateError?.message}
            isPending={isPending}
            submitLabel="Save changes"
            onSubmit={onSubmit}
            onCancel={close}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
