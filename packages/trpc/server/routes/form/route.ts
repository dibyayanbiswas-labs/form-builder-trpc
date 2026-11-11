import { formService } from "../../services";
import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createFormInputModel, createFormOutputModel } from "./model";

const getPath = generatePath("/forms");

export const formRouter = router({
  createForm: authenticatedProcedure
    .meta({
      openapi: { method: "POST", path: getPath("/"), tags: ["Forms"] },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      return formService.createForm({
        ...input,
        createdBy: ctx.user.id,
      });
    }),
});
