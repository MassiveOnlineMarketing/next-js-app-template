'use server';

import { z } from "zod";
import { NewPasswordSchema } from "@/application/schemas/authSchema";
import { AuthService } from "@/application/services/AuthService";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null,
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  const authService = new AuthService();
  const response = await authService.newPassword(password, token);

  return response;
}