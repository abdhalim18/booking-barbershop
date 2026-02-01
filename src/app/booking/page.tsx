"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Employee = { id: string; name: string };
type Service = { id: string; name: string; durationMinutes: number };

export default function BookingPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [available, setAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isFormValid = useMemo(() => {
    return name.trim() !== '' &&
      phone.trim() !== '' &&
      address.trim() !== '' &&
      employeeId &&
      serviceId &&
      date &&
      time;
  }, [name, phone, address, employeeId, serviceId, date, time]);

  useEffect(() => {
    fetch("/api/employees").then(r => r.json()).then(setEmployees);
    fetch("/api/services").then(r => r.json()).then(setServices);
  }, []);

  const startISO = useMemo(() => {
    if (!date || !time) return null;
    return new Date(`${date}T${time}:00`).toISOString();
  }, [date, time]);

  const endISO = useMemo(() => {
    const svc = services.find(s => s.id === serviceId);
    if (!svc || !startISO) return null;
    const start = new Date(startISO);
    return new Date(start.getTime() + svc.durationMinutes * 60000).toISOString();
  }, [serviceId, startISO, services]);

  async function checkAvailability() {
    if (!employeeId || !serviceId || !startISO || !endISO) return;

    // Operating hours check (09:00 - 21:00)
    const startTimeDate = new Date(startISO);
    const hour = startTimeDate.getHours();
    if (hour < 9 || hour >= 21) {
      setMessage("Booking hanya tersedia antara jam 09:00 s.d 21:00");
      toast.error("Booking hanya tersedia antara jam 09:00 s.d 21:00");
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await resCheck();
      setAvailable(Boolean(res.available));
      if (res.available) toast.success("Slot tersedia");
      else toast.error("Slot tidak tersedia");
    } finally {
      setLoading(false);
    }
  }

  async function resCheck() {
    const res = await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId, startTime: startISO, endTime: endISO }),
    });
    return res.json();
  }

  async function submitBooking() {
    if (available !== true) {
      setMessage("Silakan cek ketersediaan terlebih dahulu.");
      toast.message("Silakan cek ketersediaan terlebih dahulu.");
      return;
    }

    if (!isFormValid) {
      setMessage("Mohon lengkapi semua data yang diperlukan.");
      toast.error("Mohon lengkapi semua data yang diperlukan.");
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          serviceId,
          startTime: startISO,
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerAddress: address.trim(),
          notes: undefined
        }),
      });
      if (res.ok) {
        setMessage("Booking berhasil dikonfirmasi!");
        toast.success("Booking berhasil dikonfirmasi!");
        // Reset form
        setEmployeeId("");
        setServiceId("");
        setDate("");
        setTime("");
        setName("");
        setPhone("");
        setAddress("");
        setAvailable(null);
      } else {
        const data = await res.json();
        setMessage(data.error ?? "Gagal membuat booking");
        toast.error(data.error ?? "Gagal membuat booking");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Buat Janji Potong Rambut</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Isi data di bawah ini, pilih barber dan layanan, lalu cek ketersediaan jadwal sebelum konfirmasi.
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border bg-card p-4 sm:p-6">
        {/* Customer Information Section */}
        <div className="space-y-4 p-4 bg-muted/40 rounded-xl">
          <h2 className="text-lg font-medium">Data Diri</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="block text-sm mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="phone" className="block text-sm mb-1">
                Nomor Telepon <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="address" className="block text-sm mb-1">
                Alamat <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Alamat lengkap"
                required
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Service Selection Section */}
        <div className="space-y-4 p-4 bg-muted/40 rounded-xl">
          <h2 className="text-lg font-medium">Pilihan Layanan</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="employee" className="block text-sm mb-1">
                Pilih Pegawai <span className="text-red-500">*</span>
              </Label>
              <Select
                value={employeeId}
                onValueChange={setEmployeeId}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pegawai" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="service" className="block text-sm mb-1">
                Pilih Layanan <span className="text-red-500">*</span>
              </Label>
              <Select
                value={serviceId}
                onValueChange={setServiceId}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih layanan" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.durationMinutes} menit)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Date & Time Selection */}
        <div className="space-y-4 p-4 bg-muted/40 rounded-xl">
          <h2 className="text-lg font-medium">Waktu Booking</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="block text-sm mb-1">
                Tanggal <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="time" className="block text-sm mb-1">
                Waktu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                min="09:00"
                max="21:00"
                step="900"
                required
                disabled={loading}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                * Setiap booking memerlukan jeda 60 menit setelah janji sebelumnya.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              onClick={checkAvailability}
              disabled={loading || !employeeId || !serviceId || !date || !time}
              className="mt-2"
            >
              {loading ? 'Memeriksa...' : 'Cek Ketersediaan'}
            </Button>

            {available === true && (
              <span className="text-green-600 text-sm flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Tersedia
              </span>
            )}
            {available === false && (
              <span className="text-red-600 text-sm flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Tidak tersedia
              </span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="space-y-4 pt-2">
          <Button
            onClick={submitBooking}
            disabled={loading || available !== true || !isFormValid}
            className="w-full py-6 text-lg"
            size="lg"
          >
            {loading ? 'Memproses...' : 'Konfirmasi Booking'}
          </Button>

          {!isFormValid && available === true && (
            <p className="text-sm text-amber-600 text-center">
              Mohon lengkapi semua data yang bertanda <span className="text-red-500">*</span>
            </p>
          )}

          {message && (
            <div className={`text-sm text-center p-3 rounded ${message.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
