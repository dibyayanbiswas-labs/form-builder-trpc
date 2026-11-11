import { formService, formSubmissionService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createFieldInputModel,
  createFieldOutputModel,
  createFormInputModel,
  createFormOutputModel,
  deleteFieldInputModel,
  deleteFieldOutputModel,
  formFieldOutputModel,
  getFormSubmissionsInputModel,
  getFormSubmissionsOutputModel,
  getFormByIdInputModel,
  getFormByIdOutputModel,
  getFieldInputModel,
  listFormsInputModel,
  listFormsOutputModel,
  listFieldsInputModel,
  listFieldsOutputModel,
  reorderFieldsInputModel,
  reorderFieldsOutputModel,
  submitFormInputModel,
  submitFormOutputModel,
  updateFieldInputModel,
} from "./model";

const getPath = generatePath("/forms");

export const formRouter = router({
  createForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/"),
        tags: ["Forms"],
        protect: true,
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { title, description } = input;

      const { id } = await formService.createForm({
        title,
        description,
        createdBy: ctx.user.id,
      });

      return { id };
    }),

  listForms: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/"),
        tags: ["Forms"],
        protect: true,
      },
    })
    .input(listFormsInputModel)
    .output(listFormsOutputModel)
    .query(async ({ ctx }) => {
      const forms = await formService.listFormsByUserId(ctx.user.id);
      return forms.map((form) => ({
        ...form,
        createdAt: form.createdAt?.toISOString() ?? null,
        updatedAt: form.updatedAt?.toISOString() ?? null,
      }));
    }),

  createField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/fields"),
        tags: ["Forms"],
        protect: true,
      },
    })
    .input(createFieldInputModel)
    .output(createFieldOutputModel)
    .mutation(async ({ input, ctx }) => formService.createField(input, ctx.user.id)),

  updateField: authenticatedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: getPath("/fields/{id}"),
        tags: ["Forms"],
        protect: true,
      },
    })
    .input(updateFieldInputModel)
    .output(formFieldOutputModel)
    .mutation(async ({ input, ctx }) => {
      const field = await formService.updateField(input, ctx.user.id);
      return {
        ...field,
        createdAt: field.createdAt?.toISOString() ?? null,
        updatedAt: field.updatedAt?.toISOString() ?? null,
      };
    }),

  getField: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/fields/{id}"),
        tags: ["Forms"],
        protect: true,
      },
    })
    .input(getFieldInputModel)
    .output(formFieldOutputModel)
    .query(async ({ input, ctx }) => {
      const field = await formService.getField(input.id, ctx.user.id);
      return {
        ...field,
        createdAt: field.createdAt?.toISOString() ?? null,
        updatedAt: field.updatedAt?.toISOString() ?? null,
      };
    }),

  deleteField: authenticatedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/fields/{id}"),
        tags: ["Forms"],
        protect: true,
      },
    })
    .input(deleteFieldInputModel)
    .output(deleteFieldOutputModel)
    .mutation(async ({ input, ctx }) => formService.deleteField(input.id, ctx.user.id)),

  listFields: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/{formId}/fields"),
        tags: ["Forms"],
        protect: true,
      },
    })
    .input(listFieldsInputModel)
    .output(listFieldsOutputModel)
    .query(async ({ input, ctx }) => {
      const fields = await formService.listFieldsByFormId(input.formId, ctx.user.id);
      return fields.map((field) => ({
        ...field,
        createdAt: field.createdAt?.toISOString() ?? null,
        updatedAt: field.updatedAt?.toISOString() ?? null,
      }));
    }),

  getFormById: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getFormById/{id}"),
        tags: ["Forms"],
        protect: false,
      },
    })
    .input(getFormByIdInputModel)
    .output(getFormByIdOutputModel)
    .query(async ({ input }) => formService.getFormById(input.id)),

  submitForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/submit"),
        tags: ["Forms"],
        protect: false,
      },
    })
    .input(submitFormInputModel)
    .output(submitFormOutputModel)
    .mutation(async ({ input }) => formSubmissionService.submitForm(input)),

  getFormSubmissions: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/{formId}/submissions"),
        tags: ["Forms"],
        protect: true,
      },
    })
    .input(getFormSubmissionsInputModel)
    .output(getFormSubmissionsOutputModel)
    .query(async ({ input, ctx }) => {
      const submissions = await formSubmissionService.getSubmissionsByFormId(
        input.formId,
        ctx.user.id,
      );

      return submissions.map((submission) => ({
        ...submission,
        createdAt: submission.createdAt?.toISOString() ?? null,
        updatedAt: submission.updatedAt?.toISOString() ?? null,
      }));
    }),

  reorderFields: authenticatedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: getPath("/{formId}/fields/order"),
        tags: ["Forms"],
        protect: true,
      },
    })
    .input(reorderFieldsInputModel)
    .output(reorderFieldsOutputModel)
    .mutation(async ({ input, ctx }) => formService.reorderFields(input, ctx.user.id)),
});
