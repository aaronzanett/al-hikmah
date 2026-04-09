import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Search, Plus, MoreHorizontal, ChevronLeft, ChevronRight, Pencil, Trash2,
  Filter, Eye, X, Download, Users, UserCheck, UserX, Clock, FileText,
  GraduationCap, Phone, Mail, School, Calendar, CheckCircle2, AlertCircle,
  ClipboardList, ArrowRight, ChevronDown, BarChart3, TrendingUp, User,
  FileSpreadsheet, ArrowUpRight, ArrowDownRight, XCircle, RefreshCw,
  Settings2, GripVertical, Palette, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ─── Icon Registry for Steps ───
const STEP_ICON_OPTIONS: { key: string; icon: LucideIcon }[] = [
  { key: "ClipboardList", icon: ClipboardList },
  { key: "FileText", icon: FileText },
  { key: "Clock", icon: Clock },
  { key: "CheckCircle2", icon: CheckCircle2 },
  { key: "RefreshCw", icon: RefreshCw },
  { key: "XCircle", icon: XCircle },
  { key: "Users", icon: Users },
  { key: "UserCheck", icon: UserCheck },
  { key: "GraduationCap", icon: GraduationCap },
  { key: "Calendar", icon: Calendar },
  { key: "Mail", icon: Mail },
  { key: "Phone", icon: Phone },
  { key: "School", icon: School },
  { key: "BarChart3", icon: BarChart3 },
  { key: "Eye", icon: Eye },
  { key: "Download", icon: Download },
  { key: "Search", icon: Search },
  { key: "TrendingUp", icon: TrendingUp },
];

const STEP_COLOR_OPTIONS = [
  { label: "Abu-abu", color: "text-muted-foreground", bg: "bg-muted" },
  { label: "Biru", color: "text-info", bg: "bg-info/10" },
  { label: "Kuning", color: "text-warning", bg: "bg-warning/10" },
  { label: "Hijau", color: "text-success", bg: "bg-success/10" },
  { label: "Primer", color: "text-primary", bg: "bg-primary/10" },
  { label: "Merah", color: "text-destructive", bg: "bg-destructive/10" },
  { label: "Ungu", color: "text-purple-600", bg: "bg-purple-100" },
  { label: "Teal", color: "text-teal-600", bg: "bg-teal-100" },
];

const getIconByKey = (key: string): LucideIcon => {
  return STEP_ICON_OPTIONS.find(o => o.key === key)?.icon || ClipboardList;
};

// ─── Types ───
interface StepConfig {
  id: string;
  status: string;
  iconKey: string;
  color: string;
  bgColor: string;
  isFinal?: boolean; // "Tidak Lulus" type — excluded from progress line
}

interface RegistrationItem {
  id: string;
  studentName: string;
  program: string;
  wave: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  prevSchool: string;
  gender: string;
  status: string;
  testScore: number;
  registeredAt: string;
  birthDate: string;
  address: string;
  documents: { name: string; uploaded: boolean }[];
  notes: string;
  paymentStatus: "Lunas" | "Belum Bayar" | "Cicilan";
}

// ─── Default Steps ───
const DEFAULT_STEPS: StepConfig[] = [
  { id: "1", status: "Baru Mendaftar", iconKey: "ClipboardList", color: "text-muted-foreground", bgColor: "bg-muted" },
  { id: "2", status: "Verifikasi Berkas", iconKey: "FileText", color: "text-info", bgColor: "bg-info/10" },
  { id: "3", status: "Menunggu Tes", iconKey: "Clock", color: "text-warning", bgColor: "bg-warning/10" },
  { id: "4", status: "Lulus Seleksi", iconKey: "CheckCircle2", color: "text-success", bgColor: "bg-success/10" },
  { id: "5", status: "Daftar Ulang", iconKey: "RefreshCw", color: "text-primary", bgColor: "bg-primary/10" },
  { id: "6", status: "Tidak Lulus", iconKey: "XCircle", color: "text-destructive", bgColor: "bg-destructive/10", isFinal: true },
];

const loadSteps = (): StepConfig[] => {
  try {
    const stored = localStorage.getItem("registration_steps");
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEFAULT_STEPS;
};

// ─── Mock Data ───
const initialData: RegistrationItem[] = [
  { id: "PSB-2026-0001", studentName: "Ahmad Fathir Rahman", program: "Tahfidz Al-Qur'an", wave: "Gelombang 1", guardianName: "H. Rahman Fauzi", guardianPhone: "081234567890", guardianEmail: "rahman@email.com", prevSchool: "SDN 1 Bekasi", gender: "L", status: "Lulus Seleksi", testScore: 88, registeredAt: "2026-01-15", birthDate: "2014-03-12", address: "Jl. Masjid Al-Ikhlas No.5, Bekasi", documents: [{ name: "Akta Kelahiran", uploaded: true }, { name: "Kartu Keluarga", uploaded: true }, { name: "Rapor", uploaded: true }, { name: "Foto 3x4", uploaded: true }], notes: "Hafalan 5 juz", paymentStatus: "Lunas" },
  { id: "PSB-2026-0002", studentName: "Siti Aisyah Putri", program: "Reguler", wave: "Gelombang 1", guardianName: "Hj. Nurul Hidayah", guardianPhone: "081298765432", guardianEmail: "nurul@email.com", prevSchool: "SD Al-Azhar Cikarang", gender: "P", status: "Lulus Seleksi", testScore: 92, registeredAt: "2026-01-18", birthDate: "2014-07-22", address: "Perum. Graha Indah Blok C-12, Cikarang", documents: [{ name: "Akta Kelahiran", uploaded: true }, { name: "Kartu Keluarga", uploaded: true }, { name: "Rapor", uploaded: true }, { name: "Foto 3x4", uploaded: true }], notes: "", paymentStatus: "Lunas" },
  { id: "PSB-2026-0003", studentName: "Muhammad Rizki Aditya", program: "Bilingual", wave: "Gelombang 1", guardianName: "Ir. Aditya Pratama", guardianPhone: "081377889900", guardianEmail: "aditya.p@email.com", prevSchool: "SDIT Bina Ilmu", gender: "L", status: "Daftar Ulang", testScore: 85, registeredAt: "2026-01-20", birthDate: "2014-11-05", address: "Jl. Raya Bogor KM.30, Depok", documents: [{ name: "Akta Kelahiran", uploaded: true }, { name: "Kartu Keluarga", uploaded: true }, { name: "Rapor", uploaded: true }, { name: "Foto 3x4", uploaded: false }], notes: "Perlu follow up foto", paymentStatus: "Cicilan" },
  { id: "PSB-2026-0004", studentName: "Fatimah Az-Zahra", program: "Tahfidz Al-Qur'an", wave: "Gelombang 1", guardianName: "Dr. Zainal Abidin", guardianPhone: "081456123789", guardianEmail: "zainal@email.com", prevSchool: "MI Al-Ikhlas", gender: "P", status: "Menunggu Tes", testScore: 0, registeredAt: "2026-02-01", birthDate: "2014-09-18", address: "Jl. KH. Ahmad Dahlan No.8, Jakarta Selatan", documents: [{ name: "Akta Kelahiran", uploaded: true }, { name: "Kartu Keluarga", uploaded: true }, { name: "Rapor", uploaded: true }, { name: "Foto 3x4", uploaded: true }], notes: "", paymentStatus: "Belum Bayar" },
  { id: "PSB-2026-0005", studentName: "Abdullah Hakim", program: "STEM & Digital", wave: "Gelombang 2", guardianName: "Bambang Hakim, S.T.", guardianPhone: "081567234890", guardianEmail: "bambang.h@email.com", prevSchool: "SDN 5 Jakarta", gender: "L", status: "Verifikasi Berkas", testScore: 0, registeredAt: "2026-02-10", birthDate: "2014-06-03", address: "Jl. Sudirman No.45, Jakarta Pusat", documents: [{ name: "Akta Kelahiran", uploaded: true }, { name: "Kartu Keluarga", uploaded: true }, { name: "Rapor", uploaded: false }, { name: "Foto 3x4", uploaded: false }], notes: "Rapor belum lengkap", paymentStatus: "Belum Bayar" },
  { id: "PSB-2026-0006", studentName: "Khadijah Amira", program: "Reguler", wave: "Gelombang 1", guardianName: "Siti Maryam", guardianPhone: "081678345901", guardianEmail: "maryam@email.com", prevSchool: "SD Muhammadiyah 3", gender: "P", status: "Tidak Lulus", testScore: 55, registeredAt: "2026-01-22", birthDate: "2014-12-25", address: "Jl. Nusantara No.12, Tangerang", documents: [{ name: "Akta Kelahiran", uploaded: true }, { name: "Kartu Keluarga", uploaded: true }, { name: "Rapor", uploaded: true }, { name: "Foto 3x4", uploaded: true }], notes: "Nilai tes di bawah passing grade", paymentStatus: "Belum Bayar" },
  { id: "PSB-2026-0007", studentName: "Umar Faruq Hidayat", program: "Tahfidz Al-Qur'an", wave: "Gelombang 2", guardianName: "H. Hidayat, Lc.", guardianPhone: "081789456012", guardianEmail: "hidayat@email.com", prevSchool: "SDIT Harapan", gender: "L", status: "Baru Mendaftar", testScore: 0, registeredAt: "2026-03-01", birthDate: "2015-01-14", address: "Jl. Pesantren No.7, Bogor", documents: [{ name: "Akta Kelahiran", uploaded: true }, { name: "Kartu Keluarga", uploaded: false }, { name: "Rapor", uploaded: false }, { name: "Foto 3x4", uploaded: false }], notes: "", paymentStatus: "Belum Bayar" },
  { id: "PSB-2026-0008", studentName: "Zainab Safira", program: "Bilingual", wave: "Gelombang 2", guardianName: "Dra. Safira Wati", guardianPhone: "081890567123", guardianEmail: "safira.w@email.com", prevSchool: "SD Global Islamic", gender: "P", status: "Baru Mendaftar", testScore: 0, registeredAt: "2026-03-05", birthDate: "2014-04-30", address: "Jl. Internasional Raya No.3, Serpong", documents: [{ name: "Akta Kelahiran", uploaded: true }, { name: "Kartu Keluarga", uploaded: true }, { name: "Rapor", uploaded: false }, { name: "Foto 3x4", uploaded: false }], notes: "", paymentStatus: "Belum Bayar" },
  { id: "PSB-2026-0009", studentName: "Bilal Ahmad Syafii", program: "Reguler", wave: "Gelombang 1", guardianName: "Ahmad Syafii, S.Ag.", guardianPhone: "081901678234", guardianEmail: "syafii@email.com", prevSchool: "MI Al-Falah", gender: "L", status: "Lulus Seleksi", testScore: 90, registeredAt: "2026-01-25", birthDate: "2014-08-09", address: "Jl. Masjid Agung No.20, Cirebon", documents: [{ name: "Akta Kelahiran", uploaded: true }, { name: "Kartu Keluarga", uploaded: true }, { name: "Rapor", uploaded: true }, { name: "Foto 3x4", uploaded: true }], notes: "Prestasi juara MTQ tingkat kota", paymentStatus: "Lunas" },
  { id: "PSB-2026-0010", studentName: "Hafsa Nur Aini", program: "STEM & Digital", wave: "Gelombang 2", guardianName: "Nur Aini, M.Pd.", guardianPhone: "082012789345", guardianEmail: "nuraini@email.com", prevSchool: "SDN 2 Depok", gender: "P", status: "Verifikasi Berkas", testScore: 0, registeredAt: "2026-03-10", birthDate: "2014-10-17", address: "Jl. Margonda Raya No.55, Depok", documents: [{ name: "Akta Kelahiran", uploaded: true }, { name: "Kartu Keluarga", uploaded: true }, { name: "Rapor", uploaded: true }, { name: "Foto 3x4", uploaded: false }], notes: "", paymentStatus: "Belum Bayar" },
  { id: "PSB-2026-0011", studentName: "Yusuf Iskandar", program: "Tahfidz Al-Qur'an", wave: "Gelombang 1", guardianName: "Iskandar, S.E.", guardianPhone: "082123890456", guardianEmail: "iskandar@email.com", prevSchool: "SD IT Nurul Fikri", gender: "L", status: "Daftar Ulang", testScore: 87, registeredAt: "2026-02-05", birthDate: "2014-05-21", address: "Jl. Pondok Pesantren No.14, Bandung", documents: [{ name: "Akta Kelahiran", uploaded: true }, { name: "Kartu Keluarga", uploaded: true }, { name: "Rapor", uploaded: true }, { name: "Foto 3x4", uploaded: true }], notes: "Sudah bayar DP", paymentStatus: "Cicilan" },
  { id: "PSB-2026-0012", studentName: "Maryam Azzahra", program: "Reguler", wave: "Gelombang 2", guardianName: "Hj. Azzahra", guardianPhone: "082234901567", guardianEmail: "azzahra@email.com", prevSchool: "SDN 8 Tangerang", gender: "P", status: "Baru Mendaftar", testScore: 0, registeredAt: "2026-03-12", birthDate: "2014-02-28", address: "Jl. Raya Serpong No.88, Tangerang Selatan", documents: [{ name: "Akta Kelahiran", uploaded: false }, { name: "Kartu Keluarga", uploaded: false }, { name: "Rapor", uploaded: false }, { name: "Foto 3x4", uploaded: false }], notes: "", paymentStatus: "Belum Bayar" },
];

const PAGE_SIZES = [5, 10, 15, 20, 25];

const ManageRegistrations = () => {
  const [data, setData] = useState<RegistrationItem[]>(initialData);
  const [steps, setSteps] = useState<StepConfig[]>(loadSteps);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [waveFilter, setWaveFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [detailItem, setDetailItem] = useState<RegistrationItem | null>(null);
  const [editItem, setEditItem] = useState<RegistrationItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<RegistrationItem | null>(null);
  const [statusChangeItem, setStatusChangeItem] = useState<RegistrationItem | null>(null);
  const [newStatus, setNewStatus] = useState<string>("Baru Mendaftar");
  const [showFilters, setShowFilters] = useState(false);
  const [editForm, setEditForm] = useState<Partial<RegistrationItem>>({});

  // Step editor state
  const [stepEditorOpen, setStepEditorOpen] = useState(false);
  const [editingSteps, setEditingSteps] = useState<StepConfig[]>([]);
  const [editingStepIdx, setEditingStepIdx] = useState<number | null>(null);

  const saveSteps = (newSteps: StepConfig[]) => {
    setSteps(newSteps);
    localStorage.setItem("registration_steps", JSON.stringify(newSteps));
  };

  const getStepConfig = (status: string) => steps.find(s => s.status === status) || steps[0];
  const progressSteps = useMemo(() => steps.filter(s => !s.isFinal), [steps]);

  // ─── Derived stats ───
  const stats = useMemo(() => {
    const total = data.length;
    const byStatus: Record<string, number> = {};
    steps.forEach(s => { byStatus[s.status] = 0; });
    data.forEach(d => { byStatus[d.status] = (byStatus[d.status] || 0) + 1; });
    const passed = progressSteps.length >= 4 ? (byStatus[progressSteps[3]?.status] || 0) + (byStatus[progressSteps[4]?.status] || 0) : 0;
    const male = data.filter(d => d.gender === "L").length;
    const female = data.filter(d => d.gender === "P").length;
    return { total, byStatus, passed, male, female };
  }, [data, steps, progressSteps]);

  // ─── Filtering ───
  const filtered = useMemo(() => {
    let result = data;
    if (statusFilter !== "all") result = result.filter(d => d.status === statusFilter);
    if (programFilter !== "all") result = result.filter(d => d.program === programFilter);
    if (waveFilter !== "all") result = result.filter(d => d.wave === waveFilter);
    if (genderFilter !== "all") result = result.filter(d => d.gender === genderFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.studentName.toLowerCase().includes(q) ||
        d.guardianName.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.guardianPhone.includes(q)
      );
    }
    return result;
  }, [data, statusFilter, programFilter, waveFilter, genderFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const programs = [...new Set(data.map(d => d.program))];
  const waves = [...new Set(data.map(d => d.wave))];

  // ─── Actions ───
  const handleStatusChange = () => {
    if (!statusChangeItem) return;
    setData(prev => prev.map(d => d.id === statusChangeItem.id ? { ...d, status: newStatus } : d));
    toast.success(`Status ${statusChangeItem.studentName} diubah → ${newStatus}`, { duration: 4000 });
    setStatusChangeItem(null);
    if (detailItem?.id === statusChangeItem.id) {
      setDetailItem(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    setData(prev => prev.filter(d => d.id !== deleteItem.id));
    toast.success(`Data ${deleteItem.studentName} berhasil dihapus`, { duration: 4000 });
    setDeleteItem(null);
    if (detailItem?.id === deleteItem.id) setDetailItem(null);
  };

  const openEdit = (item: RegistrationItem) => {
    setEditItem(item);
    setEditForm({ ...item });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editItem) return;
    setData(prev => prev.map(d => d.id === editItem.id ? { ...d, ...editForm } as RegistrationItem : d));
    toast.success(`Data ${editForm.studentName || editItem.studentName} berhasil diperbarui`, { duration: 4000 });
    setEditDialogOpen(false);
    if (detailItem?.id === editItem.id) {
      setDetailItem(prev => prev ? { ...prev, ...editForm } as RegistrationItem : null);
    }
  };

  const getDocumentProgress = (item: RegistrationItem) => {
    const uploaded = item.documents.filter(d => d.uploaded).length;
    return { uploaded, total: item.documents.length, percent: Math.round((uploaded / item.documents.length) * 100) };
  };

  const getStepIndex = (status: string) => {
    const idx = progressSteps.findIndex(s => s.status === status);
    return idx >= 0 ? idx : 0;
  };

  // Step editor helpers
  const openStepEditor = () => {
    setEditingSteps(JSON.parse(JSON.stringify(steps)));
    setEditingStepIdx(null);
    setStepEditorOpen(true);
  };

  const handleSaveSteps = () => {
    if (editingSteps.length < 2) {
      toast.error("Minimal harus ada 2 tahapan");
      return;
    }
    saveSteps(editingSteps);
    setStepEditorOpen(false);
    toast.success("Tahapan pendaftaran berhasil diperbarui");
  };

  const addNewStep = () => {
    const newStep: StepConfig = {
      id: String(Date.now()),
      status: `Tahap Baru ${editingSteps.length + 1}`,
      iconKey: "ClipboardList",
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    };
    setEditingSteps(prev => [...prev, newStep]);
    setEditingStepIdx(editingSteps.length);
  };

  const removeStep = (idx: number) => {
    setEditingSteps(prev => prev.filter((_, i) => i !== idx));
    setEditingStepIdx(null);
  };

  const moveStep = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= editingSteps.length) return;
    setEditingSteps(prev => {
      const arr = [...prev];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
    setEditingStepIdx(newIdx);
  };

  // ─── Render ───
  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manajemen Pendaftaran</h1>
            <p className="text-sm text-muted-foreground mt-1">Kelola seluruh proses penerimaan santri baru secara terpusat</p>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={openStepEditor}>
                  <Settings2 className="h-4 w-4 mr-1.5" /> Atur Tahapan
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit tahapan, ikon, dan warna pipeline</TooltipContent>
            </Tooltip>
            <Button variant="outline" size="sm" onClick={() => {
              toast.success("Data pendaftar berhasil diekspor", { duration: 4000 });
            }}>
              <Download className="h-4 w-4 mr-1.5" /> Ekspor
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Pendaftar</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px] text-muted-foreground">{stats.male} L · {stats.female} P</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Lulus Seleksi</p>
                  <p className="text-2xl font-bold text-success mt-1">{stats.byStatus["Lulus Seleksi"] || 0}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-success" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <ArrowUpRight className="h-3 w-3 text-success" />
                <span className="text-[11px] text-success font-medium">{stats.total > 0 ? Math.round(((stats.byStatus["Lulus Seleksi"] || 0) / stats.total) * 100) : 0}%</span>
                <span className="text-[11px] text-muted-foreground">dari total</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Menunggu Proses</p>
                  <p className="text-2xl font-bold text-warning mt-1">
                    {(stats.byStatus["Baru Mendaftar"] || 0) + (stats.byStatus["Verifikasi Berkas"] || 0) + (stats.byStatus["Menunggu Tes"] || 0)}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px] text-muted-foreground">Perlu tindak lanjut</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Daftar Ulang</p>
                  <p className="text-2xl font-bold text-primary mt-1">{stats.byStatus["Daftar Ulang"] || 0}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px] text-muted-foreground">Sedang proses daftar ulang</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ═══ Pipeline Overview — Improved hover ═══ */}
        <Card className="border shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-wrap">
              {steps.map(({ id, status, iconKey, color, bgColor }, idx) => {
                const Icon = getIconByKey(iconKey);
                const count = stats.byStatus[status] || 0;
                const isActive = statusFilter === status;
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <Tooltip key={id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setStatusFilter(isActive ? "all" : status)}
                        className={cn(
                          "relative flex flex-col items-center gap-2 px-4 py-4 transition-all duration-200 flex-1 min-w-[100px] group",
                          "border-r border-border last:border-r-0",
                          isActive
                            ? "bg-primary/8 shadow-inner"
                            : "hover:bg-accent/50 hover:shadow-sm"
                        )}
                      >
                        {/* Active indicator top bar */}
                        {isActive && (
                          <motion.div
                            layoutId="pipeline-active"
                            className="absolute top-0 left-0 right-0 h-0.5 bg-primary rounded-b"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}

                        <div className={cn(
                          "h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200",
                          bgColor,
                          "group-hover:scale-110 group-hover:shadow-md",
                          isActive && "ring-2 ring-primary/20 scale-110"
                        )}>
                          <Icon className={cn("h-4 w-4", color)} />
                        </div>

                        <span className={cn(
                          "text-xl font-bold transition-colors",
                          isActive ? "text-primary" : "text-foreground"
                        )}>
                          {count}
                        </span>

                        <span className={cn(
                          "text-[10px] leading-tight font-medium text-center transition-colors",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        )}>
                          {status}
                        </span>

                        {/* Percentage bar */}
                        <div className="w-full h-1 bg-border/50 rounded-full overflow-hidden mt-0.5">
                          <div
                            className={cn("h-full rounded-full transition-all duration-500", isActive ? "bg-primary" : "bg-muted-foreground/30 group-hover:bg-primary/40")}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-center">
                      <p className="font-semibold">{status}</p>
                      <p className="text-xs text-muted-foreground">{count} pendaftar ({pct}%)</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Klik untuk {isActive ? "tampilkan semua" : "filter"}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Search & Filters */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, ID, wali, atau no. HP..."
                className="pl-9 h-9"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-9"
            >
              <Filter className="h-4 w-4 mr-1.5" />
              Filter
              {(programFilter !== "all" || waveFilter !== "all" || genderFilter !== "all") && (
                <Badge variant="secondary" className="ml-1.5 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                  {[programFilter, waveFilter, genderFilter].filter(f => f !== "all").length}
                </Badge>
              )}
            </Button>
            <div className="ml-auto text-xs text-muted-foreground">
              {filtered.length} pendaftar
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-muted/30 border">
                  <Select value={programFilter} onValueChange={v => { setProgramFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue placeholder="Program" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Program</SelectItem>
                      {programs.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={waveFilter} onValueChange={v => { setWaveFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Gelombang" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Gelombang</SelectItem>
                      {waves.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={genderFilter} onValueChange={v => { setGenderFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="L/P" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="L">Laki-laki</SelectItem>
                      <SelectItem value="P">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                  {(programFilter !== "all" || waveFilter !== "all" || genderFilter !== "all" || statusFilter !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-destructive hover:text-destructive"
                      onClick={() => { setProgramFilter("all"); setWaveFilter("all"); setGenderFilter("all"); setStatusFilter("all"); setPage(1); }}
                    >
                      <X className="h-3 w-3 mr-1" /> Reset
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Data Table */}
        <Card className="border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-32 text-xs">No. Pendaftaran</TableHead>
                  <TableHead className="text-xs">Calon Santri</TableHead>
                  <TableHead className="text-xs">Program</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">Gelombang</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">Wali</TableHead>
                  <TableHead className="text-xs w-20 text-center hidden lg:table-cell">Dokumen</TableHead>
                  <TableHead className="text-xs w-20 text-center">Nilai</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Users className="h-8 w-8 opacity-30" />
                        <p className="text-sm">Tidak ada data pendaftar</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginated.map((item) => {
                  const docProgress = getDocumentProgress(item);
                  const statusConf = getStepConfig(item.status);
                  const StatusIcon = getIconByKey(statusConf.iconKey);
                  return (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer hover:bg-muted/30 transition-colors group"
                      onClick={() => setDetailItem(item)}
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">{item.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0",
                            item.gender === "L" ? "bg-info/10 text-info" : "bg-accent/15 text-accent-foreground"
                          )}>
                            {item.studentName.split(" ").map(n => n[0]).slice(0, 2).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground leading-tight">{item.studentName}</p>
                            <p className="text-[11px] text-muted-foreground">{item.prevSchool}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[11px] font-medium bg-primary/8 text-primary border-0">
                          {item.program}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">{item.wave}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>
                          <p className="text-xs font-medium text-foreground">{item.guardianName}</p>
                          <p className="text-[11px] text-muted-foreground">{item.guardianPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] text-muted-foreground">{docProgress.uploaded}/{docProgress.total}</span>
                          <Progress value={docProgress.percent} className="h-1 w-12" />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={cn(
                          "text-xs font-bold",
                          item.testScore >= 70 ? "text-success" : item.testScore > 0 ? "text-destructive" : "text-muted-foreground"
                        )}>
                          {item.testScore > 0 ? item.testScore : "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-[11px] border-0 font-medium", statusConf.bgColor, statusConf.color)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => setDetailItem(item)}>
                              <Eye className="h-3.5 w-3.5 mr-2" /> Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(item)}>
                              <Pencil className="h-3.5 w-3.5 mr-2" /> Edit Data
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setStatusChangeItem(item); setNewStatus(item.status); }}>
                              <ArrowRight className="h-3.5 w-3.5 mr-2" /> Ubah Status
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteItem(item)}>
                              <Trash2 className="h-3.5 w-3.5 mr-2" /> Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Tampilkan</span>
              <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-[65px] h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAGE_SIZES.map(s => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">per halaman</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs text-muted-foreground px-2">
                {page} / {totalPages}
              </span>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* ════════════════ Detail Side Panel — Dynamic Steps ════════════════ */}
        <Dialog open={!!detailItem} onOpenChange={open => { if (!open) setDetailItem(null); }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
            {detailItem && (() => {
              const docProgress = getDocumentProgress(detailItem);
              const statusConf = getStepConfig(detailItem.status);
              const stepIdx = getStepIndex(detailItem.status);
              const isFinalStatus = steps.find(s => s.status === detailItem.status)?.isFinal;
              const StatusIcon = getIconByKey(statusConf.iconKey);
              return (
                <>
                  {/* Header — shows current status with dynamic icon/color */}
                  <div className="gradient-primary p-6 text-primary-foreground rounded-t-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center text-lg font-bold">
                          {detailItem.studentName.split(" ").map(n => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <h2 className="text-lg font-bold">{detailItem.studentName}</h2>
                          <p className="text-sm text-primary-foreground/70 font-mono">{detailItem.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-primary-foreground/15 backdrop-blur-sm rounded-lg px-3 py-1.5">
                        <StatusIcon className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">{detailItem.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Step Progress — auto-adjusts to any step changes */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-4">Progres Tahapan</h3>
                      <div className="flex items-start">
                        {progressSteps.map((step, i) => {
                          const isCompleted = isFinalStatus ? false : i < stepIdx;
                          const isCurrent = isFinalStatus ? false : i === stepIdx;
                          const StepIcon = getIconByKey(step.iconKey);
                          const isLast = i === progressSteps.length - 1;
                          return (
                            <div key={step.id} className="flex items-start flex-1 min-w-0">
                              <div className="flex flex-col items-center flex-1 gap-1.5">
                                <div className={cn(
                                  "h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                                  isCompleted ? "bg-success text-success-foreground shadow-sm" :
                                  isCurrent ? cn(step.bgColor, "ring-2 ring-offset-2", step.color.replace("text-", "ring-")) :
                                  "bg-muted text-muted-foreground/40"
                                )}>
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    <StepIcon className={cn("h-4 w-4", isCurrent ? step.color : "")} />
                                  )}
                                </div>
                                <span className={cn(
                                  "text-[9px] text-center leading-tight font-medium max-w-[70px]",
                                  isCompleted ? "text-success" :
                                  isCurrent ? "text-foreground font-semibold" :
                                  "text-muted-foreground/40"
                                )}>
                                  {step.status}
                                </span>
                              </div>
                              {!isLast && (
                                <div className={cn(
                                  "h-0.5 flex-1 min-w-[8px] mt-[18px] rounded-full transition-colors",
                                  isCompleted ? "bg-success" : "bg-border"
                                )} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {isFinalStatus && (
                        <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20">
                          <XCircle className="h-4 w-4 text-destructive shrink-0" />
                          <span className="text-xs font-medium text-destructive">{detailItem.status}</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <InfoRow icon={User} label="Jenis Kelamin" value={detailItem.gender === "L" ? "Laki-laki" : "Perempuan"} />
                      <InfoRow icon={Calendar} label="Tanggal Lahir" value={detailItem.birthDate} />
                      <InfoRow icon={GraduationCap} label="Program" value={detailItem.program} />
                      <InfoRow icon={BarChart3} label="Gelombang" value={detailItem.wave} />
                      <InfoRow icon={School} label="Asal Sekolah" value={detailItem.prevSchool} />
                      <InfoRow icon={TrendingUp} label="Nilai Tes" value={detailItem.testScore > 0 ? String(detailItem.testScore) : "Belum tes"} />
                    </div>

                    <Separator />

                    {/* Guardian */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3">Data Wali / Orang Tua</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <InfoRow icon={User} label="Nama Wali" value={detailItem.guardianName} />
                        <InfoRow icon={Phone} label="No. HP" value={detailItem.guardianPhone} />
                        <InfoRow icon={Mail} label="Email" value={detailItem.guardianEmail} />
                      </div>
                    </div>

                    <Separator />

                    {/* Documents */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-foreground">Kelengkapan Dokumen</h3>
                        <span className="text-xs text-muted-foreground">{docProgress.uploaded}/{docProgress.total} lengkap</span>
                      </div>
                      <div className="space-y-2">
                        {detailItem.documents.map((doc, i) => (
                          <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border bg-card">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm">{doc.name}</span>
                            </div>
                            {doc.uploaded ? (
                              <Badge className="bg-success/10 text-success border-0 text-[10px]">
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Lengkap
                              </Badge>
                            ) : (
                              <Badge className="bg-destructive/10 text-destructive border-0 text-[10px]">
                                <AlertCircle className="h-3 w-3 mr-1" /> Belum
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment & Notes */}
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-2">Pembayaran</h3>
                        <Badge className={cn(
                          "text-xs border-0",
                          detailItem.paymentStatus === "Lunas" ? "bg-success/10 text-success" :
                          detailItem.paymentStatus === "Cicilan" ? "bg-warning/10 text-warning" :
                          "bg-destructive/10 text-destructive"
                        )}>
                          {detailItem.paymentStatus}
                        </Badge>
                      </div>
                      {detailItem.notes && (
                        <div>
                          <h3 className="text-sm font-semibold text-foreground mb-2">Catatan</h3>
                          <p className="text-sm text-muted-foreground">{detailItem.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button size="sm" className="h-8 text-xs" onClick={() => { setStatusChangeItem(detailItem); setNewStatus(detailItem.status); }}>
                        <ArrowRight className="h-3.5 w-3.5 mr-1.5" /> Ubah Status
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => openEdit(detailItem)}>
                        <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-destructive hover:text-destructive ml-auto" onClick={() => setDeleteItem(detailItem)}>
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Hapus
                      </Button>
                    </div>
                  </div>
                </>
              );
            })()}
          </DialogContent>
        </Dialog>

        {/* ════════════════ Status Change Dialog — Dynamic ════════════════ */}
        <Dialog open={!!statusChangeItem} onOpenChange={open => { if (!open) setStatusChangeItem(null); }}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-base">Ubah Status Pendaftaran</DialogTitle>
              <DialogDescription className="text-sm">
                {statusChangeItem?.studentName} — {statusChangeItem?.id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2 max-h-[50vh] overflow-y-auto">
              {steps.map(({ id, status, iconKey, color, bgColor }) => {
                const Icon = getIconByKey(iconKey);
                return (
                  <button
                    key={id}
                    onClick={() => setNewStatus(status)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                      newStatus === status ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted/50"
                    )}
                  >
                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", bgColor)}>
                      <Icon className={cn("h-4 w-4", color)} />
                    </div>
                    <span className="text-sm font-medium">{status}</span>
                    {newStatus === status && <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />}
                  </button>
                );
              })}
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setStatusChangeItem(null)}>Batal</Button>
              <Button size="sm" onClick={handleStatusChange} disabled={statusChangeItem?.status === newStatus}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ════════════════ Edit Dialog ════════════════ */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base">Edit Data Pendaftaran</DialogTitle>
              <DialogDescription>{editItem?.id}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Nama Calon Santri</Label>
                  <Input className="h-9 text-sm" value={editForm.studentName || ""} onChange={e => setEditForm(p => ({ ...p, studentName: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Jenis Kelamin</Label>
                  <Select value={editForm.gender || "L"} onValueChange={v => setEditForm(p => ({ ...p, gender: v }))}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Laki-laki</SelectItem>
                      <SelectItem value="P">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Program</Label>
                  <Select value={editForm.program || ""} onValueChange={v => setEditForm(p => ({ ...p, program: v }))}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {programs.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Gelombang</Label>
                  <Select value={editForm.wave || ""} onValueChange={v => setEditForm(p => ({ ...p, wave: v }))}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {waves.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Tanggal Lahir</Label>
                  <Input type="date" className="h-9 text-sm" value={editForm.birthDate || ""} onChange={e => setEditForm(p => ({ ...p, birthDate: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Asal Sekolah</Label>
                  <Input className="h-9 text-sm" value={editForm.prevSchool || ""} onChange={e => setEditForm(p => ({ ...p, prevSchool: e.target.value }))} />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Nama Wali</Label>
                  <Input className="h-9 text-sm" value={editForm.guardianName || ""} onChange={e => setEditForm(p => ({ ...p, guardianName: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">No. HP Wali</Label>
                  <Input className="h-9 text-sm" value={editForm.guardianPhone || ""} onChange={e => setEditForm(p => ({ ...p, guardianPhone: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email Wali</Label>
                <Input className="h-9 text-sm" value={editForm.guardianEmail || ""} onChange={e => setEditForm(p => ({ ...p, guardianEmail: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Alamat</Label>
                <Textarea className="text-sm min-h-[60px]" value={editForm.address || ""} onChange={e => setEditForm(p => ({ ...p, address: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Nilai Tes</Label>
                  <Input type="number" className="h-9 text-sm" min={0} max={100} value={editForm.testScore ?? 0} onChange={e => setEditForm(p => ({ ...p, testScore: Number(e.target.value) }))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Status Pembayaran</Label>
                  <Select value={editForm.paymentStatus || "Belum Bayar"} onValueChange={v => setEditForm(p => ({ ...p, paymentStatus: v as RegistrationItem["paymentStatus"] }))}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lunas">Lunas</SelectItem>
                      <SelectItem value="Cicilan">Cicilan</SelectItem>
                      <SelectItem value="Belum Bayar">Belum Bayar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Catatan</Label>
                <Textarea className="text-sm min-h-[60px]" value={editForm.notes || ""} onChange={e => setEditForm(p => ({ ...p, notes: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(false)}>Batal</Button>
              <Button size="sm" onClick={handleSaveEdit}>Simpan Perubahan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ════════════════ Delete Confirmation ════════════════ */}
        <AlertDialog open={!!deleteItem} onOpenChange={open => { if (!open) setDeleteItem(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Data Pendaftaran?</AlertDialogTitle>
              <AlertDialogDescription>
                Data pendaftaran <strong>{deleteItem?.studentName}</strong> ({deleteItem?.id}) akan dihapus permanen dan tidak dapat dikembalikan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ════════════════ Step Editor Dialog ════════════════ */}
        <Dialog open={stepEditorOpen} onOpenChange={setStepEditorOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base flex items-center gap-2">
                <Settings2 className="h-4 w-4" /> Pengaturan Tahapan Pendaftaran
              </DialogTitle>
              <DialogDescription>
                Atur urutan, ikon, dan warna setiap tahapan proses pendaftaran. Perubahan akan langsung diterapkan.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              {/* Step list */}
              {editingSteps.map((step, idx) => {
                const Icon = getIconByKey(step.iconKey);
                const isSelected = editingStepIdx === idx;
                return (
                  <div key={step.id}>
                    <button
                      onClick={() => setEditingStepIdx(isSelected ? null : idx)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                        isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span className="text-[10px] font-mono w-4 text-center">{idx + 1}</span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={e => { e.stopPropagation(); moveStep(idx, -1); }}
                            disabled={idx === 0}
                            className="h-3 w-4 flex items-center justify-center hover:text-foreground disabled:opacity-20"
                          >
                            <ChevronDown className="h-2.5 w-2.5 rotate-180" />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); moveStep(idx, 1); }}
                            disabled={idx === editingSteps.length - 1}
                            className="h-3 w-4 flex items-center justify-center hover:text-foreground disabled:opacity-20"
                          >
                            <ChevronDown className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </div>
                      <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", step.bgColor)}>
                        <Icon className={cn("h-4 w-4", step.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{step.status}</p>
                        {step.isFinal && <span className="text-[10px] text-destructive">Status akhir (tidak termasuk progres)</span>}
                      </div>
                      <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", isSelected && "rotate-90")} />
                    </button>

                    {/* Expanded editor */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 border border-t-0 rounded-b-lg bg-muted/20 space-y-4">
                            {/* Name */}
                            <div className="space-y-1.5">
                              <Label className="text-xs">Nama Tahapan</Label>
                              <Input
                                className="h-9 text-sm"
                                value={step.status}
                                onChange={e => {
                                  setEditingSteps(prev => prev.map((s, i) => i === idx ? { ...s, status: e.target.value } : s));
                                }}
                              />
                            </div>

                            {/* Icon picker */}
                            <div className="space-y-1.5">
                              <Label className="text-xs">Ikon</Label>
                              <div className="flex flex-wrap gap-1.5">
                                {STEP_ICON_OPTIONS.map(opt => {
                                  const OptIcon = opt.icon;
                                  const isActive = step.iconKey === opt.key;
                                  return (
                                    <button
                                      key={opt.key}
                                      onClick={() => setEditingSteps(prev => prev.map((s, i) => i === idx ? { ...s, iconKey: opt.key } : s))}
                                      className={cn(
                                        "h-8 w-8 rounded-lg flex items-center justify-center border transition-all",
                                        isActive ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/20" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                      )}
                                    >
                                      <OptIcon className="h-3.5 w-3.5" />
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Color picker */}
                            <div className="space-y-1.5">
                              <Label className="text-xs">Warna</Label>
                              <div className="flex flex-wrap gap-2">
                                {STEP_COLOR_OPTIONS.map(opt => {
                                  const isActive = step.color === opt.color && step.bgColor === opt.bg;
                                  const PreviewIcon = getIconByKey(step.iconKey);
                                  return (
                                    <button
                                      key={opt.label}
                                      onClick={() => setEditingSteps(prev => prev.map((s, i) => i === idx ? { ...s, color: opt.color, bgColor: opt.bg } : s))}
                                      className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
                                        isActive ? "border-primary ring-1 ring-primary/20" : "hover:bg-muted/50"
                                      )}
                                    >
                                      <div className={cn("h-6 w-6 rounded-md flex items-center justify-center", opt.bg)}>
                                        <PreviewIcon className={cn("h-3 w-3", opt.color)} />
                                      </div>
                                      <span className="text-xs">{opt.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Final status toggle */}
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-medium">Status Akhir (Gagal)</p>
                                <p className="text-[10px] text-muted-foreground">Tidak termasuk dalam progres tahapan</p>
                              </div>
                              <button
                                onClick={() => setEditingSteps(prev => prev.map((s, i) => i === idx ? { ...s, isFinal: !s.isFinal } : s))}
                                className={cn(
                                  "h-6 w-11 rounded-full transition-colors relative",
                                  step.isFinal ? "bg-destructive" : "bg-muted"
                                )}
                              >
                                <div className={cn(
                                  "absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform",
                                  step.isFinal ? "translate-x-5" : "translate-x-0.5"
                                )} />
                              </button>
                            </div>

                            {/* Delete */}
                            <div className="flex justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-destructive hover:text-destructive"
                                onClick={() => removeStep(idx)}
                                disabled={editingSteps.length <= 2}
                              >
                                <Trash2 className="h-3 w-3 mr-1" /> Hapus Tahapan
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Add new step */}
              <button
                onClick={addNewStep}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-muted-foreground/20 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">Tambah Tahapan</span>
              </button>
            </div>

            {/* Live preview */}
            <div className="space-y-2 pt-2">
              <Label className="text-xs text-muted-foreground">Preview Pipeline</Label>
              <div className="flex items-center gap-1 p-3 rounded-lg bg-muted/30 border overflow-x-auto">
                {editingSteps.map((step, i) => {
                  const Icon = getIconByKey(step.iconKey);
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className="flex flex-col items-center gap-1 min-w-[60px]">
                        <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center", step.bgColor)}>
                          <Icon className={cn("h-3.5 w-3.5", step.color)} />
                        </div>
                        <span className="text-[8px] text-center leading-tight font-medium text-muted-foreground max-w-[60px] truncate">
                          {step.status}
                        </span>
                      </div>
                      {i < editingSteps.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-muted-foreground/30 mx-0.5 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setStepEditorOpen(false)}>Batal</Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setEditingSteps(JSON.parse(JSON.stringify(DEFAULT_STEPS))); setEditingStepIdx(null); }}
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Reset Default
              </Button>
              <Button size="sm" onClick={handleSaveSteps}>Simpan Perubahan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

// ─── Small helper component ───
function InfoRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default ManageRegistrations;
