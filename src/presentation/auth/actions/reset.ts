"use server";

import * as z from "zod";

import { ResetSchema } from "@/application/schemas/authSchema";
import { getUserByEmail } from "@/presentation/auth/data/user";
import { sendPasswordResetEmail } from "@/application/services/MailService";
import { generatePasswordResetToken } from "@/application/services/tokens";
export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid emaiL!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  return { success: "Reset email sent!" };
};
