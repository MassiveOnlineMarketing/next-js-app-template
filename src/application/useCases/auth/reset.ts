'use server';

import { ResetSchema } from "@/application/schemas/authSchema";
import { AuthService } from "@/application/services/AuthService";
import { z } from "zod";


export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid emaiL!" };
  }

  const { email } = validatedFields.data;

  const authService = new AuthService();
  const response = await authService.resetPassword(email);

  return response; 
}