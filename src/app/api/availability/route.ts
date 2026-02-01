import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { employeeId, startTime, endTime } = await req.json();
    if (!employeeId || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Opening hours check
    const startHour = start.getHours();
    const endHour = end.getHours();
    const endMinutes = end.getMinutes();

    if (startHour < 9 || startHour >= 21 || endHour > 21 || (endHour === 21 && endMinutes > 0)) {
      return NextResponse.json({ available: false, reason: "Outside operating hours" });
    }

    const bufferMinutes = 60;
    const startWithBuffer = new Date(start.getTime() - bufferMinutes * 60000);

    const overlap = await prisma.booking.findFirst({
      where: {
        employeeId,
        status: { not: "CANCELLED" },
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: startWithBuffer } },
        ],
      },
      select: { id: true },
    });

    return NextResponse.json({ available: !overlap });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to check availability" }, { status: 500 });
  }
}
