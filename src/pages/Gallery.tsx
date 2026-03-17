import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";


import galleryClassroom from "@/assets/gallery-classroom.jpg";
import galleryMosque from "@/assets/gallery-mosque.jpg";
import galleryDormitory from "@/assets/gallery-dormitory.jpg";
import gallerySports from "@/assets/gallery-sports.jpg";
import galleryQuran from "@/assets/gallery-quran.jpg";
import heroPesantren from "@/assets/hero-pesantren.jpg";

const categories = ["Semua", "Akademik", "Fasilitas", "Kegiatan"];

const galleryItems = [
  { src: galleryQuran, title: "Halaqah Tahfidz", category: "Akademik", description: "Para santri menjalani program tahfidz Al-Qur'an dengan bimbingan ustadz berpengalaman. Program ini menggunakan metode mutqin yang telah terbukti efektif untuk membantu santri menghafal 30 juz." },
  { src: galleryMosque, title: "Masjid Pesantren", category: "Fasilitas", description: "Masjid utama pesantren yang menjadi pusat kegiatan ibadah dan pengajian. Dilengkapi dengan sound system modern dan dapat menampung hingga 2.000 jamaah." },
  { src: galleryClassroom, title: "Kegiatan Belajar Mengajar", category: "Akademik", description: "Proses pembelajaran di kelas dengan kurikulum terintegrasi antara kurikulum nasional dan kurikulum pesantren. Ruang kelas dilengkapi dengan proyektor dan AC." },
  { src: galleryDormitory, title: "Asrama Santri", category: "Fasilitas", description: "Asrama modern yang nyaman dengan fasilitas lengkap. Setiap kamar dilengkapi dengan tempat tidur bertingkat, lemari pribadi, dan area belajar bersama." },
  { src: gallerySports, title: "Olahraga & Ekstrakurikuler", category: "Kegiatan", description: "Kegiatan olahraga dan ekstrakurikuler untuk menjaga keseimbangan jasmani dan rohani santri. Tersedia lapangan futsal, basket, badminton, dan area panahan." },
  { src: heroPesantren, title: "Kampus Pesantren", category: "Fasilitas", description: "Panorama kampus Pesantren Al-Hikmah yang asri dan hijau. Berlokasi strategis di Bekasi dengan luas area mencapai 5 hektar." },
  { src: galleryClassroom, title: "Laboratorium Komputer", category: "Fasilitas", description: "Lab komputer modern untuk mendukung program keterampilan digital santri. Dilengkapi dengan 40 unit komputer terbaru dan koneksi internet berkecepatan tinggi." },
  { src: galleryQuran, title: "Wisuda Tahfidz", category: "Kegiatan", description: "Acara wisuda tahfidz tahunan sebagai bentuk apresiasi terhadap santri yang telah berhasil menyelesaikan hafalan Al-Qur'an 30 juz." },
  { src: gallerySports, title: "Perlombaan Antar-Asrama", category: "Kegiatan", description: "Kompetisi olahraga dan seni antar-asrama yang diadakan setiap semester untuk mempererat ukhuwah dan sportivitas santri." },
  { src: galleryMosque, title: "Shalat Berjamaah", category: "Kegiatan", description: "Kegiatan shalat berjamaah lima waktu yang wajib diikuti seluruh santri sebagai bagian dari pembentukan karakter Islami." },
  { src: galleryDormitory, title: "Ruang Belajar Asrama", category: "Fasilitas", description: "Area belajar bersama di setiap lantai asrama yang nyaman untuk aktivitas belajar mandiri dan kelompok." },
  { src: heroPesantren, title: "Taman Pesantren", category: "Fasilitas", description: "Area taman hijau yang asri untuk santri beristirahat dan berdiskusi di waktu luang." },
];

const ITEMS_PER_PAGE = 6;

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = activeCategory === "Semua"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <PublicNavbar />

      {/* Hero with mosque door pattern */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-muted/30 islamic-pattern-door">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Galeri Foto</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
              Momen & Kegiatan Pesantren
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Jelajahi galeri foto kehidupan santri, fasilitas, dan berbagai kegiatan di Pesantren Al-Hikmah.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 my-10">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(cat)}
              className="rounded-full"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 pb-10">
        <motion.div
          key={`${activeCategory}-${currentPage}`}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6"
        >
          {paginatedItems.map((item, i) => (
            <motion.div
              key={`${item.title}-${i}`}
              variants={staggerItem}
              className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[4/3] border shadow-card"
              onClick={() => setLightboxIndex((currentPage - 1) * ITEMS_PER_PAGE + i)}
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 lg:p-6">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">{item.category}</span>
                  <p className="text-white font-semibold text-sm lg:text-base">{item.title}</p>
                  <p className="text-white/60 text-xs mt-1 line-clamp-2 hidden md:block">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mx-auto max-w-7xl px-4 lg:px-8 pb-20">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-9 h-9 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} dari {filtered.length} foto
          </p>
        </div>
      )}

      {/* Lightbox with detail */}
      {lightboxIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button onClick={() => setLightboxIndex(null)} className="absolute top-4 right-4 text-white/70 hover:text-white z-10">
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length); }}
            className="absolute left-4 text-white/70 hover:text-white z-10"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % filtered.length); }}
            className="absolute right-4 text-white/70 hover:text-white z-10"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <div onClick={(e) => e.stopPropagation()} className="max-w-5xl w-full flex flex-col lg:flex-row gap-6 items-center">
            <img src={filtered[lightboxIndex].src} alt={filtered[lightboxIndex].title} className="w-full lg:w-2/3 max-h-[70vh] object-contain rounded-lg" />
            <div className="lg:w-1/3 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent">{filtered[lightboxIndex].category}</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">{filtered[lightboxIndex].title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{filtered[lightboxIndex].description}</p>
              <p className="text-white/40 text-xs mt-4">{lightboxIndex + 1} / {filtered.length}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
