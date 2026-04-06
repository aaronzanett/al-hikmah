import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Award, FileText, Download, GraduationCap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateReportPdf } from "@/lib/generateReportPdf";

interface SubjectScore { name: string; score: number; grade: string; teacher: string; tugas: number; uts: number; uas: number; praktik: number; }
interface SemesterInfo { subjects: SubjectScore[]; rank: number; totalClass: number; hafalan: number; }
const semesterData: Record<string, SemesterInfo> = {
  "Ganjil 2024/2025": {
    subjects: [
      { name: "Matematika", score: 82, grade: "A-", teacher: "Ust. Budi", tugas: 80, uts: 78, uas: 85, praktik: 84 },
      { name: "Bahasa Indonesia", score: 80, grade: "A-", teacher: "Ust. Siti", tugas: 78, uts: 82, uas: 80, praktik: 79 },
      { name: "Bahasa Inggris", score: 85, grade: "A", teacher: "Miss Sarah", tugas: 84, uts: 86, uas: 85, praktik: 85 },
      { name: "Bahasa Arab", score: 88, grade: "A", teacher: "Ust. Hamid", tugas: 86, uts: 90, uas: 88, praktik: 87 },
      { name: "Fiqih", score: 84, grade: "A-", teacher: "Ust. Yusuf", tugas: 82, uts: 85, uas: 84, praktik: 83 },
      { name: "Fisika", score: 75, grade: "B+", teacher: "Ust. Rudi", tugas: 74, uts: 76, uas: 75, praktik: 74 },
      { name: "Kimia", score: 76, grade: "B+", teacher: "Ust. Dewi", tugas: 75, uts: 78, uas: 76, praktik: 74 },
      { name: "Biologi", score: 79, grade: "B+", teacher: "Ust. Rina", tugas: 78, uts: 80, uas: 79, praktik: 78 },
      { name: "Tafsir Al-Qur'an", score: 90, grade: "A+", teacher: "Ust. Ahmad", tugas: 88, uts: 92, uas: 90, praktik: 89 },
      { name: "Hadits", score: 87, grade: "A", teacher: "Ust. Khaled", tugas: 85, uts: 88, uas: 87, praktik: 86 },
    ],
    rank: 5, totalClass: 32, hafalan: 12,
  },
  "Genap 2024/2025": {
    subjects: [
      { name: "Matematika", score: 85, grade: "A", teacher: "Ust. Budi", tugas: 83, uts: 84, uas: 87, praktik: 86 },
      { name: "Bahasa Indonesia", score: 83, grade: "A-", teacher: "Ust. Siti", tugas: 82, uts: 84, uas: 83, praktik: 82 },
      { name: "Bahasa Inggris", score: 87, grade: "A", teacher: "Miss Sarah", tugas: 86, uts: 88, uas: 87, praktik: 86 },
      { name: "Bahasa Arab", score: 90, grade: "A+", teacher: "Ust. Hamid", tugas: 88, uts: 91, uas: 90, praktik: 89 },
      { name: "Fiqih", score: 86, grade: "A", teacher: "Ust. Yusuf", tugas: 84, uts: 87, uas: 86, praktik: 85 },
      { name: "Fisika", score: 77, grade: "B+", teacher: "Ust. Rudi", tugas: 75, uts: 78, uas: 77, praktik: 76 },
      { name: "Kimia", score: 78, grade: "B+", teacher: "Ust. Dewi", tugas: 77, uts: 79, uas: 78, praktik: 76 },
      { name: "Biologi", score: 81, grade: "A-", teacher: "Ust. Rina", tugas: 80, uts: 82, uas: 81, praktik: 80 },
      { name: "Tafsir Al-Qur'an", score: 93, grade: "A+", teacher: "Ust. Ahmad", tugas: 91, uts: 94, uas: 93, praktik: 92 },
      { name: "Hadits", score: 89, grade: "A", teacher: "Ust. Khaled", tugas: 87, uts: 90, uas: 89, praktik: 88 },
    ],
    rank: 4, totalClass: 32, hafalan: 13,
  },
  "Ganjil 2025/2026": {
    subjects: [
      { name: "Matematika", score: 88, grade: "A", teacher: "Ust. Budi", tugas: 86, uts: 87, uas: 90, praktik: 89 },
      { name: "Bahasa Indonesia", score: 85, grade: "A", teacher: "Ust. Siti", tugas: 84, uts: 86, uas: 85, praktik: 84 },
      { name: "Bahasa Inggris", score: 90, grade: "A+", teacher: "Miss Sarah", tugas: 89, uts: 91, uas: 90, praktik: 89 },
      { name: "Bahasa Arab", score: 92, grade: "A+", teacher: "Ust. Hamid", tugas: 90, uts: 93, uas: 92, praktik: 91 },
      { name: "Fiqih", score: 88, grade: "A", teacher: "Ust. Yusuf", tugas: 86, uts: 89, uas: 88, praktik: 87 },
      { name: "Fisika", score: 78, grade: "B+", teacher: "Ust. Rudi", tugas: 76, uts: 79, uas: 78, praktik: 77 },
      { name: "Kimia", score: 80, grade: "A-", teacher: "Ust. Dewi", tugas: 79, uts: 81, uas: 80, praktik: 78 },
      { name: "Biologi", score: 83, grade: "A-", teacher: "Ust. Rina", tugas: 82, uts: 84, uas: 83, praktik: 82 },
      { name: "Tafsir Al-Qur'an", score: 95, grade: "A+", teacher: "Ust. Ahmad", tugas: 93, uts: 96, uas: 95, praktik: 94 },
      { name: "Hadits", score: 91, grade: "A+", teacher: "Ust. Khaled", tugas: 89, uts: 92, uas: 91, praktik: 90 },
    ],
    rank: 3, totalClass: 32, hafalan: 15,
  },
};

const semesters = Object.keys(semesterData);

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

const PortalGrades = () => {
  const [selectedSemester, setSelectedSemester] = useState(semesters[semesters.length - 1]);
  const [showReport, setShowReport] = useState(false);
  const data = semesterData[selectedSemester];
  const subjects = data.subjects;
  const avg = (subjects.reduce((a, b) => a + b.score, 0) / subjects.length).toFixed(1);

  const handleDownloadPdf = () => {
    generateReportPdf({
      studentName: "Muhammad Azzam Ridwan",
      nis: "2024.001",
      kelas: "10 IPA-A",
      semester: selectedSemester,
      subjects,
      avg,
      rank: data.rank,
      totalClass: data.totalClass,
      hafalan: data.hafalan,
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">Nilai / Rapor</h2>
        <Button size="sm" variant="outline" onClick={() => setShowReport(true)} className="gap-1.5 text-xs">
          <FileText className="h-3.5 w-3.5" />
          Lihat Rapor
        </Button>
      </div>

      {/* Semester Selector */}
      <Select value={selectedSemester} onValueChange={setSelectedSemester}>
        <SelectTrigger className="w-full rounded-xl bg-card border h-12 text-sm font-medium">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {semesters.map(s => (
            <SelectItem key={s} value={s} className="text-sm">
              Semester {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Rata-rata", value: avg, icon: TrendingUp, color: "text-primary" },
          { label: "Tertinggi", value: Math.max(...subjects.map(s => s.score)).toString(), icon: Award, color: "text-green-600" },
          { label: "Peringkat", value: `${data.rank} / ${data.totalClass}`, icon: null, color: "text-foreground" },
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
          <p className="text-xs text-muted-foreground">Semester {selectedSemester} · Kelas 10 IPA-A</p>
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
                  <div className="h-full rounded-full bg-primary/60 transition-all" style={{ width: `${sub.score}%` }} />
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
              <span className="font-semibold text-primary">{data.hafalan} / 30 Juz</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full gradient-primary" style={{ width: `${Math.round((data.hafalan / 30) * 100)}%` }} />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-primary">{Math.round((data.hafalan / 30) * 100)}%</p>
            <p className="text-[10px] text-muted-foreground">Selesai</p>
          </div>
        </div>
      </div>

      {/* Report Card Modal */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Rapor Semester {selectedSemester}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-xl p-4 space-y-1">
              <p className="text-sm font-semibold text-foreground">Muhammad Azzam Ridwan</p>
              <p className="text-xs text-muted-foreground">NIS: 2024.001 · Kelas 10 IPA-A · Semester {selectedSemester}</p>
            </div>

            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="px-3 py-2 text-left font-semibold text-foreground">Mata Pelajaran</th>
                    <th className="px-2 py-2 text-center font-semibold text-foreground">Tugas</th>
                    <th className="px-2 py-2 text-center font-semibold text-foreground">UTS</th>
                    <th className="px-2 py-2 text-center font-semibold text-foreground">UAS</th>
                    <th className="px-2 py-2 text-center font-semibold text-foreground">Praktik</th>
                    <th className="px-2 py-2 text-center font-semibold text-foreground">Rata-rata</th>
                    <th className="px-2 py-2 text-center font-semibold text-foreground">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {subjects.map(sub => (
                    <tr key={sub.name}>
                      <td className="px-3 py-2 font-medium text-foreground">{sub.name}</td>
                      <td className="px-2 py-2 text-center text-muted-foreground">{sub.tugas}</td>
                      <td className="px-2 py-2 text-center text-muted-foreground">{sub.uts}</td>
                      <td className="px-2 py-2 text-center text-muted-foreground">{sub.uas}</td>
                      <td className="px-2 py-2 text-center text-muted-foreground">{sub.praktik}</td>
                      <td className={`px-2 py-2 text-center font-bold ${getScoreColor(sub.score)}`}>{sub.score}</td>
                      <td className="px-2 py-2 text-center">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${getGradeColor(sub.grade)}`}>{sub.grade}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/30 border-t font-semibold">
                    <td className="px-3 py-2 text-foreground" colSpan={5}>Rata-rata Keseluruhan</td>
                    <td className="px-2 py-2 text-center text-primary font-bold">{avg}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/30 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Peringkat Kelas</p>
                <p className="text-2xl font-bold text-primary">{data.rank} <span className="text-xs font-normal text-muted-foreground">/ {data.totalClass}</span></p>
              </div>
              <div className="bg-muted/30 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Hafalan</p>
                <p className="text-2xl font-bold text-primary">{data.hafalan} <span className="text-xs font-normal text-muted-foreground">/ 30 Juz</span></p>
              </div>
            </div>

            <Button className="w-full gap-2" onClick={handleDownloadPdf}>
              <Download className="h-4 w-4" />
              Download Rapor PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PortalGrades;
