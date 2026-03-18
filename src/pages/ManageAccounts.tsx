import { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import {
  Upload, Download, Send, Eye, Trash2, Search, ChevronLeft, ChevronRight,
  FileSpreadsheet, UserPlus, Users, Shield, CheckCircle2, AlertCircle, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AccountRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "student" | "guardian";
  username: string;
  password: string;
  status: "pending" | "active" | "sent";
  linkedTo?: string; // guardian linked to student name or vice versa
}

// Mock existing accounts
const mockAccounts: AccountRow[] = [
  { id: "ACC001", name: "Muhammad Azzam", email: "azzam@pesantren.id", phone: "081234567001", role: "student", username: "azzam.2024", password: "••••••••", status: "active", linkedTo: "H. Muhammad Ridwan" },
  { id: "ACC002", name: "H. Muhammad Ridwan", email: "ridwan@gmail.com", phone: "081234567002", role: "guardian", username: "ridwan.wali", password: "••••••••", status: "active", linkedTo: "Muhammad Azzam" },
  { id: "ACC003", name: "Ahmad Fauzi", email: "fauzi@pesantren.id", phone: "081234567003", role: "student", username: "fauzi.2024", password: "••••••••", status: "active", linkedTo: "Hasan Abdullah" },
  { id: "ACC004", name: "Hasan Abdullah", email: "hasan@gmail.com", phone: "081234567004", role: "guardian", username: "hasan.wali", password: "••••••••", status: "sent", linkedTo: "Ahmad Fauzi" },
  { id: "ACC005", name: "Siti Aisyah", email: "aisyah@pesantren.id", phone: "081234567005", role: "student", username: "aisyah.2024", password: "••••••••", status: "active", linkedTo: "Aminah Sari" },
  { id: "ACC006", name: "Aminah Sari", email: "aminah@gmail.com", phone: "081234567006", role: "guardian", username: "aminah.wali", password: "••••••••", status: "active", linkedTo: "Siti Aisyah" },
];

function generatePassword(length = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

function generateUsername(name: string, role: "student" | "guardian"): string {
  const clean = name.toLowerCase().replace(/[^a-z\s]/g, "").trim().split(/\s+/).slice(0, 2).join(".");
  return role === "guardian" ? `${clean}.wali` : `${clean}.2024`;
}

export default function ManageAccounts() {
  const [accounts, setAccounts] = useState<AccountRow[]>(mockAccounts);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Import states
  const [importData, setImportData] = useState<AccountRow[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [importFileName, setImportFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Send dialog
  const [sendOpen, setSendOpen] = useState(false);
  const [sendMethod, setSendMethod] = useState<"whatsapp" | "email">("whatsapp");
  const [sendTarget, setSendTarget] = useState("");
  const [sendItems, setSendItems] = useState<AccountRow[]>([]);

  // Confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Add manual account
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", phone: "", role: "student" as "student" | "guardian", linkedTo: "" });

  // Filtered data
  const filtered = useMemo(() => {
    let result = accounts;
    if (roleFilter !== "all") result = result.filter((a) => a.role === roleFilter);
    if (statusFilter !== "all") result = result.filter((a) => a.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.name.toLowerCase().includes(q) || a.username.toLowerCase().includes(q) || a.email.toLowerCase().includes(q));
    }
    return result;
  }, [accounts, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const stats = useMemo(() => ({
    total: accounts.length,
    students: accounts.filter((a) => a.role === "student").length,
    guardians: accounts.filter((a) => a.role === "guardian").length,
    pending: accounts.filter((a) => a.status === "pending").length,
  }), [accounts]);

  // ─── Excel Import ───
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);

      const parsed: AccountRow[] = json.map((row, i) => {
        const name = row["Nama"] || row["Name"] || row["nama"] || row["name"] || "";
        const email = row["Email"] || row["email"] || "";
        const phone = row["Telepon"] || row["Phone"] || row["phone"] || row["telepon"] || row["No. Telepon"] || "";
        const rawRole = (row["Peran"] || row["Role"] || row["role"] || row["peran"] || "student").toLowerCase();
        const role: "student" | "guardian" = rawRole.includes("wali") || rawRole.includes("guardian") ? "guardian" : "student";
        const linkedTo = row["Santri"] || row["Anak"] || row["Children"] || row["LinkedTo"] || "";

        return {
          id: `IMP-${Date.now()}-${i}`,
          name,
          email,
          phone: String(phone),
          role,
          username: generateUsername(name, role),
          password: generatePassword(),
          status: "pending" as const,
          linkedTo,
        };
      });

      setImportData(parsed);
      setPreviewOpen(true);
    };
    reader.readAsBinaryString(file);
    e.target.value = "";
  };

  const confirmImport = () => {
    setAccounts((prev) => [...importData, ...prev]);
    setImportData([]);
    setPreviewOpen(false);
    setConfirmOpen(false);
    toast.success(`${importData.length} akun berhasil diimpor`, { duration: 2500 });
  };

  // ─── Download Excel ───
  const downloadExcel = (items: AccountRow[]) => {
    const exportData = items.map((a) => ({
      "Nama / Name": a.name,
      "Email": a.email,
      "Telepon / Phone": a.phone,
      "Peran / Role": a.role === "student" ? "Santri" : "Wali",
      "Username": a.username,
      "Password": a.password === "••••••••" ? "(sudah diatur)" : a.password,
      "Status": a.status === "active" ? "Aktif" : a.status === "sent" ? "Terkirim" : "Pending",
      "Terkait / Linked To": a.linkedTo || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Akun");
    XLSX.writeFile(wb, `akun-portal-${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success("File Excel berhasil diunduh", { duration: 2500 });
  };

  // ─── Send Credentials ───
  const openSendDialog = (items: AccountRow[]) => {
    setSendItems(items);
    setSendTarget("");
    setSendOpen(true);
  };

  const handleSend = () => {
    // Download the Excel first
    downloadExcel(sendItems);

    if (sendMethod === "whatsapp") {
      const message = encodeURIComponent(
        `📋 *Kredensial Akun Portal Pesantren*\n\nBerikut file Excel berisi data akun login. Silakan distribusikan sesuai kebutuhan.\n\nTotal: ${sendItems.length} akun`
      );
      const url = sendTarget
        ? `https://wa.me/${sendTarget.replace(/[^0-9]/g, "")}?text=${message}`
        : `https://wa.me/?text=${message}`;
      window.open(url, "_blank");
    } else {
      const subject = encodeURIComponent("Kredensial Akun Portal Pesantren");
      const body = encodeURIComponent(
        `Assalamu'alaikum,\n\nTerlampir file Excel berisi data akun login portal pesantren.\nTotal: ${sendItems.length} akun.\n\nMohon distribusikan sesuai kebutuhan.\n\nJazakumullah khairan.`
      );
      const mailto = `mailto:${sendTarget}?subject=${subject}&body=${body}`;
      window.open(mailto, "_self");
    }

    // Mark as sent
    const sentIds = new Set(sendItems.map((s) => s.id));
    setAccounts((prev) => prev.map((a) => sentIds.has(a.id) ? { ...a, status: "sent" as const } : a));

    setSendOpen(false);
    toast.success(`Kredensial berhasil dikirim via ${sendMethod === "whatsapp" ? "WhatsApp" : "Email"}`, { duration: 2500 });
  };

  // ─── Add Manual Account ───
  const handleAddAccount = () => {
    const role = addForm.role;
    const newAccount: AccountRow = {
      id: `ACC-${Date.now()}`,
      name: addForm.name,
      email: addForm.email,
      phone: addForm.phone,
      role,
      username: generateUsername(addForm.name, role),
      password: generatePassword(),
      status: "pending",
      linkedTo: addForm.linkedTo,
    };
    setAccounts((prev) => [newAccount, ...prev]);
    setAddOpen(false);
    setAddForm({ name: "", email: "", phone: "", role: "student", linkedTo: "" });
    toast.success("Akun berhasil ditambahkan", { duration: 2500 });
  };

  // ─── Download Template ───
  const downloadTemplate = () => {
    const template = [
      { "Nama": "Ahmad Fauzi", "Email": "fauzi@email.com", "Telepon": "081234567890", "Peran": "Santri", "Santri": "" },
      { "Nama": "Hasan Abdullah", "Email": "hasan@email.com", "Telepon": "081298765432", "Peran": "Wali", "Santri": "Ahmad Fauzi" },
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "template-import-akun.xlsx");
    toast.success("Template Excel berhasil diunduh", { duration: 2500 });
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge variant="default" className="text-[10px]">Aktif</Badge>;
      case "sent": return <Badge variant="secondary" className="text-[10px]">Terkirim</Badge>;
      case "pending": return <Badge variant="outline" className="text-[10px] border-amber-500 text-amber-600">Pending</Badge>;
      default: return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
    }
  };

  const pendingAccounts = accounts.filter((a) => a.status === "pending");

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6">
        <h1 className="text-lg font-bold">Akun Portal / Portal Accounts</h1>
        <p className="text-sm text-muted-foreground">Kelola akun login santri & wali untuk portal pesantren</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Akun", value: stats.total, icon: Users, color: "text-primary" },
          { label: "Santri", value: stats.students, icon: Shield, color: "text-blue-600" },
          { label: "Wali", value: stats.guardians, icon: Users, color: "text-emerald-600" },
          { label: "Pending", value: stats.pending, icon: AlertCircle, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-card border rounded-xl p-4 flex items-center gap-3">
            <div className={cn("p-2 rounded-lg bg-muted", s.color)}>
              <s.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari akun..."
            className="w-full rounded-lg border bg-card pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={downloadTemplate}>
            <FileSpreadsheet className="h-4 w-4 mr-1" /> Template
          </Button>
          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-1" /> Import Excel
          </Button>
          <Button size="sm" variant="outline" onClick={() => downloadExcel(filtered)}>
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
          {pendingAccounts.length > 0 && (
            <Button size="sm" variant="outline" onClick={() => openSendDialog(pendingAccounts)}>
              <Send className="h-4 w-4 mr-1" /> Kirim ({pendingAccounts.length})
            </Button>
          )}
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <UserPlus className="h-4 w-4 mr-1" /> Tambah Akun
          </Button>
        </div>
      </div>
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileUpload} />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
          <SelectTrigger className="h-8 w-auto min-w-[120px] text-xs"><SelectValue placeholder="Peran" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Peran</SelectItem>
            <SelectItem value="student">Santri</SelectItem>
            <SelectItem value="guardian">Wali</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="h-8 w-auto min-w-[120px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="sent">Terkirim</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border rounded-xl shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Nama</TableHead>
              <TableHead className="text-xs">Username</TableHead>
              <TableHead className="text-xs">Email</TableHead>
              <TableHead className="text-xs">Telepon</TableHead>
              <TableHead className="text-xs">Peran</TableHead>
              <TableHead className="text-xs">Terkait</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs w-20">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">
                  Tidak ada data akun
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="text-sm font-medium">{a.name}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{a.username}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.email}</TableCell>
                  <TableCell className="text-xs">{a.phone}</TableCell>
                  <TableCell>
                    <Badge variant={a.role === "student" ? "default" : "secondary"} className="text-[10px]">
                      {a.role === "student" ? "Santri" : "Wali"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.linkedTo || "-"}</TableCell>
                  <TableCell>{statusBadge(a.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openSendDialog([a])}>
                        <Send className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive"
                        onClick={() => {
                          setAccounts((prev) => prev.filter((x) => x.id !== a.id));
                          toast.success("Akun dihapus", { duration: 2500 });
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-4 py-3 border-t text-xs text-muted-foreground">
          <span>
            {filtered.length > 0
              ? `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, filtered.length)} dari ${filtered.length}`
              : "Tidak ada data"}
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-muted disabled:opacity-30" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={cn("px-2 py-1 rounded", p === page ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted")}>
                {p}
              </button>
            ))}
            <button className="p-1 rounded hover:bg-muted disabled:opacity-30" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Import Preview Dialog ─── */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" /> Preview Import: {importFileName}
            </DialogTitle>
            <DialogDescription>
              {importData.length} akun terdeteksi. Periksa data sebelum mengkonfirmasi.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Nama</TableHead>
                  <TableHead className="text-xs">Email</TableHead>
                  <TableHead className="text-xs">Telepon</TableHead>
                  <TableHead className="text-xs">Peran</TableHead>
                  <TableHead className="text-xs">Username (auto)</TableHead>
                  <TableHead className="text-xs">Password (auto)</TableHead>
                  <TableHead className="text-xs">Terkait</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-sm font-medium">{row.name}</TableCell>
                    <TableCell className="text-xs">{row.email}</TableCell>
                    <TableCell className="text-xs">{row.phone}</TableCell>
                    <TableCell>
                      <Badge variant={row.role === "student" ? "default" : "secondary"} className="text-[10px]">
                        {row.role === "student" ? "Santri" : "Wali"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono">{row.username}</TableCell>
                    <TableCell className="text-xs font-mono text-emerald-600">{row.password}</TableCell>
                    <TableCell className="text-xs">{row.linkedTo || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => { setPreviewOpen(false); setImportData([]); }}>
              <X className="h-4 w-4 mr-1" /> Batal
            </Button>
            <Button onClick={() => { setPreviewOpen(false); setConfirmOpen(true); }}>
              <CheckCircle2 className="h-4 w-4 mr-1" /> Konfirmasi Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Confirm Import Dialog ─── */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Import Akun</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan mengimpor <strong>{importData.length} akun</strong> baru. Username dan password akan dibuat otomatis. Lanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmImport}>Ya, Import Sekarang</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── Send Dialog ─── */}
      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kirim Kredensial Akun</DialogTitle>
            <DialogDescription>
              Kirim file Excel berisi {sendItems.length} akun via WhatsApp atau Email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Tabs value={sendMethod} onValueChange={(v) => setSendMethod(v as "whatsapp" | "email")}>
              <TabsList className="w-full">
                <TabsTrigger value="whatsapp" className="flex-1">WhatsApp</TabsTrigger>
                <TabsTrigger value="email" className="flex-1">Email</TabsTrigger>
              </TabsList>
              <TabsContent value="whatsapp" className="space-y-3 mt-3">
                <div className="space-y-2">
                  <Label>Nomor WhatsApp / Grup (opsional)</Label>
                  <Input
                    placeholder="6281234567890"
                    value={sendTarget}
                    onChange={(e) => setSendTarget(e.target.value)}
                  />
                  <p className="text-[11px] text-muted-foreground">Kosongkan untuk memilih kontak di WhatsApp</p>
                </div>
              </TabsContent>
              <TabsContent value="email" className="space-y-3 mt-3">
                <div className="space-y-2">
                  <Label>Alamat Email</Label>
                  <Input
                    type="email"
                    placeholder="admin@pesantren.id"
                    value={sendTarget}
                    onChange={(e) => setSendTarget(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendOpen(false)}>Batal</Button>
            <Button onClick={handleSend}>
              <Send className="h-4 w-4 mr-1" /> Kirim & Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Add Account Dialog ─── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Akun Manual</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input placeholder="Nama lengkap" value={addForm.name} onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="email@contoh.com" value={addForm.email} onChange={(e) => setAddForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>No. Telepon</Label>
              <Input placeholder="081234567890" value={addForm.phone} onChange={(e) => setAddForm((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Peran / Role</Label>
              <Select value={addForm.role} onValueChange={(v) => setAddForm((p) => ({ ...p, role: v as "student" | "guardian" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Santri / Student</SelectItem>
                  <SelectItem value="guardian">Wali / Guardian</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Terkait dengan / Linked to</Label>
              <Input placeholder="Nama santri atau wali terkait" value={addForm.linkedTo} onChange={(e) => setAddForm((p) => ({ ...p, linkedTo: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Batal</Button>
            <Button onClick={handleAddAccount} disabled={!addForm.name || !addForm.email}>
              <UserPlus className="h-4 w-4 mr-1" /> Buat Akun
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
