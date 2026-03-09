import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, ArrowRight, Clock } from "lucide-react";

import galleryQuran from "@/assets/gallery-quran.jpg";
import heroPesantren from "@/assets/hero-pesantren.jpg";
import galleryClassroom from "@/assets/gallery-classroom.jpg";
import galleryMosque from "@/assets/gallery-mosque.jpg";
import gallerySports from "@/assets/gallery-sports.jpg";
import galleryDormitory from "@/assets/gallery-dormitory.jpg";

export const allNewsItems = [
  {
    id: "mtq-nasional-2026",
    title: "Pesantren Raih Juara Umum MTQ Nasional 2026",
    excerpt: "Delegasi santri berhasil meraih 5 medali emas dan 3 perak pada ajang Musabaqah Tilawatil Qur'an tingkat nasional di Makassar.",
    date: "5 Mar 2026",
    category: "Prestasi",
    image: galleryQuran,
    readTime: "3 menit",
    content: `Alhamdulillah, delegasi Pesantren Al-Hikmah berhasil menorehkan prestasi membanggakan pada ajang Musabaqah Tilawatil Qur'an (MTQ) Nasional 2026 yang diselenggarakan di Makassar, Sulawesi Selatan.

Tim yang terdiri dari 12 santri pilihan berhasil meraih 5 medali emas dan 3 medali perak di berbagai cabang lomba, termasuk Tilawah Dewasa Putra, Hifdzil Qur'an 30 Juz, Tafsir Bahasa Arab, Kaligrafi, dan Fahmil Qur'an.

"Ini adalah buah dari kerja keras dan kesungguhan para santri dalam berlatih selama berbulan-bulan. Kami bangga dengan pencapaian mereka," ujar Ustadz H. Abdul Karim, kepala bidang pembinaan tilawah pesantren.

Salah satu prestasi paling membanggakan diraih oleh Muhammad Farel, santri kelas 11, yang berhasil meraih emas di cabang Hifdzil Qur'an 30 Juz dengan predikat mumtaz (istimewa).

Keberhasilan ini menegaskan komitmen Pesantren Al-Hikmah dalam mencetak generasi penghafal dan pencinta Al-Qur'an yang berkualitas tinggi.`,
  },
  {
    id: "pendaftaran-2026-2027",
    title: "Pendaftaran Santri Baru Tahun Ajaran 2026/2027 Dibuka",
    excerpt: "Gelombang pertama pendaftaran santri baru resmi dibuka mulai 10 Maret hingga 30 April 2026 dengan kuota terbatas.",
    date: "1 Mar 2026",
    category: "Pengumuman",
    image: heroPesantren,
    readTime: "4 menit",
    content: `Pesantren Al-Hikmah dengan resmi membuka pendaftaran santri baru untuk tahun ajaran 2026/2027. Pendaftaran gelombang pertama dibuka mulai tanggal 10 Maret hingga 30 April 2026.

Kuota yang tersedia untuk gelombang pertama ini adalah sebanyak 200 santri untuk jenjang MTs (setara SMP) dan 150 santri untuk jenjang MA (setara SMA).

**Persyaratan Pendaftaran:**
- Fotokopi rapor kelas 4, 5, dan 6 SD (untuk MTs) atau kelas 7, 8, dan 9 SMP (untuk MA)
- Fotokopi akta kelahiran
- Fotokopi kartu keluarga
- Pas foto 3x4 sebanyak 4 lembar
- Surat keterangan sehat dari dokter
- Surat rekomendasi dari sekolah asal

**Tahapan Seleksi:**
1. Seleksi administrasi
2. Tes akademik (Matematika, Bahasa Indonesia, Bahasa Inggris)
3. Tes baca Al-Qur'an dan hafalan
4. Wawancara santri dan orang tua

Pendaftaran dapat dilakukan secara online melalui portal resmi pesantren atau secara langsung di kantor pendaftaran.

"Kami mengajak para orang tua untuk segera mendaftarkan putra-putrinya karena kuota sangat terbatas," ungkap panitia pendaftaran.`,
  },
  {
    id: "workshop-digital",
    title: "Workshop Keterampilan Digital untuk Santri",
    excerpt: "Pesantren menggelar workshop coding dan desain grafis bekerja sama dengan komunitas teknologi lokal.",
    date: "25 Feb 2026",
    category: "Kegiatan",
    image: galleryClassroom,
    readTime: "3 menit",
    content: `Dalam rangka membekali santri dengan keterampilan yang relevan di era digital, Pesantren Al-Hikmah menggelar workshop keterampilan digital selama 3 hari pada tanggal 23-25 Februari 2026.

Workshop ini menggandeng komunitas teknologi lokal dan beberapa profesional dari industri IT untuk memberikan pelatihan langsung kepada para santri.

**Materi yang diajarkan meliputi:**
- Dasar-dasar pemrograman web (HTML, CSS, JavaScript)
- Desain grafis menggunakan Canva dan Figma
- Digital marketing dan media sosial
- Pengenalan artificial intelligence

Sebanyak 120 santri dari kelas 10 dan 11 mengikuti workshop ini dengan antusias tinggi. Banyak dari mereka yang berhasil membuat website sederhana dan desain poster di akhir workshop.

"Santri zaman sekarang harus melek teknologi. Ini bukan bertentangan dengan nilai pesantren, justru melengkapi," ujar Ustadz Hadi, koordinator program keterampilan digital.`,
  },
  {
    id: "kunjungan-kemenag",
    title: "Kemenag RI Kunjungi Pesantren Al-Hikmah",
    excerpt: "Delegasi Kementerian Agama melakukan kunjungan kerja untuk meninjau program pendidikan integratif pesantren.",
    date: "20 Feb 2026",
    category: "Berita",
    image: galleryMosque,
    readTime: "3 menit",
    content: `Delegasi dari Kementerian Agama Republik Indonesia melakukan kunjungan kerja ke Pesantren Al-Hikmah pada Rabu, 20 Februari 2026. Kunjungan ini dipimpin langsung oleh Direktur Pendidikan Diniyah dan Pondok Pesantren.

Dalam kunjungannya, delegasi meninjau berbagai fasilitas pendidikan dan asrama, serta berdiskusi dengan pimpinan pesantren tentang model kurikulum integratif yang diterapkan.

"Pesantren Al-Hikmah bisa menjadi role model bagi pesantren lain dalam mengintegrasikan kurikulum nasional dengan kurikulum keagamaan," ungkap Direktur Pendidikan Diniyah.

Pihak pesantren menyambut baik kunjungan ini dan berharap dapat terjalin kerja sama yang lebih erat dengan Kemenag dalam pengembangan pendidikan pesantren di Indonesia.`,
  },
  {
    id: "turnamen-olahraga",
    title: "Turnamen Olahraga Antar-Pesantren se-Jabodetabek",
    excerpt: "Pesantren Al-Hikmah menjadi tuan rumah turnamen olahraga yang diikuti 24 pesantren dari wilayah Jabodetabek.",
    date: "15 Feb 2026",
    category: "Kegiatan",
    image: gallerySports,
    readTime: "3 menit",
    content: `Pesantren Al-Hikmah sukses menjadi tuan rumah Turnamen Olahraga Antar-Pesantren se-Jabodetabek 2026. Turnamen yang berlangsung selama 4 hari ini diikuti oleh 24 pesantren dari wilayah Jakarta, Bogor, Depok, Tangerang, dan Bekasi.

Cabang olahraga yang dipertandingkan meliputi futsal, bola voli, badminton, dan tenis meja. Total peserta yang berpartisipasi mencapai lebih dari 500 santri.

Tim tuan rumah berhasil meraih prestasi membanggakan dengan meraih juara 1 di cabang futsal dan juara 2 di cabang badminton.

"Turnamen ini bukan hanya soal kompetisi, tapi juga sarana silaturahim dan ukhuwah antar santri dari berbagai pesantren," ujar ketua panitia.`,
  },
  {
    id: "renovasi-asrama",
    title: "Renovasi Asrama Putri Tahap 2 Selesai",
    excerpt: "Asrama putri baru dengan kapasitas 200 santri resmi digunakan setelah proses renovasi selama 6 bulan.",
    date: "10 Feb 2026",
    category: "Pengumuman",
    image: galleryDormitory,
    readTime: "2 menit",
    content: `Proyek renovasi asrama putri tahap 2 di Pesantren Al-Hikmah telah resmi selesai dan mulai digunakan oleh para santri. Renovasi yang memakan waktu 6 bulan ini menghadirkan asrama modern dengan berbagai fasilitas terbaru.

Asrama baru ini memiliki kapasitas 200 santri dengan fasilitas yang meliputi kamar ber-AC, kamar mandi dalam, ruang belajar bersama, mushola, dan area laundry.

"Kami ingin santri merasa nyaman seperti di rumah sendiri sehingga mereka bisa fokus belajar dan beribadah," ujar pimpinan pesantren saat peresmian.

Total investasi untuk renovasi ini mencapai Rp 3,5 miliar yang bersumber dari donasi alumni, orang tua santri, dan dana pesantren.`,
  },
];

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function News() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
          <h1 className="text-base font-bold text-foreground">Berita & Pengumuman</h1>
          <div className="w-20" />
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Berita Terbaru</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
              Kabar Terbaru Pesantren
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ikuti perkembangan terbaru, prestasi, dan pengumuman penting dari Pesantren Al-Hikmah.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured article */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 mb-12">
        <Link to={`/news/${allNewsItems[0].id}`}>
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group rounded-2xl border bg-card overflow-hidden shadow-card hover:shadow-card-hover transition-all grid lg:grid-cols-2"
          >
            <div className="aspect-[16/9] lg:aspect-auto overflow-hidden">
              <img src={allNewsItems[0].image} alt={allNewsItems[0].title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-6 lg:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">{allNewsItems[0].category}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> {allNewsItems[0].date}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {allNewsItems[0].readTime}</span>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{allNewsItems[0].title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">{allNewsItems[0].excerpt}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Baca Selengkapnya <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </motion.article>
        </Link>
      </div>

      {/* All articles */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 pb-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {allNewsItems.slice(1).map((news) => (
            <motion.div key={news.id} variants={staggerItem}>
              <Link to={`/news/${news.id}`}>
                <article className="group rounded-2xl border bg-card overflow-hidden shadow-card hover:shadow-card-hover transition-all h-full">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">{news.category}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> {news.date}</span>
                    </div>
                    <h3 className="font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">{news.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{news.excerpt}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-3">
                      Baca Selengkapnya <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
