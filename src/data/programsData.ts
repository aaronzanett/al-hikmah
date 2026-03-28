// ─── Shared Programs Data ───
// This file is the single source of truth for programs displayed on both
// the public frontend (Index.tsx) and the admin management page (ManagePrograms.tsx).
// When connecting to a backend, replace this with API calls.

export interface ProgramItem {
  id: string;
  title: string;
  category: string;
  description: string;
  iconKey: string;
  badge: string;
  status: string;
  order: number;
  highlights: string[];
  createdAt: string;
}

export const programCategories = ["Semua", "Keagamaan", "Akademik", "Bahasa", "Keterampilan"];

export const programsData: ProgramItem[] = [
  { id: "P001", title: "Tahfidz Al-Qur'an", category: "Keagamaan", description: "Program intensif hafalan Al-Qur'an 30 juz dengan metode modern dan bimbingan ustadz berpengalaman.", iconKey: "BookOpen", badge: "Unggulan", status: "Aktif", order: 1, highlights: ["Hafalan 30 juz", "Metode Mutqin", "Sanad bersambung"], createdAt: "2026-01-10" },
  { id: "P002", title: "Kurikulum Nasional + Diniyah", category: "Akademik", description: "Perpaduan kurikulum Kementerian Pendidikan dan kurikulum pesantren untuk keseimbangan ilmu.", iconKey: "GraduationCap", badge: "", status: "Aktif", order: 2, highlights: ["Ijazah formal", "Kurikulum diniyah", "UN & UAMBN"], createdAt: "2026-01-10" },
  { id: "P003", title: "Bahasa Arab & Inggris", category: "Bahasa", description: "Program bilingual aktif dengan native speaker dan sertifikasi TOEFL & TOAFL.", iconKey: "Globe", badge: "", status: "Aktif", order: 3, highlights: ["Native speaker", "TOEFL prep", "Daily conversation"], createdAt: "2026-01-12" },
  { id: "P004", title: "Pendidikan Karakter", category: "Keagamaan", description: "Pembentukan akhlak mulia melalui pembiasaan ibadah, kedisiplinan, dan kemandirian.", iconKey: "Heart", badge: "", status: "Aktif", order: 4, highlights: ["Pembiasaan ibadah", "Leadership", "Kemandirian"], createdAt: "2026-01-15" },
  { id: "P005", title: "Olimpiade & Kompetisi", category: "Akademik", description: "Pembinaan santri berprestasi untuk kompetisi sains, bahasa, dan keagamaan tingkat nasional.", iconKey: "Award", badge: "", status: "Aktif", order: 5, highlights: ["OSN", "KSM", "Kompetisi bahasa"], createdAt: "2026-01-18" },
  { id: "P006", title: "Keterampilan Digital", category: "Akademik", description: "Pembekalan teknologi informasi, coding, dan desain grafis untuk menghadapi era digital.", iconKey: "BarChart3", badge: "", status: "Aktif", order: 6, highlights: ["Coding", "Desain grafis", "Digital literacy"], createdAt: "2026-01-20" },
  { id: "P007", title: "Kajian Kitab Kuning", category: "Keagamaan", description: "Pengkajian kitab-kitab klasik karya ulama terdahulu dengan metode sorogan dan bandongan.", iconKey: "BookOpen", badge: "Unggulan", status: "Aktif", order: 7, highlights: ["Metode sorogan", "Bandongan", "Kitab klasik"], createdAt: "2026-02-01" },
  { id: "P008", title: "Public Speaking", category: "Keterampilan", description: "Pelatihan pidato 3 bahasa (Indonesia, Arab, Inggris) untuk membangun kepercayaan diri santri.", iconKey: "Users", badge: "", status: "Aktif", order: 8, highlights: ["Pidato 3 bahasa", "Debat", "MC training"], createdAt: "2026-02-05" },
  { id: "P009", title: "Seni Kaligrafi", category: "Keterampilan", description: "Pelatihan seni kaligrafi Arab dengan berbagai gaya tulis seperti Naskhi, Tsuluts, dan Diwani.", iconKey: "Star", badge: "", status: "Nonaktif", order: 9, highlights: ["Naskhi", "Tsuluts", "Diwani"], createdAt: "2026-02-10" },
  { id: "P010", title: "Entrepreneurship Santri", category: "Keterampilan", description: "Program kewirausahaan yang melatih santri mengelola usaha koperasi dan UMKM pesantren.", iconKey: "Rocket", badge: "", status: "Aktif", order: 10, highlights: ["Bisnis plan", "Koperasi", "UMKM pesantren"], createdAt: "2026-02-15" },
  { id: "P011", title: "Tahsin & Tajwid", category: "Keagamaan", description: "Perbaikan bacaan Al-Qur'an dengan kaidah tajwid yang benar bersama pengajar bersertifikat.", iconKey: "BookOpen", badge: "", status: "Aktif", order: 11, highlights: ["Tajwid", "Makhraj", "Sertifikasi"], createdAt: "2026-02-20" },
  { id: "P012", title: "Robotika & Sains", category: "Akademik", description: "Klub robotika dan eksperimen sains untuk menumbuhkan minat STEM di kalangan santri.", iconKey: "Lightbulb", badge: "Baru", status: "Aktif", order: 12, highlights: ["Robotika", "Lab sains", "IoT project"], createdAt: "2026-03-01" },
];
