import { z, zodUndefinedModel } from "../../schema";
import { userService } from "../../services";
// import { getAuthenticationMethodOutputSchema } from "@repo/services/user/model";
import { publicProcedure, router } from "../../trpc";
import { getAuthenticationCookie, setAuthenticationCookie } from "../../utils/cookie";
import { generatePath } from "../../utils/path-generator";
import { createUserWithEmailAndPasswordInputModel, createUserWithEmailAndPasswordOutputModel, getLoggedInUserInfoInput, getLoggedInUserInfoOutput, signInUserWithEmailAndPasswordInputModel, signInUserWithEmailAndPasswordOutputModel } from "./model";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

// export const authRouter = router({
//   getSupportedAuthenticationProviders: publicProcedure
//     .meta({ openapi: { method: "GET", path: getPath("/supported-providers"), tags: TAGS } })
//     .input(zodUndefinedModel)
//     .output(z.readonly(z.array(getAuthenticationMethodOutputSchema)))
//     .query(async () => {
//       const supportedMethods = await userService.getAuthenticationMethods();
//       return supportedMethods;
//     }),
// });

export const authRouter = router({

  createUserWithEmailAndPassword: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/createUserWithEmailAndPassword"), tags: TAGS } })
    .input(createUserWithEmailAndPasswordInputModel)
    .output(createUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const {fullName, email, password} = input;
      const {id, token} = await userService.createUserWithEmailAndPassword({fullName, email, password});
      setAuthenticationCookie(ctx, token)
      return {id};
    }),

  signInUserWithEmailAndPassword: publicProcedure
    .meta({openapi: {method: "POST", path: getPath("/signInUserWithEmailAndPassword"), tags: TAGS} })
    .input(signInUserWithEmailAndPasswordInputModel)
    .output(signInUserWithEmailAndPasswordOutputModel)
    .mutation(async ({input, ctx}) => {
      const {email, password} = input;
      const {id, token} = await userService.signInUserWithEmailAndPassword({email, password});
      setAuthenticationCookie(ctx, token);
      return {id};
    }),

    getLoggedInUserInfo: publicProcedure
    .meta({openapi: {method: "GET", path: getPath("/getLoggedInUserInfo"), tags: TAGS} })
    .input(getLoggedInUserInfoInput)
    .output(getLoggedInUserInfoOutput)
    .query(async ({ctx}) => {
      const userToken = getAuthenticationCookie(ctx);
      if(!userToken) throw new Error("User is not logged in!")

      const {id, email, fullName, profileImageURL} = await userService.verifyAndDecodeUserToken(userToken)

      return {
        id,
        email, 
        fullName,
        profileImageURL
      }
    })
});
