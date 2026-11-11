import { trpc } from "~/trpc/client"

export const useLogin = () => {
    const utils = trpc.useUtils();
    const {
        mutateAsync: signInUserWithEmailAndPasswordAsync,
        mutate: signInUserWithEmailAndPassword,
        failureCount,
        isError,
        error,
        isIdle,
        isSuccess,
        status
    } = trpc.auth.signInUserWithEmailAndPassword.useMutation({
        onSuccess: async (data) => {
            await utils.auth.getLoggedInUserInfo.invalidate();
        }
    });

    return {
        signInUserWithEmailAndPasswordAsync,
        signInUserWithEmailAndPassword,
        failureCount,
        isError,
        error,
        isIdle,
        isSuccess,
        status

    }
}

export const useSignup = () => {
    const utils = trpc.useUtils();
    const {
        mutateAsync: createUserWithEmailAndPasswordAsync,
        mutate: createUserWithEmailAndPassword,
        failureCount,
        isError,
        error,
        isIdle,
        isSuccess,
        status
    } = trpc.auth.createUserWithEmailAndPassword.useMutation({
        onSuccess: async (data) => {
            await utils.auth.getLoggedInUserInfo.invalidate();
        }
    });

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


export const useUser = () => {
    const { data: user, error, isFetched, isFetching, isLoading, status } = trpc.auth.getLoggedInUserInfo.useQuery();

    return {
        user,
        error,
        isFetched,
        isFetching, 
        isLoading,
        status
    }
}