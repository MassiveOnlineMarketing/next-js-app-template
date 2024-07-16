// AuthService.ts

import { Session } from "next-auth";
import { AuthError } from "next-auth";
import { TokenService } from "./TokensService";

import EmailRepository from "@/infrastructure/repositories/EMailRepository";
import userRepository from "@/infrastructure/repositories/UserRepository";
import tokenRepository from "@/infrastructure/repositories/TokensRepository";

// 
import bcrypt from "bcryptjs";


//* Client components should use the useSession() hook
//  hooks are located in the presentation layer under the auth/hooks folder. 

//* Server components should use the auth() function
//  functions are located in the application layer under auth/actions folder.

//* For 'back-end' server functions use the AuthService class

export class AuthService implements AuthInterface {

  async session(): Promise<Session | null> {
    return auth()
  }

  async currentUser(): Promise<ExtendedUser | null>{
    const session = await auth();
    const user = session?.user as ExtendedUser;

    return user || null
  }

  async isAdmin() {
    const session = await auth();
    const user = session?.user as ExtendedUser;

    return user.role === "ADMIN";
  }

  async login(email: string, password: string, callbackUrl?: string | null) {
    const existingUser = await userRepository.getByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: "Email does not exist!" };
    }

    if (!existingUser.emailVerified) {

      const verificationToken = await new TokenService().generateVerificationToken(email, existingUser.id);

      const h = new EmailRepository().sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      );

      return { success: "Confirmation email sent! Please verify" };
    }

    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Invalid credentials!" };
          default:
            return { error: "Something went wrong!" };
        }
      }

      throw error;
    }
  }

  async register(email: string, password: string, name: string) {
    const existingUser = await userRepository.getByEmail(email);
    if (existingUser) {
      return { error: "Email already in use!" };
    }

    await userRepository.create(email, password, name);

    //? Send verification email
    const verificationToken = await new TokenService().generateVerificationToken(email);
    const h = new EmailRepository().sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: "Confirmation email sent!" };
  }

  async resetPassword(email: string) {
    const existingUser = await userRepository.getByEmail(email);
    if (!existingUser) {
      return { error: "Email does not exist!" };
    }

    const passwordResetToken = await new TokenService().generatePasswordResetToken(email);
    const h = new EmailRepository().sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

    return { success: "Reset email sent!" };
  }

  async newPassword(password: string, token: string) {
    const existingToken = await tokenRepository.getPasswordResetTokenByEmail(token);
    if (!existingToken) {
      return { error: "Invalid token!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Token has expired!" };
    }

    const existingUser = await userRepository.getByEmail(existingToken.email);
    if (!existingUser) {
      return { error: "Email does not exist!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userRepository.updatePassword(existingUser.id, hashedPassword);
    await tokenRepository.deletePasswordResetToken(existingToken.id);

    return { success: "Password updated!" };
  }

  async newVerification(token: string) {
    const existingtoken = await tokenRepository.getVerificationTokenByToken(token);
    if (!existingtoken) {
      return { error: "Token does not exist!" };
    }

    const hasExpired = new Date(existingtoken.expires) < new Date();
    if (hasExpired) {
      return { error: "Token has expired!" };
    }

    if (existingtoken.userId !== null) {
      const existingUser = await userRepository.getById(existingtoken.userId);
      if (!existingUser) {
        return { error: "Email does not exist!" };
      }

      await userRepository.updateEmailVerified(existingUser.id, existingtoken.email);
      await tokenRepository.deleteVerificationToken(existingtoken.id);

      return { success: "Email updated!" };
    }

    const existingUser = await userRepository.getByEmail(existingtoken.email);
    if (!existingUser) {
      return { error: "Email does not exist!" };
    }

    await userRepository.updateEmailVerified(existingUser.id, existingtoken.email);
    await tokenRepository.deleteVerificationToken(existingtoken.id);

    return { success: "Email verified!" };
  }

  async updateUserDetails(currentPassword: string | undefined, password: string | undefined, passwordConfirmation: string | undefined, email: string | null, name: string | null) {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return { error: "Unauthorized" };
    }

    const currentUser = await userRepository.getById(user.id as string);
    if (!currentUser) {
      return { error: "Unauthorized" };
    }

    let data = {
      name: name || undefined,
      email: email || undefined,
      password: password || undefined,
    };


    if (email && email !== currentUser.email) {
      const existingUser = await userRepository.getByEmail(email);
      if (existingUser && existingUser.id !== user.id) {
        return { error: "Email is already in use" };
      }

      const verificationToken = await new TokenService().generateVerificationToken(email, user.id);
      const h = new EmailRepository().sendVerificationEmail(email, verificationToken.token);

      return { success: "Verification email sent!" };
    }

    if (
      currentPassword &&
      password &&
      passwordConfirmation &&
      currentUser.password
    ) {


      const isNewPasswordValid = password === passwordConfirmation

      if (!isNewPasswordValid) {
        return { error: "Password and password confirmation do not match." };
      }

      const doesCurrentPasswordMatch = await bcrypt.compare(
        currentPassword,
        currentUser.password,
      );

      if (!doesCurrentPasswordMatch) {
        return { error: "Current password is incorrect." };
      }

      data.password = await bcrypt.hash(password, 10);
    }
    
    const updatedUser = await userRepository.update(data, user.id as string);

    return { success: "User details updated!", data: updatedUser };
  }
}

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "../../../auth.config";

import { db } from "@/infrastructure/db/prisma";
import { DEFAULT_LOGIN_REDIRECT } from "../../../routes";
import { AuthInterface } from "../interface/authInterface";
import { ExtendedUser } from "../../../next-auth";


export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  events: {
    async linkAccount({ user, account }) {

      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });

      // * Check if the user has Google connection
      if (account?.provider === "google") {
        // * If Google Search Console connection is granted update the user
        if (
          account.scope &&
          account.scope.includes(
            "https://www.googleapis.com/auth/webmasters.readonly",
          )
        ) {
          console.log("Google Search Console connection");
        }

        // console.log('link account', account)

        if (
          account.scope &&
          account.scope.includes("https://www.googleapis.com/auth/adwords")
        ) {
          console.log("Google Ads connection");
        }
      }
    },
  },
  callbacks: {
    // * Triggered when a user signs in or gives permissions using sign in function
    async signIn({ user, account }) {
      console.log('signIn', user, account)

      // * Allow OAuth without email verification
      if (account?.provider !== "credentials") {
        // Store the refresh token
        if (
          account?.provider === "google" &&
          account.refresh_token &&
          account.scope
        ) {
          console.log("google account");
          const updatedAccount = await updateGoogleAccount(
            user.id as string,
            account.refresh_token,
            account.scope,
          );
        }

        return true;
      }

      // * only triggers when email has been used to create an account
      if (user.id) {
        const existingUser = await userRepository.getById(user.id);

        // Prevent sign in without email verification
        if (!existingUser?.emailVerified) return false;

        // Update login provider for showing correct setting in the UI
        await updateLoginProvider(user.id as string, account.provider);

        // * Two factor authentication
        // if (existingUser.isTwoFactorEnabled) {
        //   const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        //   if (!twoFactorConfirmation) return false;

        //   // Delete two factor confirmation for next sign in
        //   await db.twoFactorConfirmation.delete({
        //     where: { id: twoFactorConfirmation.id }
        //   });
        // }
      }

      return true;
    },
    async jwt({ token, account, trigger, session }) {
      // If there's no user ID in the token, return the token as is
      if (!token.sub) return token;

      // Fetch the existing user
      const existingUser = await userRepository.getById(token.sub);

      // If the user doesn't exist, return the token as is
      if (!existingUser) return token;

      // Add role, credits, and refreshToken to the token
      token.role = existingUser.role;
      token.credits = existingUser.credits;
      token.email = existingUser.email;
      token.loginProvider = existingUser.loginProvider;

      // Add custom fields to the token
      token.customField = "test";

      // If the trigger is "update", update the name in the token coming from the useSession() update() function
      if (trigger === "update") {
        token.name = session.name;
      }

      return token;
    },
    // is available in auth()
    // TODO: Check why token is not working
    async session({ session, token }: any) {
      const latestUserData = await userRepository.getById(token.sub);

      // If there's a user in the session, add extra data to the user
      if (session.user && latestUserData) {
        // console.log('session.user', session)
        // Add id, role, customField, and credits to the user
        session.user.id = latestUserData.id || session.user.id;
        session.user.role = latestUserData.role || session.user.role;
        session.user.customField =
          token.customField || session.user.customField;
        session.user.credits = latestUserData.credits || session.user.credits;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.loginProvider =
          latestUserData.loginProvider || session.user.loginProvider;
      }

      // Add extra data to the session
      session.accessToken = token.accessToken || session.accessToken;
      session.credits = token.credits || session.credits;
      session.email = token.email || session.email;

      return session;
    },
  },
  ...authConfig,
});

const updateLoginProvider = async (id: string, provider: string) => {
  try {
    const user = await db.user.update({
      where: { id },
      data: { loginProvider: provider },
    });

    return user;
  } catch {
    return null;
  }
};


export const updateGoogleAccount = async (
  userId: string,
  refresh_token: string,
  scope: string,
) => {
  return await db.$transaction(async (prisma) => {
    const account = await prisma.account.findFirst({
      where: { userId: userId },
    });

    if (!account) {
      return null;
    }

    const updatedAccount = await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        refresh_token,
        scope,
      },
    });

    return updatedAccount;
  });
};
