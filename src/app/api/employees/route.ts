import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(employees);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load employees" }, { status: 500 });
  }
}
