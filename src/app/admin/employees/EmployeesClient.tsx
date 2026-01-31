"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export type Employee = {
  id: string;
  name: string;
  photoUrl?: string | null;
  specialties?: string | null;
  bio?: string | null;
  isActive: boolean;
};

export default function EmployeesClient() {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState({ name: "", photoUrl: "", specialties: "", bio: "", isActive: true });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/employees");
      if (!res.ok) throw new Error("Gagal memuat pegawai");
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      toast.error(e.message || "Gagal memuat pegawai");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function onEdit(emp: Employee) {
    setEditing(emp);
    setForm({
      name: emp.name,
      photoUrl: emp.photoUrl || "",
      specialties: emp.specialties || "",
      bio: emp.bio || "",
      isActive: emp.isActive,
    });
    setOpen(true);
  }

  function onCreate() {
    setEditing(null);
    setForm({ name: "", photoUrl: "", specialties: "", bio: "", isActive: true });
    setOpen(true);
  }

  async function onDelete(id: string) {
    if (!confirm("Hapus pegawai ini?")) return;
    const res = await fetch(`/api/admin/employees/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Pegawai dihapus");
      load();
    } else {
      const j = await res.json().catch(() => ({}));
      toast.error(j.error || "Gagal menghapus");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      photoUrl: form.photoUrl.trim() || null,
      specialties: form.specialties.trim() || null,
      bio: form.bio.trim() || null,
      isActive: form.isActive,
    };
    const method = editing ? "PATCH" : "POST";
    const url = editing ? `/api/admin/employees/${editing.id}` : "/api/admin/employees";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success(editing ? "Pegawai diperbarui" : "Pegawai ditambahkan");
      setOpen(false);
      setEditing(null);
      load();
    } else {
      const j = await res.json().catch(() => ({}));
      toast.error(j.error || "Gagal menyimpan");
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Kelola Pegawai</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={onCreate}>Tambah Pegawai</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Pegawai" : "Tambah Pegawai"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <Label htmlFor="name">Nama</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="photoUrl">Foto URL</Label>
                <Input id="photoUrl" value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} placeholder="/barbers/budi.svg" />
              </div>
              <div>
                <Label htmlFor="specialties">Spesialis</Label>
                <Input id="specialties" value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} placeholder="Pisahkan dengan koma" />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
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
              <TableHead>Spesialis</TableHead>
              <TableHead>Aktif</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && data.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">{e.name}</TableCell>
                <TableCell className="text-sm text-gray-600">{e.specialties ?? "-"}</TableCell>
                <TableCell>{e.isActive ? "Ya" : "Tidak"}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="secondary" onClick={() => onEdit(e)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(e.id)}>Hapus</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
