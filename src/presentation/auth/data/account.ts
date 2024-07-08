"use server";

import { db } from "@/infrastructure/db/prisma";

export const getAccountByUserId = async (userId: string) => {
  const account = await db.account.findFirst({
    where: {
      userId: userId,
    },
  });

  return account;
};

export const updateGoogleAccount = async (
  userId: string,
  refresh_token: string,
  scope: string,
) => {
  return await db.$transaction(async (prisma) => {
    const account = await prisma.account.findFirst({
      where: { userId: userId },
    });

    if (!account) {
      return null;
    }

    const updatedAccount = await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        refresh_token,
        scope,
      },
    });

    return updatedAccount;
  });
};
