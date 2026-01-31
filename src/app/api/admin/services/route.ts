import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const services = await prisma.service.findMany({ orderBy: { priceCents: "asc" } });
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json();
  const { name, description, priceCents, durationMinutes, isActive } = json as {
    name: string;
    description?: string | null;
    priceCents: number;
    durationMinutes: number;
    isActive?: boolean;
  };

  if (!name || !priceCents || !durationMinutes) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const created = await prisma.service.create({
      data: {
        name,
        description,
        priceCents: Number(priceCents),
        durationMinutes: Number(durationMinutes),
        isActive: isActive ?? true,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    const e = error as Error;
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 400 });
  }
}
