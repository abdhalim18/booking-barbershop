function formatPrice(cents: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(cents);
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type Service = {
  id: string;
  name: string;
  description?: string | null;
  priceCents: number;
  durationMinutes: number;
};

async function getServices() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { priceCents: "asc" },
  });
  return services as Service[];
}

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">Menu Layanan</h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
          Pilih paket layanan yang paling sesuai dengan kebutuhan Anda. Harga sudah termasuk styling akhir.
        </p>
      </div>

      <Card className="border-zinc-200/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Daftar Layanan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead className="hidden md:table-cell">Deskripsi</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Harga</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((s: Service) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">
                    <div>{s.name}</div>
                    <div className="md:hidden text-xs text-muted-foreground mt-0.5">
                      {s.description ?? "-"}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {s.description ?? "-"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {s.durationMinutes} menit
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium">
                    {formatPrice(s.priceCents)}
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
