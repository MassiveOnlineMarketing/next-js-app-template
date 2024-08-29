import { IUserRepository, stripeData } from '@/domain/repository/IUserRepository';
import { User } from '@/domain/_entities/User';
import { db } from '@/infrastructure/db/prisma';
import { Account } from '@prisma/client';


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

  async getAccountById(id: string): Promise<Account | null> {
    const user = await db.account.findFirst({
      where: { userId: id },
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

  async updateStripeSubscriptionData(data: stripeData, userEmail: string): Promise<User> {
    const user = await db.user.update({
      where: { email: userEmail },
      data: { ...data },
    });

    return user;
  }

  async updateByStripeCustomerId(data: any, stripeCustomerId: string): Promise<User> {
    const user = await db.user.update({
      where: { stripeCustomerId },
      data: { ...data },
    });

    return user;
  }

  async decrementUserCredits(userId: string, credits: number): Promise<boolean> {
    const res = await db.user.update({
      where: { id: userId },
      data: { credits: { decrement: credits } },
    });

    return !!res;
  }
}

const userRepository = new UserRepository();
export default userRepository;