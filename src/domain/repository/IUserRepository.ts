import { User } from "../_entities/User";

export interface IUserRepository {
  getByEmail(email: string): Promise<User | null>;
  create(email: string, password: string, name: string): Promise<User>;
}