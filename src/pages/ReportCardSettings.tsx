import { useState, useEffect, useRef } from "react";
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
  Download, FileDown, Upload, File, FileType2, Clock, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  exportReportDocx, exportReportPdf, loadReportConfig, saveReportConfig,
  type StudentReportData, type ReportConfig as ExportReportConfig,
} from "@/lib/reportCardExport";

// ─── Types ───
interface GradeScale { grade: string; min: number; max: number; description: string; }
interface ExamWeight { type: string; weight: number; enabled: boolean; }
interface ReportElement { id: string; label: string; enabled: boolean; description: string; }

interface UploadedTemplate {
  id: string;
  name: string;
  type: "pdf" | "docx";
  size: number;
  uploadedAt: string;
  dataUrl: string; // base64 data URL
  isActive: boolean;
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

const scaleColor = (min: number) => {
  if (min >= 90) return "bg-green-500";
  if (min >= 80) return "bg-primary";
  if (min >= 70) return "bg-amber-500";
  if (min >= 60) return "bg-orange-500";
  return "bg-destructive";
};

// ─── Template Storage ───
const TEMPLATES_KEY = "report-card-templates";

function loadTemplates(): UploadedTemplate[] {
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveTemplates(templates: UploadedTemplate[]) {
  try {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  } catch (e) {
    console.warn("Failed to save templates (storage limit):", e);
  }
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Live Preview with proper A4 ratio ───
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

  // A4 ratio: 210mm x 297mm = 1:1.4142
  const paperRatios: Record<string, number> = {
    a4: 297 / 210,
    letter: 279 / 216,
    f4: 330 / 215,
  };
  const ratio = config.orientation === "landscape"
    ? 1 / (paperRatios[config.paperSize] || paperRatios.a4)
    : (paperRatios[config.paperSize] || paperRatios.a4);

  return (
    <div className="relative w-full" style={{ paddingBottom: `${ratio * 100}%` }}>
      <div
        className="absolute inset-0 bg-white text-black rounded-lg shadow-xl border overflow-y-auto"
        style={{ fontSize: "9px" }}
      >
        <div className="p-5">
          {/* Header */}
          {hasElement("header") && (
            <div className={cn("border-b-2 border-black pb-3 mb-3", config.headerStyle === "centered" ? "text-center" : "text-left")}>
              <div className="flex items-center justify-center gap-2">
                {config.showLogo && (
                  <div className="w-9 h-9 rounded-full border-2 border-black flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <h2 className="font-bold text-[11px] uppercase tracking-wide">{config.institutionName}</h2>
                  <p className="text-[7px] leading-tight">{config.institutionAddress}</p>
                  <p className="text-[7px]">{config.institutionPhone} | {config.institutionEmail}</p>
                  {config.npsn && <p className="text-[7px] font-medium">NPSN: {config.npsn}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div className="text-center py-2 mb-2">
            <h3 className="font-bold text-[10px] uppercase tracking-widest">Laporan Hasil Belajar Santri</h3>
            <p className="text-[7px]">Tahun Pelajaran {config.academicYear} — Semester Ganjil</p>
          </div>

          {/* Student Info */}
          {hasElement("student_info") && (
            <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-0.5 border-b border-black/20 pb-2">
              <p><span className="font-semibold">Nama:</span> Ahmad Fauzi</p>
              <p><span className="font-semibold">NIS:</span> 2024001</p>
              <p><span className="font-semibold">Kelas:</span> X-A</p>
              <p><span className="font-semibold">Asrama:</span> Al-Farabi</p>
            </div>
          )}

          {/* Grade Table */}
          {hasElement("grade_table") && (
            <div className="mb-3">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black/40 px-1 py-0.5 text-left font-semibold w-5">No</th>
                    <th className="border border-black/40 px-1 py-0.5 text-left font-semibold">Mata Pelajaran</th>
                    {hasElement("score_detail") && config.examWeights.filter(w => w.enabled).map(w => (
                      <th key={w.type} className="border border-black/40 px-0.5 py-0.5 text-center font-semibold">{w.type}</th>
                    ))}
                    <th className="border border-black/40 px-0.5 py-0.5 text-center font-semibold">Rata²</th>
                    <th className="border border-black/40 px-0.5 py-0.5 text-center font-semibold">Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleSubjects.map((subj, i) => {
                    const avg = calcAvg(subj);
                    const grade = getGrade(avg);
                    return (
                      <tr key={subj.name} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                        <td className="border border-black/30 px-1 py-0.5 text-center">{i + 1}</td>
                        <td className="border border-black/30 px-1 py-0.5">{subj.name}</td>
                        {hasElement("score_detail") && config.examWeights.filter(w => w.enabled).map(w => {
                          const key = w.type.toLowerCase() as keyof typeof subj;
                          const val = subj[key] as number | null;
                          return <td key={w.type} className="border border-black/30 px-0.5 py-0.5 text-center">{val !== null ? val : "—"}</td>;
                        })}
                        <td className="border border-black/30 px-0.5 py-0.5 text-center font-semibold">{avg}</td>
                        <td className="border border-black/30 px-0.5 py-0.5 text-center font-bold">{grade}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {hasElement("average") && (
                <div className="flex justify-end mt-1 gap-4 font-semibold text-[8px]">
                  <span>Rata-rata: {Math.round(sampleSubjects.reduce((a, b) => a + calcAvg(b), 0) / sampleSubjects.length)}</span>
                  {hasElement("ranking") && <span>Peringkat: 3 dari 32</span>}
                </div>
              )}
            </div>
          )}

          {/* Attendance */}
          {hasElement("attendance") && (
            <div className="mb-2 border-t border-black/20 pt-2">
              <p className="font-semibold mb-0.5">Kehadiran:</p>
              <div className="grid grid-cols-4 gap-1 text-center">
                <div><span className="font-bold">108</span><br /><span className="text-[7px]">Hadir</span></div>
                <div><span className="font-bold">2</span><br /><span className="text-[7px]">Sakit</span></div>
                <div><span className="font-bold">1</span><br /><span className="text-[7px]">Izin</span></div>
                <div><span className="font-bold">0</span><br /><span className="text-[7px]">Alpha</span></div>
              </div>
            </div>
          )}

          {/* Behavior */}
          {hasElement("behavior") && (
            <div className="mb-2 border-t border-black/20 pt-2">
              <p className="font-semibold mb-0.5">Sikap & Perilaku:</p>
              <div className="grid grid-cols-2 gap-0.5">
                <p>Kedisiplinan: <span className="font-bold">A</span></p>
                <p>Akhlak: <span className="font-bold">A</span></p>
                <p>Kebersihan: <span className="font-bold">B+</span></p>
                <p>Keaktifan: <span className="font-bold">A</span></p>
              </div>
            </div>
          )}

          {/* Teacher Note */}
          {hasElement("teacher_note") && (
            <div className="mb-2 border-t border-black/20 pt-2">
              <p className="font-semibold mb-0.5">Catatan Wali Kelas:</p>
              <p className="italic text-[8px] border border-dashed border-black/30 rounded px-1.5 py-1">
                Ahmad menunjukkan perkembangan yang sangat baik di semester ini.
              </p>
            </div>
          )}

          {/* Signatures */}
          {hasElement("signatures") && (
            <div className="border-t border-black/20 pt-3 mt-3">
              <div className="flex justify-between items-end text-center">
                {config.parentSignature && (
                  <div>
                    <p>Orang Tua/Wali</p>
                    <div className="h-8 w-20 border-b border-black/30 mt-1" />
                    <p className="mt-0.5 text-[7px]">(......................)</p>
                  </div>
                )}
                <div>
                  <p>Wali Kelas</p>
                  <div className="h-8 w-20 border-b border-black/30 mt-1" />
                  <p className="mt-0.5 text-[7px]">Ust. Abdullah, S.Pd</p>
                </div>
                {config.principalSignature && (
                  <div>
                    <p>Kepala Sekolah</p>
                    <div className="h-8 w-20 border-b border-black/30 mt-1" />
                    <p className="mt-0.5 text-[7px]">{config.principalName}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-1 bg-gray-50 border-t border-black/20 text-[7px]">
          <p>KKM: <span className="font-bold">{config.passingGrade}</span> | {config.paperSize.toUpperCase()} {config.orientation}</p>
        </div>
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
  teacherNote: "Ahmad menunjukkan perkembangan yang sangat baik di semester ini.",
  teacherName: "Ust. Abdullah, S.Pd",
};

const ReportCardSettings = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [config, setConfig] = useState<ReportConfig>(() => {
    const saved = loadReportConfig();
    return saved ? { ...defaultConfig, ...saved } as ReportConfig : defaultConfig;
  });
  const [showPreview, setShowPreview] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>("institution");
  const [exporting, setExporting] = useState(false);
  const [templates, setTemplates] = useState<UploadedTemplate[]>(() => loadTemplates());
  const [previewTemplate, setPreviewTemplate] = useState<UploadedTemplate | null>(null);

  useEffect(() => { saveReportConfig(config as ExportReportConfig); }, [config]);

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
    const updated = config.reportElements.map(e => e.id === id ? { ...e, enabled: !e.enabled } : e);
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
    toast({ title: "Pengaturan rapor berhasil disimpan" });
  };

  const handleReset = () => {
    setConfig(defaultConfig);
    toast({ title: "Pengaturan dikembalikan ke default" });
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
    } catch { toast({ title: "Gagal mengunduh Word", variant: "destructive" }); }
    finally { setExporting(false); }
  };

  // ─── Template Upload ───
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "docx") {
      toast({ title: "Format tidak didukung", description: "Hanya file PDF atau DOCX (.docx) yang diterima.", variant: "destructive" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File terlalu besar", description: "Maksimal 10 MB per file.", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const newTemplate: UploadedTemplate = {
        id: crypto.randomUUID(),
        name: file.name,
        type: ext as "pdf" | "docx",
        size: file.size,
        uploadedAt: new Date().toISOString(),
        dataUrl: reader.result as string,
        isActive: false,
      };

      const updated = [...templates, newTemplate];
      setTemplates(updated);
      saveTemplates(updated);
      toast({ title: "Template berhasil diunggah", description: file.name });
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const setActiveTemplate = (id: string) => {
    const updated = templates.map(t => ({ ...t, isActive: t.id === id }));
    setTemplates(updated);
    saveTemplates(updated);
    setPreviewTemplate(updated.find(t => t.id === id) || null);
    toast({ title: "Template aktif diperbarui" });
  };

  const deleteTemplate = (id: string) => {
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    saveTemplates(updated);
    if (previewTemplate?.id === id) setPreviewTemplate(null);
    toast({ title: "Template dihapus" });
  };

  const downloadTemplate = (tmpl: UploadedTemplate) => {
    const a = document.createElement("a");
    a.href = tmpl.dataUrl;
    a.download = tmpl.name;
    a.click();
  };

  const activeTemplate = templates.find(t => t.isActive);

  const Section = ({ id, title, icon: Icon, children }: { id: string; title: string; icon: any; children: React.ReactNode }) => {
    const isOpen = expandedSection === id;
    return (
      <div className="bg-card border rounded-xl shadow-card overflow-hidden">
        <button onClick={() => setExpandedSection(isOpen ? null : id)} className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
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
          <p className="text-sm text-muted-foreground">Upload template PDF/Word asli, konfigurasi penilaian, dan kelola format rapor</p>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">💾 Auto-save aktif — perubahan tersimpan otomatis di browser</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleExportPdf}>
            <FileDown className="h-4 w-4 mr-1" /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportDocx} disabled={exporting}>
            <Download className="h-4 w-4 mr-1" /> {exporting ? "..." : "Word"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setPreviewTemplate(null); setShowPreview(!showPreview); }}>
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

      <div className={cn("grid gap-5", showPreview ? "grid-cols-1 xl:grid-cols-[1fr_380px]" : "grid-cols-1 max-w-3xl")}>
        {/* Settings Panel */}
        <div className="space-y-4">
          <Tabs defaultValue="template" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="template" className="text-xs"><Upload className="h-3.5 w-3.5 mr-1" /> Template</TabsTrigger>
              <TabsTrigger value="format" className="text-xs"><FileText className="h-3.5 w-3.5 mr-1" /> Format</TabsTrigger>
              <TabsTrigger value="grading" className="text-xs"><Award className="h-3.5 w-3.5 mr-1" /> Penilaian</TabsTrigger>
              <TabsTrigger value="content" className="text-xs"><BookOpen className="h-3.5 w-3.5 mr-1" /> Konten</TabsTrigger>
            </TabsList>

            {/* ═══ TEMPLATE TAB ═══ */}
            <TabsContent value="template" className="space-y-4 mt-4">
              {/* Upload Area */}
              <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Upload Template Rapor</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload file PDF atau Word (.docx) sebagai template rapor. File akan disimpan di browser dan bisa diunduh kapan saja untuk diedit ulang.
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-primary/30 rounded-xl p-8 flex flex-col items-center gap-3 hover:border-primary/60 hover:bg-primary/5 transition-all group"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Klik untuk upload template</p>
                    <p className="text-xs text-muted-foreground mt-0.5">PDF atau DOCX · Maks 10 MB</p>
                  </div>
                </button>

                <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">💡 Cara kerja:</p>
                  <p>1. Buat/edit rapor di Microsoft Word atau Adobe Acrobat</p>
                  <p>2. Upload file PDF/Word ke sini sebagai template</p>
                  <p>3. Download kapan saja untuk edit ulang, lalu re-upload</p>
                  <p>4. Website hanya menyimpan & mengorganisir file template Anda</p>
                </div>
              </div>

              {/* Template List */}
              <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">Template Tersimpan</h3>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{templates.length} file</Badge>
                </div>

                {templates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <File className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Belum ada template</p>
                    <p className="text-xs mt-1">Upload file PDF atau Word untuk memulai</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {templates.map(tmpl => (
                      <div
                        key={tmpl.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border transition-all",
                          tmpl.isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:bg-muted/20"
                        )}
                      >
                        <div className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                          tmpl.type === "pdf" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                        )}>
                          {tmpl.type === "pdf" ? <FileText className="h-5 w-5" /> : <FileType2 className="h-5 w-5" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground truncate">{tmpl.name}</p>
                            {tmpl.isActive && <Badge className="text-[9px] px-1.5 py-0">Aktif</Badge>}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                            <span>{formatFileSize(tmpl.size)}</span>
                            <span>·</span>
                            <span className="flex items-center gap-0.5">
                              <Clock className="h-2.5 w-2.5" />
                              {new Date(tmpl.uploadedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                            <span>·</span>
                            <span className="uppercase font-medium">{tmpl.type}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {tmpl.type === "pdf" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => { setPreviewTemplate(tmpl); setShowPreview(true); }}
                              title="Preview"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => downloadTemplate(tmpl)} title="Download untuk edit">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          {!tmpl.isActive && (
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]" onClick={() => setActiveTemplate(tmpl.id)}>
                              Aktifkan
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => deleteTemplate(tmpl.id)} title="Hapus">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Config Summary */}
              <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
                <h3 className="text-sm font-semibold">Ringkasan Konfigurasi</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex justify-between p-2 rounded-lg bg-muted/20">
                    <span className="text-muted-foreground">Template Aktif</span>
                    <span className="font-medium truncate max-w-[120px]">{activeTemplate?.name || "Bawaan"}</span>
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
                    <span className="text-muted-foreground">Total Template</span>
                    <span className="font-medium">{templates.length} file</span>
                  </div>
                </div>
              </div>
            </TabsContent>

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
                      <Input value={scale.grade} onChange={e => updateScale(idx, "grade", e.target.value)} className="w-14 h-7 text-xs text-center font-bold" />
                      <Input type="number" value={scale.min} onChange={e => updateScale(idx, "min", e.target.value)} className="w-16 h-7 text-xs text-center" />
                      <span className="text-xs text-muted-foreground">–</span>
                      <Input type="number" value={scale.max} onChange={e => updateScale(idx, "max", e.target.value)} className="w-16 h-7 text-xs text-center" />
                      <Input value={scale.description} onChange={e => updateScale(idx, "description", e.target.value)} className="flex-1 h-7 text-xs" placeholder="Deskripsi" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">Bobot Penilaian / Exam Weights</h3>
                  </div>
                  <Badge variant={totalWeight === 100 ? "default" : "destructive"} className="text-[10px]">Total: {totalWeight}%</Badge>
                </div>
                <div className="space-y-2">
                  {config.examWeights.map((w, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg border bg-muted/10">
                      <Switch checked={w.enabled} onCheckedChange={v => updateWeight(idx, "enabled", v)} />
                      <Input value={w.type} onChange={e => updateWeight(idx, "type", e.target.value)} className="flex-1 h-8 text-xs" />
                      <div className="flex items-center gap-1">
                        <Input type="number" value={w.weight} onChange={e => updateWeight(idx, "weight", e.target.value)} className="w-16 h-8 text-xs text-center" disabled={!w.enabled} />
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
                  <p className="text-xs text-destructive flex items-center gap-1">⚠️ Total bobot harus 100%. Saat ini: {totalWeight}%</p>
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
                <p className="text-xs text-muted-foreground">Pilih elemen yang ditampilkan di rapor bawaan (preview). Template yang diupload menggunakan format aslinya.</p>
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
                      <Badge variant={el.enabled ? "default" : "outline"} className="text-[10px]">{el.enabled ? "Aktif" : "Nonaktif"}</Badge>
                    </div>
                  ))}
                </div>
              </div>

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
          </Tabs>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  {previewTemplate ? "Preview Template" : "Live Preview"}
                </span>
              </div>
              {previewTemplate ? (
                <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1" onClick={() => setPreviewTemplate(null)}>
                  <X className="h-3 w-3" /> Tutup
                </Button>
              ) : (
                <Badge variant="outline" className="text-[10px]">Sample Data</Badge>
              )}
            </div>
            <div className="sticky top-4 overflow-hidden rounded-xl border bg-muted/20 p-3">
              {previewTemplate && previewTemplate.type === "pdf" ? (
                <div className="relative w-full" style={{ paddingBottom: `${(297 / 210) * 100}%` }}>
                  <iframe
                    src={previewTemplate.dataUrl}
                    className="absolute inset-0 w-full h-full rounded-lg"
                    title="PDF Preview"
                  />
                </div>
              ) : previewTemplate && previewTemplate.type === "docx" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileType2 className="h-12 w-12 text-blue-500 mb-3" />
                  <p className="text-sm font-medium text-foreground">{previewTemplate.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Preview tidak tersedia untuk file Word</p>
                  <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={() => downloadTemplate(previewTemplate)}>
                    <Download className="h-3.5 w-3.5 mr-1" /> Download untuk buka di Word
                  </Button>
                </div>
              ) : (
                <ReportCardPreview config={config} />
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReportCardSettings;
