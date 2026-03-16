import { CrudPage, CrudColumn, CrudFormField, CrudFilter } from "@/components/CrudPage";

interface RegistrationInfoItem {
  id: string;
  section: string;
  title: string;
  content: string;
  order: number;
  status: string;
  updatedAt: string;
}

const initialData: RegistrationInfoItem[] = [
  { id: "RI001", section: "Persyaratan", title: "Fotokopi Akta Kelahiran", content: "Fotokopi akta kelahiran yang telah dilegalisir sebanyak 2 lembar.", order: 1, status: "Aktif", updatedAt: "2026-01-05" },
  { id: "RI002", section: "Persyaratan", title: "Fotokopi Kartu Keluarga", content: "Fotokopi kartu keluarga terbaru sebanyak 2 lembar.", order: 2, status: "Aktif", updatedAt: "2026-01-05" },
  { id: "RI003", section: "Persyaratan", title: "Rapor Terakhir", content: "Fotokopi rapor 2 semester terakhir yang telah dilegalisir oleh kepala sekolah.", order: 3, status: "Aktif", updatedAt: "2026-01-05" },
  { id: "RI004", section: "Persyaratan", title: "Surat Keterangan Sehat", content: "Surat keterangan sehat dari dokter atau puskesmas (berlaku 3 bulan terakhir).", order: 4, status: "Aktif", updatedAt: "2026-01-05" },
  { id: "RI005", section: "Persyaratan", title: "Pas Foto", content: "Pas foto 3x4 dan 4x6 masing-masing 4 lembar, background biru, memakai pakaian putih.", order: 5, status: "Aktif", updatedAt: "2026-01-05" },
  { id: "RI006", section: "Biaya", title: "Biaya Pendaftaran", content: "Rp 350.000 - dibayar saat mendaftar (tidak dapat dikembalikan).", order: 1, status: "Aktif", updatedAt: "2026-01-10" },
  { id: "RI007", section: "Biaya", title: "SPP Bulanan", content: "Rp 1.500.000 per bulan, termasuk makan 3x, laundry, dan bimbingan belajar.", order: 2, status: "Aktif", updatedAt: "2026-01-10" },
  { id: "RI008", section: "Biaya", title: "Biaya Pembangunan", content: "Rp 5.000.000 - sekali bayar saat daftar ulang, bisa dicicil 2x.", order: 3, status: "Aktif", updatedAt: "2026-01-10" },
  { id: "RI009", section: "Biaya", title: "Perlengkapan Santri", content: "Rp 2.500.000 - termasuk seragam, kitab, dan perlengkapan asrama.", order: 4, status: "Aktif", updatedAt: "2026-01-10" },
  { id: "RI010", section: "Jadwal", title: "Gelombang 1", content: "Pendaftaran: 1 Jan – 28 Feb 2026 | Tes: 8 Mar 2026 | Pengumuman: 15 Mar 2026", order: 1, status: "Aktif", updatedAt: "2026-01-01" },
  { id: "RI011", section: "Jadwal", title: "Gelombang 2", content: "Pendaftaran: 1 Mar – 30 Apr 2026 | Tes: 10 Mei 2026 | Pengumuman: 17 Mei 2026", order: 2, status: "Aktif", updatedAt: "2026-01-01" },
  { id: "RI012", section: "Jadwal", title: "Gelombang 3", content: "Pendaftaran: 1 Mei – 30 Jun 2026 | Tes: 12 Jul 2026 | Pengumuman: 19 Jul 2026", order: 3, status: "Aktif", updatedAt: "2026-01-01" },
  { id: "RI013", section: "Alur", title: "Langkah 1: Pendaftaran Online", content: "Calon santri mengisi formulir pendaftaran online melalui website dan memilih program yang diminati.", order: 1, status: "Aktif", updatedAt: "2026-01-05" },
  { id: "RI014", section: "Alur", title: "Langkah 2: Upload Dokumen", content: "Lengkapi berkas persyaratan secara digital melalui portal pendaftaran.", order: 2, status: "Aktif", updatedAt: "2026-01-05" },
  { id: "RI015", section: "FAQ", title: "Usia Minimal Pendaftaran", content: "Calon santri minimal berusia 12 tahun atau setara kelas 7 SMP pada saat masuk pesantren.", order: 1, status: "Aktif", updatedAt: "2026-01-08" },
  { id: "RI016", section: "FAQ", title: "Beasiswa", content: "Ya, kami menyediakan beasiswa prestasi akademik, tahfidz, dan bantuan bagi keluarga kurang mampu.", order: 2, status: "Aktif", updatedAt: "2026-01-08" },
];

const columns: CrudColumn<RegistrationInfoItem>[] = [
  { key: "id", label: "ID", className: "w-20" },
  {
    key: "section",
    label: "Bagian / Section",
    render: (val) => {
      const colors: Record<string, string> = {
        Persyaratan: "bg-primary/10 text-primary",
        Biaya: "bg-accent/15 text-accent-foreground",
        Jadwal: "bg-info/10 text-info",
        Alur: "bg-success/10 text-success",
        FAQ: "bg-warning/10 text-warning",
      };
      return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[val as string] || "bg-muted text-muted-foreground"}`}>
          {val}
        </span>
      );
    },
  },
  { key: "title", label: "Judul / Title" },
  {
    key: "content",
    label: "Konten / Content",
    className: "max-w-[250px]",
    render: (val) => <span className="line-clamp-2 text-xs text-muted-foreground">{val}</span>,
  },
  { key: "order", label: "Urutan", className: "w-16 text-center" },
  {
    key: "status",
    label: "Status",
    render: (val) => (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${val === "Aktif" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
        {val}
      </span>
    ),
  },
  { key: "updatedAt", label: "Diperbarui" },
];

const formFields: CrudFormField[] = [
  {
    key: "section",
    label: "Bagian / Section",
    type: "select",
    options: [
      { value: "Persyaratan", label: "Persyaratan" },
      { value: "Biaya", label: "Biaya" },
      { value: "Jadwal", label: "Jadwal" },
      { value: "Alur", label: "Alur Pendaftaran" },
      { value: "FAQ", label: "FAQ" },
    ],
  },
  { key: "title", label: "Judul / Title", type: "text", placeholder: "Judul item" },
  { key: "content", label: "Konten / Content", type: "textarea", placeholder: "Isi konten..." },
  { key: "order", label: "Urutan / Order", type: "number", placeholder: "Urutan tampil" },
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
    key: "section",
    label: "Bagian",
    options: [
      { value: "Persyaratan", label: "Persyaratan" },
      { value: "Biaya", label: "Biaya" },
      { value: "Jadwal", label: "Jadwal" },
      { value: "Alur", label: "Alur" },
      { value: "FAQ", label: "FAQ" },
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

const ManageRegistrationInfo = () => {
  return (
    <CrudPage<RegistrationInfoItem>
      title="Info Pendaftaran / Registration Info"
      subtitle="Kelola konten informasi pendaftaran yang ditampilkan di halaman pendaftaran website."
      columns={columns}
      formFields={formFields}
      initialData={initialData}
      filters={filters}
      searchKeys={["title", "content", "section"]}
      searchPlaceholder="Cari info pendaftaran..."
      idKey="id"
      addLabel="Tambah Info"
    />
  );
};

export default ManageRegistrationInfo;
