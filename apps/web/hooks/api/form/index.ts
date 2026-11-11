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

export const useListForms = () => {
  const {
    data: forms,
    error,
    failureCount,
    isError,
    isFetched,
    isFetching,
    isLoading,
    isPending,
    isSuccess,
    refetch,
    status,
  } = trpc.form.listForms.useQuery();

  return {
    forms,
    error,
    failureCount,
    isError,
    isFetched,
    isFetching,
    isLoading,
    isPending,
    isSuccess,
    refetch,
    status,
  };
};

export const useCreateField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createFieldAsync,
    mutate: createField,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    reset,
    status,
  } = trpc.form.createField.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    createFieldAsync,
    createField,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    reset,
    status,
  };
};

export const useUpdateField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: updateFieldAsync,
    mutate: updateField,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    reset,
    status,
  } = trpc.form.updateField.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    updateFieldAsync,
    updateField,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    reset,
    status,
  };
};

export const useGetField = (id: string) => {
  const {
    data: field,
    error,
    failureCount,
    isError,
    isFetched,
    isFetching,
    isLoading,
    isPending,
    isSuccess,
    refetch,
    status,
  } = trpc.form.getField.useQuery({ id });

  return {
    field,
    error,
    failureCount,
    isError,
    isFetched,
    isFetching,
    isLoading,
    isPending,
    isSuccess,
    refetch,
    status,
  };
};

export const useDeleteField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: deleteFieldAsync,
    mutate: deleteField,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    reset,
    status,
  } = trpc.form.deleteField.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    deleteFieldAsync,
    deleteField,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    reset,
    status,
  };
};

export const useListFields = (formId: string) => {
  const {
    data: fields,
    error,
    failureCount,
    isError,
    isFetched,
    isFetching,
    isLoading,
    isPending,
    isSuccess,
    refetch,
    status,
  } = trpc.form.listFields.useQuery({ formId });

  return {
    fields,
    error,
    failureCount,
    isError,
    isFetched,
    isFetching,
    isLoading,
    isPending,
    isSuccess,
    refetch,
    status,
  };
};

export const useGetFormById = (id: string) => {
  const {
    data: form,
    error,
    failureCount,
    isError,
    isFetched,
    isFetching,
    isLoading,
    isPending,
    isSuccess,
    refetch,
    status,
  } = trpc.form.getFormById.useQuery({ id });

  return {
    form,
    error,
    failureCount,
    isError,
    isFetched,
    isFetching,
    isLoading,
    isPending,
    isSuccess,
    refetch,
    status,
  };
};

export const useSubmitForm = () => {
  const {
    mutateAsync: submitFormAsync,
    mutate: submitForm,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    reset,
    status,
  } = trpc.form.submitForm.useMutation();

  return {
    submitFormAsync,
    submitForm,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    reset,
    status,
  };
};

export const useGetFormSubmissions = (formId: string) => {
  const {
    data: submissions,
    error,
    failureCount,
    isError,
    isFetched,
    isFetching,
    isLoading,
    isPending,
    isSuccess,
    refetch,
    status,
  } = trpc.form.getFormSubmissions.useQuery({ formId });

  return {
    submissions,
    error,
    failureCount,
    isError,
    isFetched,
    isFetching,
    isLoading,
    isPending,
    isSuccess,
    refetch,
    status,
  };
};

export const useReorderFields = () => {
  const utils = trpc.useUtils();
  const {
    mutate: reorderFields,
    mutateAsync: reorderFieldsAsync,
    error,
    isPending,
  } = trpc.form.reorderFields.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return { reorderFields, reorderFieldsAsync, error, isPending };
};
