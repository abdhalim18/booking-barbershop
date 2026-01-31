import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.booking.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.user.deleteMany({});

  // Create sample employees
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        name: 'Andi',
        email: 'andi@example.com',
        phone: '081234567890',
        isActive: true,
        specialties: 'Potong Rambut, Pangkas Jenggot',
      },
    }),
    prisma.employee.create({
      data: {
        name: 'Budi',
        email: 'budi@example.com',
        phone: '081234567891',
        isActive: true,
        specialties: 'Potong Rambut, Creambath',
      },
    }),
    prisma.employee.create({
      data: {
        name: 'Citra',
        email: 'citra@example.com',
        phone: '081234567892',
        isActive: true,
        specialties: 'Potong Rambut Wanita, Hair Spa',
      },
    }),
  ]);

  // Create sample services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Potong Rambut Pria',
        description: 'Potong rambut pria standar',
        priceCents: 35000,
        durationMinutes: 30,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Pangkas Jenggot',
        description: 'Merapikan jenggot',
        priceCents: 20000,
        durationMinutes: 20,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Creambath',
        description: 'Creambath dengan pilihan cream',
        priceCents: 50000,
        durationMinutes: 45,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Potong Rambut Wanita',
        description: 'Potong rambut wanita',
        priceCents: 50000,
        durationMinutes: 45,
        isActive: true,
      },
    }),
  ]);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin',
      password: '$2a$10$7x4L0Z6X7YJx1X8XvLxXUeQ8QK9zX5ZxX5Lx5Xx5Xx5Xx5Xx5Xx5Xx', // password: admin123
      role: 'ADMIN',
    },
  });

  console.log('Seeding completed successfully!');
  console.log('Admin credentials:');
  console.log('Email: admin@example.com');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
