import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  GraduationCap, FileText, Palette, Eye, Save, RotateCcw,
  Building2, User, Stamp, Printer, ChevronDown, ChevronUp,
  Plus, Trash2, GripVertical, Settings2, BookOpen, Award,
  Download, FileDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  exportReportDocx, exportReportPdf, loadReportConfig, saveReportConfig,
  type StudentReportData, type ReportConfig as ExportReportConfig,
} from "@/lib/reportCardExport";

// ─── Types ───
interface GradeScale {
  grade: string;
  min: number;
  max: number;
  description: string;
}

interface ExamWeight {
  type: string;
  weight: number;
  enabled: boolean;
}

interface ReportElement {
  id: string;
  label: string;
  enabled: boolean;
  description: string;
}

interface ReportConfig {
  institutionName: string;
  institutionAddress: string;
  institutionPhone: string;
  institutionEmail: string;
  npsn: string;
  curriculum: string;
  academicYear: string;
  principalName: string;
  principalNip: string;
  paperSize: string;
  orientation: string;
  showLogo: boolean;
  showSchoolHeader: boolean;
  headerStyle: string;
  gradeScales: GradeScale[];
  examWeights: ExamWeight[];
  reportElements: ReportElement[];
  classTeacherNote: boolean;
  principalSignature: boolean;
  parentSignature: boolean;
  stampSeal: boolean;
  attendanceSummary: boolean;
  extracurricularSection: boolean;
  behaviorGrades: boolean;
  rankingDisplay: string;
  passingGrade: number;
  showPercentage: boolean;
  showBarChart: boolean;
}

const defaultConfig: ReportConfig = {
  institutionName: "Pesantren Al-Hikmah",
  institutionAddress: "Jl. Pondok Pesantren No. 123, Kec. Cikarang, Kabupaten Bekasi, Jawa Barat 17530",
  institutionPhone: "(021) 8888-1234",
  institutionEmail: "info@alhikmah.sch.id",
  npsn: "20543210",
  curriculum: "k13-pesantren",
  academicYear: "2024/2025",
  principalName: "Ust. Ahmad Hidayat, M.Pd.I",
  principalNip: "197503121998031002",
  paperSize: "a4",
  orientation: "portrait",
  showLogo: true,
  showSchoolHeader: true,
  headerStyle: "centered",
  gradeScales: [
    { grade: "A+", min: 95, max: 100, description: "Istimewa" },
    { grade: "A", min: 90, max: 94, description: "Sangat Baik" },
    { grade: "A-", min: 85, max: 89, description: "Baik Sekali" },
    { grade: "B+", min: 80, max: 84, description: "Baik" },
    { grade: "B", min: 75, max: 79, description: "Cukup Baik" },
    { grade: "B-", min: 70, max: 74, description: "Cukup" },
    { grade: "C+", min: 65, max: 69, description: "Hampir Cukup" },
    { grade: "C", min: 60, max: 64, description: "Kurang" },
    { grade: "D", min: 0, max: 59, description: "Sangat Kurang" },
  ],
  examWeights: [
    { type: "Tugas", weight: 20, enabled: true },
    { type: "UTS", weight: 25, enabled: true },
    { type: "UAS", weight: 35, enabled: true },
    { type: "Praktik", weight: 20, enabled: true },
  ],
  reportElements: [
    { id: "header", label: "Kop Surat / School Header", enabled: true, description: "Logo dan identitas sekolah di bagian atas" },
    { id: "student_info", label: "Identitas Santri / Student Info", enabled: true, description: "Nama, NIS, kelas, semester" },
    { id: "grade_table", label: "Tabel Nilai / Grade Table", enabled: true, description: "Tabel nilai per mata pelajaran" },
    { id: "score_detail", label: "Rincian Skor / Score Detail", enabled: true, description: "Tampilkan skor per jenis ujian" },
    { id: "average", label: "Rata-rata / Average", enabled: true, description: "Rata-rata nilai keseluruhan" },
    { id: "ranking", label: "Peringkat / Ranking", enabled: false, description: "Peringkat di kelas" },
    { id: "attendance", label: "Kehadiran / Attendance", enabled: true, description: "Ringkasan kehadiran santri" },
    { id: "extracurricular", label: "Ekstrakurikuler / Extracurricular", enabled: false, description: "Kegiatan di luar akademik" },
    { id: "behavior", label: "Sikap & Perilaku / Behavior", enabled: true, description: "Penilaian sikap dan perilaku" },
    { id: "teacher_note", label: "Catatan Wali Kelas / Teacher Note", enabled: true, description: "Catatan khusus dari wali kelas" },
    { id: "signatures", label: "Tanda Tangan / Signatures", enabled: true, description: "Tanda tangan kepala sekolah & wali kelas" },
  ],
  classTeacherNote: true,
  principalSignature: true,
  parentSignature: true,
  stampSeal: true,
  attendanceSummary: true,
  extracurricularSection: false,
  behaviorGrades: true,
  rankingDisplay: "none",
  passingGrade: 70,
  showPercentage: true,
  showBarChart: false,
};

// ─── Grade Scale Color ───
const scaleColor = (min: number) => {
  if (min >= 90) return "bg-green-500";
  if (min >= 80) return "bg-primary";
  if (min >= 70) return "bg-amber-500";
  if (min >= 60) return "bg-orange-500";
  return "bg-destructive";
};

// ─── Live Preview Component ───
function ReportCardPreview({ config }: { config: ReportConfig }) {
  const enabledElements = config.reportElements.filter(e => e.enabled);
  const sampleSubjects = [
    { name: "Al-Quran & Tajwid", tugas: 93, uts: 95, uas: 96, praktik: 94 },
    { name: "Fiqih", tugas: 82, uts: 85, uas: 88, praktik: null },
    { name: "Bahasa Arab", tugas: 88, uts: 90, uas: 92, praktik: 91 },
    { name: "Matematika", tugas: 75, uts: 78, uas: 82, praktik: null },
    { name: "IPA", tugas: 80, uts: 77, uas: 81, praktik: 79 },
    { name: "Bahasa Indonesia", tugas: null, uts: 83, uas: 85, praktik: null },
    { name: "Bahasa Inggris", tugas: null, uts: 79, uas: 82, praktik: null },
    { name: "Hadits", tugas: null, uts: 86, uas: 88, praktik: null },
  ];

  const calcAvg = (s: typeof sampleSubjects[0]) => {
    const vals: number[] = [];
    if (s.tugas !== null) vals.push(s.tugas);
    if (s.uts !== null) vals.push(s.uts);
    if (s.uas !== null) vals.push(s.uas);
    if (s.praktik !== null) vals.push(s.praktik);
    return vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  };

  const getGrade = (score: number) => {
    for (const s of config.gradeScales) {
      if (score >= s.min && score <= s.max) return s.grade;
    }
    return "D";
  };

  const hasElement = (id: string) => enabledElements.some(e => e.id === id);

  return (
    <div className="bg-white text-black rounded-lg shadow-lg border-2 border-muted overflow-hidden" style={{ fontSize: "10px", maxWidth: config.orientation === "landscape" ? "100%" : "400px", margin: "0 auto" }}>
      {/* Header */}
      {hasElement("header") && (
        <div className={cn("border-b-2 border-black px-4 py-3", config.headerStyle === "centered" ? "text-center" : "text-left")}>
          <div className="flex items-center justify-center gap-3">
            {config.showLogo && (
              <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
            )}
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wide">{config.institutionName}</h2>
              <p className="text-[8px] leading-tight">{config.institutionAddress}</p>
              <p className="text-[8px]">{config.institutionPhone} | {config.institutionEmail}</p>
              {config.npsn && <p className="text-[8px] font-medium">NPSN: {config.npsn}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="text-center py-2 border-b border-black/30">
        <h3 className="font-bold text-xs uppercase tracking-widest">Laporan Hasil Belajar Santri</h3>
        <p className="text-[8px]">Tahun Pelajaran {config.academicYear} — Semester Ganjil</p>
        <p className="text-[8px]">Kurikulum: {config.curriculum === "k13-pesantren" ? "K13 + Pesantren" : config.curriculum === "merdeka" ? "Merdeka" : "K13"}</p>
      </div>

      {/* Student Info */}
      {hasElement("student_info") && (
        <div className="px-4 py-2 border-b border-black/20 grid grid-cols-2 gap-x-4 gap-y-0.5">
          <p><span className="font-semibold">Nama:</span> Ahmad Fauzi</p>
          <p><span className="font-semibold">NIS:</span> 2024001</p>
          <p><span className="font-semibold">Kelas:</span> X-A</p>
          <p><span className="font-semibold">Asrama:</span> Al-Farabi</p>
        </div>
      )}

      {/* Grade Table */}
      {hasElement("grade_table") && (
        <div className="px-3 py-2">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black/40 px-1.5 py-1 text-left font-semibold">No</th>
                <th className="border border-black/40 px-1.5 py-1 text-left font-semibold">Mata Pelajaran</th>
                {hasElement("score_detail") && (
                  <>
                    {config.examWeights.filter(w => w.enabled).map(w => (
                      <th key={w.type} className="border border-black/40 px-1 py-1 text-center font-semibold">{w.type}</th>
                    ))}
                  </>
                )}
                <th className="border border-black/40 px-1 py-1 text-center font-semibold">Rata²</th>
                <th className="border border-black/40 px-1 py-1 text-center font-semibold">Nilai</th>
                {config.showPercentage && <th className="border border-black/40 px-1 py-1 text-center font-semibold">%</th>}
              </tr>
            </thead>
            <tbody>
              {sampleSubjects.map((subj, i) => {
                const avg = calcAvg(subj);
                const grade = getGrade(avg);
                return (
                  <tr key={subj.name} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                    <td className="border border-black/30 px-1.5 py-0.5 text-center">{i + 1}</td>
                    <td className="border border-black/30 px-1.5 py-0.5">{subj.name}</td>
                    {hasElement("score_detail") && (
                      <>
                        {config.examWeights.filter(w => w.enabled).map(w => {
                          const key = w.type.toLowerCase() as keyof typeof subj;
                          const val = subj[key] as number | null;
                          return (
                            <td key={w.type} className="border border-black/30 px-1 py-0.5 text-center">
                              {val !== null ? val : "—"}
                            </td>
                          );
                        })}
                      </>
                    )}
                    <td className="border border-black/30 px-1 py-0.5 text-center font-semibold">{avg}</td>
                    <td className="border border-black/30 px-1 py-0.5 text-center font-bold">{grade}</td>
                    {config.showPercentage && <td className="border border-black/30 px-1 py-0.5 text-center">{avg}%</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {hasElement("average") && (
            <div className="flex justify-end mt-1 gap-4 font-semibold">
              <span>Rata-rata Keseluruhan: {Math.round(sampleSubjects.reduce((a, b) => a + calcAvg(b), 0) / sampleSubjects.length)}</span>
              {hasElement("ranking") && <span>Peringkat: 3 dari 32</span>}
            </div>
          )}
        </div>
      )}

      {/* Attendance */}
      {hasElement("attendance") && (
        <div className="px-4 py-2 border-t border-black/20">
          <p className="font-semibold mb-1">Kehadiran / Attendance:</p>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center"><span className="font-bold">108</span><br /><span className="text-[8px]">Hadir</span></div>
            <div className="text-center"><span className="font-bold">2</span><br /><span className="text-[8px]">Sakit</span></div>
            <div className="text-center"><span className="font-bold">1</span><br /><span className="text-[8px]">Izin</span></div>
            <div className="text-center"><span className="font-bold">0</span><br /><span className="text-[8px]">Alpha</span></div>
          </div>
        </div>
      )}

      {/* Behavior */}
      {hasElement("behavior") && (
        <div className="px-4 py-2 border-t border-black/20">
          <p className="font-semibold mb-1">Sikap & Perilaku / Behavior:</p>
          <div className="grid grid-cols-2 gap-1">
            <p>Kedisiplinan: <span className="font-bold">A</span></p>
            <p>Akhlak: <span className="font-bold">A</span></p>
            <p>Kebersihan: <span className="font-bold">B+</span></p>
            <p>Keaktifan: <span className="font-bold">A</span></p>
          </div>
        </div>
      )}

      {/* Extracurricular */}
      {hasElement("extracurricular") && (
        <div className="px-4 py-2 border-t border-black/20">
          <p className="font-semibold mb-1">Ekstrakurikuler:</p>
          <p>1. Tahfidz — <span className="font-bold">Sangat Baik</span></p>
          <p>2. Pramuka — <span className="font-bold">Baik</span></p>
        </div>
      )}

      {/* Teacher Note */}
      {hasElement("teacher_note") && (
        <div className="px-4 py-2 border-t border-black/20">
          <p className="font-semibold mb-1">Catatan Wali Kelas:</p>
          <p className="italic text-[9px] border border-dashed border-black/30 rounded px-2 py-1 min-h-[24px]">
            Ahmad menunjukkan perkembangan yang sangat baik di semester ini. Perlu ditingkatkan lagi di bidang Matematika.
          </p>
        </div>
      )}

      {/* Signatures */}
      {hasElement("signatures") && (
        <div className="px-4 py-3 border-t border-black/20">
          <div className="flex justify-between items-end">
            {config.parentSignature && (
              <div className="text-center">
                <p>Orang Tua/Wali</p>
                <div className="h-10 w-24 border-b border-black/30 mt-1" />
                <p className="mt-1">(......................)</p>
              </div>
            )}
            <div className="text-center">
              <p>Wali Kelas</p>
              <div className="h-10 w-24 border-b border-black/30 mt-1" />
              <p className="mt-1">Ust. Abdullah, S.Pd</p>
            </div>
            {config.principalSignature && (
              <div className="text-center">
                <p>Kepala Sekolah</p>
                {config.stampSeal && (
                  <div className="relative">
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border border-dashed border-black/40 flex items-center justify-center">
                      <Stamp className="w-3 h-3 text-black/30" />
                    </div>
                  </div>
                )}
                <div className="h-10 w-24 border-b border-black/30 mt-1" />
                <p className="mt-1">{config.principalName}</p>
                <p className="text-[8px]">NIP. {config.principalNip}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* KKM/Passing Grade Legend */}
      <div className="px-4 py-1.5 bg-gray-50 border-t border-black/20 text-[8px]">
        <p>KKM (Kriteria Ketuntasan Minimal): <span className="font-bold">{config.passingGrade}</span> | Format: {config.paperSize.toUpperCase()} {config.orientation}</p>
      </div>
    </div>
  );
}

// ─── Main Component ───
const sampleStudentData: StudentReportData = {
  studentName: "Ahmad Fauzi",
  nis: "2024001",
  kelas: "X-A",
  semester: "Ganjil 2024/2025",
  subjects: [
    { name: "Al-Quran & Tajwid", tugas: 93, uts: 95, uas: 96, praktik: 94 },
    { name: "Fiqih", tugas: 82, uts: 85, uas: 88, praktik: null },
    { name: "Bahasa Arab", tugas: 88, uts: 90, uas: 92, praktik: 91 },
    { name: "Matematika", tugas: 75, uts: 78, uas: 82, praktik: null },
    { name: "IPA", tugas: 80, uts: 77, uas: 81, praktik: 79 },
    { name: "Bahasa Indonesia", tugas: null, uts: 83, uas: 85, praktik: null },
    { name: "Bahasa Inggris", tugas: null, uts: 79, uas: 82, praktik: null },
    { name: "Hadits", tugas: null, uts: 86, uas: 88, praktik: null },
  ],
  rank: 3,
  totalClass: 32,
  hafalan: 15,
  attendance: { hadir: 108, sakit: 2, izin: 1, alpha: 0 },
  teacherNote: "Ahmad menunjukkan perkembangan yang sangat baik di semester ini. Perlu ditingkatkan lagi di bidang Matematika.",
  teacherName: "Ust. Abdullah, S.Pd",
};

const ReportCardSettings = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<ReportConfig>(() => {
    const saved = loadReportConfig();
    return saved ? { ...defaultConfig, ...saved } as ReportConfig : defaultConfig;
  });
  const [showPreview, setShowPreview] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>("institution");
  const [exporting, setExporting] = useState(false);

  // Auto-save to localStorage on every config change
  useEffect(() => {
    saveReportConfig(config as ExportReportConfig);
  }, [config]);

  const update = <K extends keyof ReportConfig>(key: K, value: ReportConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateScale = (idx: number, field: keyof GradeScale, value: any) => {
    const updated = [...config.gradeScales];
    updated[idx] = { ...updated[idx], [field]: field === "min" || field === "max" ? Number(value) : value };
    update("gradeScales", updated);
  };

  const updateWeight = (idx: number, field: keyof ExamWeight, value: any) => {
    const updated = [...config.examWeights];
    updated[idx] = { ...updated[idx], [field]: field === "weight" ? Number(value) : value };
    update("examWeights", updated);
  };

  const toggleElement = (id: string) => {
    const updated = config.reportElements.map(e =>
      e.id === id ? { ...e, enabled: !e.enabled } : e
    );
    update("reportElements", updated);
  };

  const addExamWeight = () => {
    update("examWeights", [...config.examWeights, { type: "Ujian Baru", weight: 0, enabled: true }]);
  };

  const removeExamWeight = (idx: number) => {
    update("examWeights", config.examWeights.filter((_, i) => i !== idx));
  };

  const totalWeight = config.examWeights.filter(w => w.enabled).reduce((a, b) => a + b.weight, 0);

  const handleSave = () => {
    if (totalWeight !== 100) {
      toast({ title: "Total bobot harus 100%", description: `Saat ini: ${totalWeight}%`, variant: "destructive" });
      return;
    }
    saveReportConfig(config as ExportReportConfig);
    toast({ title: "Pengaturan rapor berhasil disimpan / Report card settings saved" });
  };

  const handleReset = () => {
    setConfig(defaultConfig);
    toast({ title: "Pengaturan dikembalikan ke default / Settings reset to default" });
  };

  const handleExportPdf = () => {
    exportReportPdf(sampleStudentData, config as ExportReportConfig);
    toast({ title: "PDF rapor berhasil diunduh" });
  };

  const handleExportDocx = async () => {
    setExporting(true);
    try {
      await exportReportDocx(sampleStudentData, config as ExportReportConfig);
      toast({ title: "Word rapor berhasil diunduh (.docx)" });
    } catch (err) {
      toast({ title: "Gagal mengunduh Word", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  const Section = ({ id, title, icon: Icon, children }: { id: string; title: string; icon: any; children: React.ReactNode }) => {
    const isOpen = expandedSection === id;
    return (
      <div className="bg-card border rounded-xl shadow-card overflow-hidden">
        <button
          onClick={() => setExpandedSection(isOpen ? null : id)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">{title}</span>
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {isOpen && <div className="px-4 pb-5 pt-1 space-y-4 border-t">{children}</div>}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-foreground">Format Rapor / Report Card</h1>
          <p className="text-sm text-muted-foreground">Konfigurasi lengkap format, isi, dan tampilan rapor santri</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="h-4 w-4 mr-1" /> {showPreview ? "Sembunyikan" : "Tampilkan"} Preview
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1" /> Reset
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" /> Simpan
          </Button>
        </div>
      </div>

      <div className={cn("grid gap-5", showPreview ? "grid-cols-1 xl:grid-cols-[1fr_420px]" : "grid-cols-1 max-w-3xl")}>
        {/* Settings Panel */}
        <div className="space-y-4">
          <Tabs defaultValue="format" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="format" className="text-xs"><FileText className="h-3.5 w-3.5 mr-1" /> Format</TabsTrigger>
              <TabsTrigger value="grading" className="text-xs"><Award className="h-3.5 w-3.5 mr-1" /> Penilaian</TabsTrigger>
              <TabsTrigger value="content" className="text-xs"><BookOpen className="h-3.5 w-3.5 mr-1" /> Konten</TabsTrigger>
              <TabsTrigger value="template" className="text-xs"><Palette className="h-3.5 w-3.5 mr-1" /> Template</TabsTrigger>
            </TabsList>

            {/* ═══ FORMAT TAB ═══ */}
            <TabsContent value="format" className="space-y-4 mt-4">
              <Section id="institution" title="Identitas Institusi / Institution Identity" icon={Building2}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Nama Institusi di Rapor</Label>
                    <Input value={config.institutionName} onChange={e => update("institutionName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">NPSN</Label>
                    <Input value={config.npsn} onChange={e => update("npsn", e.target.value)} placeholder="NPSN" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs">Alamat di Rapor</Label>
                    <Textarea value={config.institutionAddress} onChange={e => update("institutionAddress", e.target.value)} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Telepon</Label>
                    <Input value={config.institutionPhone} onChange={e => update("institutionPhone", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Email</Label>
                    <Input value={config.institutionEmail} onChange={e => update("institutionEmail", e.target.value)} />
                  </div>
                </div>
              </Section>

              <Section id="academic" title="Tahun Ajaran & Kurikulum" icon={GraduationCap}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Tahun Ajaran Aktif</Label>
                    <Select value={config.academicYear} onValueChange={v => update("academicYear", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023/2024">2023/2024</SelectItem>
                        <SelectItem value="2024/2025">2024/2025</SelectItem>
                        <SelectItem value="2025/2026">2025/2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Kurikulum</Label>
                    <Select value={config.curriculum} onValueChange={v => update("curriculum", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="k13-pesantren">K13 + Pesantren</SelectItem>
                        <SelectItem value="merdeka">Kurikulum Merdeka</SelectItem>
                        <SelectItem value="k13">Kurikulum 2013</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">KKM / Passing Grade</Label>
                    <Input type="number" value={config.passingGrade} onChange={e => update("passingGrade", Number(e.target.value))} />
                  </div>
                </div>
              </Section>

              <Section id="print" title="Pengaturan Cetak / Print Settings" icon={Printer}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Ukuran Kertas</Label>
                    <Select value={config.paperSize} onValueChange={v => update("paperSize", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a4">A4 (210 × 297 mm)</SelectItem>
                        <SelectItem value="letter">Letter (216 × 279 mm)</SelectItem>
                        <SelectItem value="f4">F4/Folio (215 × 330 mm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Orientasi</Label>
                    <Select value={config.orientation} onValueChange={v => update("orientation", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Gaya Header</Label>
                    <Select value={config.headerStyle} onValueChange={v => update("headerStyle", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="centered">Tengah / Centered</SelectItem>
                        <SelectItem value="left">Kiri / Left Aligned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <Switch checked={config.showLogo} onCheckedChange={v => update("showLogo", v)} />
                    <Label className="text-xs">Tampilkan Logo</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={config.showPercentage} onCheckedChange={v => update("showPercentage", v)} />
                    <Label className="text-xs">Tampilkan Persentase</Label>
                  </div>
                </div>
              </Section>

              <Section id="signatures" title="Tanda Tangan & Pengesahan" icon={Stamp}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Kepala Sekolah / Principal</Label>
                    <Input value={config.principalName} onChange={e => update("principalName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">NIP Kepala Sekolah</Label>
                    <Input value={config.principalNip} onChange={e => update("principalNip", e.target.value)} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <Switch checked={config.principalSignature} onCheckedChange={v => update("principalSignature", v)} />
                    <Label className="text-xs">TTD Kepala Sekolah</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={config.parentSignature} onCheckedChange={v => update("parentSignature", v)} />
                    <Label className="text-xs">TTD Orang Tua</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={config.stampSeal} onCheckedChange={v => update("stampSeal", v)} />
                    <Label className="text-xs">Stempel / Seal</Label>
                  </div>
                </div>
              </Section>
            </TabsContent>

            {/* ═══ GRADING TAB ═══ */}
            <TabsContent value="grading" className="space-y-4 mt-4">
              {/* Grade Scale */}
              <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">Skala Penilaian / Grading Scale</h3>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{config.gradeScales.length} level</Badge>
                </div>
                <div className="space-y-2">
                  {config.gradeScales.map((scale, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg border bg-muted/10 hover:bg-muted/20 transition-colors">
                      <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                      <span className={cn("w-3 h-3 rounded-full shrink-0", scaleColor(scale.min))} />
                      <Input
                        value={scale.grade}
                        onChange={e => updateScale(idx, "grade", e.target.value)}
                        className="w-14 h-7 text-xs text-center font-bold"
                      />
                      <Input
                        type="number"
                        value={scale.min}
                        onChange={e => updateScale(idx, "min", e.target.value)}
                        className="w-16 h-7 text-xs text-center"
                      />
                      <span className="text-xs text-muted-foreground">–</span>
                      <Input
                        type="number"
                        value={scale.max}
                        onChange={e => updateScale(idx, "max", e.target.value)}
                        className="w-16 h-7 text-xs text-center"
                      />
                      <Input
                        value={scale.description}
                        onChange={e => updateScale(idx, "description", e.target.value)}
                        className="flex-1 h-7 text-xs"
                        placeholder="Deskripsi"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Exam Weights */}
              <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">Bobot Penilaian / Exam Weights</h3>
                  </div>
                  <Badge variant={totalWeight === 100 ? "default" : "destructive"} className="text-[10px]">
                    Total: {totalWeight}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  {config.examWeights.map((w, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg border bg-muted/10">
                      <Switch checked={w.enabled} onCheckedChange={v => updateWeight(idx, "enabled", v)} />
                      <Input
                        value={w.type}
                        onChange={e => updateWeight(idx, "type", e.target.value)}
                        className="flex-1 h-8 text-xs"
                      />
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={w.weight}
                          onChange={e => updateWeight(idx, "weight", e.target.value)}
                          className="w-16 h-8 text-xs text-center"
                          disabled={!w.enabled}
                        />
                        <span className="text-xs text-muted-foreground">%</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => removeExamWeight(idx)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="text-xs" onClick={addExamWeight}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Tambah Jenis Ujian
                </Button>
                {totalWeight !== 100 && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    ⚠️ Total bobot harus 100%. Saat ini: {totalWeight}%
                  </p>
                )}
              </div>
            </TabsContent>

            {/* ═══ CONTENT TAB ═══ */}
            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Elemen Rapor / Report Elements</h3>
                </div>
                <p className="text-xs text-muted-foreground">Pilih elemen yang ditampilkan di rapor. Perubahan akan langsung terlihat di preview.</p>
                <div className="space-y-2">
                  {config.reportElements.map(el => (
                    <div key={el.id} className={cn(
                      "flex items-center justify-between p-3 rounded-lg border transition-colors",
                      el.enabled ? "bg-primary/5 border-primary/20" : "bg-muted/10 border-border"
                    )}>
                      <div className="flex items-center gap-3">
                        <Switch checked={el.enabled} onCheckedChange={() => toggleElement(el.id)} />
                        <div>
                          <p className={cn("text-xs font-medium", el.enabled ? "text-foreground" : "text-muted-foreground")}>{el.label}</p>
                          <p className="text-[10px] text-muted-foreground">{el.description}</p>
                        </div>
                      </div>
                      <Badge variant={el.enabled ? "default" : "outline"} className="text-[10px]">
                        {el.enabled ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Display Options */}
              <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
                <h3 className="text-sm font-semibold">Opsi Tampilan Tambahan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Tampilan Peringkat</Label>
                    <Select value={config.rankingDisplay} onValueChange={v => update("rankingDisplay", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Tidak Ditampilkan</SelectItem>
                        <SelectItem value="class">Peringkat Kelas</SelectItem>
                        <SelectItem value="overall">Peringkat Keseluruhan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ═══ TEMPLATE TAB ═══ */}
            <TabsContent value="template" className="space-y-4 mt-4">
              <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
                <h3 className="text-sm font-semibold">Pilih Template / Choose Template</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: "classic", name: "Klasik / Classic", desc: "Format standar, layout tradisional" },
                    { id: "modern", name: "Modern", desc: "Clean design, visual chart" },
                    { id: "compact", name: "Ringkas / Compact", desc: "Format hemat kertas" },
                  ].map(tmpl => (
                    <button
                      key={tmpl.id}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all hover:shadow-md",
                        "classic" === tmpl.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                      )}
                    >
                      <div className="h-20 rounded-lg bg-muted/50 border mb-2 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                      <p className="text-xs font-semibold text-foreground">{tmpl.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{tmpl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
                <h3 className="text-sm font-semibold">Ringkasan Konfigurasi / Configuration Summary</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex justify-between p-2 rounded-lg bg-muted/20">
                    <span className="text-muted-foreground">Kertas</span>
                    <span className="font-medium">{config.paperSize.toUpperCase()} {config.orientation}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-muted/20">
                    <span className="text-muted-foreground">Kurikulum</span>
                    <span className="font-medium">{config.curriculum === "k13-pesantren" ? "K13+Pesantren" : config.curriculum}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-muted/20">
                    <span className="text-muted-foreground">Skala Nilai</span>
                    <span className="font-medium">{config.gradeScales.length} level</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-muted/20">
                    <span className="text-muted-foreground">Bobot Ujian</span>
                    <span className={cn("font-medium", totalWeight === 100 ? "text-green-600" : "text-destructive")}>{totalWeight}%</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-muted/20">
                    <span className="text-muted-foreground">KKM</span>
                    <span className="font-medium">{config.passingGrade}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-muted/20">
                    <span className="text-muted-foreground">Elemen Aktif</span>
                    <span className="font-medium">{config.reportElements.filter(e => e.enabled).length}/{config.reportElements.length}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview Panel */}
        {showPreview && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Live Preview</span>
              </div>
              <Badge variant="outline" className="text-[10px]">Sample Data</Badge>
            </div>
            <div className="sticky top-4 overflow-y-auto max-h-[calc(100vh-140px)] rounded-xl border bg-muted/20 p-4">
              <ReportCardPreview config={config} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReportCardSettings;
