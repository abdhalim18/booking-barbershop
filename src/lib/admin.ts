import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAdmin(): Promise<void> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}
