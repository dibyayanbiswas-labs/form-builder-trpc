import { trpc } from "~/trpc/client"

export const useSignup = () => {
    const {
        mutateAsync: createUserWithEmailAndPasswordAsync,
        mutate: createUserWithEmailAndPassword,
        failureCount,
        isError,
        error,
        isIdle,
        isSuccess,
        status
    } = trpc.auth.createUserWithEmailAndPassword.useMutation();

    return {
        createUserWithEmailAndPasswordAsync,
        createUserWithEmailAndPassword,
        failureCount,
        isError,
        error,
        isIdle,
        isSuccess,
        status

    }
}