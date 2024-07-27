"use server";

import * as z from "zod";

import { LoginSchema } from "@/application/schemas/authSchema";
import { AuthService } from "@/application/services/AuthService";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };  
  }

  const { email, password, code } = validatedFields.data;


  const authService = new AuthService();
  const login = await authService.login(email, password, callbackUrl);

  return login;
};
