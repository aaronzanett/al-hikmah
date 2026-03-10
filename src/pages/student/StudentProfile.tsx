import { motion } from "framer-motion";
import { User, Phone, Mail, MapPin, BookOpen, Calendar, Award, Home } from "lucide-react";

const StudentProfile = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <h2 className="text-base font-bold text-foreground">Profil Saya</h2>

      {/* Profile Card */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
            MA
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Muhammad Azzam Ridwan</h3>
            <p className="text-sm text-muted-foreground">NIS: 2024.001</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">Kelas 10 IPA-A</span>
              <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">Aktif</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {[
            { label: "Tempat, Tanggal Lahir", value: "Bandung, 15 April 2010", icon: Calendar },
            { label: "Asal Daerah", value: "Bandung, Jawa Barat", icon: MapPin },
            { label: "Tahun Masuk", value: "2024", icon: BookOpen },
            { label: "Program", value: "Tahfidz + Reguler", icon: Award },
          ].map((item) => (
            <div key={item.label} className="flex gap-3 p-3 rounded-lg bg-muted/50">
              <item.icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">{item.label}</p>
                <p className="font-medium text-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Info */}
      <div className="bg-card border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Informasi Akademik</h3>
        <div className="space-y-3">
          {[
            { label: "Wali Kelas", value: "Ustadzah Siti Aisyah, S.Pd." },
            { label: "Pembimbing Tahfidz", value: "Ust. Ahmad Kholid" },
            { label: "Kamar Asrama", value: "Kamar 201 - Gedung Zaid bin Tsabit" },
            { label: "Hafalan Saat Ini", value: "15 Juz" },
            { label: "Cabang", value: "Pesantren Al-Hikmah Pusat" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium text-foreground text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-card border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Prestasi</h3>
        <div className="space-y-3">
          {[
            { title: "Juara 2 Lomba Tahfidz Tingkat Kota", date: "Desember 2025", badge: "🥈" },
            { title: "Santri Teladan Semester Ganjil", date: "Januari 2026", badge: "⭐" },
            { title: "Peringkat 3 Besar di Kelas", date: "Semester Ganjil 2025", badge: "🏆" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3 py-2 border-b last:border-0">
              <span className="text-xl">{item.badge}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-[10px] text-muted-foreground">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guardian Info */}
      <div className="bg-card border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Data Wali Santri</h3>
        <div className="space-y-3">
          {[
            { label: "Nama", value: "H. Muhammad Ridwan", icon: User },
            { label: "No. Telepon", value: "0812-3456-7890", icon: Phone },
            { label: "Email", value: "wali@gmail.com", icon: Mail },
            { label: "Alamat", value: "Jl. Merdeka No. 12, Bandung", icon: MapPin },
          ].map((item) => (
            <div key={item.label} className="flex gap-3 py-2 border-b last:border-0 text-sm items-center">
              <item.icon className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground w-28 shrink-0">{item.label}</span>
              <span className="font-medium text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StudentProfile;
