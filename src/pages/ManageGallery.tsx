import { CrudPage, CrudColumn, CrudFormField, DetailField } from "@/components/CrudPage";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  status: string;
  createdAt: string;
}

const initialData: GalleryItem[] = [
  { id: "G001", title: "Halaqah Tahfidz", category: "Akademik", description: "Para santri menjalani program tahfidz Al-Qur'an dengan bimbingan ustadz berpengalaman.", imageUrl: "/assets/gallery-quran.jpg", status: "Aktif", createdAt: "2026-03-01" },
  { id: "G002", title: "Masjid Pesantren", category: "Fasilitas", description: "Masjid utama pesantren yang menjadi pusat kegiatan ibadah dan pengajian.", imageUrl: "/assets/gallery-mosque.jpg", status: "Aktif", createdAt: "2026-03-01" },
  { id: "G003", title: "Kegiatan Belajar Mengajar", category: "Akademik", description: "Proses pembelajaran di kelas dengan kurikulum terintegrasi.", imageUrl: "/assets/gallery-classroom.jpg", status: "Aktif", createdAt: "2026-02-28" },
  { id: "G004", title: "Asrama Santri", category: "Fasilitas", description: "Asrama modern yang nyaman dengan fasilitas lengkap.", imageUrl: "/assets/gallery-dormitory.jpg", status: "Aktif", createdAt: "2026-02-28" },
  { id: "G005", title: "Olahraga & Ekstrakurikuler", category: "Kegiatan", description: "Kegiatan olahraga untuk menjaga keseimbangan jasmani dan rohani.", imageUrl: "/assets/gallery-sports.jpg", status: "Aktif", createdAt: "2026-02-25" },
  { id: "G006", title: "Kampus Pesantren", category: "Fasilitas", description: "Panorama kampus Pesantren Al-Hikmah yang asri dan hijau.", imageUrl: "/assets/hero-pesantren.jpg", status: "Nonaktif", createdAt: "2026-02-20" },
  { id: "G007", title: "Laboratorium Komputer", category: "Fasilitas", description: "Lab komputer modern untuk mendukung program keterampilan digital santri.", imageUrl: "/assets/gallery-classroom.jpg", status: "Aktif", createdAt: "2026-02-18" },
  { id: "G008", title: "Wisuda Tahfidz", category: "Kegiatan", description: "Acara wisuda tahfidz tahunan untuk santri yang menyelesaikan hafalan 30 juz.", imageUrl: "/assets/gallery-quran.jpg", status: "Aktif", createdAt: "2026-02-15" },
  { id: "G009", title: "Perpustakaan Pesantren", category: "Fasilitas", description: "Perpustakaan lengkap dengan koleksi kitab kuning dan buku modern.", imageUrl: "/assets/gallery-classroom.jpg", status: "Aktif", createdAt: "2026-02-12" },
  { id: "G010", title: "Lomba Pidato", category: "Kegiatan", description: "Lomba pidato 3 bahasa dalam peringatan hari santri nasional.", imageUrl: "/assets/gallery-sports.jpg", status: "Aktif", createdAt: "2026-02-10" },
  { id: "G011", title: "Kantin Santri", category: "Fasilitas", description: "Kantin bersih dan higienis menyediakan makanan bergizi untuk santri.", imageUrl: "/assets/gallery-dormitory.jpg", status: "Aktif", createdAt: "2026-02-08" },
  { id: "G012", title: "Kelas Kaligrafi", category: "Akademik", description: "Pelatihan seni kaligrafi Arab untuk mengasah kreativitas santri.", imageUrl: "/assets/gallery-quran.jpg", status: "Nonaktif", createdAt: "2026-02-05" },
];

const columns: CrudColumn<GalleryItem>[] = [
  { key: "id", label: "ID", className: "w-20" },
  {
    key: "imageUrl",
    label: "Gambar",
    className: "w-20",
    render: (val) =>
      val ? (
        <img src={val} alt="" className="h-10 w-16 rounded object-cover border" />
      ) : (
        <span className="text-xs text-muted-foreground">-</span>
      ),
  },
  { key: "title", label: "Judul / Title" },
  { key: "category", label: "Kategori / Category",
    render: (val) => (
      <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">{val}</span>
    ),
  },
  { key: "description", label: "Deskripsi / Description", className: "max-w-[200px]",
    render: (val) => <span className="line-clamp-2 text-xs text-muted-foreground">{val}</span>,
  },
  { key: "status", label: "Status",
    render: (val) => (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${val === "Aktif" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
        {val}
      </span>
    ),
  },
  { key: "createdAt", label: "Tanggal / Date" },
];

const formFields: CrudFormField[] = [
  { key: "title", label: "Judul / Title", type: "text", placeholder: "Masukkan judul foto" },
  { key: "category", label: "Kategori / Category", type: "select", options: [
    { value: "Akademik", label: "Akademik" },
    { value: "Fasilitas", label: "Fasilitas" },
    { value: "Kegiatan", label: "Kegiatan" },
  ]},
  { key: "imageUrl", label: "Gambar / Image", type: "image" },
  { key: "description", label: "Deskripsi / Description", type: "textarea", placeholder: "Deskripsi foto..." },
  { key: "status", label: "Status", type: "select", options: [
    { value: "Aktif", label: "Aktif / Active" },
    { value: "Nonaktif", label: "Nonaktif / Inactive" },
  ]},
];

export default function ManageGallery() {
  return (
    <CrudPage<GalleryItem>
      title="Kelola Galeri / Manage Gallery"
      subtitle="Kelola foto dan media yang ditampilkan di halaman galeri website."
      columns={columns}
      initialData={initialData}
      formFields={formFields}
      searchPlaceholder="Cari foto... / Search photos..."
      searchKeys={["title", "category", "description"]}
      idKey="id"
      addLabel="Tambah Foto / Add Photo"
      filters={[
        { key: "category", label: "Kategori", options: [{ value: "Akademik", label: "Akademik" }, { value: "Fasilitas", label: "Fasilitas" }, { value: "Kegiatan", label: "Kegiatan" }] },
        { key: "status", label: "Status", options: [{ value: "Aktif", label: "Aktif" }, { value: "Nonaktif", label: "Nonaktif" }] },
      ]}
    />
  );
}
