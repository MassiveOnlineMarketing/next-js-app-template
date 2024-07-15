"use server";

import { auth } from "@/application/services/AuthService";
import { SessionProvider } from "next-auth/react";
import { UserAccountStoreProvider } from "./_providers/userAccountStoreProvider";
import ServerProvider from "./_providers/serverProvider";


export default async function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log('re render lauout');

  return (
    <SessionProvider session={session}>
      <ServerProvider>

        {children}

      </ServerProvider>
    </SessionProvider>
  );
}
