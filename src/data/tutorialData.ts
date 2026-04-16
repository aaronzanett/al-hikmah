import {
  LogIn, LayoutDashboard, Users, UserPlus, Building2, School,
  ListChecks, Star, FileText, CalendarCheck, DoorOpen, Package,
  CreditCard, ClipboardCheck, PiggyBank, Wallet, Globe, Image,
  Newspaper, MessageSquare, BookOpen, UserCog, Settings, Eye,
  BarChart3, Clock, GraduationCap, Upload, type LucideIcon
} from "lucide-react";

// ─── Shared Types ───
export type UserType = "admin" | "guardian" | "student";

export interface TutorialStepData {
  id: string;
  title: string;
  description: string;
  icon: string; // string key for icon
  details: string[];
  tips?: string;
  isVisible: boolean;
}

export interface TutorialSectionData {
  id: string;
  title: string;
  steps: TutorialStepData[];
  isVisible: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  isVisible: boolean;
}

export interface TutorialData {
  admin: TutorialSectionData[];
  guardian: TutorialSectionData[];
  student: TutorialSectionData[];
  faq: FaqItem[];
}

// ─── Icon Map ───
export const tutorialIconMap: Record<string, LucideIcon> = {
  LogIn, LayoutDashboard, Users, UserPlus, Building2, School,
  ListChecks, Star, FileText, CalendarCheck, DoorOpen, Package,
  CreditCard, ClipboardCheck, PiggyBank, Wallet, Globe, Image,
  Newspaper, MessageSquare, BookOpen, UserCog, Settings, Eye,
  BarChart3, Clock, GraduationCap, Upload,
};

export const tutorialIconOptions = Object.keys(tutorialIconMap);

export function getIconComponent(name: string): LucideIcon {
  return tutorialIconMap[name] || BookOpen;
}

// ─── Storage ───
export const TUTORIAL_DATA_KEY = "managed_tutorial_data";
export const TUTORIAL_PROGRESS_KEY = "tutorial_progress";

export function loadTutorialData(): TutorialData {
  try {
    const raw = localStorage.getItem(TUTORIAL_DATA_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return getDefaultTutorialData();
}

export function saveTutorialData(data: TutorialData) {
  localStorage.setItem(TUTORIAL_DATA_KEY, JSON.stringify(data));
}

export function loadProgress(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(TUTORIAL_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function saveProgress(progress: Record<string, boolean>) {
  localStorage.setItem(TUTORIAL_PROGRESS_KEY, JSON.stringify(progress));
}

export function generateId() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Default Data (complete content from Tutorial page) ───
export function getDefaultTutorialData(): TutorialData {
  return {
    admin: [
      {
        id: "sec-admin-1",
        title: "Memulai & Login",
        isVisible: true,
        steps: [
          {
            id: "admin-login",
            title: "Login ke Dashboard Admin",
            description: "Akses halaman login admin untuk masuk ke sistem manajemen pesantren.",
            icon: "LogIn",
            details: [
              "Buka halaman /login/admin di browser",
              "Pilih role Anda (Super Admin, Branch Admin, Treasurer, dll.)",
              "Masukkan kredensial yang telah diberikan",
              "Anda akan diarahkan ke dashboard sesuai dengan hak akses role Anda"
            ],
            tips: "Super Admin memiliki akses penuh ke seluruh fitur. Role lain memiliki akses terbatas sesuai tugasnya.",
            isVisible: true
          },
          {
            id: "admin-dashboard",
            title: "Memahami Dashboard",
            description: "Dashboard menampilkan ringkasan data penting pesantren secara real-time.",
            icon: "LayoutDashboard",
            details: [
              "Lihat statistik jumlah santri, kelas, dan cabang aktif",
              "Pantau ringkasan keuangan (pembayaran, tabungan, pengeluaran)",
              "Akses menu navigasi di sidebar kiri untuk fitur spesifik",
              "Gunakan tombol toggle untuk menyembunyikan/menampilkan sidebar"
            ],
            isVisible: true
          }
        ]
      },
      {
        id: "sec-admin-2",
        title: "Manajemen Santri & Wali",
        isVisible: true,
        steps: [
          {
            id: "admin-students",
            title: "Kelola Data Santri",
            description: "Tambah, edit, dan kelola seluruh data santri pesantren.",
            icon: "Users",
            details: [
              "Buka menu 'Santri' di sidebar",
              "Klik 'Tambah Santri' untuk mendaftarkan santri baru",
              "Isi data lengkap: nama, kelas, wali, dan informasi lainnya",
              "Gunakan fitur pencarian untuk menemukan santri tertentu",
              "Klik ikon edit untuk mengubah data santri yang sudah ada"
            ],
            isVisible: true
          },
          {
            id: "admin-guardians",
            title: "Kelola Data Wali Santri",
            description: "Atur data orang tua / wali santri dan hubungkan ke anak.",
            icon: "UserPlus",
            details: [
              "Buka menu 'Wali Santri' di sidebar",
              "Tambah wali baru dengan data kontak lengkap",
              "Hubungkan wali dengan santri yang bersangkutan",
              "Wali yang terdaftar dapat login ke Portal Wali"
            ],
            isVisible: true
          },
          {
            id: "admin-branches",
            title: "Kelola Cabang Pesantren",
            description: "Atur data cabang-cabang pesantren yang terdaftar.",
            icon: "Building2",
            details: [
              "Buka menu 'Cabang' di sidebar",
              "Tambah cabang baru dengan nama dan lokasi",
              "Branch Admin hanya bisa mengakses data cabang mereka sendiri",
              "Super Admin dapat melihat seluruh cabang"
            ],
            isVisible: true
          }
        ]
      },
      {
        id: "sec-admin-3",
        title: "Akademik & Kurikulum",
        isVisible: true,
        steps: [
          {
            id: "admin-classes",
            title: "Kelola Kelas",
            description: "Atur struktur kelas dan alokasi santri.",
            icon: "School",
            details: [
              "Buka menu 'Kelas' untuk melihat dan mengelola daftar kelas",
              "Tambah kelas baru dengan nama, tingkat, dan kapasitas",
              "Alokasikan santri ke kelas yang sesuai",
              "Setiap perubahan tercatat beserta operator yang melakukannya"
            ],
            tips: "Riwayat perubahan (operator history) tersedia di setiap halaman akademik.",
            isVisible: true
          },
          {
            id: "admin-subjects",
            title: "Kelola Mata Pelajaran",
            description: "Atur kurikulum dan daftar mata pelajaran.",
            icon: "ListChecks",
            details: [
              "Buka menu 'Mata Pelajaran' di sidebar",
              "Tambah mata pelajaran baru dengan kode dan nama",
              "Tetapkan mata pelajaran ke kelas tertentu",
              "Perubahan akan mencatat operator secara otomatis"
            ],
            isVisible: true
          },
          {
            id: "admin-grades",
            title: "Input & Kelola Nilai",
            description: "Masukkan nilai santri per mata pelajaran.",
            icon: "Star",
            details: [
              "Buka menu 'Nilai' di sidebar",
              "Pilih kelas dan mata pelajaran",
              "Input nilai untuk setiap santri",
              "Nilai otomatis terhubung ke rapor dan portal santri/wali"
            ],
            isVisible: true
          },
          {
            id: "admin-reportcard",
            title: "Pengaturan Rapor",
            description: "Konfigurasi format dan template rapor santri.",
            icon: "FileText",
            details: [
              "Buka menu 'Rapor' di sidebar",
              "Atur nama institusi, ukuran kertas, dan skala nilai",
              "Upload template rapor dalam format PDF atau Word",
              "Template yang di-upload dapat di-preview dan diaktifkan",
              "Export rapor santri ke format PDF atau Word kapan saja",
              "Konfigurasi tersimpan otomatis secara lokal (auto-save)"
            ],
            tips: "Upload template PDF/Word asli untuk hasil rapor yang lebih profesional dan proporsional.",
            isVisible: true
          },
          {
            id: "admin-attendance",
            title: "Absensi Santri",
            description: "Catat dan pantau kehadiran santri harian.",
            icon: "CalendarCheck",
            details: [
              "Buka menu 'Absensi' di sidebar",
              "Pilih tanggal dan kelas untuk mencatat kehadiran",
              "Tandai status: Hadir, Sakit, Izin, atau Alpha",
              "Lihat rekap absensi per santri atau per kelas",
              "Riwayat operator yang mencatat absensi tersimpan"
            ],
            isVisible: true
          },
          {
            id: "admin-rooms",
            title: "Kelola Kamar Asrama",
            description: "Atur kamar dan alokasi santri asrama.",
            icon: "DoorOpen",
            details: [
              "Buka menu 'Kamar' di sidebar",
              "Tambah kamar baru dengan kapasitas",
              "Alokasikan santri ke kamar masing-masing",
              "Pantau status kapasitas kamar"
            ],
            isVisible: true
          },
          {
            id: "admin-inventory",
            title: "Inventaris Pesantren",
            description: "Kelola aset dan barang inventaris pesantren.",
            icon: "Package",
            details: [
              "Buka menu 'Inventaris' di sidebar",
              "Catat barang inventaris beserta kondisinya",
              "Pantau jumlah stok dan lokasi barang",
              "Update status barang jika ada perubahan"
            ],
            isVisible: true
          }
        ]
      },
      {
        id: "sec-admin-4",
        title: "Keuangan",
        isVisible: true,
        steps: [
          {
            id: "admin-bills",
            title: "Kelola Tagihan",
            description: "Buat dan kelola tagihan untuk santri.",
            icon: "CreditCard",
            details: [
              "Buka menu 'Tagihan' di sidebar",
              "Buat tagihan baru dengan jenis, jumlah, dan jatuh tempo",
              "Tagihan otomatis muncul di portal wali dan santri",
              "Pantau status pembayaran setiap tagihan"
            ],
            isVisible: true
          },
          {
            id: "admin-payments",
            title: "Lihat Pembayaran (Read-Only)",
            description: "Pantau seluruh riwayat pembayaran yang masuk.",
            icon: "ClipboardCheck",
            details: [
              "Buka menu 'Pembayaran' di sidebar",
              "Halaman ini bersifat read-only (hanya lihat)",
              "Semua pembayaran tercatat otomatis dari sistem",
              "Gunakan filter untuk mencari transaksi tertentu"
            ],
            tips: "Halaman Pembayaran sengaja dibuat read-only untuk menjaga integritas data keuangan.",
            isVisible: true
          },
          {
            id: "admin-savings",
            title: "Kelola Tabungan Santri",
            description: "Catat setoran dan penarikan tabungan santri.",
            icon: "PiggyBank",
            details: [
              "Buka menu 'Tabungan' di sidebar",
              "Lihat saldo tabungan setiap santri",
              "Catat setoran dan penarikan tabungan",
              "Operator yang menangani transaksi tercatat otomatis",
              "Riwayat transaksi lengkap tersedia untuk setiap santri"
            ],
            isVisible: true
          },
          {
            id: "admin-expenses",
            title: "Catat Pengeluaran",
            description: "Catat pengeluaran operasional pesantren.",
            icon: "Wallet",
            details: [
              "Buka menu 'Pengeluaran' di sidebar",
              "Tambah pengeluaran baru dengan kategori dan jumlah",
              "Operator yang menginput pengeluaran tercatat otomatis",
              "Pantau total pengeluaran per periode"
            ],
            isVisible: true
          }
        ]
      },
      {
        id: "sec-admin-5",
        title: "Konten Website Publik",
        isVisible: true,
        steps: [
          {
            id: "admin-hero",
            title: "Kelola Banner Hero",
            description: "Atur banner utama di halaman depan website.",
            icon: "Globe",
            details: [
              "Buka menu 'Konten > Hero' di sidebar",
              "Upload gambar dan atur teks banner utama",
              "Preview perubahan sebelum disimpan",
              "Banner akan tampil di halaman utama website publik"
            ],
            isVisible: true
          },
          {
            id: "admin-gallery",
            title: "Kelola Galeri Foto",
            description: "Upload dan atur galeri foto pesantren.",
            icon: "Image",
            details: [
              "Buka menu 'Konten > Galeri'",
              "Upload foto kegiatan dan fasilitas pesantren",
              "Atur urutan dan kategori foto",
              "Foto akan tampil di halaman Galeri website"
            ],
            isVisible: true
          },
          {
            id: "admin-news",
            title: "Publikasi Berita",
            description: "Buat dan kelola berita/pengumuman pesantren.",
            icon: "Newspaper",
            details: [
              "Buka menu 'Konten > Berita'",
              "Buat berita baru dengan judul, isi, dan gambar",
              "Berita akan tampil di halaman Berita website",
              "Edit atau hapus berita yang sudah dipublikasi"
            ],
            isVisible: true
          },
          {
            id: "admin-messages",
            title: "Lihat Pesan Kontak",
            description: "Baca pesan masuk dari pengunjung website.",
            icon: "MessageSquare",
            details: [
              "Buka menu 'Konten > Pesan'",
              "Lihat pesan yang dikirim melalui formulir kontak",
              "Tandai pesan yang sudah ditangani",
              "Balas pesan melalui email atau telepon"
            ],
            isVisible: true
          },
          {
            id: "admin-programs",
            title: "Kelola Program Pendidikan",
            description: "Atur informasi program yang ditawarkan.",
            icon: "BookOpen",
            details: [
              "Buka menu 'Konten > Program'",
              "Tambah atau edit program pendidikan",
              "Atur deskripsi, gambar, dan detail program",
              "Program akan tampil di halaman utama website"
            ],
            isVisible: true
          },
          {
            id: "admin-registration-content",
            title: "Kelola Info Pendaftaran",
            description: "Atur alur dan informasi pendaftaran santri baru.",
            icon: "ClipboardCheck",
            details: [
              "Buka menu 'Konten > Pendaftaran'",
              "Atur langkah-langkah alur pendaftaran",
              "Tambahkan detail dan persyaratan setiap tahap",
              "Preview alur di halaman /registration website"
            ],
            isVisible: true
          }
        ]
      },
      {
        id: "sec-admin-6",
        title: "Pengaturan & Pengguna",
        isVisible: true,
        steps: [
          {
            id: "admin-users",
            title: "Kelola Pengguna & Hak Akses",
            description: "Atur akun pengguna dan role masing-masing.",
            icon: "UserCog",
            details: [
              "Buka menu 'Pengguna' di sidebar",
              "Tambah pengguna baru dengan role yang sesuai",
              "Role: Super Admin, Branch Admin, Treasurer, Academic Staff, Musyrif",
              "Setiap role memiliki hak akses berbeda secara otomatis",
              "Nonaktifkan akun pengguna jika diperlukan"
            ],
            tips: "Gunakan prinsip least privilege — berikan hak akses minimal yang diperlukan untuk setiap role.",
            isVisible: true
          },
          {
            id: "admin-settings",
            title: "Pengaturan Umum",
            description: "Konfigurasi pengaturan umum pesantren.",
            icon: "Settings",
            details: [
              "Buka menu 'Pengaturan' di sidebar",
              "Atur nama pesantren dan informasi institusi",
              "Ubah logo dan warna tema aplikasi",
              "Aktifkan/nonaktifkan mode maintenance jika perlu",
              "Pengaturan tersimpan dan berlaku untuk seluruh sistem"
            ],
            isVisible: true
          },
          {
            id: "admin-registrations",
            title: "Kelola Pendaftaran Masuk",
            description: "Proses pendaftaran santri baru yang masuk.",
            icon: "ClipboardCheck",
            details: [
              "Buka menu 'Pendaftaran' di sidebar",
              "Lihat daftar pendaftar yang masuk via website",
              "Review dan proses setiap pendaftaran",
              "Terima atau tolak pendaftaran dengan catatan"
            ],
            isVisible: true
          }
        ]
      }
    ],
    guardian: [
      {
        id: "sec-guardian-1",
        title: "Memulai",
        isVisible: true,
        steps: [
          {
            id: "guardian-login",
            title: "Login sebagai Wali Santri",
            description: "Masuk ke portal wali untuk memantau perkembangan anak Anda.",
            icon: "LogIn",
            details: [
              "Buka halaman /login di browser",
              "Pilih 'Wali Santri' sebagai jenis akun",
              "Masukkan email dan password yang telah terdaftar",
              "Anda akan masuk ke Portal Wali dengan tampilan khusus"
            ],
            tips: "Hubungi pihak pesantren jika Anda belum memiliki akun.",
            isVisible: true
          }
        ]
      },
      {
        id: "sec-guardian-2",
        title: "Memantau Anak",
        isVisible: true,
        steps: [
          {
            id: "guardian-profile",
            title: "Lihat Profil Anak",
            description: "Akses informasi lengkap tentang anak Anda di pesantren.",
            icon: "Eye",
            details: [
              "Klik menu 'Profil Anak' di navigasi portal",
              "Lihat data pribadi, kelas, dan kamar anak Anda",
              "Cek foto profil dan informasi akademik terkini"
            ],
            isVisible: true
          },
          {
            id: "guardian-grades",
            title: "Pantau Nilai & Hafalan",
            description: "Lihat perkembangan akademik dan hafalan anak.",
            icon: "BarChart3",
            details: [
              "Buka menu 'Nilai' di portal",
              "Lihat nilai per mata pelajaran dan semester",
              "Pantau progress hafalan Al-Quran anak",
              "Perhatikan catatan dan evaluasi dari ustadz/ustadzah"
            ],
            isVisible: true
          },
          {
            id: "guardian-attendance",
            title: "Cek Kehadiran",
            description: "Pantau kehadiran anak di pesantren.",
            icon: "CalendarCheck",
            details: [
              "Buka menu 'Absensi' di portal",
              "Lihat rekap kehadiran harian dan bulanan",
              "Cek status: Hadir, Sakit, Izin, atau Alpha",
              "Hubungi pesantren jika ada ketidaksesuaian data"
            ],
            isVisible: true
          }
        ]
      },
      {
        id: "sec-guardian-3",
        title: "Keuangan",
        isVisible: true,
        steps: [
          {
            id: "guardian-bills",
            title: "Lihat Tagihan",
            description: "Pantau tagihan dan status pembayaran.",
            icon: "CreditCard",
            details: [
              "Buka menu 'Tagihan' di portal",
              "Lihat daftar tagihan aktif dan jatuh tempo",
              "Cek status pembayaran: Lunas, Belum Lunas, atau Jatuh Tempo",
              "Lihat riwayat pembayaran yang telah dilakukan"
            ],
            isVisible: true
          },
          {
            id: "guardian-savings",
            title: "Kelola Tabungan Anak",
            description: "Pantau dan top-up tabungan anak di pesantren.",
            icon: "Wallet",
            details: [
              "Buka menu 'Tabungan' di portal",
              "Lihat saldo tabungan anak saat ini",
              "Klik 'Transfer / Top Up' untuk menambah saldo",
              "Pilih metode pembayaran: GoPay, OVO, Virtual Account, dll.",
              "Ikuti instruksi pembayaran hingga selesai"
            ],
            tips: "Top-up tabungan menggunakan berbagai metode pembayaran digital yang tersedia.",
            isVisible: true
          }
        ]
      }
    ],
    student: [
      {
        id: "sec-student-1",
        title: "Memulai",
        isVisible: true,
        steps: [
          {
            id: "student-login",
            title: "Login sebagai Santri",
            description: "Masuk ke portal santri untuk mengakses informasi akademik Anda.",
            icon: "LogIn",
            details: [
              "Buka halaman /login di browser",
              "Pilih 'Santri' sebagai jenis akun",
              "Masukkan email dan password yang diberikan pesantren",
              "Anda akan masuk ke Portal Santri"
            ],
            isVisible: true
          }
        ]
      },
      {
        id: "sec-student-2",
        title: "Akademik",
        isVisible: true,
        steps: [
          {
            id: "student-schedule",
            title: "Lihat Jadwal Pelajaran",
            description: "Cek jadwal harian dan mingguan Anda.",
            icon: "Clock",
            details: [
              "Buka menu 'Jadwal' di portal santri",
              "Lihat jadwal pelajaran harian",
              "Cek ruangan dan nama pengajar untuk setiap sesi",
              "Jadwal diperbarui otomatis jika ada perubahan"
            ],
            isVisible: true
          },
          {
            id: "student-grades",
            title: "Cek Nilai & Progress Hafalan",
            description: "Pantau nilai akademik dan progress hafalan Anda.",
            icon: "Star",
            details: [
              "Buka menu 'Nilai' di portal",
              "Lihat nilai per mata pelajaran",
              "Pantau progress hafalan Al-Quran",
              "Perhatikan feedback dari ustadz/ustadzah"
            ],
            isVisible: true
          },
          {
            id: "student-attendance",
            title: "Riwayat Kehadiran",
            description: "Lihat rekap kehadiran Anda.",
            icon: "CalendarCheck",
            details: [
              "Buka menu 'Absensi' di portal",
              "Lihat statistik kehadiran Anda",
              "Cek detail harian: Hadir, Sakit, Izin, Alpha"
            ],
            isVisible: true
          }
        ]
      },
      {
        id: "sec-student-3",
        title: "Keuangan & Profil",
        isVisible: true,
        steps: [
          {
            id: "student-finance",
            title: "Lihat Tagihan & Tabungan",
            description: "Pantau status keuangan Anda di pesantren.",
            icon: "Wallet",
            details: [
              "Buka menu 'Tagihan' untuk melihat tagihan aktif",
              "Buka menu 'Tabungan' untuk cek saldo dan riwayat transaksi",
              "Hubungi wali atau pesantren jika ada pertanyaan"
            ],
            isVisible: true
          },
          {
            id: "student-profile",
            title: "Lihat Profil",
            description: "Lihat informasi profil Anda.",
            icon: "UserPlus",
            details: [
              "Buka menu 'Profil' di portal santri",
              "Lihat data pribadi dan informasi kamar",
              "Informasi kelas dan wali tercantum di profil"
            ],
            isVisible: true
          }
        ]
      }
    ],
    faq: [
      { id: "faq-1", question: "Bagaimana jika saya lupa password?", answer: "Hubungi administrator pesantren untuk mereset password Anda. Jangan bagikan password kepada siapa pun.", isVisible: true },
      { id: "faq-2", question: "Apakah data saya aman?", answer: "Ya, sistem menggunakan enkripsi dan kontrol akses berbasis peran (RBAC) untuk melindungi data setiap pengguna.", isVisible: true },
      { id: "faq-3", question: "Bisakah wali santri melihat data semua santri?", answer: "Tidak, wali hanya dapat melihat data anak yang terdaftar di akunnya.", isVisible: true },
      { id: "faq-4", question: "Bagaimana cara menghubungi pihak pesantren?", answer: "Gunakan formulir kontak di halaman utama website atau hubungi langsung melalui nomor telepon yang tertera.", isVisible: true },
      { id: "faq-5", question: "Apakah progress tutorial saya tersimpan?", answer: "Ya, progress tutorial Anda tersimpan secara lokal di browser. Anda bisa melanjutkan kapan saja.", isVisible: true },
      { id: "faq-6", question: "Siapa saja yang bisa mengakses sistem ini?", answer: "Sistem mendukung 7 role: Super Admin, Branch Admin, Treasurer, Academic Staff, Musyrif (Dormitory Supervisor), Wali Santri, dan Santri.", isVisible: true },
    ]
  };
}
