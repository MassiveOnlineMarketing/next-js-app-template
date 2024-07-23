"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { AuthService } from "@/application/services/AuthService";
import { RegisterSchema } from "@/application/schemas/authSchema";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);


  const authService = new AuthService();

  try {
    console.log("🟡 Registering user", email, name)
    const login = await authService.register(email, hashedPassword, name);

    console.log("User registered", login);
    return login;
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(`Error logging in ${errorMessage}`);
    return { error: errorMessage };
  }

};
