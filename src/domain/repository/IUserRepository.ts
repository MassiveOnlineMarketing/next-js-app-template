import { User } from "../_entities/User";

/**
 * Represents a repository for managing user data.
 */
export interface IUserRepository {
  /**
   * Creates a new user with the specified email, password, and name.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @param name - The name of the user.
   * @returns A promise that resolves to the created user.
   */
  create(email: string, password: string, name: string): Promise<User>;

  /**
   * Retrieves a user by their email.
   * @param email - The email of the user.
   * @returns A promise that resolves to the found user, or null if not found.
   */
  getByEmail(email: string): Promise<User | null>;

  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user.
   * @returns A promise that resolves to the found user, or null if not found.
   */
  getById(id: string): Promise<User | null>;

  /**
   * Updates the email verification status of a user.
   * @param id - The ID of the user.
   * @param email - The new email of the user.
   * @returns A promise that resolves when the update is complete.
   */
  updateEmailVerified(id: string, email: string): Promise<void>;

  /**
   * Updates the password of a user.
   * @param id - The ID of the user.
   * @param password - The new password of the user.
   * @returns A promise that resolves when the update is complete.
   */
  updatePassword(id: string, password: string): Promise<void>;

  /**
   * Updates the data of a user.
   * @param data - The updated data for the user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to the updated user.
   */
  update(data: any, userId: string): Promise<User>;
}