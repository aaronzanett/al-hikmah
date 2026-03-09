import { CrudPage, CrudColumn, CrudFormField } from "@/components/CrudPage";

interface NewsItem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  author: string;
  status: string;
}

const initialData: NewsItem[] = [
  { id: "N001", title: "Pesantren Raih Juara Umum MTQ Nasional 2026", category: "Prestasi", excerpt: "Delegasi santri berhasil meraih 5 medali emas dan 3 perak pada ajang MTQ nasional.", date: "2026-03-05", author: "Admin", status: "Terbit" },
  { id: "N002", title: "Pendaftaran Santri Baru Tahun Ajaran 2026/2027 Dibuka", category: "Pengumuman", excerpt: "Gelombang pertama pendaftaran santri baru resmi dibuka mulai 10 Maret hingga 30 April 2026.", date: "2026-03-01", author: "Admin", status: "Terbit" },
  { id: "N003", title: "Workshop Keterampilan Digital untuk Santri", category: "Kegiatan", excerpt: "Pesantren menggelar workshop coding dan desain grafis bekerja sama dengan komunitas teknologi lokal.", date: "2026-02-25", author: "Admin", status: "Terbit" },
  { id: "N004", title: "Menteri Agama Kunjungi Pesantren Al-Hikmah", category: "Berita", excerpt: "Kunjungan kerja Menteri Agama RI dalam rangka meninjau program pendidikan pesantren modern.", date: "2026-02-20", author: "Admin", status: "Terbit" },
  { id: "N005", title: "Santri Raih Medali Olimpiade Sains Nasional", category: "Prestasi", excerpt: "Dua santri berhasil meraih medali perunggu di OSN bidang Fisika dan Biologi.", date: "2026-02-15", author: "Admin", status: "Terbit" },
  { id: "N006", title: "Peresmian Gedung Asrama Baru Putri", category: "Pengumuman", excerpt: "Pesantren meresmikan gedung asrama baru putri dengan kapasitas 200 santri.", date: "2026-02-10", author: "Admin", status: "Terbit" },
  { id: "N007", title: "Bakti Sosial di Desa Tertinggal", category: "Kegiatan", excerpt: "Ratusan santri mengikuti program bakti sosial dan mengajar di desa-desa tertinggal.", date: "2026-02-05", author: "Admin", status: "Draft" },
  { id: "N008", title: "Wisuda 50 Hafidz dan Hafidzah Baru", category: "Prestasi", excerpt: "Pesantren menggelar wisuda tahfidz untuk 50 santri yang berhasil menghafal 30 juz.", date: "2026-02-01", author: "Admin", status: "Terbit" },
];

const columns: CrudColumn<NewsItem>[] = [
  { key: "id", label: "ID", className: "w-20" },
  { key: "title", label: "Judul / Title", className: "max-w-[250px]",
    render: (val) => <span className="font-medium line-clamp-1">{val}</span>,
  },
  { key: "category", label: "Kategori / Category",
    render: (val) => (
      <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">{val}</span>
    ),
  },
  { key: "author", label: "Penulis / Author" },
  { key: "date", label: "Tanggal / Date" },
  { key: "status", label: "Status",
    render: (val) => (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${val === "Terbit" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
        {val}
      </span>
    ),
  },
];

const formFields: CrudFormField[] = [
  { key: "title", label: "Judul / Title", type: "text", placeholder: "Masukkan judul berita" },
  { key: "category", label: "Kategori / Category", type: "select", options: [
    { value: "Prestasi", label: "Prestasi / Achievement" },
    { value: "Pengumuman", label: "Pengumuman / Announcement" },
    { value: "Kegiatan", label: "Kegiatan / Activity" },
    { value: "Berita", label: "Berita / News" },
  ]},
  { key: "excerpt", label: "Ringkasan / Excerpt", type: "textarea", placeholder: "Ringkasan singkat berita..." },
  { key: "author", label: "Penulis / Author", type: "text", placeholder: "Nama penulis" },
  { key: "date", label: "Tanggal / Date", type: "date" },
  { key: "status", label: "Status", type: "select", options: [
    { value: "Terbit", label: "Terbit / Published" },
    { value: "Draft", label: "Draft" },
  ]},
];

export default function ManageNews() {
  return (
    <CrudPage<NewsItem>
      title="Kelola Berita / Manage News"
      subtitle="Kelola berita dan pengumuman yang ditampilkan di website."
      columns={columns}
      initialData={initialData}
      formFields={formFields}
      searchPlaceholder="Cari berita... / Search news..."
      searchKeys={["title", "category", "author"]}
      idKey="id"
      addLabel="Tambah Berita / Add News"
    />
  );
}
