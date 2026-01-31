import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { priceCents: "asc" },
    });
    return NextResponse.json(services);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load services" }, { status: 500 });
  }
}
