import { CrudPage, CrudColumn, CrudFormField, DetailField } from "@/components/CrudPage";

interface NewsItem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  imageUrl: string;
  content: string;
  date: string;
  author: string;
  readTime: string;
  status: string;
}

const initialData: NewsItem[] = [
  { id: "N001", title: "Pesantren Raih Juara Umum MTQ Nasional 2026", category: "Prestasi", excerpt: "Delegasi santri berhasil meraih 5 medali emas dan 3 perak pada ajang MTQ nasional.", imageUrl: "/assets/gallery-quran.jpg", content: "", date: "2026-03-05", author: "Admin", readTime: "3 menit", status: "Terbit" },
  { id: "N002", title: "Pendaftaran Santri Baru Tahun Ajaran 2026/2027 Dibuka", category: "Pengumuman", excerpt: "Gelombang pertama pendaftaran santri baru resmi dibuka mulai 10 Maret hingga 30 April 2026.", imageUrl: "/assets/hero-pesantren.jpg", content: "", date: "2026-03-01", author: "Admin", readTime: "4 menit", status: "Terbit" },
  { id: "N003", title: "Workshop Keterampilan Digital untuk Santri", category: "Kegiatan", excerpt: "Pesantren menggelar workshop coding dan desain grafis bekerja sama dengan komunitas teknologi lokal.", imageUrl: "/assets/gallery-classroom.jpg", content: "", date: "2026-02-25", author: "Admin", readTime: "3 menit", status: "Terbit" },
  { id: "N004", title: "Menteri Agama Kunjungi Pesantren Al-Hikmah", category: "Berita", excerpt: "Kunjungan kerja Menteri Agama RI dalam rangka meninjau program pendidikan pesantren modern.", imageUrl: "/assets/gallery-mosque.jpg", content: "", date: "2026-02-20", author: "Admin", readTime: "5 menit", status: "Terbit" },
  { id: "N005", title: "Santri Raih Medali Olimpiade Sains Nasional", category: "Prestasi", excerpt: "Dua santri berhasil meraih medali perunggu di OSN bidang Fisika dan Biologi.", imageUrl: "/assets/gallery-sports.jpg", content: "", date: "2026-02-15", author: "Admin", readTime: "3 menit", status: "Terbit" },
  { id: "N006", title: "Peresmian Gedung Asrama Baru Putri", category: "Pengumuman", excerpt: "Pesantren meresmikan gedung asrama baru putri dengan kapasitas 200 santri.", imageUrl: "/assets/gallery-dormitory.jpg", content: "", date: "2026-02-10", author: "Admin", readTime: "4 menit", status: "Terbit" },
  { id: "N007", title: "Bakti Sosial di Desa Tertinggal", category: "Kegiatan", excerpt: "Ratusan santri mengikuti program bakti sosial dan mengajar di desa-desa tertinggal.", imageUrl: "/assets/gallery-sports.jpg", content: "", date: "2026-02-05", author: "Admin", readTime: "3 menit", status: "Draft" },
  { id: "N008", title: "Wisuda 50 Hafidz dan Hafidzah Baru", category: "Prestasi", excerpt: "Pesantren menggelar wisuda tahfidz untuk 50 santri yang berhasil menghafal 30 juz.", imageUrl: "/assets/gallery-quran.jpg", content: "", date: "2026-02-01", author: "Admin", readTime: "3 menit", status: "Terbit" },
  { id: "N009", title: "Pelatihan Kepemimpinan Santri Senior", category: "Kegiatan", excerpt: "Program leadership camp untuk santri kelas XII sebagai bekal di masyarakat.", imageUrl: "/assets/gallery-classroom.jpg", content: "", date: "2026-01-28", author: "Admin", readTime: "4 menit", status: "Terbit" },
  { id: "N010", title: "Kerjasama dengan Universitas Al-Azhar", category: "Berita", excerpt: "Penandatanganan MoU dengan Universitas Al-Azhar Kairo untuk program beasiswa.", imageUrl: "/assets/gallery-mosque.jpg", content: "", date: "2026-01-25", author: "Admin", readTime: "5 menit", status: "Terbit" },
  { id: "N011", title: "Jadwal Ujian Semester Genap 2025/2026", category: "Pengumuman", excerpt: "Informasi jadwal ujian akhir semester genap tahun ajaran 2025/2026.", imageUrl: "/assets/hero-pesantren.jpg", content: "", date: "2026-01-20", author: "Staff", readTime: "2 menit", status: "Draft" },
  { id: "N012", title: "Festival Seni Islami Antar Pesantren", category: "Kegiatan", excerpt: "Pesantren menjadi tuan rumah festival seni islami se-Jawa Barat.", imageUrl: "/assets/gallery-dormitory.jpg", content: "", date: "2026-01-15", author: "Admin", readTime: "4 menit", status: "Terbit" },
];

const columns: CrudColumn<NewsItem>[] = [
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
  { key: "imageUrl", label: "Gambar Utama / Featured Image", type: "image" },
  { key: "excerpt", label: "Ringkasan / Excerpt", type: "textarea", placeholder: "Ringkasan singkat berita..." },
  { key: "content", label: "Konten / Content", type: "textarea", placeholder: "Isi berita lengkap..." },
  { key: "author", label: "Penulis / Author", type: "text", placeholder: "Nama penulis" },
  { key: "readTime", label: "Waktu Baca / Read Time", type: "text", placeholder: "3 menit" },
  { key: "date", label: "Tanggal / Date", type: "date" },
  { key: "status", label: "Status", type: "select", options: [
    { value: "Terbit", label: "Terbit / Published" },
    { value: "Draft", label: "Draft" },
  ]},
];

const detailFields: DetailField<NewsItem>[] = [
  { key: "imageUrl", label: "Gambar Utama / Featured Image", type: "image", fullWidth: true },
  { key: "id", label: "ID" },
  { key: "title", label: "Judul / Title" },
  { key: "category", label: "Kategori / Category", type: "badge" },
  { key: "status", label: "Status", render: (val) => (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${val === "Terbit" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{val}</span>
  )},
  { key: "author", label: "Penulis / Author" },
  { key: "date", label: "Tanggal / Date" },
  { key: "readTime", label: "Waktu Baca / Read Time" },
  { key: "excerpt", label: "Ringkasan / Excerpt", type: "long-text", fullWidth: true },
  { key: "content", label: "Konten / Content", type: "long-text", fullWidth: true },
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
      detailFields={detailFields}
      filters={[
        { key: "category", label: "Kategori", options: [{ value: "Prestasi", label: "Prestasi" }, { value: "Pengumuman", label: "Pengumuman" }, { value: "Kegiatan", label: "Kegiatan" }, { value: "Berita", label: "Berita" }] },
        { key: "status", label: "Status", options: [{ value: "Terbit", label: "Terbit" }, { value: "Draft", label: "Draft" }] },
      ]}
    />
  );
}
