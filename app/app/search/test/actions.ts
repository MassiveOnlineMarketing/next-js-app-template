'use server'

import { db } from "@/infrastructure/db/prisma";

export const testAction = async () => {
  const userEmail = 'iguidoo@outlook.com';
  const creditsToAdd = 1000;
  const user = await db.user.update({
    where: { email: userEmail },
    data: {
      credits: { increment: creditsToAdd },
    },
  });

  return user;
}