import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });


  const json = await req.json();
  const { name, photoUrl, specialties, bio, isActive } = json as {
    name?: string;
    photoUrl?: string | null;
    specialties?: string | null;
    bio?: string | null;
    isActive?: boolean;
  };

  try {
    const updated = await prisma.employee.update({
      where: { id },
      data: { name, photoUrl, specialties, bio, isActive },
    });
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const e = error as Error;
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.employee.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const e = error as Error;
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 400 });
  }
}
