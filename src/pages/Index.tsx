import { motion, useInView } from "framer-motion";
import { allNewsItems } from "./News";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  GraduationCap,
  Users,
  Building2,
  BedDouble,
  ChevronRight,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  Heart,
  Utensils,
  Dumbbell,
  Library,
  X,
  ChevronLeft,
  ArrowRight,
  Quote,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { programsData, programCategories } from "@/data/programsData";
import { getIconComponent } from "@/lib/iconMap";


import heroPesantren from "@/assets/hero-pesantren.jpg";
import galleryClassroom from "@/assets/gallery-classroom.jpg";
import galleryMosque from "@/assets/gallery-mosque.jpg";
import galleryDormitory from "@/assets/gallery-dormitory.jpg";
import gallerySports from "@/assets/gallery-sports.jpg";
import galleryQuran from "@/assets/gallery-quran.jpg";

const heroSlides = [
  {
    image: heroPesantren,
    badge: "Pendaftaran Santri Baru 2026/2027 Dibuka",
    title: <>Mencetak Generasi <span className="text-accent">Qur'ani</span>, Berilmu &amp; Berkarakter</>,
    desc: "Pesantren Al-Hikmah memadukan pendidikan agama Islam dan ilmu pengetahuan modern dalam lingkungan asrama yang kondusif sejak 1985.",
  },
  {
    image: galleryMosque,
    badge: "Program Unggulan Tahfidz Al-Qur'an",
    title: <>Hafal Al-Qur'an <span className="text-accent">30 Juz</span> dengan Metode Mutqin</>,
    desc: "Program tahfidz intensif dengan bimbingan ustadz berpengalaman, menghasilkan ratusan hafidz dan hafidzah setiap tahunnya.",
  },
  {
    image: galleryClassroom,
    badge: "Kurikulum Modern & Diniyah",
    title: <>Pendidikan <span className="text-accent">Berkualitas</span> untuk Masa Depan</>,
    desc: "Kurikulum terintegrasi yang memadukan pendidikan nasional dengan pendidikan pesantren untuk menghasilkan lulusan kompetitif.",
  },
  {
    image: gallerySports,
    badge: "Fasilitas Lengkap & Modern",
    title: <>Lingkungan <span className="text-accent">Terbaik</span> untuk Tumbuh Kembang Santri</>,
    desc: "Asrama modern, lapangan olahraga, laboratorium, dan perpustakaan digital mendukung kehidupan santri yang seimbang.",
  },
];

function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [activeIndex, setActiveIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative overflow-hidden">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {heroSlides.map((slide, i) => (
            <div key={i} className="min-w-0 shrink-0 grow-0 basis-full relative">
              <div className="absolute inset-0">
                <img src={slide.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
              </div>
              <div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-24 md:py-36 lg:py-44">
                <div className="max-w-2xl">
                  <motion.div
                    key={`hero-${i}-${activeIndex}`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: activeIndex === i ? 1 : 0, y: activeIndex === i ? 0 : 24 }}
                    transition={{ duration: 0.7 }}
                  >
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-xs font-medium text-white/90">
                      <Star className="h-3.5 w-3.5 text-accent" />
                      {slide.badge}
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-5 font-display">
                      {slide.title}
                    </h1>
                    <p className="text-base md:text-lg text-white/75 max-w-xl mb-8 leading-relaxed">
                      {slide.desc}
                    </p>
                  </motion.div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/registration">
                      <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg">
                        Daftar Sekarang <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <a href="#about">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white bg-white/5">
                        Kenali Kami
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Dots indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${activeIndex === i ? "w-8 bg-accent" : "w-2 bg-white/40 hover:bg-white/60"}`}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Data ────────────────────────────────────────────
const stats = [
  { value: "1,250+", label: "Santri Aktif", icon: GraduationCap },
  { value: "85+", label: "Tenaga Pengajar", icon: Users },
  { value: "15,000+", label: "Alumni", icon: Award },
  { value: "3", label: "Cabang Pesantren", icon: Building2 },
];

// Programs are now imported from shared data (programsData, programCategories)
const programs = programsData
  .filter((p) => p.status === "Aktif")
  .sort((a, b) => a.order - b.order)
  .map((p) => ({
    iconKey: p.iconKey,
    title: p.title,
    desc: p.description,
    badge: p.badge,
    category: p.category,
    highlights: p.highlights,
  }));

const facilities = [
  { icon: BedDouble, title: "Asrama Modern", desc: "Kamar nyaman ber-AC dengan fasilitas lengkap" },
  { icon: Library, title: "Perpustakaan Digital", desc: "Ribuan koleksi buku fisik & e-book" },
  { icon: Dumbbell, title: "Lapangan Olahraga", desc: "Futsal, basket, badminton, dan panahan" },
  { icon: Utensils, title: "Dapur & Kantin", desc: "Menu bergizi dengan standar kesehatan" },
];

const galleryItems = [
  { src: galleryQuran, title: "Halaqah Tahfidz", category: "Akademik", description: "Para santri menjalani program tahfidz Al-Qur'an dengan bimbingan ustadz berpengalaman." },
  { src: galleryMosque, title: "Masjid Pesantren", category: "Fasilitas", description: "Masjid utama pesantren yang menjadi pusat kegiatan ibadah dan pengajian." },
  { src: galleryClassroom, title: "Kegiatan Belajar", category: "Akademik", description: "Proses pembelajaran di kelas dengan kurikulum terintegrasi." },
  { src: galleryDormitory, title: "Asrama Santri", category: "Fasilitas", description: "Asrama modern yang nyaman dengan fasilitas lengkap." },
  { src: gallerySports, title: "Olahraga & Ekstrakurikuler", category: "Kegiatan", description: "Kegiatan olahraga untuk menjaga keseimbangan jasmani dan rohani." },
  { src: heroPesantren, title: "Kampus Pesantren", category: "Fasilitas", description: "Panorama kampus Pesantren Al-Hikmah yang asri dan hijau." },
];

const newsItems = allNewsItems.slice(0, 3);

const testimonials = [
  {
    name: "H. Ahmad Fauzi, S.Pd.",
    role: "Wali Santri",
    text: "Alhamdulillah, anak saya berkembang pesat di sini. Hafalan Qur'an-nya sudah 15 juz dan nilai akademiknya tetap excellent.",
    avatar: "AF",
  },
  {
    name: "Ustadzah Nur Aisyah, M.A.",
    role: "Alumni & Pengajar",
    text: "Pesantren ini membentuk saya menjadi pribadi yang kuat. Sekarang saya bangga bisa mengabdi kembali sebagai pengajar.",
    avatar: "NA",
  },
  {
    name: "Muhammad Rizki",
    role: "Santri Kelas 12",
    text: "Di sini saya belajar keseimbangan — hafal Qur'an, juara olimpiade sains, dan tetap bisa main futsal setiap sore.",
    avatar: "MR",
  },
];

// ─── Animation variants ────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

// ─── Counter animation hook ────────────────────────────
function AnimatedStat({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="text-3xl font-extrabold text-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}

// ─── Gallery Lightbox ──────────────────────────────────
function GalleryLightbox({
  images,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: typeof galleryItems;
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const img = images[activeIndex];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white z-10">
        <X className="h-6 w-6" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 text-white/70 hover:text-white z-10"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 text-white/70 hover:text-white z-10"
      >
        <ChevronRight className="h-8 w-8" />
      </button>
      <div onClick={(e) => e.stopPropagation()} className="max-w-4xl w-full">
        <img src={img.src} alt={img.title} className="w-full max-h-[80vh] object-contain rounded-lg" />
        <div className="text-center mt-4">
          <p className="text-white font-semibold">{img.title}</p>
          <p className="text-white/60 text-sm">{img.category} · {activeIndex + 1}/{images.length}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Programs Section (Redesigned) ─────────────────────
import { createPortal } from "react-dom";
function ProgramsSection() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedProgram, setSelectedProgram] = useState<typeof programs[0] | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // Lock body scroll when program modal is open
  useEffect(() => {
    if (selectedProgram) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedProgram]);

  const filteredPrograms = activeCategory === "Semua"
    ? programs
    : programs.filter((p) => p.category === activeCategory);

  return (
    <section id="programs" className="py-20 lg:py-28 bg-muted/30 islamic-pattern">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Program Unggulan</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Kurikulum Terintegrasi untuk Masa Depan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Santri kami dibekali dengan ilmu agama yang kuat, penguasaan sains & teknologi, serta keterampilan kepemimpinan.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {programCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card border text-muted-foreground hover:text-foreground hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Program Cards */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {filteredPrograms.map((p) => (
            <motion.div
              key={p.title}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              onClick={() => setSelectedProgram(p)}
              className="group cursor-pointer rounded-2xl border bg-card p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 gradient-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary shadow-md">
                  {(() => { const Icon = getIconComponent(p.iconKey); return <Icon className="h-5 w-5 text-primary-foreground" />; })()}
                </div>
                {p.badge && (
                  <span className="text-[9px] font-bold uppercase tracking-wider gradient-gold text-accent-foreground px-2 py-0.5 rounded-full">
                    {p.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/60 mb-1 block">{p.category}</span>
              <h3 className="font-bold text-foreground mb-2 text-sm group-hover:text-primary transition-colors">{p.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.highlights.map((h) => (
                  <span key={h} className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    {h}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Program Detail Modal */}
        {selectedProgram && createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setSelectedProgram(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl border shadow-xl max-w-lg w-full p-8 relative"
            >
              <button
                onClick={() => setSelectedProgram(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-4 mb-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-primary shadow-md">
                  {(() => { const Icon = getIconComponent(selectedProgram.iconKey); return <Icon className="h-7 w-7 text-primary-foreground" />; })()}
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/60">{selectedProgram.category}</span>
                  <h3 className="text-xl font-bold text-foreground">{selectedProgram.title}</h3>
                </div>
                {selectedProgram.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider gradient-gold text-accent-foreground px-2.5 py-1 rounded-full ml-auto">
                    {selectedProgram.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{selectedProgram.desc}</p>
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Keunggulan Program</h4>
                <div className="grid grid-cols-3 gap-2">
                  {selectedProgram.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 rounded-lg bg-primary/5 p-2.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-xs font-medium text-foreground">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/registration">
                <Button className="w-full gap-2">
                  Daftar Program Ini <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>,
          document.body
        )}
      </div>
    </section>
  );
}

// ─── Main Page ─────────────────────────────────────────
const Index = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  return (
    <div className="bg-background">
      {/* ─── Hero Carousel ─── */}
      <HeroCarousel />

      {/* ─── Stats Bar ─── */}
      <section className="relative -mt-12 z-10">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="rounded-2xl border bg-card shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <AnimatedStat key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── About / Visi Misi ─── */}
      <section id="about" className="py-20 lg:py-28 islamic-pattern-star">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <img
                  src={galleryMosque}
                  alt="Masjid Pesantren"
                  className="rounded-2xl shadow-xl w-full aspect-[4/3] object-cover"
                />
                <div className="absolute -bottom-6 -right-6 rounded-xl gradient-gold p-5 shadow-lg hidden md:block">
                  <div className="text-2xl font-extrabold text-accent-foreground">40+</div>
                  <div className="text-xs font-medium text-accent-foreground/80">Tahun Berdiri</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Tentang Kami</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-5 leading-tight">
                Membangun Peradaban dari{" "}
                <span className="text-primary">Pondok Pesantren</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Didirikan pada tahun 1985, Pesantren Al-Hikmah telah mencetak ribuan alumni yang berkontribusi di berbagai bidang. Kami mengedepankan keseimbangan antara ilmu agama dan ilmu pengetahuan umum, dengan pendekatan modern tanpa meninggalkan tradisi pesantren.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Visi</h4>
                    <p className="text-sm text-muted-foreground">Menjadi pesantren modern terdepan yang mencetak generasi berilmu, beramal, dan berakhlak mulia.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/15">
                    <Heart className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Misi</h4>
                    <p className="text-sm text-muted-foreground">Menyelenggarakan pendidikan integral yang memadukan kurikulum nasional, keagamaan, dan keterampilan hidup.</p>
                  </div>
                </div>
              </div>
              <a href="#programs">
                <Button variant="outline" className="gap-2">
                  Lihat Program Kami <ChevronRight className="h-4 w-4" />
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Programs ─── */}
      <ProgramsSection />

      {/* ─── Facilities ─── */}
      <section className="py-20 lg:py-28 islamic-pattern-arabesque">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Fasilitas</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-5 leading-tight">
                Lingkungan Belajar yang Nyaman & Modern
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Kami menyediakan fasilitas terbaik untuk menunjang proses belajar mengajar dan kehidupan santri di asrama.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {facilities.map((f) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-xl border bg-card p-4 shadow-card"
                  >
                    <f.icon className="h-5 w-5 text-primary mb-2" />
                    <h4 className="text-sm font-semibold text-foreground mb-0.5">{f.title}</h4>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img src={galleryDormitory} alt="Asrama" className="rounded-2xl shadow-lg w-full aspect-square object-cover" />
              <img src={gallerySports} alt="Olahraga" className="rounded-2xl shadow-lg w-full aspect-square object-cover mt-8" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Gallery ─── */}
      <section id="gallery" className="py-20 lg:py-28 bg-muted/30 islamic-pattern-star">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Galeri</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Momen & Kegiatan Pesantren
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Lihat suasana kehidupan di pesantren kami melalui galeri foto kegiatan santri.
            </p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6"
          >
            {galleryItems.map((item, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[4/3] border shadow-card"
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 z-10">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">{item.category}</span>
                  <p className="text-white font-semibold text-sm lg:text-base">{item.title}</p>
                  <p className="text-white/60 text-xs mt-1 line-clamp-2 hidden md:block">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-10">
            <Link to="/gallery">
              <Button variant="outline" className="gap-2">
                Lihat Semua Galeri <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          images={galleryItems}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((lightboxIndex - 1 + galleryItems.length) % galleryItems.length)}
          onNext={() => setLightboxIndex((lightboxIndex + 1) % galleryItems.length)}
        />
      )}

      {/* ─── News ─── */}
      <section id="news" className="py-20 lg:py-28 islamic-pattern">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Berita & Pengumuman</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                Kabar Terbaru
              </h2>
            </div>
            <Link to="/news" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {newsItems.map((news, i) => (
              <Link key={news.id} to={`/news/${news.id}`}>
                <motion.article
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="group rounded-2xl border bg-card overflow-hidden shadow-card hover:shadow-card-hover transition-all h-full"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {news.category}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {news.date}
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{news.excerpt}</p>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link to="/news" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              Lihat Semua Berita <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20 lg:py-28 bg-muted/30 islamic-pattern-arabesque">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Testimoni</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Apa Kata Mereka
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-2xl border bg-card p-7 shadow-card"
              >
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary-foreground">{t.avatar}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="rounded-3xl gradient-primary p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4 font-display">
                Daftarkan Putra-Putri Anda Sekarang
              </h2>
              <p className="text-primary-foreground/75 max-w-xl mx-auto mb-8">
                Gelombang pendaftaran santri baru tahun ajaran 2026/2027 sedang dibuka.
                Kuota terbatas, segera amankan tempat untuk anak Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/registration">
                  <Button size="lg" className="w-full sm:w-auto gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
                    Daftar Online <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="#contact">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground bg-transparent">
                    Hubungi Kami
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Contact ─── */}
      <section id="contact" className="py-20 lg:py-28 bg-muted/30 islamic-pattern">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Kontak</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-5">
                Hubungi Kami
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Silakan hubungi kami untuk informasi pendaftaran, kunjungan, atau pertanyaan lainnya.
              </p>
              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Alamat</h4>
                    <p className="text-sm text-muted-foreground">Jl. Pondok Pesantren No. 123, Kec. Cikarang, Kabupaten Bekasi, Jawa Barat 17530</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Telepon & WhatsApp</h4>
                    <p className="text-sm text-muted-foreground">(021) 8888-1234 · +62 812-3456-7890</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Email</h4>
                    <p className="text-sm text-muted-foreground">info@alhikmah.sch.id</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Jam Operasional</h4>
                    <p className="text-sm text-muted-foreground">Senin–Sabtu: 07.00–16.00 WIB</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-card">
              <h3 className="font-bold text-foreground mb-5">Kirim Pesan</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nama Lengkap</label>
                    <input type="text" placeholder="Masukkan nama" className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">No. Telepon</label>
                    <input type="tel" placeholder="08xx-xxxx-xxxx" className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                  <input type="email" placeholder="email@example.com" className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Pesan</label>
                  <textarea rows={4} placeholder="Tulis pesan Anda..." className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>
                <Button type="submit" className="w-full">
                  Kirim Pesan
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
