"use server";

import { auth } from "@/application/services/AuthService";
import { SessionProvider } from "next-auth/react";

import ServerProvider from "./_providers/serverProvider";

import DashboardLayout from "./_dash-layout/layout";


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
        <DashboardLayout>

        {children}

        </DashboardLayout>
      </ServerProvider>
    </SessionProvider>
  );
}
