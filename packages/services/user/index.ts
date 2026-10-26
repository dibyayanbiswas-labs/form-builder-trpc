import crypto, { createHmac } from "crypto";
import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import * as JWT from "jsonwebtoken";

import { env } from "../env";
import { googleOAuth2Client } from "../clients/google-oauth";
import { createUserWithEmailAndPasswordInputSchema, CreateUserWithEmailAndPasswordInputSchemaType, generateUserTokenPayload, GenerateUserTokenPayloadType } from "./model";

// class UserService {
//   public async getAuthenticationMethods(): Promise<
//     ReadonlyArray<GetAuthenticationMethodOutputSchema>
//   > {
//     const supportedAuthenticationProviders: GetAuthenticationMethodOutputSchema[] = [];

//     const isGoogleConfigured = !!(env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET);

//     if (isGoogleConfigured) {
//       const url = googleOAuth2Client.generateAuthUrl();
//       supportedAuthenticationProviders.push({
//         provider: "GOOGLE_OAUTH",
//         displayName: "Google",
//         displayText: "Signin with Google",
//         authUrl: url,
//       });
//     }

//     return supportedAuthenticationProviders;
//   }
// }

// export default UserService;

class UserService {

  private async getUserByEmail(email: string) {
    const user = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if(!user || user.length === 0) return null; 
    return user[0];
  }

  public async generateUserToken(payload: GenerateUserTokenPayloadType) {
    const {id} = await generateUserTokenPayload.parseAsync(payload);
    const token = JWT.sign({id}, env.JWT_SECRET);
    return {token}
  }

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputSchemaType) {
    const {fullName, email, password} = await createUserWithEmailAndPasswordInputSchema.parseAsync(payload);
    const existingUserByEmail = await this.getUserByEmail(email);

    if(existingUserByEmail) {
      throw new Error("User with this email already exists");
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");

    const userInsertResult = await db.insert(usersTable).values({
      fullName,
      email,
      password: hashedPassword,
      salt
    }).returning({id: usersTable.id });

    if(!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id) {
      throw new Error("something went wrong while creating the user");
    }

    const userId = userInsertResult[0].id;
    const {token} = await this.generateUserToken({id: userId})

    return {
      id: userId,
      token
    }
  }
}

export default UserService;