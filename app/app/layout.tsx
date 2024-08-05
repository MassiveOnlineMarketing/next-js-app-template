"use server";

import { auth } from "@/application/services/AuthService";
import { SessionProvider } from "next-auth/react";

import ReactQueryProvider from "./_providers/reactQueryProvider";
import ServerProvider from "./_providers/serverProvider";
import DashboardLayout from "./_dash-layout/layout";


export default async function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <ReactQueryProvider>
        <ServerProvider>
          <DashboardLayout>

            {children}

          </DashboardLayout>
        </ServerProvider>
      </ReactQueryProvider>
    </SessionProvider>
  );
}
