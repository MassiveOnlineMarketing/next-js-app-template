"use server";

import { db } from "@/infrastructure/db/prisma";
import { getUserByEmail, getUserById } from "@/presentation/auth/data/user";
import { getVerificationTokenByToken } from "@/presentation/auth/data/verification-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  console.log("existingToken", existingToken);

  // If the token has a user ID, we can use it to verify the email
  // Used for cases where the user has already signed up/ changed their email
  if (existingToken.userId !== null) {
    const existingUser = await getUserById(existingToken.userId);

    if (!existingUser) {
      return { error: "Email does not exist!" };
    }
    await db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return { success: "Email updated" };
  }

  // If the token does not have a user ID, we can use the email to verify the email
  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified!" };
};
