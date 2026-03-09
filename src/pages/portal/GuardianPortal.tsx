import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  GraduationCap,
  ClipboardList,
  Receipt,
  PiggyBank,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" as const },
  }),
};

const quickLinks = [
  { title: "Nilai Terkini", desc: "Lihat rapor & nilai ulangan", url: "/portal/grades", icon: GraduationCap, color: "bg-blue-500/10 text-blue-600" },
  { title: "Absensi", desc: "Riwayat kehadiran anak", url: "/portal/attendance", icon: ClipboardList, color: "bg-green-500/10 text-green-600" },
  { title: "Tagihan", desc: "Cek & bayar tagihan pesantren", url: "/portal/bills", icon: Receipt, color: "bg-amber-500/10 text-amber-600" },
  { title: "Tabungan", desc: "Saldo & riwayat tabungan", url: "/portal/savings", icon: PiggyBank, color: "bg-purple-500/10 text-purple-600" },
];

const recentBills = [
  { name: "SPP Bulan Maret 2026", amount: "Rp 750.000", status: "unpaid", due: "31 Mar 2026" },
  { name: "Biaya Seragam", amount: "Rp 350.000", status: "paid", due: "15 Feb 2026" },
  { name: "SPP Bulan Februari 2026", amount: "Rp 750.000", status: "paid", due: "28 Feb 2026" },
];

const GuardianPortal = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-5">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl gradient-primary p-6 text-primary-foreground"
      >
        <p className="text-primary-foreground/70 text-xs mb-1">Assalamu'alaikum,</p>
        <h1 className="text-xl font-bold mb-1">{user?.name}</h1>
        <p className="text-primary-foreground/70 text-sm">
          Selamat datang di Portal Wali Santri Pesantren Al-Hikmah
        </p>

        {/* Child Info */}
        <div className="mt-5 p-4 rounded-xl bg-white/10 backdrop-blur-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
            MA
          </div>
          <div>
            <p className="text-xs text-primary-foreground/70">Putra/i Anda</p>
            <p className="font-semibold">Muhammad Azzam Ridwan</p>
            <p className="text-xs text-primary-foreground/70">NIS: 2024.001 · Kelas 10 IPA-A</p>
          </div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Kehadiran", value: "92%", sub: "Bulan ini", icon: CheckCircle2, color: "text-green-600" },
          { label: "Rata-rata Nilai", value: "84.5", sub: "Semester ini", icon: TrendingUp, color: "text-blue-600" },
          { label: "Tagihan Lunas", value: "5", sub: "dari 6 tagihan", icon: Receipt, color: "text-amber-600" },
          { label: "Saldo Tabungan", value: "Rp 1,2 jt", sub: "Total tabungan", icon: PiggyBank, color: "text-purple-600" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-card border rounded-xl p-4"
          >
            <stat.icon className={`h-4 w-4 mb-2 ${stat.color}`} />
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
            <p className="text-xs font-medium text-foreground">{stat.label}</p>
            <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Akses Cepat</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link, i) => (
            <motion.div
              key={link.url}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <Link
                to={link.url}
                className="flex items-start gap-3 p-4 bg-card border rounded-xl hover:shadow-md transition-all group"
              >
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${link.color}`}>
                  <link.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{link.title}</p>
                  <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{link.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Bills */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-card border rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Tagihan Terbaru</h2>
          <Link to="/portal/bills" className="text-xs text-primary hover:underline">
            Lihat semua
          </Link>
        </div>
        <div className="space-y-3">
          {recentBills.map((bill) => (
            <div key={bill.name} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-3">
                {bill.status === "paid" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-medium text-foreground">{bill.name}</p>
                  <p className="text-[10px] text-muted-foreground">Jatuh tempo: {bill.due}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-foreground">{bill.amount}</p>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  bill.status === "paid" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {bill.status === "paid" ? "Lunas" : "Belum Bayar"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Announcements */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border rounded-xl p-5"
      >
        <h2 className="text-sm font-semibold text-foreground mb-4">Pengumuman Terbaru</h2>
        <div className="space-y-3">
          {[
            { title: "Libur Akhir Semester", date: "5 Mar 2026", desc: "Libur akhir semester dimulai 20 Juni - 10 Juli 2026." },
            { title: "Pembagian Rapor", date: "1 Mar 2026", desc: "Pengambilan rapor semester genap pada 18 Juni 2026." },
          ].map((ann) => (
            <div key={ann.title} className="flex gap-3 py-2 border-b last:border-0">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{ann.title}</p>
                <p className="text-[10px] text-muted-foreground mb-1">{ann.date}</p>
                <p className="text-[11px] text-muted-foreground">{ann.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GuardianPortal;
