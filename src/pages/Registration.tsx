import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  Users,
  CreditCard,
  Trophy,
  GraduationCap,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  Star,
  ShieldCheck,
  BookOpen,
  Globe,
  Heart,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import heroPesantren from "@/assets/hero-pesantren.jpg";
import galleryClassroom from "@/assets/gallery-classroom.jpg";
import galleryMosque from "@/assets/gallery-mosque.jpg";

// ─── Registration Steps ───
const registrationPhases = [
  {
    step: 1,
    icon: ClipboardList,
    title: "Pendaftaran Online",
    desc: "Isi formulir pendaftaran online dengan data lengkap calon santri dan wali/orang tua.",
    details: [
      "Pilih program yang diminati",
      "Isi data pribadi calon santri",
      "Isi data wali/orang tua",
      "Upload pas foto terbaru",
    ],
    color: "bg-primary/10 text-primary",
  },
  {
    step: 2,
    icon: FileText,
    title: "Upload Dokumen",
    desc: "Lengkapi berkas persyaratan secara digital melalui portal pendaftaran.",
    details: [
      "Akta kelahiran",
      "Kartu keluarga",
      "Rapor 2 semester terakhir",
      "Surat keterangan sehat",
    ],
    color: "bg-accent/15 text-accent-foreground",
  },
  {
    step: 3,
    icon: Users,
    title: "Tes Seleksi",
    desc: "Ikuti tes seleksi yang meliputi tes akademik, baca Al-Qur'an, dan wawancara.",
    details: [
      "Tes kemampuan akademik dasar",
      "Tes baca Al-Qur'an & hafalan",
      "Wawancara calon santri",
      "Wawancara orang tua/wali",
    ],
    color: "bg-info/10 text-info",
  },
  {
    step: 4,
    icon: Trophy,
    title: "Pengumuman Hasil",
    desc: "Hasil seleksi akan diumumkan melalui website dan notifikasi ke email/WhatsApp terdaftar.",
    details: [
      "Pengumuman via website & email",
      "Notifikasi WhatsApp",
      "Surat kelulusan digital",
      "Panduan langkah selanjutnya",
    ],
    color: "bg-success/10 text-success",
  },
  {
    step: 5,
    icon: CreditCard,
    title: "Daftar Ulang & Pembayaran",
    desc: "Lakukan pembayaran biaya pendaftaran dan perlengkapan sesuai gelombang yang dipilih.",
    details: [
      "Pembayaran biaya pendidikan",
      "Pembayaran perlengkapan santri",
      "Pembayaran seragam & kitab",
      "Konfirmasi pembayaran",
    ],
    color: "bg-warning/10 text-warning-foreground",
  },
  {
    step: 6,
    icon: GraduationCap,
    title: "Orientasi & Masuk Pesantren",
    desc: "Ikuti kegiatan orientasi dan mulai kehidupan sebagai santri di pesantren.",
    details: [
      "Orientasi santri baru (3 hari)",
      "Penempatan kamar asrama",
      "Penerimaan jadwal pelajaran",
      "Perkenalan lingkungan pesantren",
    ],
    color: "bg-primary/10 text-primary",
  },
];

const scheduleData = [
  { wave: "Gelombang 1", period: "1 Januari – 28 Februari 2026", test: "8 Maret 2026", result: "15 Maret 2026", status: "Dibuka" },
  { wave: "Gelombang 2", period: "1 Maret – 30 April 2026", test: "10 Mei 2026", result: "17 Mei 2026", status: "Segera" },
  { wave: "Gelombang 3", period: "1 Mei – 30 Juni 2026", test: "12 Juli 2026", result: "19 Juli 2026", status: "Tertutup" },
];

const costItems = [
  { item: "Biaya Pendaftaran", amount: "Rp 350.000", note: "Sekali bayar" },
  { item: "SPP Bulanan", amount: "Rp 1.500.000", note: "Per bulan" },
  { item: "Biaya Pembangunan", amount: "Rp 5.000.000", note: "Sekali bayar" },
  { item: "Perlengkapan Santri", amount: "Rp 2.500.000", note: "Sekali bayar" },
  { item: "Seragam & Kitab", amount: "Rp 1.800.000", note: "Sekali bayar" },
];

const requirements = [
  "Fotokopi akta kelahiran (2 lembar)",
  "Fotokopi kartu keluarga (2 lembar)",
  "Fotokopi rapor 2 semester terakhir yang dilegalisir",
  "Surat keterangan sehat dari dokter",
  "Pas foto 3x4 dan 4x6 (masing-masing 4 lembar, background biru)",
  "Fotokopi KTP orang tua/wali (2 lembar)",
  "Surat keterangan berkelakuan baik dari sekolah asal",
  "Mengisi formulir pendaftaran online",
];

const faqData = [
  { q: "Berapa usia minimal untuk mendaftar?", a: "Calon santri minimal berusia 12 tahun atau setara kelas 7 SMP pada saat masuk pesantren." },
  { q: "Apakah ada beasiswa untuk santri berprestasi?", a: "Ya, kami menyediakan beasiswa prestasi akademik, tahfidz, dan bantuan bagi keluarga kurang mampu. Informasi lebih lanjut bisa ditanyakan saat pendaftaran." },
  { q: "Bagaimana sistem pembayaran SPP?", a: "Pembayaran SPP dilakukan setiap bulan melalui transfer bank, virtual account, atau e-wallet. Kami juga menerima pembayaran per semester." },
  { q: "Apakah orang tua bisa berkunjung?", a: "Kunjungan orang tua dijadwalkan setiap 2 minggu sekali pada hari Ahad. Kunjungan di luar jadwal bisa diatur melalui koordinasi dengan pihak pesantren." },
  { q: "Apa kurikulum yang digunakan?", a: "Kami menggunakan kurikulum nasional (Kemendikbud) yang dipadukan dengan kurikulum pesantren (Diniyah), sehingga santri mendapat ijazah formal dan kemampuan keagamaan." },
  { q: "Apakah ada program tahfidz?", a: "Ya, program tahfidz adalah salah satu program unggulan kami dengan target hafalan 30 juz selama masa pendidikan." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {faqData.map((faq, i) => (
        <div key={i} className="rounded-xl border bg-card overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full text-left flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm font-semibold text-foreground pr-4">{faq.q}</span>
            {openIndex === i ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
          </button>
          {openIndex === i && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="px-5 pb-5"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

const Registration = () => {
  return (
    <div className="bg-background">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroPesantren} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-20 md:py-28 lg:py-36">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30 px-4 py-1.5 text-xs font-medium text-accent">
              <Star className="h-3.5 w-3.5" />
              Pendaftaran Santri Baru 2026/2027
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-5">
              Bergabung Bersama <span className="text-accent">Pesantren Al-Hikmah</span>
            </h1>
            <p className="text-base md:text-lg text-white/75 max-w-xl mb-8 leading-relaxed">
              Daftarkan putra-putri Anda untuk menjadi generasi Qur'ani yang berilmu, berkarakter, dan siap menghadapi masa depan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/registration/form">
                <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg">
                  Daftar Sekarang <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#steps">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white bg-white/5">
                  Lihat Alur Pendaftaran
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="relative -mt-10 z-10">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="rounded-2xl border bg-card shadow-xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Periode Pendaftaran</p>
                <p className="text-sm font-bold text-foreground">Jan – Jun 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 shrink-0">
                <Users className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kuota Tersedia</p>
                <p className="text-sm font-bold text-foreground">120 Santri</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 shrink-0">
                <Clock className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm font-bold text-success">Gelombang 1 Dibuka</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Steps */}
      <section id="steps" className="py-20 lg:py-28 islamic-pattern">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Alur Pendaftaran</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              6 Langkah Menuju Pesantren
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Proses pendaftaran yang mudah dan terstruktur untuk memastikan setiap calon santri mendapat layanan terbaik.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {registrationPhases.map((phase, i) => (
              <motion.div
                key={phase.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group rounded-2xl border bg-card p-7 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${phase.color}`}>
                    <phase.icon className="h-6 w-6" />
                  </div>
                  <span className="text-2xl font-extrabold text-muted-foreground/20">0{phase.step}</span>
                </div>
                <h3 className="font-bold text-foreground mb-2">{phase.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{phase.desc}</p>
                <ul className="space-y-1.5">
                  {phase.details.map((d, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-20 lg:py-28 bg-muted/30 islamic-pattern-star">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Jadwal Pendaftaran</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Gelombang Pendaftaran
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold text-foreground">Gelombang</th>
                      <th className="text-left p-4 font-semibold text-foreground">Periode Daftar</th>
                      <th className="text-left p-4 font-semibold text-foreground">Tes Seleksi</th>
                      <th className="text-left p-4 font-semibold text-foreground">Pengumuman</th>
                      <th className="text-left p-4 font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleData.map((s) => (
                      <tr key={s.wave} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-semibold text-foreground">{s.wave}</td>
                        <td className="p-4 text-muted-foreground">{s.period}</td>
                        <td className="p-4 text-muted-foreground">{s.test}</td>
                        <td className="p-4 text-muted-foreground">{s.result}</td>
                        <td className="p-4">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            s.status === "Dibuka" ? "bg-success/10 text-success" :
                            s.status === "Segera" ? "bg-warning/10 text-warning" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 lg:py-28 islamic-pattern-arabesque">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Persyaratan</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-5">
                Syarat Pendaftaran
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Siapkan dokumen-dokumen berikut untuk melengkapi proses pendaftaran calon santri baru.
              </p>
              <div className="space-y-3">
                {requirements.map((req, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="flex items-start gap-3 rounded-xl border bg-card p-4"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{req}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Costs */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Biaya Pendidikan</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-5">
                Rincian Biaya
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Berikut adalah rincian biaya pendidikan untuk tahun ajaran 2026/2027.
              </p>
              <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
                {costItems.map((cost, i) => (
                  <div key={i} className={`flex items-center justify-between p-5 ${i < costItems.length - 1 ? "border-b" : ""}`}>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{cost.item}</p>
                      <p className="text-xs text-muted-foreground">{cost.note}</p>
                    </div>
                    <span className="text-sm font-bold text-primary">{cost.amount}</span>
                  </div>
                ))}
                <div className="p-5 bg-primary/5 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">Total Biaya Awal</span>
                    <span className="text-lg font-extrabold text-primary">Rp 11.150.000</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">*Belum termasuk SPP bulanan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28 bg-muted/30 islamic-pattern-star">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">FAQ</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>
          <FAQ />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="rounded-3xl gradient-primary p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
                Siap Mendaftarkan Putra-Putri Anda?
              </h2>
              <p className="text-primary-foreground/75 max-w-xl mx-auto mb-8">
                Kuota terbatas! Segera isi formulir pendaftaran online dan amankan tempat untuk anak Anda.
              </p>
              <Link to="/registration/form">
                <Button size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
                  Mulai Pendaftaran <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Registration;
