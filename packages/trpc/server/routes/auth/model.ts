import {z} from "zod";

export const createUserWithEmailAndPasswordInputModel = z.object({
    fullName: z.string().describe("The full name of the user"),
    email: z.email().describe("The email address of the user"),
    password: z.string().min(6).max(100).describe("The password of the user"),
});

export const createUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("The unique identifier of the created user"),
});

export const signInUserWithEmailAndPasswordInputModel = z.object({
    email: z.email().describe("The email address of the user"),
    password: z.string().describe("The password of the user"),
});

export const signInUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("The unique identifier of the created user"),
});

export const getLoggedInUserInfoInput = z.undefined();

export const getLoggedInUserInfoOutput = z.object({
    id: z.string().describe("The unique identifier of the created user"),
    fullName: z.string().describe("The full name of the user"),
    email: z.email().describe("The email address of the user"),
    profileImageURL: z.string().describe("image of the user").optional().nullable()
});
