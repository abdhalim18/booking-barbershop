-- Add sample employees
INSERT INTO "Employee" (id, name, "photoUrl", specialties, "isActive", "createdAt", "updatedAt") VALUES
  ('emp1', 'Andi', NULL, 'Potong Rambut, Pangkas Jenggot', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('emp2', 'Budi', NULL, 'Potong Rambut, Creambath', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('emp3', 'Citra', NULL, 'Potong Rambut Wanita, Hair Spa', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Add sample services
INSERT INTO "Service" (id, name, description, "priceCents", "durationMinutes", "isActive", "createdAt", "updatedAt") VALUES
  ('srv1', 'Potong Rambut Pria', 'Potong rambut pria standar', 35000, 30, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('srv2', 'Pangkas Jenggot', 'Merapikan jenggot', 20000, 20, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('srv3', 'Creambath', 'Creambath dengan pilihan cream', 50000, 45, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('srv4', 'Potong Rambut Wanita', 'Potong rambut wanita', 50000, 45, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Add admin user (password: admin123)
INSERT INTO "User" (id, email, name, "hashedPassword", role, "createdAt", "updatedAt") VALUES
  ('usr1', 'admin@example.com', 'Admin', '$2a$10$7x4L0Z6X7YJx1X8XvLxXUeQ8QK9zX5ZxX5Lx5Xx5Xx5Xx5Xx5Xx5Xx', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
