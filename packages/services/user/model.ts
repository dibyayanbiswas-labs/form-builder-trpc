import { z } from "zod";

// export const getAuthenticationMethodOutputSchema = z.object({
//   provider: z.enum(["GOOGLE_OAUTH"]),
//   displayName: z.string().optional(),
//   displayText: z.string().optional(),
//   authUrl: z.string(),
// });
// export type GetAuthenticationMethodOutputSchema = z.infer<
//   typeof getAuthenticationMethodOutputSchema
// >;

export const createUserWithEmailAndPasswordInputSchema = z.object({
  fullName: z.string().describe("The full name of the user"),
  email: z.email().describe("The email address of the user"),
  password: z.string().min(6).max(100).describe("The password of the user"),
});

export type CreateUserWithEmailAndPasswordInputSchemaType = z.infer<
  typeof createUserWithEmailAndPasswordInputSchema
>;

export const generateUserTokenPayload = z.object({
  id: z.string().describe("uuid of the user")
});

export type GenerateUserTokenPayloadType = z.infer<
  typeof generateUserTokenPayload
>;



