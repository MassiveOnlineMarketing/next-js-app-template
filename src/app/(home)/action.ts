'use server';

import { db } from "@/infrastructure/db/prisma";

export const getUserById = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  return user;
}