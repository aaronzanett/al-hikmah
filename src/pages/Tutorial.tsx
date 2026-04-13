import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Users, GraduationCap, Shield, ChevronDown, ChevronRight,
  LogIn, LayoutDashboard, UserPlus, CreditCard, PiggyBank,
  CalendarCheck, FileText, Settings, Eye, Upload,
  School, BarChart3, Wallet, Clock, Star, CheckCircle2,
  ListChecks, Building2, DoorOpen, Package, UserCog, Globe,
  MessageSquare, Image, Newspaper, ClipboardCheck, RotateCcw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

type UserType = "admin" | "guardian" | "student";

interface TutorialStep {
  id: string;
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

const STORAGE_KEY = "tutorial_progress";

function loadProgress(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

const adminTutorials: TutorialSection[] = [
  {
    title: "Memulai & Login",
    steps: [
      {
        id: "admin-login",
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
        id: "admin-dashboard",
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
    title: "Manajemen Santri & Wali",
    steps: [
      {
        id: "admin-students",
        title: "Kelola Data Santri",
        description: "Tambah, edit, dan kelola seluruh data santri pesantren.",
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
        id: "admin-guardians",
        title: "Kelola Data Wali Santri",
        description: "Atur data orang tua / wali santri dan hubungkan ke anak.",
        icon: <UserPlus className="h-5 w-5" />,
        details: [
          "Buka menu 'Wali Santri' di sidebar",
          "Tambah wali baru dengan data kontak lengkap",
          "Hubungkan wali dengan santri yang bersangkutan",
          "Wali yang terdaftar dapat login ke Portal Wali"
        ]
      },
      {
        id: "admin-branches",
        title: "Kelola Cabang Pesantren",
        description: "Atur data cabang-cabang pesantren yang terdaftar.",
        icon: <Building2 className="h-5 w-5" />,
        details: [
          "Buka menu 'Cabang' di sidebar",
          "Tambah cabang baru dengan nama dan lokasi",
          "Branch Admin hanya bisa mengakses data cabang mereka sendiri",
          "Super Admin dapat melihat seluruh cabang"
        ]
      }
    ]
  },
  {
    title: "Akademik & Kurikulum",
    steps: [
      {
        id: "admin-classes",
        title: "Kelola Kelas",
        description: "Atur struktur kelas dan alokasi santri.",
        icon: <School className="h-5 w-5" />,
        details: [
          "Buka menu 'Kelas' untuk melihat dan mengelola daftar kelas",
          "Tambah kelas baru dengan nama, tingkat, dan kapasitas",
          "Alokasikan santri ke kelas yang sesuai",
          "Setiap perubahan tercatat beserta operator yang melakukannya"
        ],
        tips: "Riwayat perubahan (operator history) tersedia di setiap halaman akademik."
      },
      {
        id: "admin-subjects",
        title: "Kelola Mata Pelajaran",
        description: "Atur kurikulum dan daftar mata pelajaran.",
        icon: <ListChecks className="h-5 w-5" />,
        details: [
          "Buka menu 'Mata Pelajaran' di sidebar",
          "Tambah mata pelajaran baru dengan kode dan nama",
          "Tetapkan mata pelajaran ke kelas tertentu",
          "Perubahan akan mencatat operator secara otomatis"
        ]
      },
      {
        id: "admin-grades",
        title: "Input & Kelola Nilai",
        description: "Masukkan nilai santri per mata pelajaran.",
        icon: <Star className="h-5 w-5" />,
        details: [
          "Buka menu 'Nilai' di sidebar",
          "Pilih kelas dan mata pelajaran",
          "Input nilai untuk setiap santri",
          "Nilai otomatis terhubung ke rapor dan portal santri/wali"
        ]
      },
      {
        id: "admin-reportcard",
        title: "Pengaturan Rapor",
        description: "Konfigurasi format dan template rapor santri.",
        icon: <FileText className="h-5 w-5" />,
        details: [
          "Buka menu 'Rapor' di sidebar",
          "Atur nama institusi, ukuran kertas, dan skala nilai",
          "Upload template rapor dalam format PDF atau Word",
          "Template yang di-upload dapat di-preview dan diaktifkan",
          "Export rapor santri ke format PDF atau Word kapan saja",
          "Konfigurasi tersimpan otomatis secara lokal (auto-save)"
        ],
        tips: "Upload template PDF/Word asli untuk hasil rapor yang lebih profesional dan proporsional."
      },
      {
        id: "admin-attendance",
        title: "Absensi Santri",
        description: "Catat dan pantau kehadiran santri harian.",
        icon: <CalendarCheck className="h-5 w-5" />,
        details: [
          "Buka menu 'Absensi' di sidebar",
          "Pilih tanggal dan kelas untuk mencatat kehadiran",
          "Tandai status: Hadir, Sakit, Izin, atau Alpha",
          "Lihat rekap absensi per santri atau per kelas",
          "Riwayat operator yang mencatat absensi tersimpan"
        ]
      },
      {
        id: "admin-rooms",
        title: "Kelola Kamar Asrama",
        description: "Atur kamar dan alokasi santri asrama.",
        icon: <DoorOpen className="h-5 w-5" />,
        details: [
          "Buka menu 'Kamar' di sidebar",
          "Tambah kamar baru dengan kapasitas",
          "Alokasikan santri ke kamar masing-masing",
          "Pantau status kapasitas kamar"
        ]
      },
      {
        id: "admin-inventory",
        title: "Inventaris Pesantren",
        description: "Kelola aset dan barang inventaris pesantren.",
        icon: <Package className="h-5 w-5" />,
        details: [
          "Buka menu 'Inventaris' di sidebar",
          "Catat barang inventaris beserta kondisinya",
          "Pantau jumlah stok dan lokasi barang",
          "Update status barang jika ada perubahan"
        ]
      }
    ]
  },
  {
    title: "Keuangan",
    steps: [
      {
        id: "admin-bills",
        title: "Kelola Tagihan",
        description: "Buat dan kelola tagihan untuk santri.",
        icon: <CreditCard className="h-5 w-5" />,
        details: [
          "Buka menu 'Tagihan' di sidebar",
          "Buat tagihan baru dengan jenis, jumlah, dan jatuh tempo",
          "Tagihan otomatis muncul di portal wali dan santri",
          "Pantau status pembayaran setiap tagihan"
        ]
      },
      {
        id: "admin-payments",
        title: "Lihat Pembayaran (Read-Only)",
        description: "Pantau seluruh riwayat pembayaran yang masuk.",
        icon: <ClipboardCheck className="h-5 w-5" />,
        details: [
          "Buka menu 'Pembayaran' di sidebar",
          "Halaman ini bersifat read-only (hanya lihat)",
          "Semua pembayaran tercatat otomatis dari sistem",
          "Gunakan filter untuk mencari transaksi tertentu"
        ],
        tips: "Halaman Pembayaran sengaja dibuat read-only untuk menjaga integritas data keuangan."
      },
      {
        id: "admin-savings",
        title: "Kelola Tabungan Santri",
        description: "Catat setoran dan penarikan tabungan santri.",
        icon: <PiggyBank className="h-5 w-5" />,
        details: [
          "Buka menu 'Tabungan' di sidebar",
          "Lihat saldo tabungan setiap santri",
          "Catat setoran dan penarikan tabungan",
          "Operator yang menangani transaksi tercatat otomatis",
          "Riwayat transaksi lengkap tersedia untuk setiap santri"
        ]
      },
      {
        id: "admin-expenses",
        title: "Catat Pengeluaran",
        description: "Catat pengeluaran operasional pesantren.",
        icon: <Wallet className="h-5 w-5" />,
        details: [
          "Buka menu 'Pengeluaran' di sidebar",
          "Tambah pengeluaran baru dengan kategori dan jumlah",
          "Operator yang menginput pengeluaran tercatat otomatis",
          "Pantau total pengeluaran per periode"
        ]
      }
    ]
  },
  {
    title: "Konten Website Publik",
    steps: [
      {
        id: "admin-hero",
        title: "Kelola Banner Hero",
        description: "Atur banner utama di halaman depan website.",
        icon: <Globe className="h-5 w-5" />,
        details: [
          "Buka menu 'Konten > Hero' di sidebar",
          "Upload gambar dan atur teks banner utama",
          "Preview perubahan sebelum disimpan",
          "Banner akan tampil di halaman utama website publik"
        ]
      },
      {
        id: "admin-gallery",
        title: "Kelola Galeri Foto",
        description: "Upload dan atur galeri foto pesantren.",
        icon: <Image className="h-5 w-5" />,
        details: [
          "Buka menu 'Konten > Galeri'",
          "Upload foto kegiatan dan fasilitas pesantren",
          "Atur urutan dan kategori foto",
          "Foto akan tampil di halaman Galeri website"
        ]
      },
      {
        id: "admin-news",
        title: "Publikasi Berita",
        description: "Buat dan kelola berita/pengumuman pesantren.",
        icon: <Newspaper className="h-5 w-5" />,
        details: [
          "Buka menu 'Konten > Berita'",
          "Buat berita baru dengan judul, isi, dan gambar",
          "Berita akan tampil di halaman Berita website",
          "Edit atau hapus berita yang sudah dipublikasi"
        ]
      },
      {
        id: "admin-messages",
        title: "Lihat Pesan Kontak",
        description: "Baca pesan masuk dari pengunjung website.",
        icon: <MessageSquare className="h-5 w-5" />,
        details: [
          "Buka menu 'Konten > Pesan'",
          "Lihat pesan yang dikirim melalui formulir kontak",
          "Tandai pesan yang sudah ditangani",
          "Balas pesan melalui email atau telepon"
        ]
      },
      {
        id: "admin-programs",
        title: "Kelola Program Pendidikan",
        description: "Atur informasi program yang ditawarkan.",
        icon: <BookOpen className="h-5 w-5" />,
        details: [
          "Buka menu 'Konten > Program'",
          "Tambah atau edit program pendidikan",
          "Atur deskripsi, gambar, dan detail program",
          "Program akan tampil di halaman utama website"
        ]
      },
      {
        id: "admin-registration-content",
        title: "Kelola Info Pendaftaran",
        description: "Atur alur dan informasi pendaftaran santri baru.",
        icon: <ClipboardCheck className="h-5 w-5" />,
        details: [
          "Buka menu 'Konten > Pendaftaran'",
          "Atur langkah-langkah alur pendaftaran",
          "Tambahkan detail dan persyaratan setiap tahap",
          "Preview alur di halaman /registration website"
        ]
      }
    ]
  },
  {
    title: "Pengaturan & Pengguna",
    steps: [
      {
        id: "admin-users",
        title: "Kelola Pengguna & Hak Akses",
        description: "Atur akun pengguna dan role masing-masing.",
        icon: <UserCog className="h-5 w-5" />,
        details: [
          "Buka menu 'Pengguna' di sidebar",
          "Tambah pengguna baru dengan role yang sesuai",
          "Role: Super Admin, Branch Admin, Treasurer, Academic Staff, Musyrif",
          "Setiap role memiliki hak akses berbeda secara otomatis",
          "Nonaktifkan akun pengguna jika diperlukan"
        ],
        tips: "Gunakan prinsip least privilege — berikan hak akses minimal yang diperlukan untuk setiap role."
      },
      {
        id: "admin-settings",
        title: "Pengaturan Umum",
        description: "Konfigurasi pengaturan umum pesantren.",
        icon: <Settings className="h-5 w-5" />,
        details: [
          "Buka menu 'Pengaturan' di sidebar",
          "Atur nama pesantren dan informasi institusi",
          "Ubah logo dan warna tema aplikasi",
          "Aktifkan/nonaktifkan mode maintenance jika perlu",
          "Pengaturan tersimpan dan berlaku untuk seluruh sistem"
        ]
      },
      {
        id: "admin-registrations",
        title: "Kelola Pendaftaran Masuk",
        description: "Proses pendaftaran santri baru yang masuk.",
        icon: <ClipboardCheck className="h-5 w-5" />,
        details: [
          "Buka menu 'Pendaftaran' di sidebar",
          "Lihat daftar pendaftar yang masuk via website",
          "Review dan proses setiap pendaftaran",
          "Terima atau tolak pendaftaran dengan catatan"
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
        id: "guardian-login",
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
        id: "guardian-profile",
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
        id: "guardian-grades",
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
        id: "guardian-attendance",
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
        id: "guardian-bills",
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
        id: "guardian-savings",
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
        id: "student-login",
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
        id: "student-schedule",
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
        id: "student-grades",
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
        id: "student-attendance",
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
        id: "student-finance",
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
        id: "student-profile",
        title: "Lihat Profil",
        description: "Lihat informasi profil Anda.",
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

function getStepIds(tutorials: TutorialSection[]): string[] {
  return tutorials.flatMap(s => s.steps.map(st => st.id));
}

function StepCard({ step, index, completed, onToggleComplete }: { 
  step: TutorialStep; 
  index: number; 
  completed: boolean;
  onToggleComplete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className={`cursor-pointer hover:shadow-md transition-all border-border/60 ${completed ? 'bg-primary/5 border-primary/20' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <CardHeader className="p-4 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 rounded-lg p-2 shrink-0 ${completed ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
                {completed ? <CheckCircle2 className="h-5 w-5" /> : step.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs font-normal">
                    Langkah {index + 1}
                  </Badge>
                  {completed && (
                    <Badge className="text-xs bg-primary/15 text-primary border-0 hover:bg-primary/20">
                      ✓ Selesai
                    </Badge>
                  )}
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
              <CardContent className="px-4 pt-0 pb-5">
                <Separator className="mb-3" />
                <ol className="space-y-2.5 ml-1">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ol>
                {step.tips && (
                  <div className="mt-4 rounded-lg bg-accent/20 border border-accent/30 p-3">
                    <p className="text-sm text-accent-foreground">
                      <span className="font-semibold">💡 Tips:</span> {step.tips}
                    </p>
                  </div>
                )}
                <div className="mt-4 flex justify-end">
                  <Button
                    size="sm"
                    variant={completed ? "outline" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(step.id);
                    }}
                  >
                    {completed ? (
                      <>
                        <RotateCcw className="h-3.5 w-3.5 mr-1" />
                        Tandai Belum Selesai
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Tandai Selesai
                      </>
                    )}
                  </Button>
                </div>
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
  const [progress, setProgress] = useState<Record<string, boolean>>(loadProgress);
  const { toast } = useToast();
  const config = userTypeConfig[activeTab];

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const toggleComplete = useCallback((id: string) => {
    setProgress(prev => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({});
    toast({ title: "Progress direset", description: "Semua langkah ditandai belum selesai." });
  }, [toast]);

  // Calculate progress for current tab
  const currentStepIds = getStepIds(config.tutorials);
  const completedCount = currentStepIds.filter(id => progress[id]).length;
  const totalCount = currentStepIds.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

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
              {/* Progress bar */}
              <Card className="mb-6 border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={cfg.color}>{cfg.label}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {completedCount}/{totalCount} langkah selesai
                      </span>
                    </div>
                    {completedCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={resetProgress} className="text-xs h-7">
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Reset
                      </Button>
                    )}
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {key === "admin" && "Panduan lengkap untuk Super Admin, Branch Admin, Treasurer, Academic Staff, dan Dormitory Supervisor."}
                    {key === "guardian" && "Panduan untuk orang tua / wali santri dalam memantau perkembangan anak."}
                    {key === "student" && "Panduan untuk santri dalam mengakses informasi akademik dan keuangan."}
                  </p>
                  {progressPercent === 100 && (
                    <div className="mt-2 rounded-lg bg-primary/10 border border-primary/20 p-2 text-center">
                      <p className="text-sm font-medium text-primary">🎉 Selamat! Anda telah menyelesaikan semua tutorial.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

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
                        <StepCard 
                          key={step.id} 
                          step={step} 
                          index={i} 
                          completed={!!progress[step.id]}
                          onToggleComplete={toggleComplete}
                        />
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
              { q: "Apakah progress tutorial saya tersimpan?", a: "Ya, progress tutorial Anda tersimpan secara lokal di browser. Anda bisa melanjutkan kapan saja." },
              { q: "Siapa saja yang bisa mengakses sistem ini?", a: "Sistem mendukung 7 role: Super Admin, Branch Admin, Treasurer, Academic Staff, Musyrif (Dormitory Supervisor), Wali Santri, dan Santri." },
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
