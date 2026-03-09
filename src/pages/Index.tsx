import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import {
  GraduationCap,
  Users,
  ShieldCheck,
  BookOpen,
  Building2,
  Wallet,
  BedDouble,
  BarChart3,
  ChevronRight,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  Heart,
  Globe,
  Utensils,
  Dumbbell,
  Library,
  X,
  ChevronLeft,
  Calendar,
  ArrowRight,
  Quote,
  Menu,
  XIcon,
} from "lucide-react";

import heroPesantren from "@/assets/hero-pesantren.jpg";
import galleryClassroom from "@/assets/gallery-classroom.jpg";
import galleryMosque from "@/assets/gallery-mosque.jpg";
import galleryDormitory from "@/assets/gallery-dormitory.jpg";
import gallerySports from "@/assets/gallery-sports.jpg";
import galleryQuran from "@/assets/gallery-quran.jpg";

// ─── Data ────────────────────────────────────────────
const stats = [
  { value: "1,250+", label: "Santri Aktif", icon: GraduationCap },
  { value: "85+", label: "Tenaga Pengajar", icon: Users },
  { value: "15,000+", label: "Alumni", icon: Award },
  { value: "3", label: "Cabang Pesantren", icon: Building2 },
];

const programs = [
  {
    icon: BookOpen,
    title: "Tahfidz Al-Qur'an",
    desc: "Program intensif hafalan Al-Qur'an 30 juz dengan metode modern dan bimbingan ustadz berpengalaman.",
    badge: "Unggulan",
  },
  {
    icon: GraduationCap,
    title: "Kurikulum Nasional + Diniyah",
    desc: "Perpaduan kurikulum Kementerian Pendidikan dan kurikulum pesantren untuk keseimbangan ilmu.",
  },
  {
    icon: Globe,
    title: "Bahasa Arab & Inggris",
    desc: "Program bilingual aktif dengan native speaker dan sertifikasi TOEFL & TOAFL.",
  },
  {
    icon: Heart,
    title: "Pendidikan Karakter",
    desc: "Pembentukan akhlak mulia melalui pembiasaan ibadah, kedisiplinan, dan kemandirian.",
  },
  {
    icon: Award,
    title: "Olimpiade & Kompetisi",
    desc: "Pembinaan santri berprestasi untuk kompetisi sains, bahasa, dan keagamaan tingkat nasional.",
  },
  {
    icon: BarChart3,
    title: "Keterampilan Digital",
    desc: "Pembekalan teknologi informasi, coding, dan desain grafis untuk menghadapi era digital.",
  },
];

const facilities = [
  { icon: BedDouble, title: "Asrama Modern", desc: "Kamar nyaman ber-AC dengan fasilitas lengkap" },
  { icon: Library, title: "Perpustakaan Digital", desc: "Ribuan koleksi buku fisik & e-book" },
  { icon: Dumbbell, title: "Lapangan Olahraga", desc: "Futsal, basket, badminton, dan panahan" },
  { icon: Utensils, title: "Dapur & Kantin", desc: "Menu bergizi dengan standar kesehatan" },
];

const galleryItems = [
  { src: galleryQuran, title: "Halaqah Tahfidz", category: "Akademik" },
  { src: galleryMosque, title: "Masjid Pesantren", category: "Fasilitas" },
  { src: galleryClassroom, title: "Kegiatan Belajar", category: "Akademik" },
  { src: galleryDormitory, title: "Asrama Santri", category: "Fasilitas" },
  { src: gallerySports, title: "Olahraga & Ekstrakurikuler", category: "Kegiatan" },
  { src: heroPesantren, title: "Kampus Pesantren", category: "Fasilitas" },
];

const newsItems = [
  {
    title: "Pesantren Raih Juara Umum MTQ Nasional 2026",
    excerpt: "Delegasi santri berhasil meraih 5 medali emas dan 3 perak pada ajang Musabaqah Tilawatil Qur'an tingkat nasional di Makassar.",
    date: "5 Mar 2026",
    category: "Prestasi",
    image: galleryQuran,
  },
  {
    title: "Pendaftaran Santri Baru Tahun Ajaran 2026/2027 Dibuka",
    excerpt: "Gelombang pertama pendaftaran santri baru resmi dibuka mulai 10 Maret hingga 30 April 2026 dengan kuota terbatas.",
    date: "1 Mar 2026",
    category: "Pengumuman",
    image: heroPesantren,
  },
  {
    title: "Workshop Keterampilan Digital untuk Santri",
    excerpt: "Pesantren menggelar workshop coding dan desain grafis bekerja sama dengan komunitas teknologi lokal.",
    date: "25 Feb 2026",
    category: "Kegiatan",
    image: galleryClassroom,
  },
];

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

// ─── Main Page ─────────────────────────────────────────
const Index = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-gold shadow-md">
              <span className="text-sm font-bold text-accent-foreground">B</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-bold text-foreground leading-none">Pesantren Al-Hikmah</span>
              <span className="block text-[10px] text-muted-foreground leading-tight">Modern Islamic Boarding School</span>
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition-colors">Tentang</a>
            <a href="#programs" className="hover:text-foreground transition-colors">Program</a>
            <Link to="/gallery" className="hover:text-foreground transition-colors">Galeri</Link>
            <Link to="/news" className="hover:text-foreground transition-colors">Berita</Link>
            <a href="#contact" className="hover:text-foreground transition-colors">Kontak</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:inline-flex">
              <Button size="sm" className="gap-1.5">
                Portal Masuk <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <button onClick={() => setMobileNav(!mobileNav)} className="lg:hidden p-2 rounded-md hover:bg-muted">
              {mobileNav ? <XIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {/* Mobile nav */}
        {mobileNav && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="lg:hidden border-t bg-background px-4 py-4 space-y-3"
          >
            {["Tentang|#about","Program|#programs","Galeri|/gallery","Berita|/news","Kontak|#contact"].map(item => {
              const [label, href] = item.split("|");
              const isRoute = href.startsWith("/");
              return isRoute ? (
                <Link key={href} to={href} onClick={() => setMobileNav(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground">{label}</Link>
              ) : (
                <a key={href} href={href} onClick={() => setMobileNav(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground">{label}</a>
              );
            })}
            <Link to="/login" onClick={() => setMobileNav(false)}>
              <Button size="sm" className="w-full mt-2">Portal Masuk</Button>
            </Link>
          </motion.div>
        )}
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroPesantren} alt="Kampus Pesantren Al-Hikmah" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-24 md:py-36 lg:py-44">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-xs font-medium text-white/90">
                <Star className="h-3.5 w-3.5 text-accent" />
                Pendaftaran Santri Baru 2026/2027 Dibuka
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-5 font-display">
                Mencetak Generasi{" "}
                <span className="text-accent">Qur'ani</span>,{" "}
                Berilmu &amp; Berkarakter
              </h1>
              <p className="text-base md:text-lg text-white/75 max-w-xl mb-8 leading-relaxed">
                Pesantren Al-Hikmah memadukan pendidikan agama Islam dan ilmu pengetahuan modern dalam lingkungan asrama yang kondusif sejak 1985.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg">
                  Daftar Sekarang <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white bg-white/5">
                  Kenali Kami
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

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
      <section id="about" className="py-20 lg:py-28">
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
      <section id="programs" className="py-20 lg:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Program Unggulan</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Kurikulum Terintegrasi untuk Masa Depan
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Santri kami dibekali dengan ilmu agama yang kuat, penguasaan sains & teknologi, serta keterampilan kepemimpinan.
            </p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {programs.map((p) => (
              <motion.div
                key={p.title}
                variants={staggerItem}
                className="group rounded-2xl border bg-card p-7 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-md">
                    <p.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  {p.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider gradient-gold text-accent-foreground px-2.5 py-1 rounded-full">
                      {p.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Facilities ─── */}
      <section className="py-20 lg:py-28">
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
      <section id="gallery" className="py-20 lg:py-28 bg-muted/30">
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
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {galleryItems.map((item, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[4/3]"
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">{item.category}</span>
                    <p className="text-white font-semibold text-sm">{item.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
      <section id="news" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Berita & Pengumuman</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                Kabar Terbaru
              </h2>
            </div>
            <a href="#" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {newsItems.map((news, i) => (
              <motion.article
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group rounded-2xl border bg-card overflow-hidden shadow-card hover:shadow-card-hover transition-all"
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
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <a href="#" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              Lihat Semua Berita <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20 lg:py-28 bg-muted/30">
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
                <Link to="/login">
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
      <section id="contact" className="py-20 lg:py-28 bg-muted/30">
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

      {/* ─── Footer ─── */}
      <footer className="border-t bg-card">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-md gradient-gold">
                  <span className="text-[10px] font-bold text-accent-foreground">B</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-foreground block leading-none">Pesantren Al-Hikmah</span>
                  <span className="text-[10px] text-muted-foreground">Modern Islamic Boarding School</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Mencetak generasi Qur'ani yang berilmu, beramal, dan berakhlak mulia sejak 1985.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Menu</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground transition-colors">Tentang</a></li>
                <li><a href="#programs" className="hover:text-foreground transition-colors">Program</a></li>
                <li><a href="#gallery" className="hover:text-foreground transition-colors">Galeri</a></li>
                <li><a href="#news" className="hover:text-foreground transition-colors">Berita</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Portal</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link to="/login" className="hover:text-foreground transition-colors">Santri & Wali</Link></li>
                <li><Link to="/login/admin" className="hover:text-foreground transition-colors flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Administrator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Kontak</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> (021) 8888-1234</li>
                <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> info@alhikmah.sch.id</li>
                <li className="flex items-start gap-2"><MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" /> Jl. Pondok Pesantren No. 123, Bekasi</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">© 2026 Pesantren Al-Hikmah. All rights reserved.</p>
            <Link to="/login/admin">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Login Administrator
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
