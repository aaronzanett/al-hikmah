import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";

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
    id: "workshop-digital-2026",
    title: "Workshop Keterampilan Digital untuk Santri",
    excerpt: "Pesantren menggelar workshop coding dan desain grafis bekerja sama dengan komunitas teknologi lokal.",
    date: "25 Feb 2026",
    category: "Kegiatan",
    image: galleryClassroom,
    readTime: "3 menit",
    content: `Dalam upaya membekali santri dengan keterampilan yang relevan di era digital, Pesantren Al-Hikmah menggelar workshop keterampilan digital yang berlangsung selama tiga hari.

Workshop ini diikuti oleh 120 santri kelas 10 dan 11 yang dibagi menjadi dua jalur: coding dasar dan desain grafis. Acara ini bekerja sama dengan komunitas teknologi lokal dan praktisi industri.

Materi yang diajarkan meliputi dasar-dasar pemrograman web menggunakan HTML, CSS, dan JavaScript untuk jalur coding, serta penggunaan Canva dan Adobe Illustrator untuk jalur desain grafis.

"Santri zaman sekarang harus melek teknologi. Dengan keterampilan ini, mereka bisa berdakwah dengan cara yang lebih modern dan menjangkau lebih banyak orang," kata Ustadz Ridwan, koordinator kegiatan.`,
  },
  {
    id: "kunjungan-menteri-2026",
    title: "Menteri Agama Kunjungi Pesantren Al-Hikmah",
    excerpt: "Kunjungan kerja Menteri Agama RI dalam rangka meninjau program pendidikan pesantren modern.",
    date: "20 Feb 2026",
    category: "Berita",
    image: galleryMosque,
    readTime: "4 menit",
    content: `Pesantren Al-Hikmah kedatangan tamu istimewa, Menteri Agama Republik Indonesia, dalam kunjungan kerja untuk meninjau program pendidikan pesantren modern.

Dalam kunjungannya, Menteri Agama menyempatkan diri untuk berkeliling melihat fasilitas pesantren, termasuk asrama, ruang kelas, laboratorium komputer, dan masjid.

"Pesantren Al-Hikmah adalah contoh yang baik bagaimana pesantren bisa memadukan pendidikan agama dengan pendidikan umum secara seimbang. Ini adalah model yang patut ditiru oleh pesantren lain," puji Menteri Agama.

Kunjungan ini juga menjadi momentum untuk membahas rencana kerja sama antara Kementerian Agama dengan pesantren dalam pengembangan kurikulum pendidikan pesantren yang lebih komprehensif.`,
  },
  {
    id: "olimpiade-sains-2026",
    title: "Santri Raih Medali Olimpiade Sains Nasional",
    excerpt: "Dua santri berhasil meraih medali perunggu di Olimpiade Sains Nasional bidang Fisika dan Biologi.",
    date: "15 Feb 2026",
    category: "Prestasi",
    image: gallerySports,
    readTime: "3 menit",
    content: `Pesantren Al-Hikmah kembali menorehkan prestasi di bidang akademik setelah dua santrinya berhasil meraih medali perunggu di Olimpiade Sains Nasional (OSN) 2026.

Ahmad Zaki, santri kelas 11, berhasil meraih medali perunggu di bidang Fisika, sementara Fatimah Azzahra, santri kelas 12, meraih medali perunggu di bidang Biologi.

"Ini membuktikan bahwa santri pesantren juga mampu bersaing di tingkat nasional dalam bidang sains," ujar Kepala Bidang Akademik pesantren.

Kedua santri ini sebelumnya telah melalui seleksi ketat di tingkat kabupaten dan provinsi sebelum akhirnya mewakili provinsi di tingkat nasional.`,
  },
  {
    id: "renovasi-asrama-2026",
    title: "Peresmian Gedung Asrama Baru Putri",
    excerpt: "Pesantren meresmikan gedung asrama baru putri dengan kapasitas 200 santri dan fasilitas modern.",
    date: "10 Feb 2026",
    category: "Pengumuman",
    image: galleryDormitory,
    readTime: "3 menit",
    content: `Pesantren Al-Hikmah meresmikan gedung asrama baru putri yang dibangun dengan investasi sebesar Rp 8 miliar. Gedung empat lantai ini mampu menampung hingga 200 santri putri.

Fasilitas yang tersedia meliputi kamar tidur ber-AC dengan kapasitas 4 orang per kamar, kamar mandi dalam, ruang belajar bersama, kantin, dan area olahraga indoor.

"Dengan gedung asrama baru ini, kami berharap dapat menerima lebih banyak santri putri dan memberikan kenyamanan yang lebih baik," kata Pengasuh Pesantren.

Pembangunan gedung ini merupakan bagian dari masterplan pengembangan pesantren dalam lima tahun ke depan.`,
  },
  {
    id: "bakti-sosial-2026",
    title: "Santri Gelar Bakti Sosial di Desa Tertinggal",
    excerpt: "Ratusan santri mengikuti program bakti sosial dan mengajar di desa-desa tertinggal sekitar pesantren.",
    date: "5 Feb 2026",
    category: "Kegiatan",
    image: heroPesantren,
    readTime: "3 menit",
    content: `Sebagai bentuk kepedulian sosial, Pesantren Al-Hikmah menggelar program bakti sosial yang diikuti oleh 150 santri kelas 11 dan 12.

Kegiatan yang berlangsung selama satu minggu ini meliputi mengajar di sekolah dasar, memberikan les gratis untuk anak-anak, membersihkan lingkungan, dan membagikan sembako kepada warga kurang mampu.

"Program ini bertujuan untuk melatih santri agar memiliki kepekaan sosial dan rasa tanggung jawab terhadap masyarakat sekitar," jelas koordinator kegiatan.

Selain bakti sosial, santri juga mengadakan pengajian akbar yang dihadiri oleh warga dari tiga desa di sekitar lokasi kegiatan.`,
  },
  {
    id: "wisuda-tahfidz-2026",
    title: "Wisuda 50 Hafidz dan Hafidzah Baru",
    excerpt: "Pesantren menggelar wisuda tahfidz untuk 50 santri yang berhasil menyelesaikan hafalan 30 juz Al-Qur'an.",
    date: "1 Feb 2026",
    category: "Prestasi",
    image: galleryQuran,
    readTime: "3 menit",
    content: `Pesantren Al-Hikmah menggelar acara wisuda tahfidz untuk 50 santri yang berhasil menyelesaikan hafalan Al-Qur'an 30 juz dengan predikat mumtaz.

Acara yang dihadiri oleh para wali santri dan tokoh masyarakat ini menjadi momen yang sangat emosional bagi para hafidz dan hafidzah beserta keluarganya.

"Menghafal Al-Qur'an 30 juz bukanlah pencapaian yang mudah. Para santri ini telah menunjukkan kesungguhan dan istiqomah yang luar biasa," ujar Pengasuh Pesantren dalam sambutannya.

Para wisudawan juga mendapatkan beasiswa penuh untuk melanjutkan pendidikan di perguruan tinggi Islam terkemuka.`,
  },
];

const ITEMS_PER_PAGE = 6;

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function News() {
  const [currentPage, setCurrentPage] = useState(1);

  // Exclude featured article (first one) from pagination
  const remainingNews = allNewsItems.slice(1);
  const totalPages = Math.ceil(remainingNews.length / ITEMS_PER_PAGE);
  const paginatedNews = remainingNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <PublicNavbar />

      {/* Hero */}
      <section className="py-16 lg:py-24 islamic-pattern-door bg-muted/30">
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
      <div className="mx-auto max-w-7xl px-4 lg:px-8 mb-12 -mt-8 relative z-10">
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
      <div className="mx-auto max-w-7xl px-4 lg:px-8 pb-10">
        <motion.div
          key={currentPage}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {paginatedNews.map((news) => (
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
            Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, remainingNews.length)} dari {remainingNews.length} berita
          </p>
        </div>
      )}
    </div>
  );
}
