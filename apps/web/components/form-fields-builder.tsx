"use client";

import { useState } from "react";
import Link from "next/link";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconEye, IconGripVertical, IconPencil, IconTrash } from "@tabler/icons-react";

import { CreateFieldDialog, EditFieldDialog } from "~/components/field-editor-dialog";
import { Button } from "~/components/ui/button";
import { useDeleteField, useListFields, useReorderFields } from "~/hooks/api/form";

type FormField = NonNullable<ReturnType<typeof useListFields>["fields"]>[number];

function SortableFormField({
  field,
  isDraggingDisabled,
  isDeleting,
  onEdit,
  onDelete,
}: {
  field: FormField;
  isDraggingDisabled: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
    disabled: isDraggingDisabled,
  });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : undefined,
      }}
      className="flex items-start justify-between gap-4 rounded-lg border bg-background p-4"
    >
      <div className="flex min-w-0 items-start gap-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="shrink-0 touch-none"
          aria-label={`Reorder ${field.label}`}
          disabled={isDraggingDisabled}
          {...attributes}
          {...listeners}
        >
          <IconGripVertical />
        </Button>
        <div className="min-w-0">
          <p className="font-medium">{field.label}</p>
          <p className="text-sm text-muted-foreground">
            {field.fieldType}
            {field.isRequired ? " · Required" : ""}
          </p>
          {field.description && <p className="mt-2 text-sm">{field.description}</p>}
          {field.placeholder && (
            <p className="mt-1 text-sm text-muted-foreground">Placeholder: {field.placeholder}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            Label key: <code>{field.labelKey}</code>
          </p>
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label={`Edit ${field.label}`}
          disabled={isDraggingDisabled}
          onClick={onEdit}
        >
          <IconPencil />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label={`Delete ${field.label}`}
          disabled={isDeleting || isDraggingDisabled}
          onClick={onDelete}
        >
          <IconTrash />
        </Button>
      </div>
    </li>
  );
}

export function FormFieldsBuilder({ formId }: { formId: string }) {
  const [editingFieldId, setEditingFieldId] = useState<string>();
  const { fields, error, isError, isLoading } = useListFields(formId);
  const { deleteField, error: deleteError, isPending: isDeleting } = useDeleteField();
  const { reorderFields, error: reorderError, isPending: isReordering } = useReorderFields();
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id || !fields) {
      return;
    }

    const oldIndex = fields.findIndex((field) => field.id === active.id);
    const newIndex = fields.findIndex((field) => field.id === over.id);

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const reorderedFields = arrayMove(fields, oldIndex, newIndex);
    reorderFields({ formId, fieldIds: reorderedFields.map((field) => field.id) });
  };

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
      {reorderError && (
        <p role="alert" className="text-sm text-destructive">
          Could not reorder fields: {reorderError.message}
        </p>
      )}
      {!isLoading && !isError && !fields?.length && (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          This form has no fields yet.
        </p>
      )}
      {!!fields?.length && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={fields.map((field) => field.id)}
            strategy={verticalListSortingStrategy}
          >
            <ol className="flex flex-col gap-3">
              {fields.map((field) => (
                <SortableFormField
                  key={field.id}
                  field={field}
                  isDraggingDisabled={isReordering}
                  isDeleting={isDeleting}
                  onEdit={() => setEditingFieldId(field.id)}
                  onDelete={() => {
                    if (window.confirm(`Delete "${field.label}"?`)) {
                      deleteField({ id: field.id });
                    }
                  }}
                />
              ))}
            </ol>
          </SortableContext>
        </DndContext>
      )}

      {editingFieldId && (
        <EditFieldDialog fieldId={editingFieldId} onClose={() => setEditingFieldId(undefined)} />
      )}
    </div>
  );
}
