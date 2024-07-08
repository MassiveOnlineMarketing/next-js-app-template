import { v4 as uuidv4 } from "uuid";

import { db } from "@/infrastructure/db/prisma";

import tokenRepository from "@/infrastructure/repositories/TokensRepository";


export class TokenService {
  async generateVerificationToken(email: string, userId?: string) {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingVerificationToken = await tokenRepository.getVerificationTokenByEmail(email);

    if (existingVerificationToken) {
      await tokenRepository.deleteVerificationToken(existingVerificationToken.id);
    }

    const verificationToken = tokenRepository.createVerificationToken(email, token, expires, userId);
  
    return verificationToken;
  }

  async generatePasswordResetToken(email: string) {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingPasswordResetToken = await tokenRepository.getPasswordResetTokenByEmail(email);
    if (existingPasswordResetToken) {
      await tokenRepository.deletePasswordResetToken(existingPasswordResetToken.id);
    }

    const passwordResetToken = await tokenRepository.createPasswordResetToken(email, token, expires);

    return passwordResetToken;
  }
}


export const updateGoogleRefreshToken = async (
  id: string,
  refreshToken: string,
) => {
  await db.user.update({
    where: {
      id,
    },
    data: {
      refreshToken,
    },
  });
};
