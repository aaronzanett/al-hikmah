import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type DayKey = "senin" | "selasa" | "rabu" | "kamis" | "jumat" | "sabtu";

interface ScheduleItem {
  time: string;
  subject: string;
  teacher: string;
  room: string;
  type?: "academic" | "tahfidz" | "extracurricular";
}

const schedule: Record<DayKey, ScheduleItem[]> = {
  senin: [
    { time: "05:00 - 06:00", subject: "Tahfidz Al-Qur'an", teacher: "Ust. Ahmad Kholid", room: "Masjid", type: "tahfidz" },
    { time: "07:00 - 08:30", subject: "Matematika", teacher: "Ust. Budi", room: "Ruang 10-A" },
    { time: "08:30 - 10:00", subject: "Bahasa Arab", teacher: "Ust. Hamid", room: "Ruang 10-A" },
    { time: "10:15 - 11:45", subject: "Fiqih", teacher: "Ust. Yusuf", room: "Ruang 10-A" },
    { time: "13:00 - 14:30", subject: "Fisika", teacher: "Ust. Rudi", room: "Lab Fisika" },
    { time: "15:30 - 17:00", subject: "Pramuka", teacher: "Ust. Hendra", room: "Lapangan", type: "extracurricular" },
  ],
  selasa: [
    { time: "05:00 - 06:00", subject: "Tahfidz Al-Qur'an", teacher: "Ust. Ahmad Kholid", room: "Masjid", type: "tahfidz" },
    { time: "07:00 - 08:30", subject: "Bahasa Indonesia", teacher: "Ust. Siti", room: "Ruang 10-A" },
    { time: "08:30 - 10:00", subject: "Kimia", teacher: "Ust. Dewi", room: "Lab Kimia" },
    { time: "10:15 - 11:45", subject: "Tafsir Al-Qur'an", teacher: "Ust. Ahmad", room: "Ruang 10-A" },
    { time: "13:00 - 14:30", subject: "Bahasa Inggris", teacher: "Miss Sarah", room: "Ruang 10-A" },
  ],
  rabu: [
    { time: "05:00 - 06:00", subject: "Tahfidz Al-Qur'an", teacher: "Ust. Ahmad Kholid", room: "Masjid", type: "tahfidz" },
    { time: "07:00 - 08:30", subject: "Matematika", teacher: "Ust. Budi", room: "Ruang 10-A" },
    { time: "08:30 - 10:00", subject: "Biologi", teacher: "Ust. Rina", room: "Lab Bio" },
    { time: "10:15 - 11:45", subject: "Hadits", teacher: "Ust. Khaled", room: "Ruang 10-A" },
    { time: "13:00 - 14:30", subject: "Bahasa Arab", teacher: "Ust. Hamid", room: "Ruang 10-A" },
    { time: "15:30 - 17:00", subject: "Futsal", teacher: "Ust. Fajar", room: "Lapangan", type: "extracurricular" },
  ],
  kamis: [
    { time: "05:00 - 06:00", subject: "Tahfidz Al-Qur'an", teacher: "Ust. Ahmad Kholid", room: "Masjid", type: "tahfidz" },
    { time: "07:00 - 08:30", subject: "Fisika", teacher: "Ust. Rudi", room: "Lab Fisika" },
    { time: "08:30 - 10:00", subject: "Fiqih", teacher: "Ust. Yusuf", room: "Ruang 10-A" },
    { time: "10:15 - 11:45", subject: "Bahasa Indonesia", teacher: "Ust. Siti", room: "Ruang 10-A" },
    { time: "13:00 - 14:30", subject: "Kimia", teacher: "Ust. Dewi", room: "Lab Kimia" },
  ],
  jumat: [
    { time: "05:00 - 06:00", subject: "Tahfidz Al-Qur'an", teacher: "Ust. Ahmad Kholid", room: "Masjid", type: "tahfidz" },
    { time: "07:00 - 08:30", subject: "Bahasa Inggris", teacher: "Miss Sarah", room: "Ruang 10-A" },
    { time: "08:30 - 10:00", subject: "Tafsir Al-Qur'an", teacher: "Ust. Ahmad", room: "Ruang 10-A" },
    { time: "10:15 - 11:30", subject: "Hadits", teacher: "Ust. Khaled", room: "Ruang 10-A" },
  ],
  sabtu: [
    { time: "05:00 - 06:00", subject: "Tahfidz Al-Qur'an", teacher: "Ust. Ahmad Kholid", room: "Masjid", type: "tahfidz" },
    { time: "07:00 - 08:30", subject: "Biologi", teacher: "Ust. Rina", room: "Lab Bio" },
    { time: "08:30 - 10:00", subject: "Matematika", teacher: "Ust. Budi", room: "Ruang 10-A" },
    { time: "10:15 - 11:45", subject: "Kaligrafi", teacher: "Ust. Zaki", room: "Ruang Seni", type: "extracurricular" },
  ],
};

const dayLabels: Record<DayKey, string> = {
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat",
  sabtu: "Sabtu",
};

const typeColors: Record<string, string> = {
  academic: "bg-blue-100 text-blue-700",
  tahfidz: "bg-emerald-100 text-emerald-700",
  extracurricular: "bg-violet-100 text-violet-700",
};

const StudentSchedule = () => {
  const days = Object.keys(schedule) as DayKey[];
  const todayIndex = new Date().getDay();
  const mappedDay = todayIndex === 0 ? 0 : todayIndex - 1;
  const [activeDay, setActiveDay] = useState<DayKey>(days[Math.min(mappedDay, 5)]);

  const items = schedule[activeDay];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <h2 className="text-base font-bold text-foreground">Jadwal Pelajaran</h2>
        <p className="text-xs text-muted-foreground">Kelas 10 IPA-A · Semester Genap 2025/2026</p>
      </div>

      {/* Day Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              activeDay === day
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {dayLabels[day]}
          </button>
        ))}
      </div>

      {/* Schedule Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-foreground">{items.length}</p>
          <p className="text-[10px] text-muted-foreground">Total Sesi</p>
        </div>
        <div className="bg-card border rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-blue-600">{items.filter(i => !i.type || i.type === "academic").length}</p>
          <p className="text-[10px] text-muted-foreground">Akademik</p>
        </div>
        <div className="bg-card border rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-emerald-600">{items.filter(i => i.type === "tahfidz").length}</p>
          <p className="text-[10px] text-muted-foreground">Tahfidz</p>
        </div>
      </div>

      {/* Schedule List */}
      <motion.div
        key={activeDay}
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-card border rounded-xl overflow-hidden"
      >
        <div className="px-5 py-3.5 border-b">
          <h3 className="text-sm font-semibold text-foreground">
            Jadwal Hari {dayLabels[activeDay]}
          </h3>
        </div>
        <div className="divide-y">
          {items.map((item, i) => {
            const type = item.type || "academic";
            return (
              <div key={i} className="flex items-center px-5 py-4 gap-4">
                <div className="w-28 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs font-medium text-foreground">{item.time}</p>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-foreground">{item.subject}</p>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${typeColors[type]}`}>
                      {type === "tahfidz" ? "Tahfidz" : type === "extracurricular" ? "Ekskul" : "Akademik"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>{item.teacher}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5" />
                      {item.room}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudentSchedule;
