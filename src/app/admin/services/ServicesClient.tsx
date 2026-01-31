"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export type Service = {
  id: string;
  name: string;
  description?: string | null;
  priceCents: number;
  durationMinutes: number;
  isActive: boolean;
};

export default function ServicesClient() {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: "", description: "", priceCents: "", durationMinutes: "", isActive: true });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      if (!res.ok) throw new Error("Gagal memuat layanan");
      const json = await res.json();
      setData(json);
    } catch (error: unknown) {
      const e = error as Error;
      toast.error(e.message || "Gagal memuat layanan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function onEdit(svc: Service) {
    setEditing(svc);
    // Convert cents to rupiah for display
    const priceInRupiah = Math.floor(svc.priceCents / 100);
    setForm({
      name: svc.name,
      description: svc.description || "",
      priceCents: String(priceInRupiah),
      durationMinutes: String(svc.durationMinutes),
      isActive: svc.isActive,
    });
    setOpen(true);
  }

  function onCreate() {
    setEditing(null);
    setForm({ name: "", description: "", priceCents: "", durationMinutes: "", isActive: true });
    setOpen(true);
  }

  async function onDelete(id: string) {
    if (!confirm("Hapus layanan ini?")) return;
    const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Layanan dihapus");
      load();
    } else {
      const j = await res.json().catch(() => ({}));
      toast.error(j.error || "Gagal menghapus");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Convert rupiah to cents
    const priceInRupiah = Number(form.priceCents);
    const priceInCents = priceInRupiah * 100;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      priceCents: priceInCents,
      durationMinutes: Number(form.durationMinutes),
      isActive: form.isActive,
    };
    const method = editing ? "PATCH" : "POST";
    const url = editing ? `/api/admin/services/${editing.id}` : "/api/admin/services";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success(editing ? "Layanan diperbarui" : "Layanan ditambahkan");
      setOpen(false);
      setEditing(null);
      load();
    } else {
      const j = await res.json().catch(() => ({}));
      toast.error(j.error || "Gagal menyimpan");
    }
  }

  const rupiah = (cents: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(cents);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Kelola Layanan</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={onCreate}>Tambah Layanan</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Layanan" : "Tambah Layanan"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <Label htmlFor="name">Nama</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Input id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="priceCents">Harga (Rp)</Label>
                  <Input
                    id="priceCents"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1000"
                    value={form.priceCents}
                    onChange={(e) => setForm({ ...form, priceCents: e.target.value })}
                    placeholder="50000"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Masukkan harga dalam rupiah</p>
                </div>
                <div>
                  <Label htmlFor="durationMinutes">Durasi (menit)</Label>
                  <Input
                    id="durationMinutes"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    value={form.durationMinutes}
                    onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
                    placeholder="30"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input id="isActive" type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                <Label htmlFor="isActive">Aktif</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Batal</Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Durasi</TableHead>
              <TableHead>Aktif</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && data.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="whitespace-nowrap">{rupiah(s.priceCents)}</TableCell>
                <TableCell className="whitespace-nowrap">{s.durationMinutes} menit</TableCell>
                <TableCell>{s.isActive ? "Ya" : "Tidak"}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="secondary" onClick={() => onEdit(s)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(s.id)}>Hapus</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
