"use client";

import { useState } from "react";
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
import { useCreateForm } from "~/hooks/api/form";

type CreateFormValues = {
  title: string;
  description: string;
};

export function CreateFormDialog() {
  const [open, setOpen] = useState(false);
  const { createFormAsync, error, isPending, reset: resetMutation } = useCreateForm();
  const { register, handleSubmit, reset } = useForm<CreateFormValues>({
    defaultValues: { title: "", description: "" },
  });

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset();
      resetMutation();
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createFormAsync({
        title: values.title,
        description: values.description || undefined,
      });
      onOpenChange(false);
    } catch {
      // The mutation error is rendered in the dialog.
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button type="button">Create new form</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a form</DialogTitle>
          <DialogDescription>
            Add a title and optional description for your new form.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="form-title">Title</FieldLabel>
            <Input
              id="form-title"
              maxLength={55}
              required
              {...register("title", { required: true, maxLength: 55 })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="form-description">Description</FieldLabel>
            <Textarea
              id="form-description"
              maxLength={255}
              {...register("description", { maxLength: 255 })}
            />
          </Field>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error.message}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create form"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
