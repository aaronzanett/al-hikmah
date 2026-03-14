import { CrudPage, CrudColumn, CrudFormField, CrudFilter } from "@/components/CrudPage";

interface ProgramItem {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  badge: string;
  status: string;
  order: number;
  createdAt: string;
}

const iconOptions = [
  "BookOpen", "GraduationCap", "Globe", "Heart", "Award", "BarChart3",
  "Star", "Users", "Shield", "Lightbulb", "Rocket", "Target",
];

const initialData: ProgramItem[] = [
  { id: "P001", title: "Tahfidz Al-Qur'an", category: "Keagamaan", description: "Program intensif hafalan Al-Qur'an 30 juz dengan metode modern dan bimbingan ustadz berpengalaman.", icon: "BookOpen", badge: "Unggulan", status: "Aktif", order: 1, createdAt: "2026-01-10" },
  { id: "P002", title: "Kurikulum Nasional + Diniyah", category: "Akademik", description: "Perpaduan kurikulum Kementerian Pendidikan dan kurikulum pesantren untuk keseimbangan ilmu.", icon: "GraduationCap", badge: "", status: "Aktif", order: 2, createdAt: "2026-01-10" },
  { id: "P003", title: "Bahasa Arab & Inggris", category: "Bahasa", description: "Program bilingual aktif dengan native speaker dan sertifikasi TOEFL & TOAFL.", icon: "Globe", badge: "", status: "Aktif", order: 3, createdAt: "2026-01-12" },
  { id: "P004", title: "Pendidikan Karakter", category: "Keagamaan", description: "Pembentukan akhlak mulia melalui pembiasaan ibadah, kedisiplinan, dan kemandirian.", icon: "Heart", badge: "", status: "Aktif", order: 4, createdAt: "2026-01-15" },
  { id: "P005", title: "Olimpiade & Kompetisi", category: "Akademik", description: "Pembinaan santri berprestasi untuk kompetisi sains, bahasa, dan keagamaan tingkat nasional.", icon: "Award", badge: "", status: "Aktif", order: 5, createdAt: "2026-01-18" },
  { id: "P006", title: "Keterampilan Digital", category: "Keterampilan", description: "Pembekalan teknologi informasi, coding, dan desain grafis untuk menghadapi era digital.", icon: "BarChart3", badge: "", status: "Aktif", order: 6, createdAt: "2026-01-20" },
  { id: "P007", title: "Kajian Kitab Kuning", category: "Keagamaan", description: "Pengkajian kitab-kitab klasik karya ulama terdahulu dengan metode sorogan dan bandongan.", icon: "BookOpen", badge: "Unggulan", status: "Aktif", order: 7, createdAt: "2026-02-01" },
  { id: "P008", title: "Public Speaking", category: "Keterampilan", description: "Pelatihan pidato 3 bahasa (Indonesia, Arab, Inggris) untuk membangun kepercayaan diri santri.", icon: "Users", badge: "", status: "Aktif", order: 8, createdAt: "2026-02-05" },
  { id: "P009", title: "Seni Kaligrafi", category: "Keterampilan", description: "Pelatihan seni kaligrafi Arab dengan berbagai gaya tulis seperti Naskhi, Tsuluts, dan Diwani.", icon: "Star", badge: "", status: "Nonaktif", order: 9, createdAt: "2026-02-10" },
  { id: "P010", title: "Entrepreneurship Santri", category: "Keterampilan", description: "Program kewirausahaan yang melatih santri mengelola usaha koperasi dan UMKM pesantren.", icon: "Rocket", badge: "", status: "Aktif", order: 10, createdAt: "2026-02-15" },
  { id: "P011", title: "Tahsin & Tajwid", category: "Keagamaan", description: "Perbaikan bacaan Al-Qur'an dengan kaidah tajwid yang benar bersama pengajar bersertifikat.", icon: "BookOpen", badge: "", status: "Aktif", order: 11, createdAt: "2026-02-20" },
  { id: "P012", title: "Robotika & Sains", category: "Akademik", description: "Klub robotika dan eksperimen sains untuk menumbuhkan minat STEM di kalangan santri.", icon: "Lightbulb", badge: "", status: "Nonaktif", order: 12, createdAt: "2026-03-01" },
];

const columns: CrudColumn<ProgramItem>[] = [
  { key: "id", label: "ID", className: "w-20" },
  { key: "title", label: "Judul / Title" },
  {
    key: "category",
    label: "Kategori / Category",
    render: (val) => (
      <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">{val}</span>
    ),
  },
  {
    key: "description",
    label: "Deskripsi / Description",
    className: "max-w-[200px]",
    render: (val) => <span className="line-clamp-2 text-xs text-muted-foreground">{val}</span>,
  },
  {
    key: "icon",
    label: "Ikon / Icon",
    render: (val) => <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{val}</span>,
  },
  {
    key: "badge",
    label: "Label",
    render: (val) =>
      val ? (
        <span className="text-[10px] font-bold uppercase tracking-wider bg-accent/15 text-accent px-2 py-0.5 rounded-full">
          {val}
        </span>
      ) : (
        <span className="text-xs text-muted-foreground">-</span>
      ),
  },
  { key: "order", label: "Urutan / Order", className: "w-20 text-center" },
  {
    key: "status",
    label: "Status",
    render: (val) => (
      <span
        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          val === "Aktif" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
        }`}
      >
        {val}
      </span>
    ),
  },
  { key: "createdAt", label: "Tanggal / Date" },
];

const formFields: CrudFormField[] = [
  { key: "title", label: "Judul Program / Title", type: "text", placeholder: "Masukkan judul program" },
  {
    key: "category",
    label: "Kategori / Category",
    type: "select",
    options: [
      { value: "Keagamaan", label: "Keagamaan" },
      { value: "Akademik", label: "Akademik" },
      { value: "Bahasa", label: "Bahasa" },
      { value: "Keterampilan", label: "Keterampilan" },
    ],
  },
  { key: "description", label: "Deskripsi / Description", type: "textarea", placeholder: "Jelaskan program secara singkat" },
  {
    key: "icon",
    label: "Ikon / Icon",
    type: "select",
    options: iconOptions.map((i) => ({ value: i, label: i })),
  },
  { key: "badge", label: "Label / Badge", type: "text", placeholder: "Contoh: Unggulan (kosongkan jika tidak ada)" },
  { key: "order", label: "Urutan / Order", type: "number", placeholder: "Urutan tampil di halaman depan" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "Aktif", label: "Aktif" },
      { value: "Nonaktif", label: "Nonaktif" },
    ],
  },
];

const filters: CrudFilter[] = [
  {
    key: "category",
    label: "Kategori",
    options: [
      { value: "Keagamaan", label: "Keagamaan" },
      { value: "Akademik", label: "Akademik" },
      { value: "Bahasa", label: "Bahasa" },
      { value: "Keterampilan", label: "Keterampilan" },
    ],
  },
  {
    key: "status",
    label: "Status",
    options: [
      { value: "Aktif", label: "Aktif" },
      { value: "Nonaktif", label: "Nonaktif" },
    ],
  },
];

const ManagePrograms = () => {
  return (
    <CrudPage<ProgramItem>
      title="Program / Programs"
      columns={columns}
      formFields={formFields}
      initialData={initialData}
      filters={filters}
      searchKeys={["title", "category", "description"]}
    />
  );
};

export default ManagePrograms;
