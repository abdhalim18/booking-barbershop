import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string } | undefined)?.role;
  const isAdmin = role === "ADMIN";
  if (!isAdmin) {
    redirect("/login");
  }

  const [employees, services, bookings] = await Promise.all([
    prisma.employee.findMany({ orderBy: { name: "asc" } }),
    prisma.service.findMany({ orderBy: { priceCents: "asc" } }),
    prisma.booking.findMany({
      orderBy: { startTime: "desc" },
      include: { employee: true, service: true, user: true },
      take: 20,
    }),
  ]);

  const formatPrice = (cents: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(cents);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin/employees">
            <Button variant="outline">Kelola Pegawai</Button>
          </Link>
          <Link href="/admin/services">
            <Button variant="outline">Kelola Layanan</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pegawai</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Aktif</TableHead>
                <TableHead>Spesialis</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell>{e.isActive ? "Ya" : "Tidak"}</TableCell>
                  <TableCell className="text-sm text-gray-600">{e.specialties ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Layanan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Aktif</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{formatPrice(s.priceCents)}</TableCell>
                  <TableCell>{s.durationMinutes} mnt</TableCell>
                  <TableCell>{s.isActive ? "Ya" : "Tidak"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Booking Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Pegawai</TableHead>
                <TableHead>Layanan</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{new Date(b.startTime).toLocaleString("id-ID")}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div className="font-medium">{b.customerName || b.user?.name || "Guest"}</div>
                    {b.customerPhone && <div className="text-xs text-gray-500">{b.customerPhone}</div>}
                  </TableCell>
                  <TableCell>{b.employee.name}</TableCell>
                  <TableCell>{b.service.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      b.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      b.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      b.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {b.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
