import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const employees = await prisma.employee.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(employees);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const json = await req.json();
  const { name, photoUrl, specialties, bio, isActive } = json as {
    name: string;
    photoUrl?: string | null;
    specialties?: string | null;
    bio?: string | null;
    isActive?: boolean;
  };
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  try {
    const created = await prisma.employee.create({
      data: { name, photoUrl, specialties, bio, isActive: isActive ?? true },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 400 });
  }
}
