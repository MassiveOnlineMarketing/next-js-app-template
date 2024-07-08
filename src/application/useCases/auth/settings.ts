'use server';

import { GeneralUserSettingsSchema } from "@/application/schemas/authSchema";
import { auth, AuthService } from "@/application/services/AuthService";
import { z } from "zod";

export const updateUserDetails = async (values: z.infer<typeof GeneralUserSettingsSchema>) => {

  const validatedFields = GeneralUserSettingsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name, currentPassword, passwordConfirmation } = validatedFields.data;

  const authService = new AuthService();
  const response = authService.updateUserDetails(currentPassword, password, passwordConfirmation, email, name);

  return response;
}
