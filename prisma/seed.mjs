import bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  // Seed Services
  const servicesData = [
    {
      name: "Haircut",
      description: "Classic haircut and style",
      priceCents: 80000,
      durationMinutes: 45,
    },
    {
      name: "Beard Trim",
      description: "Beard shaping and trim",
      priceCents: 50000,
      durationMinutes: 30,
    },
    {
      name: "Haircut + Beard",
      description: "Complete haircut and beard grooming",
      priceCents: 120000,
      durationMinutes: 75,
    },
  ];

  for (const svc of servicesData) {
    await prisma.service.upsert({
      where: { name: svc.name },
      update: svc,
      create: svc,
    });
  }

  // Seed Employees
  const employeesData = [
    {
      name: "Budi",
      photoUrl: "/barbers/budi.svg",
      specialties: "Clippers,Clean fade,Beard trims",
      bio: "Fades and precision cuts.",
    },
    {
      name: "Andi",
      photoUrl: "/barbers/andi.svg",
      specialties: "Scissor cut,Kids cut,Beard shaping",
      bio: "Scissor specialist and family-friendly.",
    },
    {
      name: "Sari",
      photoUrl: "/barbers/sari.svg",
      specialties: "Styling,Color,Hot towel shave",
      bio: "Modern styles and premium care.",
    },
  ];

  for (const emp of employeesData) {
    await prisma.employee.upsert({
      where: { name: emp.name },
      update: emp,
      create: emp,
    });
  }

  // Seed Admin User
  const adminEmail = "admin@local";
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin",
      email: adminEmail,
      hashedPassword: adminPassword,
      role: "ADMIN",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
