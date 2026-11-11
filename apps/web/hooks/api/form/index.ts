import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createFormAsync,
    mutate: createForm,
    failureCount,
    isError,
    error,
    isIdle,
    isPending,
    isSuccess,
    status,
    reset,
  } = trpc.form.createForm.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    createFormAsync,
    createForm,
    failureCount,
    isError,
    error,
    isIdle,
    isPending,
    isSuccess,
    status,
    reset,
  };
};
