import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";

type Employee = {
  id: string;
  name: string;
  photoUrl?: string | null;
  specialties?: string | null;
  bio?: string | null;
};

async function getEmployees() {
  try {
    const employees = await prisma.employee.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    return employees as Employee[];
  } catch {
    // Likely database not migrated yet
    return [];
  }
}

export default async function EmployeesPage() {
  const employees = await getEmployees();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">Tim Barber Kami</h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
          Kenali barber-barber berpengalaman yang siap membantu upgrade tampilan Anda.
          Pilih barber favorit saat melakukan booking.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((e: Employee) => (
          <Card key={e.id} className="overflow-hidden border border-zinc-200/80">
            <div className="relative w-full aspect-video bg-zinc-100">
              {e.photoUrl ? (
                <Image src={e.photoUrl} alt={e.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-xs sm:text-sm text-zinc-500">
                  Foto belum tersedia
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span>{e.name}</span>
                {e.specialties && (
                  <span className="text-[11px] rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                    Barber Aktif
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {e.specialties && (
                <div className="flex flex-wrap gap-1">
                  {e.specialties.split(",").map((s) => (
                    <Badge key={s.trim()} variant="secondary">{s.trim()}</Badge>
                  ))}
                </div>
              )}
              {e.bio && <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3">{e.bio}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
