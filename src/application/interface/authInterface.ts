import { Session } from "next-auth";
import { ExtendedUser } from "../../../next-auth";

type SucessResponse = {
  success: string;
  error?: undefined;
}

type ErrorResponse = {
  error: string;
    success?: undefined;
}

/**
 * Represents the interface for authentication operations.
 */
export interface AuthInterface {

  /**
   * Returns the current user.
   * @returns A promise that resolves to a success response, error response, or null.
   */
  session: () => Promise<Session | null>;

  /**
   * Returns the current user.
   * @returns A promise that resolves to a success response, error response, or null.
   */
  currentUser: () => Promise<ExtendedUser | null>;

  /**
   * Logs in a user with the provided email and password.
   * @param email - The user's email.
   * @param password - The user's password.
   * @param callbackUrl - Optional callback URL after successful login.
   * @returns A promise that resolves to a success response, error response, or undefined.
   */
  login(email: string, password: string, callbackUrl?: string | null): Promise<SucessResponse | ErrorResponse | undefined>;

  /**
   * Registers a new user with the provided email, name, and password.
   * @param email - The user's email.
   * @param name - The user's name.
   * @param password - The user's password.
   * @returns A promise that resolves to a success response, error response, or undefined.
   */
  register(email: string, name: string, password: string): Promise<SucessResponse | ErrorResponse | undefined>;

  /**
   * Sends a reset password request for the user with the provided email.
   * @param email - The user's email.
   * @returns A promise that resolves to a success response, error response, or undefined.
   */
  resetPassword(email: string): Promise<SucessResponse | ErrorResponse | undefined>;

  /**
   * Sets a new password for the user with the provided token.
   * @param password - The new password.
   * @param token - The password reset token.
   * @returns A promise that resolves to a success response, error response, or undefined.
   */
  newPassword(password: string, token: string): Promise<SucessResponse | ErrorResponse | undefined>;

  /**
   * Verifies a new user with the provided verification token.
   * @param token - The verification token.
   * @returns A promise that resolves to a success response, error response, or undefined.
   */
  newVerification(token: string): Promise<SucessResponse | ErrorResponse | undefined>;

  /**
   * Updates the user's details with the provided information.
   * @param currentPassword - The user's current password.
   * @param password - The new password.
   * @param passwordConfirmation - The confirmation of the new password.
   * @param email - The new email (optional).
   * @param name - The new name (optional).
   * @returns A promise that resolves to a success response, error response, or undefined.
   */
  updateUserDetails(
    currentPassword: string | undefined,
    password: string | undefined,
    passwordConfirmation: string | undefined,
    email: string | null,
    name: string | null
  ): Promise<SucessResponse | ErrorResponse | undefined>;
}
