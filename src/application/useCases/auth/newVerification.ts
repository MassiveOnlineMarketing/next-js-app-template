'use server';

import { AuthService } from "@/application/services/AuthService";

export const newVerification = async (token: string) => {
  const authService = new AuthService();
  const response = await authService.newVerification(token);

  return response;
}