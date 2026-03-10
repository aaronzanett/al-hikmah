import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  GraduationCap,
  ClipboardList,
  Receipt,
  PiggyBank,
  Calendar,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Award,
  Clock,
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
  { title: "Jadwal Hari Ini", desc: "Lihat jadwal pelajaran & kegiatan", url: "/student/schedule", icon: Calendar, color: "bg-indigo-500/10 text-indigo-600" },
  { title: "Nilai & Rapor", desc: "Periksa nilai ulangan & rapor", url: "/student/grades", icon: GraduationCap, color: "bg-blue-500/10 text-blue-600" },
  { title: "Absensi", desc: "Riwayat kehadiran kamu", url: "/student/attendance", icon: ClipboardList, color: "bg-green-500/10 text-green-600" },
  { title: "Tagihan", desc: "Cek status tagihan pesantren", url: "/student/bills", icon: Receipt, color: "bg-amber-500/10 text-amber-600" },
  { title: "Tabungan", desc: "Saldo & riwayat tabungan", url: "/student/savings", icon: PiggyBank, color: "bg-purple-500/10 text-purple-600" },
];

const todaySchedule = [
  { time: "07:00 - 08:30", subject: "Matematika", teacher: "Ust. Budi", room: "Ruang 10-A" },
  { time: "08:30 - 10:00", subject: "Bahasa Arab", teacher: "Ust. Hamid", room: "Ruang 10-A" },
  { time: "10:15 - 11:45", subject: "Fiqih", teacher: "Ust. Yusuf", room: "Ruang 10-A" },
  { time: "13:00 - 14:30", subject: "Tahfidz Al-Qur'an", teacher: "Ust. Ahmad Kholid", room: "Masjid" },
];

const recentGrades = [
  { subject: "Bahasa Arab", type: "Ulangan Harian", score: 92, date: "5 Mar 2026" },
  { subject: "Matematika", type: "UTS", score: 85, date: "3 Mar 2026" },
  { subject: "Fiqih", type: "Ulangan Harian", score: 88, date: "1 Mar 2026" },
];

const StudentPortal = () => {
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
          Selamat datang di Portal Santri Pesantren Al-Hikmah
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
            <p className="text-[11px] text-primary-foreground/70">Kelas</p>
            <p className="font-semibold text-sm">10 IPA-A</p>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
            <p className="text-[11px] text-primary-foreground/70">Kamar Asrama</p>
            <p className="font-semibold text-sm">201 - Zaid bin Tsabit</p>
          </div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Kehadiran", value: "92%", sub: "Bulan ini", icon: CheckCircle2, color: "text-green-600" },
          { label: "Rata-rata Nilai", value: "84.5", sub: "Semester ini", icon: TrendingUp, color: "text-blue-600" },
          { label: "Hafalan", value: "15 Juz", sub: "Progress tahfidz", icon: BookOpen, color: "text-primary" },
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

      {/* Today's Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Jadwal Hari Ini</h2>
          </div>
          <Link to="/student/schedule" className="text-xs text-primary hover:underline">
            Lihat semua
          </Link>
        </div>
        <div className="space-y-3">
          {todaySchedule.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-2 border-b last:border-0">
              <div className="w-28 shrink-0">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <p className="text-xs font-medium text-foreground">{item.time}</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.subject}</p>
                <p className="text-[10px] text-muted-foreground">{item.teacher} · {item.room}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Akses Cepat</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Grades */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-foreground">Nilai Terbaru</h2>
          </div>
          <Link to="/student/grades" className="text-xs text-primary hover:underline">
            Lihat semua
          </Link>
        </div>
        <div className="space-y-3">
          {recentGrades.map((grade, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <p className="text-xs font-medium text-foreground">{grade.subject}</p>
                <p className="text-[10px] text-muted-foreground">{grade.type} · {grade.date}</p>
              </div>
              <span className={`text-base font-bold ${
                grade.score >= 90 ? "text-green-600" : grade.score >= 80 ? "text-blue-600" : "text-amber-600"
              }`}>
                {grade.score}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Announcements */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-card border rounded-xl p-5"
      >
        <h2 className="text-sm font-semibold text-foreground mb-4">Pengumuman</h2>
        <div className="space-y-3">
          {[
            { title: "Ujian Tengah Semester", date: "8 Mar 2026", desc: "UTS semester genap dimulai tanggal 17-21 Maret 2026. Persiapkan diri dengan baik!" },
            { title: "Jadwal Tahfidz Baru", date: "5 Mar 2026", desc: "Jadwal setoran hafalan berubah menjadi setiap hari Senin dan Kamis ba'da Subuh." },
            { title: "Lomba Cerdas Cermat", date: "1 Mar 2026", desc: "Pendaftaran lomba cerdas cermat antar-pesantren dibuka hingga 15 Maret 2026." },
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

export default StudentPortal;
