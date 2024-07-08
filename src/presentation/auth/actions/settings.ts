"use server";

import { db } from "@/infrastructure/db/prisma";
import { GeneralUserSettingsSchema } from "@/application/schemas/authSchema";
import { z } from "zod";
import { getUserByEmail, getUserById } from "../data/user";
import { generateVerificationToken } from "@/application/services/tokens";
import { sendVerificationEmail } from "@/application/services/MailService";
import bcrypt from "bcryptjs";
import { auth } from "@/application/services/AuthService";

export const updateUserDetails = async (
  values: z.infer<typeof GeneralUserSettingsSchema>,
) => {
  console.log("values", values);
  // TODO: change to currentUser from auth
  const session = await auth();
  const user = session?.user;

  let data = {
    name: values.name || undefined,
    email: values.email || undefined,
    password: values.password || undefined,
  };
  // console.log('initial data', data)

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (values.email && values.email !== dbUser.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email is already in use" };
    }

    // TODO: Create new email template for updating email adress
    const verificationToken = await generateVerificationToken(
      values.email,
      user.id,
    );
    await sendVerificationEmail(values.email, verificationToken.token);

    return { success: "Verification email sent!" };
  }

  if (
    values.currentPassword &&
    values.password &&
    values.passwordConfirmation &&
    dbUser.password
  ) {
    const isNewPasswordValid = values.password === values.passwordConfirmation;

    if (!isNewPasswordValid) {
      return { error: "Password and password confirmation do not match." };
    }

    const doesCurrentPasswordMatch = await bcrypt.compare(
      values.currentPassword,
      dbUser.password,
    );

    if (!doesCurrentPasswordMatch) {
      return { error: "Current password is incorrect" };
    }

    data.password = await bcrypt.hash(values.password, 10);
  }

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      ...data,
    },
  });

  return { success: "User details updated!", data: updatedUser };
};
