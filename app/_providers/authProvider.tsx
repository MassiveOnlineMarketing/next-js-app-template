"use server";

import { auth } from "@/application/services/AuthService";
import { SessionProvider } from "next-auth/react";


export default async function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
