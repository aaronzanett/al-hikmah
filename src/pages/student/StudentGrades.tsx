import { motion } from "framer-motion";
import { TrendingUp, Award, BookOpen } from "lucide-react";

const subjects = [
  { name: "Matematika", score: 88, grade: "A", teacher: "Ust. Budi" },
  { name: "Bahasa Indonesia", score: 85, grade: "A", teacher: "Ust. Siti" },
  { name: "Bahasa Inggris", score: 90, grade: "A+", teacher: "Miss Sarah" },
  { name: "Bahasa Arab", score: 92, grade: "A+", teacher: "Ust. Hamid" },
  { name: "Fiqih", score: 88, grade: "A", teacher: "Ust. Yusuf" },
  { name: "Fisika", score: 78, grade: "B+", teacher: "Ust. Rudi" },
  { name: "Kimia", score: 80, grade: "A-", teacher: "Ust. Dewi" },
  { name: "Biologi", score: 83, grade: "A-", teacher: "Ust. Rina" },
  { name: "Tafsir Al-Qur'an", score: 95, grade: "A+", teacher: "Ust. Ahmad" },
  { name: "Hadits", score: 91, grade: "A+", teacher: "Ust. Khaled" },
];

const getGradeColor = (grade: string) => {
  if (grade.startsWith("A")) return "bg-green-100 text-green-700";
  if (grade.startsWith("B")) return "bg-blue-100 text-blue-700";
  return "bg-amber-100 text-amber-700";
};

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-600";
  if (score >= 80) return "text-blue-600";
  return "text-amber-600";
};

const StudentGrades = () => {
  const avg = (subjects.reduce((a, b) => a + b.score, 0) / subjects.length).toFixed(1);
  const highest = Math.max(...subjects.map(s => s.score));
  const lowest = Math.min(...subjects.map(s => s.score));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <h2 className="text-base font-bold text-foreground">Nilai Saya</h2>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Rata-rata", value: avg, icon: TrendingUp, color: "text-primary" },
          { label: "Tertinggi", value: highest.toString(), icon: Award, color: "text-green-600" },
          { label: "Terendah", value: lowest.toString(), icon: BookOpen, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-card border rounded-xl p-4 text-center">
            {s.icon && <s.icon className={`h-4 w-4 mx-auto mb-1.5 ${s.color}`} />}
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Subject Grades */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b">
          <h3 className="text-sm font-semibold text-foreground">Nilai Per Mata Pelajaran</h3>
          <p className="text-xs text-muted-foreground">Semester Genap 2025/2026 · Kelas 10 IPA-A</p>
        </div>
        <div className="divide-y">
          {subjects.map((sub) => (
            <div key={sub.name} className="flex items-center px-5 py-3.5 gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{sub.name}</p>
                <p className="text-[10px] text-muted-foreground">{sub.teacher}</p>
              </div>
              <div className="w-24 hidden sm:block">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary/60 transition-all"
                    style={{ width: `${sub.score}%` }}
                  />
                </div>
              </div>
              <p className={`text-base font-bold w-10 text-right ${getScoreColor(sub.score)}`}>{sub.score}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md w-10 text-center ${getGradeColor(sub.grade)}`}>
                {sub.grade}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hafalan Progress */}
      <div className="bg-card border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Progress Hafalan Al-Qur'an</h3>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Hafalan saat ini</span>
              <span className="font-semibold text-primary">15 / 30 Juz</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-1/2 rounded-full gradient-primary" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-primary">50%</p>
            <p className="text-[10px] text-muted-foreground">Selesai</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Target: Menyelesaikan 20 juz pada akhir tahun ajaran 2025/2026
        </p>
      </div>

      {/* Ranking */}
      <div className="bg-card border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Peringkat Kelas</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <p className="text-3xl font-bold text-primary">3</p>
            <p className="text-xs text-muted-foreground mt-1">Peringkat di Kelas</p>
            <p className="text-[10px] text-muted-foreground">dari 32 santri</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <p className="text-3xl font-bold text-blue-600">12</p>
            <p className="text-xs text-muted-foreground mt-1">Peringkat Paralel</p>
            <p className="text-[10px] text-muted-foreground">dari 128 santri</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentGrades;
