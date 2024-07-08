import { VerificationToken } from "@prisma/client";


/**
 * Represents a token repository interface.
 */
export interface ITokenRepository {
  /**
   * Retrieves a verification token by email.
   * @param email - The email associated with the verification token.
   * @returns A promise that resolves to the verification token, or null if not found.
   */
  getVerificationTokenByEmail(email: string): Promise<VerificationToken | null>;

  /**
   * Deletes a verification token by ID.
   * @param id - The ID of the verification token to delete.
   * @returns A promise that resolves when the token is deleted.
   */
  deleteVerificationToken(id: string): Promise<void>;

  /**
   * Creates a new verification token.
   * @param email - The email associated with the verification token.
   * @param token - The verification token.
   * @param expires - The expiration date of the token.
   * @param userId - The ID of the user associated with the token.
   * @returns A promise that resolves to the created verification token.
   */
  createVerificationToken(email: string, token: string, expires: Date, userId: string): Promise<VerificationToken>;
}