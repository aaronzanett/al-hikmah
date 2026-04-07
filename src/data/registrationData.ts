import {
  ClipboardList, FileText, Users, CreditCard, Trophy, GraduationCap,
  type LucideIcon,
} from "lucide-react";

// ─── Shared Types ───
export interface AlurItem {
  id: string; step: number; title: string; desc: string; details: string[]; status: string;
  iconKey: string; color: string;
  icon?: typeof ClipboardList;
}

export type FeeMode = "free" | "global" | "per-program";

export interface RegistrationFeeConfig {
  mode: FeeMode;
  globalAmount: string;
  programFees: Record<string, string>; // program name -> amount
}

export interface JadwalItem {
  id: string; program: string; wave: string; periodStart: string; periodEnd: string; testDate: string; resultDate: string; status: string;
}
export interface PersyaratanItem {
  id: string; title: string; order: number; status: string;
}
export interface BiayaItem {
  id: string; item: string; amount: string; note: string; order: number; status: string;
}
export interface FAQItem {
  id: string; question: string; answer: string; order: number; status: string;
}

// ─── Step Icons & Colors ───
export const stepIcons = [ClipboardList, FileText, Users, Trophy, CreditCard, GraduationCap];
export const stepColors = [
  "bg-primary/10 text-primary",
  "bg-warning/10 text-warning",
  "bg-info/10 text-info",
  "bg-success/10 text-success",
  "bg-destructive/10 text-destructive",
  "bg-primary/10 text-primary",
];

export const defaultStepIconKeys = ["ClipboardList", "FileText", "Users", "Trophy", "CreditCard", "GraduationCap"];

// ─── Shared Data ───
export const registrationSteps: AlurItem[] = [
  { id: "A1", step: 1, title: "Pendaftaran Online", desc: "Isi formulir pendaftaran online dengan data lengkap calon santri dan wali/orang tua.", details: ["Pilih program yang diminati", "Isi data pribadi calon santri", "Isi data wali/orang tua", "Upload pas foto terbaru"], status: "Aktif", iconKey: "ClipboardList", color: "bg-primary/10 text-primary" },
  { id: "A2", step: 2, title: "Upload Dokumen", desc: "Lengkapi berkas persyaratan secara digital melalui portal pendaftaran.", details: ["Akta kelahiran", "Kartu keluarga", "Rapor 2 semester terakhir", "Surat keterangan sehat"], status: "Aktif", iconKey: "FileText", color: "bg-warning/10 text-warning" },
  { id: "A3", step: 3, title: "Tes Seleksi", desc: "Ikuti tes seleksi yang meliputi tes akademik, baca Al-Qur'an, dan wawancara.", details: ["Tes kemampuan akademik dasar", "Tes baca Al-Qur'an & hafalan", "Wawancara calon santri", "Wawancara orang tua/wali"], status: "Aktif", iconKey: "Users", color: "bg-info/10 text-info" },
  { id: "A4", step: 4, title: "Pengumuman Hasil", desc: "Hasil seleksi akan diumumkan melalui website dan notifikasi ke email/WhatsApp terdaftar.", details: ["Pengumuman via website & email", "Notifikasi WhatsApp", "Surat kelulusan digital", "Panduan langkah selanjutnya"], status: "Aktif", iconKey: "Trophy", color: "bg-success/10 text-success" },
  { id: "A5", step: 5, title: "Daftar Ulang & Pembayaran", desc: "Lakukan pembayaran biaya pendaftaran dan perlengkapan sesuai gelombang yang dipilih.", details: ["Pembayaran biaya pendidikan", "Pembayaran perlengkapan santri", "Pembayaran seragam & kitab", "Konfirmasi pembayaran"], status: "Aktif", iconKey: "CreditCard", color: "bg-destructive/10 text-destructive" },
  { id: "A6", step: 6, title: "Orientasi & Masuk Pesantren", desc: "Ikuti kegiatan orientasi dan mulai kehidupan sebagai santri di pesantren.", details: ["Orientasi santri baru (3 hari)", "Penempatan kamar asrama", "Penerimaan jadwal pelajaran", "Perkenalan lingkungan pesantren"], status: "Aktif", iconKey: "GraduationCap", color: "bg-primary/10 text-primary" },
];

export const scheduleData: JadwalItem[] = [
  { id: "J1", program: "Tahfidz Al-Qur'an", wave: "Gelombang 1", periodStart: "2026-01-01", periodEnd: "2026-02-28", testDate: "2026-03-08", resultDate: "2026-03-15", status: "Dibuka" },
  { id: "J2", program: "Tahfidz Al-Qur'an", wave: "Gelombang 2", periodStart: "2026-03-01", periodEnd: "2026-04-30", testDate: "2026-05-10", resultDate: "2026-05-17", status: "Segera" },
  { id: "J3", program: "Tahfidz Al-Qur'an", wave: "Gelombang 3", periodStart: "2026-05-01", periodEnd: "2026-06-30", testDate: "2026-07-12", resultDate: "2026-07-19", status: "Tertutup" },
  { id: "J4", program: "Kurikulum Nasional + Diniyah", wave: "Gelombang 1", periodStart: "2026-01-01", periodEnd: "2026-02-28", testDate: "2026-03-10", resultDate: "2026-03-17", status: "Dibuka" },
  { id: "J5", program: "Kurikulum Nasional + Diniyah", wave: "Gelombang 2", periodStart: "2026-03-01", periodEnd: "2026-04-30", testDate: "2026-05-12", resultDate: "2026-05-19", status: "Segera" },
  { id: "J6", program: "Bahasa Arab & Inggris", wave: "Gelombang 1", periodStart: "2026-02-01", periodEnd: "2026-03-31", testDate: "2026-04-12", resultDate: "2026-04-19", status: "Dibuka" },
  { id: "J7", program: "Bahasa Arab & Inggris", wave: "Gelombang 2", periodStart: "2026-04-01", periodEnd: "2026-05-31", testDate: "2026-06-14", resultDate: "2026-06-21", status: "Segera" },
];

export const requirementsData: PersyaratanItem[] = [
  { id: "P1", title: "Fotokopi akta kelahiran (2 lembar)", order: 1, status: "Aktif" },
  { id: "P2", title: "Fotokopi kartu keluarga (2 lembar)", order: 2, status: "Aktif" },
  { id: "P3", title: "Fotokopi rapor 2 semester terakhir yang dilegalisir", order: 3, status: "Aktif" },
  { id: "P4", title: "Surat keterangan sehat dari dokter", order: 4, status: "Aktif" },
  { id: "P5", title: "Pas foto 3x4 dan 4x6 (masing-masing 4 lembar, background biru)", order: 5, status: "Aktif" },
  { id: "P6", title: "Fotokopi KTP orang tua/wali (2 lembar)", order: 6, status: "Aktif" },
  { id: "P7", title: "Surat keterangan berkelakuan baik dari sekolah asal", order: 7, status: "Aktif" },
  { id: "P8", title: "Mengisi formulir pendaftaran online", order: 8, status: "Aktif" },
];

export const costData: BiayaItem[] = [
  { id: "B1", item: "Biaya Pendaftaran", amount: "Rp 350.000", note: "Sekali bayar", order: 1, status: "Aktif" },
  { id: "B2", item: "SPP Bulanan", amount: "Rp 1.500.000", note: "Per bulan", order: 2, status: "Aktif" },
  { id: "B3", item: "Biaya Pembangunan", amount: "Rp 5.000.000", note: "Sekali bayar", order: 3, status: "Aktif" },
  { id: "B4", item: "Perlengkapan Santri", amount: "Rp 2.500.000", note: "Sekali bayar", order: 4, status: "Aktif" },
  { id: "B5", item: "Seragam & Kitab", amount: "Rp 1.800.000", note: "Sekali bayar", order: 5, status: "Aktif" },
];

export const faqData: FAQItem[] = [
  { id: "F1", question: "Berapa usia minimal untuk mendaftar?", answer: "Calon santri minimal berusia 12 tahun atau setara kelas 7 SMP pada saat masuk pesantren.", order: 1, status: "Aktif" },
  { id: "F2", question: "Apakah ada beasiswa untuk santri berprestasi?", answer: "Ya, kami menyediakan beasiswa prestasi akademik, tahfidz, dan bantuan bagi keluarga kurang mampu. Informasi lebih lanjut bisa ditanyakan saat pendaftaran.", order: 2, status: "Aktif" },
  { id: "F3", question: "Bagaimana sistem pembayaran SPP?", answer: "Pembayaran SPP dilakukan setiap bulan melalui transfer bank, virtual account, atau e-wallet. Kami juga menerima pembayaran per semester.", order: 3, status: "Aktif" },
  { id: "F4", question: "Apakah orang tua bisa berkunjung?", answer: "Kunjungan orang tua dijadwalkan setiap 2 minggu sekali pada hari Ahad. Kunjungan di luar jadwal bisa diatur melalui koordinasi dengan pihak pesantren.", order: 4, status: "Aktif" },
  { id: "F5", question: "Apa kurikulum yang digunakan?", answer: "Kami menggunakan kurikulum nasional (Kemendikbud) yang dipadukan dengan kurikulum pesantren (Diniyah), sehingga santri mendapat ijazah formal dan kemampuan keagamaan.", order: 5, status: "Aktif" },
  { id: "F6", question: "Apakah ada program tahfidz?", answer: "Ya, program tahfidz adalah salah satu program unggulan kami dengan target hafalan 30 juz selama masa pendidikan.", order: 6, status: "Aktif" },
];

// ─── Default Fee Config ───
export const defaultFeeConfig: RegistrationFeeConfig = {
  mode: "global",
  globalAmount: "Rp 350.000",
  programFees: {
    "Tahfidz Al-Qur'an": "Rp 400.000",
    "Kurikulum Nasional + Diniyah": "Rp 350.000",
    "Bahasa Arab & Inggris": "Rp 300.000",
  },
};

// ─── LocalStorage helpers ───
const FEE_CONFIG_KEY = "psb_fee_config";

export const loadFeeConfig = (): RegistrationFeeConfig => {
  try {
    const stored = localStorage.getItem(FEE_CONFIG_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { ...defaultFeeConfig };
};

export const saveFeeConfig = (config: RegistrationFeeConfig) => {
  try {
    localStorage.setItem(FEE_CONFIG_KEY, JSON.stringify(config));
  } catch {}
};

// ─── Helper: format ISO date to display ───
export const formatDateDisplay = (isoDate: string): string => {
  if (!isoDate) return "-";
  try {
    const d = new Date(isoDate + "T00:00:00");
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return isoDate;
  }
};

export const formatPeriodDisplay = (start: string, end: string): string => {
  if (!start || !end) return "-";
  return `${formatDateDisplay(start)} – ${formatDateDisplay(end)}`;
};
