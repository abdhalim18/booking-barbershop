import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, CalendarClock, WalletMinimal, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section className="rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white p-6 sm:p-10 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-sky-500 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-zinc-900/70 px-3 py-1 text-xs font-medium text-zinc-300 ring-1 ring-zinc-700/60">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              Barbershop Booking Modern
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
                Tampil rapi tanpa antre,
                <span className="text-emerald-400"> cukup sekali klik.</span>
              </h1>
              <p className="text-sm sm:text-base text-zinc-200">
                Pilih layanan, barber favorit, dan jadwal yang pas. Sistem booking online yang simpel
                untuk pengalaman grooming yang lebih nyaman dan teratur.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-emerald-400 text-black hover:bg-emerald-300 shadow-lg shadow-emerald-400/30"
              >
                <Link href="/booking">Booking Sekarang</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-zinc-600 bg-zinc-900/40 text-zinc-100">
                <Link href="/services">Lihat Menu Layanan</Link>
              </Button>
              <p className="text-xs text-zinc-300">
                Tidak perlu akun untuk booking pertama.
              </p>
            </div>
          </div>

          <div className="relative w-full max-w-sm rounded-2xl border border-zinc-700/60 bg-zinc-900/70 p-4 shadow-xl backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between text-xs text-zinc-400">
              <span>Preview Jadwal Booking</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                Live update
              </span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="rounded-lg bg-zinc-800/80 px-3 py-2 space-y-1.5">
                <p className="text-[11px] text-zinc-400">Layanan</p>
                <p className="font-medium text-zinc-100">Haircut + Styling</p>
                <p className="text-[11px] text-zinc-400">Durasi: 30 menit</p>
              </div>
              <div className="rounded-lg bg-zinc-800/70 px-3 py-2 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[11px] text-zinc-400">Barber</p>
                  <p className="font-medium text-zinc-100">Andi</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-zinc-400">Tanggal & Waktu</p>
                  <p className="font-medium text-zinc-100">Hari ini, 16.00</p>
                </div>
              </div>
              <div className="rounded-lg bg-zinc-800/60 px-3 py-2 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-zinc-400">Status ketersediaan</p>
                  <p className="font-medium text-emerald-300">Slot tersedia</p>
                  <p className="text-[11px] text-zinc-500">
                    Sama seperti langkah di halaman booking: cek ketersediaan dulu, lalu konfirmasi.
                  </p>
                </div>
                <Button asChild size="sm" className="h-7 px-3 text-[11px]">
                  <Link href="/booking">Buka Form</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-zinc-200/70">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Scissors className="h-5 w-5" />
            </div>
            <CardTitle className="text-base">Barber Berpengalaman</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            Tim barber ahli dengan spesialisasi fade, scissor cut, styling, dan beard grooming modern.
          </CardContent>
        </Card>
        <Card className="border-zinc-200/70">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600">
              <CalendarClock className="h-5 w-5" />
            </div>
            <CardTitle className="text-base">Booking Fleksibel</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            Pilih layanan, barber, tanggal, dan jam sesuai jadwal Anda. Notifikasi otomatis lewat sistem.
          </CardContent>
        </Card>
        <Card className="border-zinc-200/70">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <WalletMinimal className="h-5 w-5" />
            </div>
            <CardTitle className="text-base">Harga Transparan</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            Semua layanan ditampilkan lengkap dengan durasi dan harga, tanpa biaya tersembunyi.
          </CardContent>
        </Card>
      </section>

      <section className="rounded-2xl border bg-gradient-to-r from-emerald-50 to-sky-50 p-6 sm:p-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900">Siap upgrade tampilan kamu?</h2>
          <p className="text-sm sm:text-base text-zinc-600">
            Booking kurang dari 1 menit. Pilih slot waktu yang cocok dan datang tepat waktu, tanpa antre panjang.
          </p>
        </div>
        <div className="flex flex-col justify-end gap-2 sm:items-end">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/booking">Mulai Booking Sekarang</Link>
          </Button>
          <p className="text-[11px] text-zinc-500">
            Bisa dibatalkan atau dijadwalkan ulang sesuai kebijakan barbershop.
          </p>
        </div>
      </section>
    </div>
  );
}
