import { IUserRepository } from '@/domain/repository/IUserRepository';
import { User } from '@/domain/_entities/User';
import { db } from '@/infrastructure/db/prisma';


class UserRepository implements IUserRepository {
  async getByEmail(email: string): Promise<User | null> {
    const user = await db.user.findUnique({
      where: { email },
    });

    return user;
  }

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
}

const userRepository = new UserRepository();
export default userRepository;