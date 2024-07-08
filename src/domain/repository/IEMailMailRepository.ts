
/**
 * Represents an interface for an email service.
 */
export interface IEmailService {
  /**
   * Sends a verification email to the specified email address with the given token.
   * @param email - The email address to send the verification email to.
   * @param token - The verification token to include in the email.
   * @returns A promise that resolves when the email is sent.
   */
  sendVerificationEmail(email: string, token: string): Promise<void>;
}