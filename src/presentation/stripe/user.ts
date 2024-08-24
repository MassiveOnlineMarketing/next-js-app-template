'use server';

import { auth } from "@/application/services/AuthService";
import { db } from "@/infrastructure/db/prisma";

export async function getUserStripeId() {
  const session = await auth();

  if (!session || !session.user) throw new Error("No user found");

  const user = await db.user.findFirst({
    where: {
      id: session.user.id,
    },
  });

  if (!user) throw new Error("No user found");

  return user.stripeCustomerId;
}
