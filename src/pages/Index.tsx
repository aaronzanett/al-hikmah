import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Users,
  ShieldCheck,
  BookOpen,
  Building2,
  Wallet,
  BedDouble,
  BarChart3,
  ChevronRight,
  Star,
} from "lucide-react";

const features = [
  { icon: GraduationCap, title: "Manajemen Santri", desc: "Kelola data santri, pendaftaran, dan riwayat akademik secara terpadu." },
  { icon: BookOpen, title: "Akademik & Kurikulum", desc: "Atur jadwal pelajaran, nilai, absensi, dan laporan akademik." },
  { icon: BedDouble, title: "Asrama & Kamar", desc: "Manajemen penempatan kamar, inventaris, dan kebutuhan asrama." },
  { icon: Wallet, title: "Keuangan", desc: "Tagihan, pembayaran, pengeluaran, dan tabungan santri dalam satu sistem." },
  { icon: Building2, title: "Multi-Cabang", desc: "Kelola beberapa cabang pesantren dari satu dashboard terpusat." },
  { icon: BarChart3, title: "Laporan & Analitik", desc: "Dashboard real-time dengan grafik dan insight performa pesantren." },
];

const roles = [
  {
    icon: ShieldCheck,
    title: "Administrator",
    desc: "Akses penuh untuk mengelola seluruh sistem pesantren.",
    href: "/login/admin",
    color: "from-primary to-primary/80",
  },
  {
    icon: Users,
    title: "Wali Santri",
    desc: "Pantau perkembangan, tagihan, dan informasi anak Anda.",
    href: "/login/guardian",
    color: "from-accent to-amber-600",
  },
  {
    icon: GraduationCap,
    title: "Santri",
    desc: "Lihat jadwal, nilai, dan informasi akademik Anda.",
    href: "/login/student",
    color: "from-info to-blue-600",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-gold">
              <span className="text-sm font-bold text-accent-foreground">B</span>
            </div>
            <span className="text-lg font-bold text-foreground">BoardingCore</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Fitur</a>
            <a href="#login" className="hover:text-foreground transition-colors">Masuk</a>
          </div>
          <Link to="/login/admin">
            <Button size="sm">Masuk Dashboard</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-[0.03]" />
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
                <Star className="h-3.5 w-3.5 text-accent" />
                Sistem Manajemen Pesantren Modern
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl leading-[1.1] mb-6">
                Kelola Pesantren Anda{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Lebih Mudah
                </span>
              </h1>
              <p className="mx-auto max-w-xl text-base text-muted-foreground md:text-lg mb-8">
                Platform terintegrasi untuk manajemen santri, akademik, asrama, dan keuangan pesantren.
                Satu sistem untuk semua kebutuhan.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link to="/login/admin">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Mulai Sekarang <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Lihat Fitur
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl mb-3">Fitur Lengkap</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Semua yang Anda butuhkan untuk mengelola pesantren dalam satu platform.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                className="rounded-xl border bg-card p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg gradient-primary">
                  <f.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Portals */}
      <section id="login" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl mb-3">Portal Masuk</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Pilih portal sesuai peran Anda untuk mengakses sistem.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
            {roles.map((r, i) => (
              <motion.div
                key={r.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Link
                  to={r.href}
                  className="group block rounded-xl border bg-card p-6 text-center shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1"
                >
                  <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${r.color}`}>
                    <r.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{r.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{r.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                    Masuk <ChevronRight className="h-4 w-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md gradient-gold">
              <span className="text-[10px] font-bold text-accent-foreground">B</span>
            </div>
            <span className="text-sm font-semibold text-foreground">BoardingCore</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 BoardingCore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
