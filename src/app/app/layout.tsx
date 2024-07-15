"use server";

import { auth } from "@/application/services/AuthService";
import { SessionProvider } from "next-auth/react";
import { UserAccountStoreProvider } from "./_providers/userAccountStoreProvider";


export default async function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <UserAccountStoreProvider>

        {children}

      </UserAccountStoreProvider>
    </SessionProvider>
  );
}
