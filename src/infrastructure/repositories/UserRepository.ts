import { IUserRepository } from '@/domain/repository/IUserRepository';
import { User } from '@/domain/_entities/User';
import { db } from '@/infrastructure/db/prisma';


class UserRepository implements IUserRepository {
  async create(email: string, password: string, name: string): Promise<User> {
    const user = await db.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await db.user.findUnique({
      where: { email },
    });

    return user;
  }

  async getById(id: string): Promise<User | null> {
    const user = await db.user.findUnique({
      where: { id },
    });

    return user;
  }

  async updateEmailVerified(id: string, email: string): Promise<void> {
    await db.user.update({
      where: { id },
      data: { emailVerified: new Date(), email },
    });
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await db.user.update({
      where: { id },
      data: { password },
    });
  }

  async update(data: any, userId: string): Promise<User> {
    const user = await db.user.update({
      where: { id: userId },
      data: { ...data },
    });

    return user;
  }
}

const userRepository = new UserRepository();
export default userRepository;