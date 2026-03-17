import { CrudPage, CrudColumn, CrudFormField, CrudFilter } from "@/components/CrudPage";

interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaLabel: string;
  ctaLink: string;
  order: number;
  status: string;
  createdAt: string;
}

const initialData: HeroSlide[] = [
  {
    id: "H001",
    badge: "Pendaftaran Santri Baru 2026/2027 Dibuka",
    title: "Mencetak Generasi Qur'ani, Berilmu & Berkarakter",
    description: "Pesantren Al-Hikmah memadukan pendidikan agama Islam dan ilmu pengetahuan modern dalam lingkungan asrama yang kondusif sejak 1985.",
    imageUrl: "/assets/hero-pesantren.jpg",
    ctaLabel: "Daftar Sekarang",
    ctaLink: "/registration/form",
    order: 1,
    status: "Aktif",
    createdAt: "2026-01-01",
  },
  {
    id: "H002",
    badge: "Program Unggulan Tahfidz Al-Qur'an",
    title: "Hafal Al-Qur'an 30 Juz dengan Metode Mutqin",
    description: "Program tahfidz intensif dengan bimbingan ustadz berpengalaman, menghasilkan ratusan hafidz dan hafidzah setiap tahunnya.",
    imageUrl: "/assets/gallery-mosque.jpg",
    ctaLabel: "Daftar Sekarang",
    ctaLink: "/registration/form",
    order: 2,
    status: "Aktif",
    createdAt: "2026-01-01",
  },
  {
    id: "H003",
    badge: "Kurikulum Modern & Diniyah",
    title: "Pendidikan Berkualitas untuk Masa Depan",
    description: "Kurikulum terintegrasi yang memadukan pendidikan nasional dengan pendidikan pesantren untuk menghasilkan lulusan kompetitif.",
    imageUrl: "/assets/gallery-classroom.jpg",
    ctaLabel: "Kenali Kami",
    ctaLink: "/#about",
    order: 3,
    status: "Aktif",
    createdAt: "2026-01-05",
  },
  {
    id: "H004",
    badge: "Fasilitas Lengkap & Modern",
    title: "Lingkungan Terbaik untuk Tumbuh Kembang Santri",
    description: "Asrama modern, lapangan olahraga, laboratorium, dan perpustakaan digital mendukung kehidupan santri yang seimbang.",
    imageUrl: "/assets/gallery-sports.jpg",
    ctaLabel: "Lihat Galeri",
    ctaLink: "/gallery",
    order: 4,
    status: "Aktif",
    createdAt: "2026-01-05",
  },
];

const columns: CrudColumn<HeroSlide>[] = [
  { key: "id", label: "ID", className: "w-16" },
  {
    key: "imageUrl",
    label: "Gambar",
    className: "w-24",
    render: (val) =>
      val ? (
        <img src={val} alt="" className="h-12 w-20 rounded-md object-cover border" />
      ) : (
        <span className="text-xs text-muted-foreground">-</span>
      ),
  },
  {
    key: "badge",
    label: "Badge / Tag",
    className: "max-w-[180px]",
    render: (val) => (
      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full line-clamp-1">
        {val}
      </span>
    ),
  },
  {
    key: "title",
    label: "Judul / Title",
    className: "max-w-[200px]",
    render: (val) => <span className="font-medium line-clamp-2 text-sm">{val}</span>,
  },
  {
    key: "ctaLabel",
    label: "CTA",
    render: (val) => <span className="text-xs text-muted-foreground">{val}</span>,
  },
  { key: "order", label: "Urutan", className: "w-16 text-center" },
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
  { key: "createdAt", label: "Tanggal" },
];

const formFields: CrudFormField[] = [
  { key: "badge", label: "Badge / Tag", type: "text", placeholder: "Contoh: Pendaftaran Dibuka!" },
  { key: "title", label: "Judul / Title", type: "text", placeholder: "Judul utama hero slide" },
  { key: "description", label: "Deskripsi / Description", type: "textarea", placeholder: "Deskripsi singkat di bawah judul..." },
  { key: "imageUrl", label: "Gambar Background / Image", type: "image" },
  { key: "ctaLabel", label: "Label Tombol CTA", type: "text", placeholder: "Contoh: Daftar Sekarang" },
  { key: "ctaLink", label: "Link Tombol CTA", type: "text", placeholder: "/registration/form" },
  { key: "order", label: "Urutan / Order", type: "number", placeholder: "1, 2, 3..." },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "Aktif", label: "Aktif / Active" },
      { value: "Nonaktif", label: "Nonaktif / Inactive" },
    ],
  },
];

const filters: CrudFilter[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "Aktif", label: "Aktif" },
      { value: "Nonaktif", label: "Nonaktif" },
    ],
  },
];

export default function ManageHero() {
  return (
    <CrudPage<HeroSlide>
      title="Hero Carousel / Hero Slides"
      subtitle="Kelola konten hero carousel yang ditampilkan di halaman depan website."
      columns={columns}
      formFields={formFields}
      initialData={initialData}
      filters={filters}
      searchKeys={["badge", "title", "description"]}
      searchPlaceholder="Cari hero slide..."
      idKey="id"
      addLabel="Tambah Slide"
    />
  );
}
