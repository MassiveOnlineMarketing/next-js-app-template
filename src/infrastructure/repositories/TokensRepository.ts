import { ITokenRepository } from "@/domain/repository/ITokenRepository";
import { db } from "../db/prisma";
import { PasswordResetToken, VerificationToken } from "@prisma/client";

class TokenRepository implements ITokenRepository {
  // Verification Token
  async createVerificationToken(email: string, token: string, expires: Date, userId?: string): Promise<VerificationToken> {
    const verificationToken = await db.verificationToken.create({
      data: {
        email,
        token,
        expires,
        userId,
      },
    });

    return verificationToken;
  }

  async deleteVerificationToken(id: string): Promise<void> {
    await db.verificationToken.delete({
      where: { id },
    });
  }


  async getVerificationTokenByEmail(email: string): Promise<VerificationToken | null> {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  }

  async getVerificationTokenByToken(token: string): Promise<VerificationToken | null> {
    const verificationToken = await db.verificationToken.findFirst({
      where: { token },
    });

    return verificationToken;
  }


  // Password Reset Token
  async createPasswordResetToken(email: string, token: string, expires: Date): Promise<PasswordResetToken> {
    const passwordResetToken = await db.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return passwordResetToken;
  }

  async deletePasswordResetToken(id: string): Promise<void> {
    await db.passwordResetToken.delete({
      where: { id },
    });
  }

  async getPasswordResetTokenByEmail(token: string): Promise<PasswordResetToken | null> {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { token },
    });

    return passwordResetToken;
  }


}


/**
 * Repository for managing tokens.
 */
const tokenRepository = new TokenRepository();

export default tokenRepository;