import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Search, Plus, MoreHorizontal, ChevronLeft, ChevronRight, Pencil, Trash2,
  Filter, Eye, X, Download, Users, UserCheck, UserX, Clock, FileText,
  GraduationCap, Phone, Mail, School, Calendar, CheckCircle2, AlertCircle,
  ClipboardList, ArrowRight, ChevronDown, BarChart3, TrendingUp, User,
  FileSpreadsheet, ArrowUpRight, ArrowDownRight, XCircle, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { cn } from "@/lib/utils";

// ─── Types ───
type RegistrationStatus = "Baru Mendaftar" | "Verifikasi Berkas" | "Menunggu Tes" | "Lulus Seleksi" | "Tidak Lulus" | "Daftar Ulang";

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
  status: RegistrationStatus;
  testScore: number;
  registeredAt: string;
  birthDate: string;
  address: string;
  documents: { name: string; uploaded: boolean }[];
  notes: string;
  paymentStatus: "Lunas" | "Belum Bayar" | "Cicilan";
}

// ─── Status config ───
const STATUS_PIPELINE: { status: RegistrationStatus; icon: typeof Clock; color: string; bgColor: string }[] = [
  { status: "Baru Mendaftar", icon: ClipboardList, color: "text-muted-foreground", bgColor: "bg-muted" },
  { status: "Verifikasi Berkas", icon: FileText, color: "text-info", bgColor: "bg-info/10" },
  { status: "Menunggu Tes", icon: Clock, color: "text-warning", bgColor: "bg-warning/10" },
  { status: "Lulus Seleksi", icon: CheckCircle2, color: "text-success", bgColor: "bg-success/10" },
  { status: "Daftar Ulang", icon: RefreshCw, color: "text-primary", bgColor: "bg-primary/10" },
  { status: "Tidak Lulus", icon: XCircle, color: "text-destructive", bgColor: "bg-destructive/10" },
];

const getStatusConfig = (status: string) => STATUS_PIPELINE.find(s => s.status === status) || STATUS_PIPELINE[0];

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
  const [newStatus, setNewStatus] = useState<RegistrationStatus>("Baru Mendaftar");
  const [showFilters, setShowFilters] = useState(false);
  const [editForm, setEditForm] = useState<Partial<RegistrationItem>>({});

  // ─── Derived stats ───
  const stats = useMemo(() => {
    const total = data.length;
    const byStatus: Record<string, number> = {};
    STATUS_PIPELINE.forEach(s => { byStatus[s.status] = 0; });
    data.forEach(d => { byStatus[d.status] = (byStatus[d.status] || 0) + 1; });
    const passed = byStatus["Lulus Seleksi"] + byStatus["Daftar Ulang"];
    const male = data.filter(d => d.gender === "L").length;
    const female = data.filter(d => d.gender === "P").length;
    return { total, byStatus, passed, male, female };
  }, [data]);

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

  const getStepIndex = (status: RegistrationStatus) => {
    const idx = STATUS_PIPELINE.findIndex(s => s.status === status);
    return idx >= 0 ? idx : 0;
  };

  // ─── Render ───
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manajemen Pendaftaran</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola seluruh proses penerimaan santri baru secara terpusat</p>
        </div>
        <div className="flex items-center gap-2">
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
                <p className="text-2xl font-bold text-success mt-1">{stats.byStatus["Lulus Seleksi"]}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-success" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <ArrowUpRight className="h-3 w-3 text-success" />
              <span className="text-[11px] text-success font-medium">{stats.total > 0 ? Math.round((stats.byStatus["Lulus Seleksi"] / stats.total) * 100) : 0}%</span>
              <span className="text-[11px] text-muted-foreground">dari total</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Menunggu Proses</p>
                <p className="text-2xl font-bold text-warning mt-1">{stats.byStatus["Baru Mendaftar"] + stats.byStatus["Verifikasi Berkas"] + stats.byStatus["Menunggu Tes"]}</p>
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
                <p className="text-2xl font-bold text-primary mt-1">{stats.byStatus["Daftar Ulang"]}</p>
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

      {/* Pipeline Overview */}
      <Card className="border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-3 lg:grid-cols-6 divide-x divide-border">
            {STATUS_PIPELINE.map(({ status, icon: Icon, color, bgColor }) => {
              const count = stats.byStatus[status] || 0;
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(isActive ? "all" : status)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 lg:p-4 transition-colors text-center",
                    isActive ? "bg-primary/5" : "hover:bg-muted/50"
                  )}
                >
                  <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", bgColor)}>
                    <Icon className={cn("h-4 w-4", color)} />
                  </div>
                  <span className="text-lg font-bold text-foreground">{count}</span>
                  <span className="text-[10px] leading-tight font-medium text-muted-foreground">{status}</span>
                  {isActive && <div className="w-6 h-0.5 rounded-full bg-primary" />}
                </button>
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
              ) : paginated.map((item, i) => {
                const docProgress = getDocumentProgress(item);
                const statusConf = getStatusConfig(item.status);
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

      {/* ════════════════ Detail Side Panel ════════════════ */}
      <Dialog open={!!detailItem} onOpenChange={open => { if (!open) setDetailItem(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          {detailItem && (() => {
            const docProgress = getDocumentProgress(detailItem);
            const statusConf = getStatusConfig(detailItem.status);
            const stepIdx = getStepIndex(detailItem.status);
            return (
              <>
                {/* Header */}
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
                    <Badge className={cn("text-xs border-0", statusConf.bgColor.replace("/10", "-foreground/15"), "text-primary-foreground")}>
                      {detailItem.status}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Step Progress */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">Progres Tahapan</h3>
                    <div className="flex items-center gap-1">
                      {STATUS_PIPELINE.filter(s => s.status !== "Tidak Lulus").map((step, i) => {
                        const isCompleted = i < stepIdx;
                        const isCurrent = i === stepIdx;
                        const isRejected = detailItem.status === "Tidak Lulus";
                        const StepIcon = step.icon;
                        return (
                          <div key={step.status} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1 gap-1.5">
                              <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                                isRejected && isCurrent ? "bg-destructive/10" :
                                isCompleted ? "bg-success/10" :
                                isCurrent ? "bg-primary/10" : "bg-muted"
                              )}>
                                <StepIcon className={cn(
                                  "h-3.5 w-3.5",
                                  isRejected && isCurrent ? "text-destructive" :
                                  isCompleted ? "text-success" :
                                  isCurrent ? "text-primary" : "text-muted-foreground/50"
                                )} />
                              </div>
                              <span className={cn(
                                "text-[9px] text-center leading-tight font-medium",
                                isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground/50"
                              )}>
                                {step.status}
                              </span>
                            </div>
                            {i < STATUS_PIPELINE.filter(s => s.status !== "Tidak Lulus").length - 1 && (
                              <div className={cn(
                                "h-0.5 w-full min-w-[12px] -mt-5",
                                isCompleted ? "bg-success/40" : "bg-border"
                              )} />
                            )}
                          </div>
                        );
                      })}
                    </div>
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

      {/* ════════════════ Status Change Dialog ════════════════ */}
      <Dialog open={!!statusChangeItem} onOpenChange={open => { if (!open) setStatusChangeItem(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Ubah Status Pendaftaran</DialogTitle>
            <DialogDescription className="text-sm">
              {statusChangeItem?.studentName} — {statusChangeItem?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {STATUS_PIPELINE.map(({ status, icon: Icon, color, bgColor }) => (
              <button
                key={status}
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
            ))}
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
    </div>
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
