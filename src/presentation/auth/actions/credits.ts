import { getSession } from "next-auth/react";

export const decrementDisplayCredits = async (credits: number) => {
  const session = await getSession();
  if (session) {
    session.user.credits = session.user.credits - credits; // assuming the response contains the updated credits
    // trigger a session update
    const response = await fetch("/api/auth/session", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(session),
    });

    console.log("response", response);
  } else {
    // handle the case where there is no active session
  }
};
