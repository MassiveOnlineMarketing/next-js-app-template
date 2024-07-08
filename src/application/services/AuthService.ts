// AuthService.ts

import { Session } from "next-auth";
import { AuthError } from "next-auth";
import { TokenService } from "./TokensService";

import emailRepository from "@/infrastructure/repositories/EMailRepository";
import userRepository from "@/infrastructure/repositories/UserRepository";

export class AuthService {

  static session(): Promise<Session | null> {
    return auth()
  }

  static getUserId() {
    return auth().then((session) => {
      return session?.user?.id;
    });
  }

  async login(email: string, password: string, callbackUrl?: string | null) {
    const existingUser = await userRepository.getByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: "Email does not exist!" };
    }

    if (!existingUser.emailVerified) {

      const verificationToken = await new TokenService().generateVerificationToken(email, existingUser.id);

      emailRepository.sendVerificationEmail(
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
    console.log('regesting user service')

    const existingUser = await userRepository.getByEmail(email);

    if (existingUser) {
      return { error: "Email already in use!" };
    }

    await userRepository.create(email, password, name);

    const verificationToken = await new TokenService().generateVerificationToken(email);
    
    
    emailRepository.sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Confirmation email sent!" };
  }


  // static session(): Promise<Session> {
  //   return auth().then(session => {
  //     if (session === null) {
  //       throw new Error('Session is null');
  //     }
  //     return session;
  //   });
  // }

  static isAuthenticated(session: Session | null): boolean {
    return !!session;
  }

  // Additional methods for authorization checks can be added here
}

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "../../../auth.config";

import { db } from "@/infrastructure/db/prisma";
import { getUserByEmail, getUserById } from "@/presentation/auth/data/user";
import { updateGoogleAccount } from "@/presentation/auth/data/account";
import { DEFAULT_LOGIN_REDIRECT } from "../../../routes";
import { IEmailService } from "@/domain/repository/IEMailMailRepository";



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
      // console.log('signIn', user, account)

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
        const existingUser = await getUserById(user.id);

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
      const existingUser = await getUserById(token.sub);

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
      const latestUserData = await getUserById(token.sub);

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