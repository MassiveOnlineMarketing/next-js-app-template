import { ITokenRepository } from "@/domain/repository/ITokenRepository";
import { db } from "../db/prisma";
import { VerificationToken } from "@prisma/client";

class TokenRepository implements ITokenRepository {
  async getVerificationTokenByEmail(email: string): Promise<VerificationToken | null> {

    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  }

  async deleteVerificationToken(id: string): Promise<void> {
    await db.verificationToken.delete({
      where: { id },
    });
  }

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


}


const tokenRepository = new TokenRepository();

export default tokenRepository;