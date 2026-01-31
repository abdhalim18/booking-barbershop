import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import EmployeesClient from "./EmployeesClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminEmployeesPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") redirect("/login");
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/admin">
          <Button variant="ghost" size="sm">← Kembali ke Dashboard</Button>
        </Link>
      </div>
      <EmployeesClient />
    </div>
  );
}
