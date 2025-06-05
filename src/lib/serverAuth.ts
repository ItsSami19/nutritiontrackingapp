// lib/serverAuth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";

export async function serverAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  return { currentUser: session.user };
}
