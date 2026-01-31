import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const BookingSchema = z.object({
  userId: z.string().optional(),
  employeeId: z.string(),
  serviceId: z.string(),
  startTime: z.string(),
  customerName: z.string().min(1, "Nama lengkap harus diisi"),
  customerPhone: z.string().min(1, "Nomor telepon harus diisi"),
  customerAddress: z.string().min(1, "Alamat harus diisi"),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = BookingSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { 
      userId, 
      employeeId, 
      serviceId, 
      startTime, 
      customerName, 
      customerPhone, 
      customerAddress, 
      notes 
    } = parsed.data;

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service || !service.isActive) {
      return NextResponse.json({ error: "Invalid service" }, { status: 400 });
    }

    const start = new Date(startTime);
    const end = new Date(start.getTime() + service.durationMinutes * 60000);

    // Check overlap
    const overlap = await prisma.booking.findFirst({
      where: {
        employeeId,
        status: { not: "CANCELLED" },
        AND: [
          // Enforce 60-minute buffer after existing bookings by shifting the start backward
          { startTime: { lt: end } },
          { endTime: { gt: new Date(start.getTime() - 60 * 60000) } },
        ],
      },
      select: { id: true },
    });

    if (overlap) {
      return NextResponse.json({ error: "Time slot not available" }, { status: 409 });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: userId ?? null,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        employeeId,
        serviceId,
        startTime: start,
        endTime: end,
        notes: notes?.trim(),
        status: "CONFIRMED",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
