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
import { cn } from "@/lib/utils";

type Employee = { id: string; name: string };
type Service = { id: string; name: string; durationMinutes: number };
type BookingSlot = { startTime: string; endTime: string };

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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // New state for booked slots
  const [bookedSlots, setBookedSlots] = useState<BookingSlot[]>([]);

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
    fetch("/api/employees")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setEmployees(data);
        else console.error("Employees API error:", data);
      })
      .catch(console.error);

    fetch("/api/services")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setServices(data);
        else console.error("Services API error:", data);
      })
      .catch(console.error);
  }, []);

  // Fetch booked slots when date or employee changes
  useEffect(() => {
    if (employeeId && date) {
      setLoading(true);
      fetch(`/api/availability?employeeId=${employeeId}&date=${date}`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) {
            setBookedSlots(data);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setBookedSlots([]);
    }
  }, [employeeId, date]);

  // Generate time slots (09:00 - 21:00)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let i = 9; i < 21; i++) {
      // Create full hour slot (09:00, 10:00)
      slots.push(`${i.toString().padStart(2, '0')}:00`);
      // Creative 30 min slot (09:30, 10:30)
      slots.push(`${i.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }, []);

  const getSlotStatus = (slotTime: string) => {
    if (!serviceId) return "disabled"; // Must select service first

    const service = services.find(s => s.id === serviceId);
    if (!service) return "disabled";

    const slotStart = new Date(`${date}T${slotTime}:00`);
    const slotEnd = new Date(slotStart.getTime() + service.durationMinutes * 60000);

    // Check operating hours (Hard limit 21:00)
    const endHour = slotEnd.getHours();
    const endMinutes = slotEnd.getMinutes();
    if (endHour > 21 || (endHour === 21 && endMinutes > 0)) return "unavailable";

    // Check overlap with existing bookings
    // Buffer rule: New booking cannot start less than 60 mins after previous booking ends
    // AND new booking cannot end less than 60 mins before next booking starts? 
    // Wait, requirement logic from API:
    // { startTime: { lt: end } }, { endTime: { gt: startWithBuffer } }

    // Let's replicate logic:
    // User wants to book [slotStart, slotEnd]
    // Existing booking [bStart, bEnd]
    // Conflict if: bStart < slotEnd AND bEnd > (slotStart - 60min)

    const bufferMinutes = 60;
    const startWithBuffer = new Date(slotStart.getTime() - bufferMinutes * 60000);

    const isConflict = bookedSlots.some(booking => {
      const bStart = new Date(booking.startTime);
      const bEnd = new Date(booking.endTime);

      return bStart < slotEnd && bEnd > startWithBuffer;
    });

    if (isConflict) return "unavailable";
    return "available";
  };

  async function submitBooking() {
    if (!isFormValid) {
      setMessage("Mohon lengkapi semua data yang diperlukan.");
      toast.error("Mohon lengkapi semua data yang diperlukan.");
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const startISO = new Date(`${date}T${time}:00`).toISOString();

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
        setBookedSlots([]);
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
          Isi data di bawah ini, pilih barber dan layanan, lalu pilih jadwal yang tersedia.
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border bg-card p-4 sm:p-6">
        {/* Customer Information */}
        <div className="space-y-4 p-4 bg-muted/40 rounded-xl">
          <h2 className="text-lg font-medium">Data Diri</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="block text-sm mb-1">Nama Lengkap <span className="text-red-500">*</span></Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" required disabled={loading} />
            </div>
            <div>
              <Label htmlFor="phone" className="block text-sm mb-1">Nomor Telepon <span className="text-red-500">*</span></Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Contoh: 081234567890" required disabled={loading} />
            </div>
            <div>
              <Label htmlFor="address" className="block text-sm mb-1">Alamat <span className="text-red-500">*</span></Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Alamat lengkap" required disabled={loading} />
            </div>
          </div>
        </div>

        {/* Service Selection */}
        <div className="space-y-4 p-4 bg-muted/40 rounded-xl">
          <h2 className="text-lg font-medium">Pilihan Layanan</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="employee" className="block text-sm mb-1">Pilih Pegawai <span className="text-red-500">*</span></Label>
              <Select value={employeeId} onValueChange={(v) => { setEmployeeId(v); setTime(""); }} disabled={loading}>
                <SelectTrigger><SelectValue placeholder="Pilih pegawai" /></SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="service" className="block text-sm mb-1">Pilih Layanan <span className="text-red-500">*</span></Label>
              <Select value={serviceId} onValueChange={(v) => { setServiceId(v); setTime(""); }} disabled={loading}>
                <SelectTrigger><SelectValue placeholder="Pilih layanan" /></SelectTrigger>
                <SelectContent>
                  {services.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name} ({s.durationMinutes} menit)</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Date & Time Slot Picker */}
        <div className="space-y-4 p-4 bg-muted/40 rounded-xl">
          <h2 className="text-lg font-medium">Jadwal Booking (09:00 - 21:00)</h2>

          <div>
            <Label htmlFor="date" className="block text-sm mb-1">Tanggal <span className="text-red-500">*</span></Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={e => { setDate(e.target.value); setTime(""); }}
              min={new Date().toISOString().split('T')[0]}
              required
              disabled={loading}
              className="mb-4"
            />
          </div>

          {!date || !employeeId || !serviceId ? (
            <div className="text-center py-8 text-muted-foreground bg-background/50 rounded-lg border border-dashed">
              Pilih Pegawai, Layanan, dan Tanggal untuk melihat slot waktu.
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {timeSlots.map((slot) => {
                const status = getSlotStatus(slot);
                const isSelected = time === slot;

                if (status === "unavailable") {
                  return (
                    <Button key={slot} variant="secondary" disabled className="bg-gray-200 text-gray-400 cursor-not-allowed opacity-50 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-px bg-gray-400 rotate-45 transform scale-150 origin-center" />
                      </div>
                      {slot}
                    </Button>
                  );
                }

                return (
                  <Button
                    key={slot}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => setTime(slot)}
                    className={cn(
                      "transition-all",
                      isSelected ? "ring-2 ring-primary ring-offset-2" : "hover:border-primary"
                    )}
                  >
                    {slot}
                  </Button>
                );
              })}
            </div>
          )}

          <div className="flex gap-4 text-xs mt-2 justify-center">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full border border-input bg-background"></div> Tersedia</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-primary"></div> Dipilih</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gray-200 opacity-50 relative overflow-hidden"><div className="w-[150%] h-px bg-gray-400 rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div></div> Tidak Tersedia</div>
          </div>
        </div>

        {/* Submit */}
        <div className="space-y-4 pt-2">
          <Button
            onClick={submitBooking}
            disabled={loading || !time || !isFormValid}
            className="w-full py-6 text-lg"
            size="lg"
          >
            {loading ? 'Memproses...' : 'Konfirmasi Booking'}
          </Button>

          {message && (
            <div className={`text-sm text-center p-3 rounded ${message.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
