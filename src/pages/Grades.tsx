import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search, Plus, MoreHorizontal, ChevronLeft, ChevronRight,
  Pencil, Trash2, Filter, Users, Award, TrendingUp, ChevronDown, ChevronUp, GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface GradeEntry {
  id: string;
  studentId: string;
  student: string;
  class: string;
  dormitory: string;
  subject: string;
  semester: string;
  type: string;
  score: number;
  grade: string;
}

const mockGrades: GradeEntry[] = [
  // Ahmad Fauzi - X-A - Asrama Al-Farabi
  { id: "GRD001", studentId: "STD001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Fiqih", semester: "Ganjil 2024", type: "UTS", score: 85, grade: "A" },
  { id: "GRD002", studentId: "STD001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Fiqih", semester: "Ganjil 2024", type: "UAS", score: 88, grade: "A" },
  { id: "GRD003", studentId: "STD001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Matematika", semester: "Ganjil 2024", type: "UTS", score: 78, grade: "B+" },
  { id: "GRD004", studentId: "STD001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Matematika", semester: "Ganjil 2024", type: "UAS", score: 82, grade: "A-" },
  { id: "GRD005", studentId: "STD001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Bahasa Arab", semester: "Ganjil 2024", type: "UTS", score: 90, grade: "A" },
  { id: "GRD006", studentId: "STD001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Bahasa Arab", semester: "Ganjil 2024", type: "UAS", score: 92, grade: "A" },
  { id: "GRD007", studentId: "STD001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Al-Quran & Tajwid", semester: "Ganjil 2024", type: "UTS", score: 95, grade: "A+" },
  { id: "GRD008", studentId: "STD001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Al-Quran & Tajwid", semester: "Ganjil 2024", type: "UAS", score: 96, grade: "A+" },
  // Siti Aisyah - X-A - Asrama Khadijah
  { id: "GRD009", studentId: "STD002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "Fiqih", semester: "Ganjil 2024", type: "UTS", score: 92, grade: "A" },
  { id: "GRD010", studentId: "STD002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "Fiqih", semester: "Ganjil 2024", type: "UAS", score: 90, grade: "A" },
  { id: "GRD011", studentId: "STD002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "Matematika", semester: "Ganjil 2024", type: "UTS", score: 88, grade: "A" },
  { id: "GRD012", studentId: "STD002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "Matematika", semester: "Ganjil 2024", type: "UAS", score: 91, grade: "A" },
  { id: "GRD013", studentId: "STD002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "Bahasa Arab", semester: "Ganjil 2024", type: "UTS", score: 86, grade: "A" },
  { id: "GRD014", studentId: "STD002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "Bahasa Arab", semester: "Ganjil 2024", type: "UAS", score: 89, grade: "A" },
  // Muhammad Rizki - XI-A - Asrama Al-Farabi
  { id: "GRD015", studentId: "STD003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "Al-Quran & Tajwid", semester: "Ganjil 2024", type: "UTS", score: 95, grade: "A+" },
  { id: "GRD016", studentId: "STD003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "Al-Quran & Tajwid", semester: "Ganjil 2024", type: "UAS", score: 97, grade: "A+" },
  { id: "GRD017", studentId: "STD003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "Hadits", semester: "Ganjil 2024", type: "UTS", score: 72, grade: "B" },
  { id: "GRD018", studentId: "STD003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "Hadits", semester: "Ganjil 2024", type: "UAS", score: 75, grade: "B+" },
  { id: "GRD019", studentId: "STD003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "IPA", semester: "Ganjil 2024", type: "UTS", score: 80, grade: "A-" },
  { id: "GRD020", studentId: "STD003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "IPA", semester: "Ganjil 2024", type: "UAS", score: 83, grade: "A-" },
  // Fatimah Zahra - XII-A - Asrama Khadijah
  { id: "GRD021", studentId: "STD004", student: "Fatimah Zahra", class: "XII-A", dormitory: "Khadijah", subject: "Bahasa Inggris", semester: "Ganjil 2024", type: "UTS", score: 80, grade: "A-" },
  { id: "GRD022", studentId: "STD004", student: "Fatimah Zahra", class: "XII-A", dormitory: "Khadijah", subject: "Bahasa Inggris", semester: "Ganjil 2024", type: "UAS", score: 84, grade: "A-" },
  { id: "GRD023", studentId: "STD004", student: "Fatimah Zahra", class: "XII-A", dormitory: "Khadijah", subject: "Fiqih", semester: "Ganjil 2024", type: "UTS", score: 88, grade: "A" },
  { id: "GRD024", studentId: "STD004", student: "Fatimah Zahra", class: "XII-A", dormitory: "Khadijah", subject: "Fiqih", semester: "Ganjil 2024", type: "UAS", score: 90, grade: "A" },
  { id: "GRD025", studentId: "STD004", student: "Fatimah Zahra", class: "XII-A", dormitory: "Khadijah", subject: "Matematika", semester: "Ganjil 2024", type: "UTS", score: 76, grade: "B+" },
  { id: "GRD026", studentId: "STD004", student: "Fatimah Zahra", class: "XII-A", dormitory: "Khadijah", subject: "Matematika", semester: "Ganjil 2024", type: "UAS", score: 79, grade: "B+" },
  // Umar Hadi - XI-B - Asrama Ibn Sina
  { id: "GRD027", studentId: "STD005", student: "Umar Hadi", class: "XI-B", dormitory: "Ibn Sina", subject: "IPA", semester: "Ganjil 2024", type: "UTS", score: 65, grade: "C+" },
  { id: "GRD028", studentId: "STD005", student: "Umar Hadi", class: "XI-B", dormitory: "Ibn Sina", subject: "IPA", semester: "Ganjil 2024", type: "UAS", score: 70, grade: "B" },
  { id: "GRD029", studentId: "STD005", student: "Umar Hadi", class: "XI-B", dormitory: "Ibn Sina", subject: "Matematika", semester: "Ganjil 2024", type: "UTS", score: 60, grade: "C" },
  { id: "GRD030", studentId: "STD005", student: "Umar Hadi", class: "XI-B", dormitory: "Ibn Sina", subject: "Matematika", semester: "Ganjil 2024", type: "UAS", score: 68, grade: "B-" },
  // Khadijah Nur - X-B - Asrama Khadijah
  { id: "GRD031", studentId: "STD006", student: "Khadijah Nur", class: "X-B", dormitory: "Khadijah", subject: "Matematika", semester: "Ganjil 2024", type: "UTS", score: 90, grade: "A" },
  { id: "GRD032", studentId: "STD006", student: "Khadijah Nur", class: "X-B", dormitory: "Khadijah", subject: "Matematika", semester: "Ganjil 2024", type: "UAS", score: 93, grade: "A" },
  { id: "GRD033", studentId: "STD006", student: "Khadijah Nur", class: "X-B", dormitory: "Khadijah", subject: "Fiqih", semester: "Ganjil 2024", type: "UTS", score: 87, grade: "A" },
  { id: "GRD034", studentId: "STD006", student: "Khadijah Nur", class: "X-B", dormitory: "Khadijah", subject: "Fiqih", semester: "Ganjil 2024", type: "UAS", score: 89, grade: "A" },
  // Ibrahim Malik - XII-B - Asrama Ibn Sina
  { id: "GRD035", studentId: "STD007", student: "Ibrahim Malik", class: "XII-B", dormitory: "Ibn Sina", subject: "Fiqih", semester: "Ganjil 2024", type: "UTS", score: 87, grade: "A" },
  { id: "GRD036", studentId: "STD007", student: "Ibrahim Malik", class: "XII-B", dormitory: "Ibn Sina", subject: "Fiqih", semester: "Ganjil 2024", type: "UAS", score: 85, grade: "A" },
  { id: "GRD037", studentId: "STD007", student: "Ibrahim Malik", class: "XII-B", dormitory: "Ibn Sina", subject: "Hadits", semester: "Ganjil 2024", type: "UTS", score: 82, grade: "A-" },
  { id: "GRD038", studentId: "STD007", student: "Ibrahim Malik", class: "XII-B", dormitory: "Ibn Sina", subject: "Hadits", semester: "Ganjil 2024", type: "UAS", score: 80, grade: "A-" },
  // Aisyah Putri - X-C - Asrama Khadijah
  { id: "GRD039", studentId: "STD008", student: "Aisyah Putri", class: "X-C", dormitory: "Khadijah", subject: "Bahasa Arab", semester: "Genap 2024", type: "UTS", score: 76, grade: "B+" },
  { id: "GRD040", studentId: "STD008", student: "Aisyah Putri", class: "X-C", dormitory: "Khadijah", subject: "Bahasa Arab", semester: "Genap 2024", type: "UAS", score: 80, grade: "A-" },
  { id: "GRD041", studentId: "STD008", student: "Aisyah Putri", class: "X-C", dormitory: "Khadijah", subject: "Fiqih", semester: "Genap 2024", type: "UTS", score: 84, grade: "A-" },
  { id: "GRD042", studentId: "STD008", student: "Aisyah Putri", class: "X-C", dormitory: "Khadijah", subject: "Fiqih", semester: "Genap 2024", type: "UAS", score: 86, grade: "A" },
  // Zainab Amira - XI-A - Asrama Khadijah
  { id: "GRD043", studentId: "STD009", student: "Zainab Amira", class: "XI-A", dormitory: "Khadijah", subject: "Matematika", semester: "Genap 2024", type: "UTS", score: 82, grade: "A-" },
  { id: "GRD044", studentId: "STD009", student: "Zainab Amira", class: "XI-A", dormitory: "Khadijah", subject: "Matematika", semester: "Genap 2024", type: "UAS", score: 85, grade: "A" },
  { id: "GRD045", studentId: "STD009", student: "Zainab Amira", class: "XI-A", dormitory: "Khadijah", subject: "Bahasa Inggris", semester: "Genap 2024", type: "UTS", score: 78, grade: "B+" },
  { id: "GRD046", studentId: "STD009", student: "Zainab Amira", class: "XI-A", dormitory: "Khadijah", subject: "Bahasa Inggris", semester: "Genap 2024", type: "UAS", score: 81, grade: "A-" },
  // Bilal Hakim - XI-B - Asrama Al-Farabi
  { id: "GRD047", studentId: "STD010", student: "Bilal Hakim", class: "XI-B", dormitory: "Al-Farabi", subject: "Al-Quran & Tajwid", semester: "Genap 2024", type: "UTS", score: 94, grade: "A+" },
  { id: "GRD048", studentId: "STD010", student: "Bilal Hakim", class: "XI-B", dormitory: "Al-Farabi", subject: "Al-Quran & Tajwid", semester: "Genap 2024", type: "UAS", score: 96, grade: "A+" },
  { id: "GRD049", studentId: "STD010", student: "Bilal Hakim", class: "XI-B", dormitory: "Al-Farabi", subject: "Hadits", semester: "Genap 2024", type: "UTS", score: 88, grade: "A" },
  { id: "GRD050", studentId: "STD010", student: "Bilal Hakim", class: "XI-B", dormitory: "Al-Farabi", subject: "Hadits", semester: "Genap 2024", type: "UAS", score: 90, grade: "A" },
  // Yusuf Rahman - XII-A - Asrama Al-Farabi
  { id: "GRD051", studentId: "STD011", student: "Yusuf Rahman", class: "XII-A", dormitory: "Al-Farabi", subject: "Hadits", semester: "Genap 2024", type: "UTS", score: 91, grade: "A" },
  { id: "GRD052", studentId: "STD011", student: "Yusuf Rahman", class: "XII-A", dormitory: "Al-Farabi", subject: "Hadits", semester: "Genap 2024", type: "UAS", score: 93, grade: "A" },
  { id: "GRD053", studentId: "STD011", student: "Yusuf Rahman", class: "XII-A", dormitory: "Al-Farabi", subject: "Fiqih", semester: "Genap 2024", type: "UTS", score: 86, grade: "A" },
  { id: "GRD054", studentId: "STD011", student: "Yusuf Rahman", class: "XII-A", dormitory: "Al-Farabi", subject: "Fiqih", semester: "Genap 2024", type: "UAS", score: 88, grade: "A" },
];

const gradeColorBadge = (grade: string) => {
  if (grade === "A+" || grade === "A") return "default";
  if (grade.startsWith("A")) return "secondary";
  if (grade.startsWith("B")) return "outline";
  return "destructive" as const;
};

const scoreBarColor = (score: number) => {
  if (score >= 90) return "bg-green-500";
  if (score >= 80) return "bg-primary";
  if (score >= 70) return "bg-amber-500";
  return "bg-destructive";
};

interface StudentSummary {
  studentId: string;
  student: string;
  class: string;
  dormitory: string;
  grades: GradeEntry[];
  avg: number;
  highest: number;
  lowest: number;
  subjectCount: number;
}

const Grades = () => {
  const { toast } = useToast();
  const [data, setData] = useState<GradeEntry[]>(mockGrades);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedDormitory, setSelectedDormitory] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [viewMode, setViewMode] = useState<"student" | "table">("student");
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<GradeEntry | null>(null);
  const [deleteItem, setDeleteItem] = useState<GradeEntry | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const pageSize = 10;

  const classes = [...new Set(data.map((g) => g.class))].sort();
  const dormitories = [...new Set(data.map((g) => g.dormitory))].sort();
  const semesters = [...new Set(data.map((g) => g.semester))];
  const subjects = [...new Set(data.map((g) => g.subject))].sort();

  const filtered = useMemo(() => {
    let result = data;
    if (selectedClass !== "all") result = result.filter((g) => g.class === selectedClass);
    if (selectedDormitory !== "all") result = result.filter((g) => g.dormitory === selectedDormitory);
    if (selectedSemester !== "all") result = result.filter((g) => g.semester === selectedSemester);
    if (selectedSubject !== "all") result = result.filter((g) => g.subject === selectedSubject);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((g) => g.student.toLowerCase().includes(q) || g.subject.toLowerCase().includes(q));
    }
    return result;
  }, [data, selectedClass, selectedDormitory, selectedSemester, selectedSubject, search]);

  const studentSummaries = useMemo((): StudentSummary[] => {
    const map = new Map<string, GradeEntry[]>();
    filtered.forEach((g) => {
      if (!map.has(g.studentId)) map.set(g.studentId, []);
      map.get(g.studentId)!.push(g);
    });
    return Array.from(map.entries()).map(([studentId, grades]) => {
      const scores = grades.map((g) => g.score);
      const uniqueSubjects = new Set(grades.map((g) => g.subject));
      return {
        studentId,
        student: grades[0].student,
        class: grades[0].class,
        dormitory: grades[0].dormitory,
        grades,
        avg: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
        highest: Math.max(...scores),
        lowest: Math.min(...scores),
        subjectCount: uniqueSubjects.size,
      };
    }).sort((a, b) => b.avg - a.avg);
  }, [filtered]);

  // Stats
  const totalStudents = studentSummaries.length;
  const overallAvg = totalStudents > 0
    ? (studentSummaries.reduce((a, b) => a + b.avg, 0) / totalStudents).toFixed(1)
    : "0";
  const topStudent = studentSummaries[0];

  // Pagination for student view
  const totalStudentPages = Math.max(1, Math.ceil(studentSummaries.length / pageSize));
  const paginatedStudents = studentSummaries.slice((page - 1) * pageSize, page * pageSize);

  // Pagination for table view
  const totalTablePages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedTable = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleExpand = (studentId: string) => {
    setExpandedStudents((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  };

  const formFields = [
    { key: "student", label: "Santri", type: "text" as const, placeholder: "Nama santri" },
    { key: "studentId", label: "ID Santri", type: "text" as const, placeholder: "STD001" },
    { key: "class", label: "Kelas", type: "select" as const, options: classes.map((c) => ({ value: c, label: c })) },
    { key: "dormitory", label: "Asrama", type: "select" as const, options: dormitories.map((d) => ({ value: d, label: d })) },
    { key: "subject", label: "Mata Pelajaran", type: "select" as const, options: subjects.map((s) => ({ value: s, label: s })) },
    { key: "semester", label: "Semester", type: "select" as const, options: semesters.map((s) => ({ value: s, label: s })) },
    { key: "type", label: "Jenis Ujian", type: "select" as const, options: [{ value: "UTS", label: "UTS" }, { value: "UAS", label: "UAS" }, { value: "Tugas", label: "Tugas" }, { value: "Praktik", label: "Praktik" }] },
    { key: "score", label: "Skor", type: "number" as const, placeholder: "85" },
    { key: "grade", label: "Nilai", type: "select" as const, options: [{ value: "A+", label: "A+" }, { value: "A", label: "A" }, { value: "A-", label: "A-" }, { value: "B+", label: "B+" }, { value: "B", label: "B" }, { value: "B-", label: "B-" }, { value: "C+", label: "C+" }, { value: "C", label: "C" }] },
  ];

  const openAdd = () => {
    setEditItem(null);
    const defaults: Record<string, any> = {};
    formFields.forEach((f) => { defaults[f.key] = ""; });
    setFormData(defaults);
    setDialogOpen(true);
  };

  const openEdit = (item: GradeEntry) => {
    setEditItem(item);
    setFormData({ ...item });
    setDialogOpen(true);
  };

  const openDelete = (item: GradeEntry) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSave = () => {
    if (editItem) {
      setData((prev) => prev.map((item) => item.id === editItem.id ? { ...item, ...formData, score: Number(formData.score) } as GradeEntry : item));
      toast({ title: "Nilai berhasil diperbarui" });
    } else {
      const newItem: GradeEntry = { ...formData, id: `GRD-${Date.now()}`, score: Number(formData.score) } as GradeEntry;
      setData((prev) => [newItem, ...prev]);
      toast({ title: "Nilai berhasil ditambahkan" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Nilai berhasil dihapus" });
    }
    setDeleteOpen(false);
  };

  const resetFilters = () => {
    setSelectedClass("all");
    setSelectedDormitory("all");
    setSelectedSemester("all");
    setSelectedSubject("all");
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters = selectedClass !== "all" || selectedDormitory !== "all" || selectedSemester !== "all" || selectedSubject !== "all" || search;

  const currentTotalPages = viewMode === "student" ? totalStudentPages : totalTablePages;
  const currentTotal = viewMode === "student" ? studentSummaries.length : filtered.length;

  // Group grades by subject for a student
  const groupBySubject = (grades: GradeEntry[]) => {
    const map = new Map<string, GradeEntry[]>();
    grades.forEach((g) => {
      if (!map.has(g.subject)) map.set(g.subject, []);
      map.get(g.subject)!.push(g);
    });
    return Array.from(map.entries());
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-bold text-foreground">Nilai / Grades</h1>
        <p className="text-sm text-muted-foreground">Kelola nilai santri berdasarkan kelas, asrama, dan mata pelajaran</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total Santri</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-xs text-muted-foreground">Rata-rata</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{overallAvg}</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Award className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-muted-foreground">Nilai Terbaik</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{topStudent?.student || "-"}</p>
          <p className="text-xs text-muted-foreground">Avg: {topStudent?.avg || 0}</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="h-4 w-4 text-blue-600" />
            <span className="text-xs text-muted-foreground">Total Nilai</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{filtered.length}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari santri atau mata pelajaran..."
              className="w-full rounded-lg border border-input bg-card pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <Tabs value={viewMode} onValueChange={(v) => { setViewMode(v as "student" | "table"); setPage(1); }}>
              <TabsList className="h-9">
                <TabsTrigger value="student" className="text-xs px-3">Per Santri</TabsTrigger>
                <TabsTrigger value="table" className="text-xs px-3">Tabel</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button size="sm" onClick={openAdd}>
              <Plus className="h-4 w-4 mr-1" /> Tambah Nilai
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedClass} onValueChange={(v) => { setSelectedClass(v); setPage(1); }}>
            <SelectTrigger className="h-8 w-auto min-w-[100px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              {classes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedDormitory} onValueChange={(v) => { setSelectedDormitory(v); setPage(1); }}>
            <SelectTrigger className="h-8 w-auto min-w-[110px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Asrama</SelectItem>
              {dormitories.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedSemester} onValueChange={(v) => { setSelectedSemester(v); setPage(1); }}>
            <SelectTrigger className="h-8 w-auto min-w-[130px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Semester</SelectItem>
              {semesters.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedSubject} onValueChange={(v) => { setSelectedSubject(v); setPage(1); }}>
            <SelectTrigger className="h-8 w-auto min-w-[130px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Mapel</SelectItem>
              {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={resetFilters}>
              Reset Filter
            </Button>
          )}
        </div>
      </div>

      {/* Student View */}
      {viewMode === "student" && (
        <div className="space-y-3">
          {paginatedStudents.length === 0 ? (
            <div className="bg-card border rounded-xl p-8 text-center text-sm text-muted-foreground">
              Tidak ada data nilai ditemukan
            </div>
          ) : (
            paginatedStudents.map((summary, idx) => (
              <Collapsible
                key={summary.studentId}
                open={expandedStudents.has(summary.studentId)}
                onOpenChange={() => toggleExpand(summary.studentId)}
              >
                <div className="bg-card border rounded-xl overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <button className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors text-left">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">#{(page - 1) * pageSize + idx + 1}</span>
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{summary.student}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{summary.class}</Badge>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{summary.dormitory}</Badge>
                          <span className="text-[10px] text-muted-foreground">{summary.subjectCount} mapel</span>
                        </div>
                      </div>
                      {/* Scores */}
                      <div className="hidden sm:flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-lg font-bold text-primary">{summary.avg}</p>
                          <p className="text-[10px] text-muted-foreground">Rata-rata</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-green-600">{summary.highest}</p>
                          <p className="text-[10px] text-muted-foreground">Tertinggi</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-amber-600">{summary.lowest}</p>
                          <p className="text-[10px] text-muted-foreground">Terendah</p>
                        </div>
                      </div>
                      {/* Expand icon */}
                      {expandedStudents.has(summary.studentId) ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="border-t">
                      {/* Mobile summary */}
                      <div className="sm:hidden flex items-center gap-4 px-5 py-3 bg-muted/30">
                        <div className="text-center flex-1">
                          <p className="text-base font-bold text-primary">{summary.avg}</p>
                          <p className="text-[10px] text-muted-foreground">Rata-rata</p>
                        </div>
                        <div className="text-center flex-1">
                          <p className="text-sm font-semibold text-green-600">{summary.highest}</p>
                          <p className="text-[10px] text-muted-foreground">Tertinggi</p>
                        </div>
                        <div className="text-center flex-1">
                          <p className="text-sm font-semibold text-amber-600">{summary.lowest}</p>
                          <p className="text-[10px] text-muted-foreground">Terendah</p>
                        </div>
                      </div>
                      {/* Grades by subject */}
                      {groupBySubject(summary.grades).map(([subject, grades]) => (
                        <div key={subject} className="border-t">
                          <div className="px-5 py-2.5 bg-muted/20">
                            <p className="text-xs font-semibold text-foreground">{subject}</p>
                          </div>
                          <Table>
                            <TableHeader>
                              <TableRow className="hover:bg-transparent">
                                <TableHead className="text-[10px] h-8">Semester</TableHead>
                                <TableHead className="text-[10px] h-8">Jenis</TableHead>
                                <TableHead className="text-[10px] h-8">Skor</TableHead>
                                <TableHead className="text-[10px] h-8">Nilai</TableHead>
                                <TableHead className="text-[10px] h-8 w-10"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {grades.map((g) => (
                                <TableRow key={g.id}>
                                  <TableCell className="text-xs py-2">{g.semester}</TableCell>
                                  <TableCell className="text-xs py-2">
                                    <Badge variant="outline" className="text-[10px]">{g.type}</Badge>
                                  </TableCell>
                                  <TableCell className="py-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div className={cn("h-full rounded-full", scoreBarColor(g.score))} style={{ width: `${g.score}%` }} />
                                      </div>
                                      <span className="text-xs font-semibold">{g.score}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-2">
                                    <Badge variant={gradeColorBadge(g.grade)} className="text-[10px]">{g.grade}</Badge>
                                  </TableCell>
                                  <TableCell className="py-2">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <button className="p-1 rounded hover:bg-muted">
                                          <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                                        </button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => openEdit(g)}><Pencil className="h-3.5 w-3.5 mr-2" /> Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => openDelete(g)} className="text-destructive"><Trash2 className="h-3.5 w-3.5 mr-2" /> Hapus</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="bg-card border rounded-xl shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Santri</TableHead>
                <TableHead className="text-xs">Kelas</TableHead>
                <TableHead className="text-xs">Asrama</TableHead>
                <TableHead className="text-xs">Mapel</TableHead>
                <TableHead className="text-xs">Semester</TableHead>
                <TableHead className="text-xs">Jenis</TableHead>
                <TableHead className="text-xs">Skor</TableHead>
                <TableHead className="text-xs">Nilai</TableHead>
                <TableHead className="text-xs w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTable.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-8">
                    Tidak ada data ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTable.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="text-sm font-medium">{g.student}</TableCell>
                    <TableCell className="text-sm">{g.class}</TableCell>
                    <TableCell className="text-sm">{g.dormitory}</TableCell>
                    <TableCell className="text-sm">{g.subject}</TableCell>
                    <TableCell className="text-sm">{g.semester}</TableCell>
                    <TableCell className="text-sm"><Badge variant="outline" className="text-[10px]">{g.type}</Badge></TableCell>
                    <TableCell className="text-sm font-semibold">{g.score}</TableCell>
                    <TableCell><Badge variant={gradeColorBadge(g.grade)} className="text-[10px]">{g.grade}</Badge></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded hover:bg-muted"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(g)}><Pencil className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDelete(g)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Hapus</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between px-1 py-3 text-xs text-muted-foreground mt-2">
        <span>
          {currentTotal > 0
            ? `Menampilkan ${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, currentTotal)} dari ${currentTotal}`
            : "Tidak ada data"}
        </span>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-muted disabled:opacity-30" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: Math.min(currentTotalPages, 5) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn("px-2 py-1 rounded", p === page ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted")}
            >
              {p}
            </button>
          ))}
          <button className="p-1 rounded hover:bg-muted disabled:opacity-30" onClick={() => setPage((p) => Math.min(currentTotalPages, p + 1))} disabled={page === currentTotalPages}>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Nilai" : "Tambah Nilai Baru"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {formFields.map((field) => {
              const value = formData[field.key] ?? "";
              return (
                <div key={field.key} className={cn("space-y-2", field.key === "student" && "col-span-2")}>
                  <Label className="text-xs">{field.label}</Label>
                  {field.type === "select" ? (
                    <Select value={String(value)} onValueChange={(v) => setFormData((p) => ({ ...p, [field.key]: v }))}>
                      <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={field.type}
                      value={value}
                      onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Nilai</AlertDialogTitle>
            <AlertDialogDescription>Apakah Anda yakin ingin menghapus nilai ini? Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default Grades;
