import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Users, GraduationCap, Shield, ChevronDown, ChevronRight,
  LogIn, LayoutDashboard, UserPlus, ClipboardList, CreditCard, PiggyBank,
  CalendarCheck, FileText, Settings, Eye, Upload, Bell, Search,
  School, Home, BarChart3, Wallet, Clock, Star, CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

type UserType = "admin" | "guardian" | "student";

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
  tips?: string;
}

interface TutorialSection {
  title: string;
  steps: TutorialStep[];
}

const adminTutorials: TutorialSection[] = [
  {
    title: "Memulai & Login",
    steps: [
      {
        title: "Login ke Dashboard Admin",
        description: "Akses halaman login admin untuk masuk ke sistem manajemen pesantren.",
        icon: <LogIn className="h-5 w-5" />,
        details: [
          "Buka halaman /login/admin di browser",
          "Pilih role Anda (Super Admin, Branch Admin, Treasurer, dll.)",
          "Masukkan kredensial yang telah diberikan",
          "Anda akan diarahkan ke dashboard sesuai dengan hak akses role Anda"
        ],
        tips: "Super Admin memiliki akses penuh ke seluruh fitur. Role lain memiliki akses terbatas sesuai tugasnya."
      },
      {
        title: "Memahami Dashboard",
        description: "Dashboard menampilkan ringkasan data penting pesantren secara real-time.",
        icon: <LayoutDashboard className="h-5 w-5" />,
        details: [
          "Lihat statistik jumlah santri, kelas, dan cabang aktif",
          "Pantau ringkasan keuangan (pembayaran, tabungan, pengeluaran)",
          "Akses menu navigasi di sidebar kiri untuk fitur spesifik",
          "Gunakan tombol toggle untuk menyembunyikan/menampilkan sidebar"
        ]
      }
    ]
  },
  {
    title: "Manajemen Santri & Akademik",
    steps: [
      {
        title: "Kelola Data Santri",
        description: "Tambah, edit, dan kelola data santri pesantren.",
        icon: <Users className="h-5 w-5" />,
        details: [
          "Buka menu 'Santri' di sidebar",
          "Klik 'Tambah Santri' untuk mendaftarkan santri baru",
          "Isi data lengkap: nama, kelas, wali, dan informasi lainnya",
          "Gunakan fitur pencarian untuk menemukan santri tertentu",
          "Klik ikon edit untuk mengubah data santri yang sudah ada"
        ]
      },
      {
        title: "Kelola Kelas & Mata Pelajaran",
        description: "Atur struktur kelas dan kurikulum mata pelajaran.",
        icon: <School className="h-5 w-5" />,
        details: [
          "Buka menu 'Kelas' untuk melihat dan mengelola daftar kelas",
          "Tambah kelas baru dengan nama, tingkat, dan kapasitas",
          "Buka menu 'Mata Pelajaran' untuk mengatur kurikulum",
          "Setiap perubahan akan tercatat beserta operator yang melakukannya"
        ],
        tips: "Riwayat perubahan (operator history) tersedia di setiap halaman akademik."
      },
      {
        title: "Input Nilai & Rapor",
        description: "Masukkan nilai santri dan kelola format rapor.",
        icon: <FileText className="h-5 w-5" />,
        details: [
          "Buka menu 'Nilai' untuk input dan kelola nilai santri",
          "Pilih kelas dan mata pelajaran yang akan dinilai",
          "Buka menu 'Rapor' untuk mengatur format dan template rapor",
          "Upload template PDF/Word untuk format rapor kustom",
          "Export rapor dalam format PDF atau Word"
        ]
      },
      {
        title: "Absensi Santri",
        description: "Catat dan pantau kehadiran santri harian.",
        icon: <CalendarCheck className="h-5 w-5" />,
        details: [
          "Buka menu 'Absensi' di sidebar",
          "Pilih tanggal dan kelas untuk mencatat kehadiran",
          "Tandai status: Hadir, Sakit, Izin, atau Alpha",
          "Lihat rekap absensi per santri atau per kelas"
        ]
      }
    ]
  },
  {
    title: "Keuangan",
    steps: [
      {
        title: "Kelola Tagihan & Pembayaran",
        description: "Buat tagihan dan pantau pembayaran santri.",
        icon: <CreditCard className="h-5 w-5" />,
        details: [
          "Buka menu 'Tagihan' untuk membuat dan mengelola tagihan",
          "Buat tagihan baru dengan jenis, jumlah, dan jatuh tempo",
          "Buka menu 'Pembayaran' untuk melihat riwayat pembayaran (read-only)",
          "Halaman pembayaran menampilkan semua transaksi yang telah dicatat"
        ],
        tips: "Halaman Pembayaran bersifat read-only untuk menjaga integritas data keuangan."
      },
      {
        title: "Tabungan & Pengeluaran",
        description: "Kelola tabungan santri dan catat pengeluaran pesantren.",
        icon: <PiggyBank className="h-5 w-5" />,
        details: [
          "Buka menu 'Tabungan' untuk melihat saldo dan transaksi tabungan santri",
          "Catat setoran dan penarikan tabungan beserta operator yang menangani",
          "Buka menu 'Pengeluaran' untuk mencatat biaya operasional pesantren",
          "Setiap transaksi mencatat operator yang bertanggung jawab"
        ]
      }
    ]
  },
  {
    title: "Konten Website & Pengaturan",
    steps: [
      {
        title: "Kelola Konten Website",
        description: "Atur tampilan website publik pesantren.",
        icon: <Upload className="h-5 w-5" />,
        details: [
          "Buka menu 'Konten > Hero' untuk mengatur banner utama website",
          "Kelola galeri foto di menu 'Konten > Galeri'",
          "Publikasi berita dan pengumuman di 'Konten > Berita'",
          "Atur informasi program dan pendaftaran",
          "Lihat pesan masuk dari pengunjung di 'Konten > Pesan'"
        ]
      },
      {
        title: "Pengaturan Sistem",
        description: "Konfigurasi pengaturan umum pesantren.",
        icon: <Settings className="h-5 w-5" />,
        details: [
          "Buka menu 'Pengaturan' untuk konfigurasi umum",
          "Atur nama pesantren, logo, dan warna tema",
          "Kelola pengguna dan hak akses di menu 'Pengguna'",
          "Aktifkan/nonaktifkan mode maintenance jika diperlukan"
        ]
      }
    ]
  }
];

const guardianTutorials: TutorialSection[] = [
  {
    title: "Memulai",
    steps: [
      {
        title: "Login sebagai Wali Santri",
        description: "Masuk ke portal wali untuk memantau perkembangan anak Anda.",
        icon: <LogIn className="h-5 w-5" />,
        details: [
          "Buka halaman /login di browser",
          "Pilih 'Wali Santri' sebagai jenis akun",
          "Masukkan email dan password yang telah terdaftar",
          "Anda akan masuk ke Portal Wali dengan tampilan khusus"
        ],
        tips: "Hubungi pihak pesantren jika Anda belum memiliki akun."
      }
    ]
  },
  {
    title: "Memantau Anak",
    steps: [
      {
        title: "Lihat Profil Anak",
        description: "Akses informasi lengkap tentang anak Anda di pesantren.",
        icon: <Eye className="h-5 w-5" />,
        details: [
          "Klik menu 'Profil Anak' di navigasi portal",
          "Lihat data pribadi, kelas, dan kamar anak Anda",
          "Cek foto profil dan informasi akademik terkini"
        ]
      },
      {
        title: "Pantau Nilai & Hafalan",
        description: "Lihat perkembangan akademik dan hafalan anak.",
        icon: <BarChart3 className="h-5 w-5" />,
        details: [
          "Buka menu 'Nilai' di portal",
          "Lihat nilai per mata pelajaran dan semester",
          "Pantau progress hafalan Al-Quran anak",
          "Perhatikan catatan dan evaluasi dari ustadz/ustadzah"
        ]
      },
      {
        title: "Cek Kehadiran",
        description: "Pantau kehadiran anak di pesantren.",
        icon: <CalendarCheck className="h-5 w-5" />,
        details: [
          "Buka menu 'Absensi' di portal",
          "Lihat rekap kehadiran harian dan bulanan",
          "Cek status: Hadir, Sakit, Izin, atau Alpha",
          "Hubungi pesantren jika ada ketidaksesuaian data"
        ]
      }
    ]
  },
  {
    title: "Keuangan",
    steps: [
      {
        title: "Lihat Tagihan",
        description: "Pantau tagihan dan status pembayaran.",
        icon: <CreditCard className="h-5 w-5" />,
        details: [
          "Buka menu 'Tagihan' di portal",
          "Lihat daftar tagihan aktif dan jatuh tempo",
          "Cek status pembayaran: Lunas, Belum Lunas, atau Jatuh Tempo",
          "Lihat riwayat pembayaran yang telah dilakukan"
        ]
      },
      {
        title: "Kelola Tabungan Anak",
        description: "Pantau dan top-up tabungan anak di pesantren.",
        icon: <Wallet className="h-5 w-5" />,
        details: [
          "Buka menu 'Tabungan' di portal",
          "Lihat saldo tabungan anak saat ini",
          "Klik 'Transfer / Top Up' untuk menambah saldo",
          "Pilih metode pembayaran: GoPay, OVO, Virtual Account, dll.",
          "Ikuti instruksi pembayaran hingga selesai"
        ],
        tips: "Top-up tabungan menggunakan berbagai metode pembayaran digital yang tersedia."
      }
    ]
  }
];

const studentTutorials: TutorialSection[] = [
  {
    title: "Memulai",
    steps: [
      {
        title: "Login sebagai Santri",
        description: "Masuk ke portal santri untuk mengakses informasi akademik Anda.",
        icon: <LogIn className="h-5 w-5" />,
        details: [
          "Buka halaman /login di browser",
          "Pilih 'Santri' sebagai jenis akun",
          "Masukkan email dan password yang diberikan pesantren",
          "Anda akan masuk ke Portal Santri"
        ]
      }
    ]
  },
  {
    title: "Akademik",
    steps: [
      {
        title: "Lihat Jadwal Pelajaran",
        description: "Cek jadwal harian dan mingguan Anda.",
        icon: <Clock className="h-5 w-5" />,
        details: [
          "Buka menu 'Jadwal' di portal santri",
          "Lihat jadwal pelajaran harian",
          "Cek ruangan dan nama pengajar untuk setiap sesi",
          "Jadwal diperbarui otomatis jika ada perubahan"
        ]
      },
      {
        title: "Cek Nilai & Progress Hafalan",
        description: "Pantau nilai akademik dan progress hafalan Anda.",
        icon: <Star className="h-5 w-5" />,
        details: [
          "Buka menu 'Nilai' di portal",
          "Lihat nilai per mata pelajaran",
          "Pantau progress hafalan Al-Quran",
          "Perhatikan feedback dari ustadz/ustadzah"
        ]
      },
      {
        title: "Riwayat Kehadiran",
        description: "Lihat rekap kehadiran Anda.",
        icon: <CalendarCheck className="h-5 w-5" />,
        details: [
          "Buka menu 'Absensi' di portal",
          "Lihat statistik kehadiran Anda",
          "Cek detail harian: Hadir, Sakit, Izin, Alpha"
        ]
      }
    ]
  },
  {
    title: "Keuangan & Profil",
    steps: [
      {
        title: "Lihat Tagihan & Tabungan",
        description: "Pantau status keuangan Anda di pesantren.",
        icon: <Wallet className="h-5 w-5" />,
        details: [
          "Buka menu 'Tagihan' untuk melihat tagihan aktif",
          "Buka menu 'Tabungan' untuk cek saldo dan riwayat transaksi",
          "Hubungi wali atau pesantren jika ada pertanyaan"
        ]
      },
      {
        title: "Update Profil",
        description: "Lihat dan kelola informasi profil Anda.",
        icon: <UserPlus className="h-5 w-5" />,
        details: [
          "Buka menu 'Profil' di portal santri",
          "Lihat data pribadi dan informasi kamar",
          "Informasi kelas dan wali tercantum di profil"
        ]
      }
    ]
  }
];

const userTypeConfig: Record<UserType, { label: string; icon: React.ReactNode; color: string; tutorials: TutorialSection[] }> = {
  admin: {
    label: "Administrator Pesantren",
    icon: <Shield className="h-5 w-5" />,
    color: "bg-primary text-primary-foreground",
    tutorials: adminTutorials
  },
  guardian: {
    label: "Wali Santri",
    icon: <Users className="h-5 w-5" />,
    color: "bg-accent text-accent-foreground",
    tutorials: guardianTutorials
  },
  student: {
    label: "Santri",
    icon: <GraduationCap className="h-5 w-5" />,
    color: "bg-secondary text-secondary-foreground",
    tutorials: studentTutorials
  }
};

function StepCard({ step, index }: { step: TutorialStep; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow border-border/60"
        onClick={() => setOpen(!open)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary shrink-0">
                {step.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs font-normal">
                    Langkah {index + 1}
                  </Badge>
                </div>
                <CardTitle className="text-base leading-snug">{step.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>
            <div className="shrink-0 mt-1 text-muted-foreground">
              {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0 pb-4">
                <Separator className="mb-3" />
                <ol className="space-y-2 ml-1">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ol>
                {step.tips && (
                  <div className="mt-3 rounded-lg bg-accent/20 border border-accent/30 p-3">
                    <p className="text-sm text-accent-foreground">
                      <span className="font-semibold">💡 Tips:</span> {step.tips}
                    </p>
                  </div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export default function Tutorial() {
  const [activeTab, setActiveTab] = useState<UserType>("admin");
  const config = userTypeConfig[activeTab];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <BookOpen className="h-4 w-4" />
              Panduan Pengguna
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tutorial Penggunaan Aplikasi
            </h1>
            <p className="text-muted-foreground text-lg">
              Panduan lengkap untuk semua pengguna — administrator pesantren, wali santri, dan santri.
              Ikuti langkah-langkah di bawah ini untuk memaksimalkan penggunaan sistem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as UserType)}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            {(Object.entries(userTypeConfig) as [UserType, typeof config][]).map(([key, cfg]) => (
              <TabsTrigger key={key} value={key} className="gap-2 text-xs sm:text-sm">
                {cfg.icon}
                <span className="hidden sm:inline">{cfg.label}</span>
                <span className="sm:hidden">
                  {key === "admin" ? "Admin" : key === "guardian" ? "Wali" : "Santri"}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {(Object.entries(userTypeConfig) as [UserType, typeof config][]).map(([key, cfg]) => (
            <TabsContent key={key} value={key}>
              <div className="mb-6">
                <Badge className={cfg.color}>{cfg.label}</Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  {key === "admin" && "Panduan untuk Super Admin, Branch Admin, Treasurer, Academic Staff, dan Dormitory Supervisor."}
                  {key === "guardian" && "Panduan untuk orang tua / wali santri dalam memantau perkembangan anak."}
                  {key === "student" && "Panduan untuk santri dalam mengakses informasi akademik dan keuangan."}
                </p>
              </div>

              <div className="space-y-8">
                {cfg.tutorials.map((section, si) => (
                  <div key={si}>
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                        {si + 1}
                      </span>
                      {section.title}
                    </h2>
                    <div className="space-y-3">
                      {section.steps.map((step, i) => (
                        <StepCard key={i} step={step} index={i} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-foreground mb-6 text-center">Pertanyaan Umum (FAQ)</h2>
          <div className="space-y-3 max-w-2xl mx-auto">
            {[
              { q: "Bagaimana jika saya lupa password?", a: "Hubungi administrator pesantren untuk mereset password Anda. Jangan bagikan password kepada siapa pun." },
              { q: "Apakah data saya aman?", a: "Ya, sistem menggunakan enkripsi dan kontrol akses berbasis peran (RBAC) untuk melindungi data setiap pengguna." },
              { q: "Bisakah wali santri melihat data semua santri?", a: "Tidak, wali hanya dapat melihat data anak yang terdaftar di akunnya." },
              { q: "Bagaimana cara menghubungi pihak pesantren?", a: "Gunakan formulir kontak di halaman utama website atau hubungi langsung melalui nomor telepon yang tertera." },
            ].map((faq, i) => (
              <Card key={i} className="border-border/60">
                <CardContent className="p-4">
                  <p className="font-medium text-sm text-foreground">{faq.q}</p>
                  <p className="text-sm text-muted-foreground mt-1">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
