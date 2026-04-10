import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Phone, Mail, MapPin, Clock, Instagram, Youtube, Facebook, Twitter, Globe, Music2, ShieldCheck, Upload, ImageIcon, Info, Lock, AlertTriangle, Power, GraduationCap, FileText, Palette, Check, TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, Filter, Download, Search as SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import { useThemeColor, themePresets } from "@/contexts/ThemeColorContext";
import { useLogo } from "@/contexts/LogoContext";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// ─── WhatsApp SVG icon component ───
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ─── Types ───
interface ContactInfo {
  id: string;
  type: string;
  label: string;
  value: string;
  isActive: boolean;
}

interface SocialMedia {
  id: string;
  platform: string;
  username: string;
  url: string;
  isActive: boolean;
}

// ─── Social media platforms ───
const socialPlatforms = [
  { value: "Instagram", icon: Instagram },
  { value: "YouTube", icon: Youtube },
  { value: "Facebook", icon: Facebook },
  { value: "Twitter / X", icon: Twitter },
  { value: "TikTok", icon: Music2 },
  { value: "WhatsApp", icon: WhatsAppIcon },
  { value: "Website", icon: Globe },
];

const getSocialIcon = (platform: string) => {
  const found = socialPlatforms.find(p => p.value === platform);
  return found ? found.icon : Globe;
};

// ─── Contact types ───
const contactTypes = [
  { value: "Telepon", label: "Telepon / Phone" },
  { value: "Email", label: "Email" },
  { value: "Jam Operasional", label: "Jam Operasional / Hours" },
];

const getContactIcon = (type: string) => {
  switch (type) {
    case "Telepon": return Phone;
    case "Email": return Mail;
    case "Jam Operasional": return Clock;
    default: return Phone;
  }
};

// ─── Initial data ───
const initialContacts: ContactInfo[] = [
  { id: "C001", type: "Telepon", label: "Telepon Kantor", value: "(021) 8888-1234", isActive: true },
  { id: "C002", type: "Email", label: "Email Resmi", value: "info@alhikmah.sch.id", isActive: true },
  { id: "C003", type: "Jam Operasional", label: "Jam Kerja", value: "Senin–Sabtu: 07.00–16.00 WIB", isActive: true },
];

const initialSocials: SocialMedia[] = [
  { id: "S001", platform: "Instagram", username: "@pesantren.alhikmah", url: "https://instagram.com/pesantren.alhikmah", isActive: true },
  { id: "S002", platform: "YouTube", username: "Pesantren Al-Hikmah Official", url: "https://youtube.com/@alhikmah", isActive: true },
  { id: "S003", platform: "Facebook", username: "Pesantren Al-Hikmah", url: "https://facebook.com/pesantren.alhikmah", isActive: false },
  { id: "S004", platform: "WhatsApp", username: "+62 812-3456-7890", url: "https://wa.me/6281234567890", isActive: true },
];

// ─── Logo format options ───
const imageFormats = [
  { value: "image/png", label: "PNG" },
  { value: "image/jpeg", label: "JPG" },
  { value: "image/webp", label: "WebP" },
];

// ─── Finance mock data ───
const monthlyFinanceData = [
  { month: "Jan 2026", income: 18500000, withdrawn: 15000000, fee: 1250000, transactions: 2850 },
  { month: "Feb 2026", income: 19200000, withdrawn: 16500000, fee: 1320000, transactions: 2940 },
  { month: "Mar 2026", income: 20100000, withdrawn: 17200000, fee: 1520000, transactions: 3040 },
  { month: "Apr 2026", income: 8400000, withdrawn: 5000000, fee: 680000, transactions: 1360 },
];

const financeTransactions = [
  { id: "TXN001", date: "2026-04-10", type: "income" as const, description: "Pembayaran SPP - Ahmad Fauzi", amount: 600500, method: "VA BCA" },
  { id: "TXN002", date: "2026-04-10", type: "income" as const, description: "Pembayaran SPP - Siti Aisyah", amount: 550700, method: "GoPay" },
  { id: "TXN003", date: "2026-04-09", type: "withdrawn" as const, description: "Pencairan ke rekening utama", amount: 5000000, method: "Transfer Bank" },
  { id: "TXN004", date: "2026-04-09", type: "income" as const, description: "Pembayaran SPP - Khadijah Nur", amount: 600500, method: "VA BNI" },
  { id: "TXN005", date: "2026-04-08", type: "income" as const, description: "Pembayaran SPP - Aisyah Putri", amount: 600800, method: "DANA" },
  { id: "TXN006", date: "2026-04-08", type: "withdrawn" as const, description: "Pencairan ke rekening cabang 1", amount: 3000000, method: "Transfer Bank" },
  { id: "TXN007", date: "2026-04-07", type: "income" as const, description: "Pembayaran SPP - Fatimah Zahra", amount: 500600, method: "VA Mandiri" },
  { id: "TXN008", date: "2026-04-07", type: "income" as const, description: "Pembayaran SPP - Ibrahim Malik", amount: 150500, method: "VA BCA" },
  { id: "TXN009", date: "2026-04-06", type: "income" as const, description: "Pembayaran SPP - Zainab Amira", amount: 600700, method: "GoPay" },
  { id: "TXN010", date: "2026-04-05", type: "withdrawn" as const, description: "Pencairan ke rekening utama", amount: 8000000, method: "Transfer Bank" },
];

const formatCurrency = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

function FinanceDashboard({ settings, update, handleSave }: { settings: any; update: (k: string, v: string) => void; handleSave: () => void }) {
  const [txFilter, setTxFilter] = useState<"all" | "income" | "withdrawn">("all");
  const [txSearch, setTxSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [txPage, setTxPage] = useState(1);
  const txPageSize = 5;

  const currentMonth = monthlyFinanceData[monthlyFinanceData.length - 1];
  const totalBalance = monthlyFinanceData.reduce((s, m) => s + m.income - m.withdrawn, 0);
  const totalIncome = monthlyFinanceData.reduce((s, m) => s + m.income, 0);
  const totalWithdrawn = monthlyFinanceData.reduce((s, m) => s + m.withdrawn, 0);

  const filtered = financeTransactions.filter(tx => {
    if (txFilter !== "all" && tx.type !== txFilter) return false;
    if (txSearch && !tx.description.toLowerCase().includes(txSearch.toLowerCase()) && !tx.id.toLowerCase().includes(txSearch.toLowerCase())) return false;
    return true;
  });

  const txTotalPages = Math.max(1, Math.ceil(filtered.length / txPageSize));
  const paginatedTx = filtered.slice((txPage - 1) * txPageSize, txPage * txPageSize);

  return (
    <>
      {/* Balance & Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium">Saldo Saat Ini / Balance</p>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-xl font-bold text-foreground">{formatCurrency(totalBalance)}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Akumulasi semua periode</p>
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium">Pemasukan Bulan Ini</p>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ArrowDownRight className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-xl font-bold text-foreground">{formatCurrency(currentMonth.income)}</p>
          <p className="text-[10px] text-primary font-medium mt-1">↑ {currentMonth.transactions.toLocaleString()} transaksi</p>
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium">Pencairan / Withdrawn</p>
            <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-destructive" />
            </div>
          </div>
          <p className="text-xl font-bold text-foreground">{formatCurrency(currentMonth.withdrawn)}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Bulan ini</p>
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium">Micro-Fee Revenue</p>
            <div className="h-8 w-8 rounded-lg bg-accent/50 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-foreground" />
            </div>
          </div>
          <p className="text-xl font-bold text-foreground">{formatCurrency(currentMonth.fee)}</p>
          <p className="text-[10px] text-primary font-medium mt-1">↑ 8.3% vs bulan lalu</p>
        </div>
      </div>

      {/* Monthly Summary Table */}
      <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Ringkasan Bulanan / Monthly Summary</h3>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[160px] h-8 text-xs">
              <SelectValue placeholder="Semua Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Bulan</SelectItem>
              {monthlyFinanceData.map(m => (
                <SelectItem key={m.month} value={m.month}>{m.month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Bulan / Month</TableHead>
                <TableHead className="text-xs text-right">Pemasukan / Income</TableHead>
                <TableHead className="text-xs text-right">Pencairan / Withdrawn</TableHead>
                <TableHead className="text-xs text-right">Micro-Fee</TableHead>
                <TableHead className="text-xs text-right">Transaksi</TableHead>
                <TableHead className="text-xs text-right">Net Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(selectedMonth === "all" ? monthlyFinanceData : monthlyFinanceData.filter(m => m.month === selectedMonth)).map(m => (
                <TableRow key={m.month}>
                  <TableCell className="text-xs font-medium">{m.month}</TableCell>
                  <TableCell className="text-xs text-right text-primary font-medium">{formatCurrency(m.income)}</TableCell>
                  <TableCell className="text-xs text-right text-destructive font-medium">{formatCurrency(m.withdrawn)}</TableCell>
                  <TableCell className="text-xs text-right">{formatCurrency(m.fee)}</TableCell>
                  <TableCell className="text-xs text-right">{m.transactions.toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-right font-bold">{formatCurrency(m.income - m.withdrawn)}</TableCell>
                </TableRow>
              ))}
              {selectedMonth === "all" && (
                <TableRow className="bg-muted/30 font-bold">
                  <TableCell className="text-xs">Total</TableCell>
                  <TableCell className="text-xs text-right text-primary">{formatCurrency(totalIncome)}</TableCell>
                  <TableCell className="text-xs text-right text-destructive">{formatCurrency(totalWithdrawn)}</TableCell>
                  <TableCell className="text-xs text-right">{formatCurrency(monthlyFinanceData.reduce((s, m) => s + m.fee, 0))}</TableCell>
                  <TableCell className="text-xs text-right">{monthlyFinanceData.reduce((s, m) => s + m.transactions, 0).toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-right">{formatCurrency(totalBalance)}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">Riwayat Transaksi / Transaction History</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Cari transaksi..."
                value={txSearch}
                onChange={e => setTxSearch(e.target.value)}
                className="pl-8 h-8 text-xs w-full sm:w-[200px]"
              />
            </div>
            <Select value={txFilter} onValueChange={(v) => setTxFilter(v as any)}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <Filter className="h-3 w-3 mr-1.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua / All</SelectItem>
                <SelectItem value="income">Pemasukan</SelectItem>
                <SelectItem value="withdrawn">Pencairan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">ID</TableHead>
                <TableHead className="text-xs">Tanggal</TableHead>
                <TableHead className="text-xs">Tipe</TableHead>
                <TableHead className="text-xs">Keterangan</TableHead>
                <TableHead className="text-xs">Metode</TableHead>
                <TableHead className="text-xs text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-xs text-muted-foreground py-8">Tidak ada transaksi ditemukan</TableCell></TableRow>
              ) : paginatedTx.map(tx => (
                <TableRow key={tx.id}>
                  <TableCell className="text-xs font-mono">{tx.id}</TableCell>
                  <TableCell className="text-xs">{tx.date}</TableCell>
                  <TableCell className="text-xs">
                    <Badge variant={tx.type === "income" ? "default" : "destructive"} className="text-[10px]">
                      {tx.type === "income" ? "Masuk" : "Keluar"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{tx.description}</TableCell>
                  <TableCell className="text-xs">{tx.method}</TableCell>
                  <TableCell className={`text-xs text-right font-medium ${tx.type === "income" ? "text-primary" : "text-destructive"}`}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Menampilkan {filtered.length === 0 ? 0 : (txPage - 1) * txPageSize + 1}–{Math.min(txPage * txPageSize, filtered.length)} dari {filtered.length} transaksi
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7 text-xs px-2" disabled={txPage <= 1} onClick={() => setTxPage(p => p - 1)}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: txTotalPages }, (_, i) => (
              <Button key={i} variant={txPage === i + 1 ? "default" : "outline"} size="sm" className="h-7 text-xs px-2.5 min-w-[28px]" onClick={() => setTxPage(i + 1)}>
                {i + 1}
              </Button>
            ))}
            <Button variant="outline" size="sm" className="h-7 text-xs px-2" disabled={txPage >= txTotalPages} onClick={() => setTxPage(p => p + 1)}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Finance Settings */}
      <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
        <h3 className="text-sm font-semibold">Pengaturan Keuangan / Finance Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Micro-Fee per Transaksi (Rp)</Label>
            <Input type="number" value={settings.microFee} onChange={(e) => update("microFee", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Payment Gateway</Label>
            <Select value={settings.paymentGateway} onValueChange={(v) => update("paymentGateway", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="midtrans">Midtrans</SelectItem>
                <SelectItem value="xendit">Xendit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave}>Simpan / Save</Button>
      </div>
    </>
  );
}

// ─── Crop helper ───
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 80 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

function getCroppedImage(image: HTMLImageElement, crop: PixelCrop, format: string): Promise<string> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0, 0,
    canvas.width,
    canvas.height
  );
  // Return data URL instead of blob URL for localStorage persistence
  return Promise.resolve(canvas.toDataURL(format, 0.85));
}

const Settings = () => {
  const { isMaintenanceMode, maintenanceMessage, estimatedEnd, setMaintenanceMode, setMaintenanceMessage, setEstimatedEnd } = useMaintenance();
  const { activeTheme, customColor, applyTheme } = useThemeColor();
  const { logoMode, logoUrl, institutionName, tagline, setLogoMode, setLogoUrl, setInstitutionName, setTagline } = useLogo();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const cropImageRef = useRef<HTMLImageElement>(null);

  // Maintenance confirmation dialog
  const [maintenanceConfirmOpen, setMaintenanceConfirmOpen] = useState(false);
  const [maintenancePendingState, setMaintenancePendingState] = useState(false);

  // Theme color local state (applied on save)
  const [pendingTheme, setPendingTheme] = useState(activeTheme);
  const [pendingCustomColor, setPendingCustomColor] = useState(customColor);

  // ─── Institution info state ───
  const [settings, setSettings] = useState({
    description: "Mencetak generasi Qur'ani yang berilmu, beramal, dan berakhlak mulia sejak 1985.",
    address: "Jl. Pondok Pesantren No. 123, Kec. Cikarang, Kabupaten Bekasi, Jawa Barat 17530",
    microFee: "500",
    paymentGateway: "midtrans",
    language: "bilingual",
    timezone: "Asia/Jakarta",
  });

  // ─── Logo crop state ───
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [logoFormat, setLogoFormat] = useState("image/png");

  // ─── Contacts state ───
  const [contacts, setContacts] = useState<ContactInfo[]>(initialContacts);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null);
  const [contactForm, setContactForm] = useState({ type: "Telepon", label: "", value: "", isActive: true });

  // ─── Social media state ───
  const [socials, setSocials] = useState<SocialMedia[]>(initialSocials);
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialMedia | null>(null);
  const [socialForm, setSocialForm] = useState({ platform: "Instagram", username: "", url: "", isActive: true });

  // ─── Developer password state ───
  const [devPasswordInput, setDevPasswordInput] = useState("");
  const [devUnlocked, setDevUnlocked] = useState(false);
  const [devPasswordError, setDevPasswordError] = useState(false);
  const DEV_PASSWORD = "developerganteng";

  const handleDevPasswordSubmit = () => {
    if (devPasswordInput === DEV_PASSWORD) {
      setDevUnlocked(true);
      setDevPasswordError(false);
      toast.success("Akses diberikan / Access granted", { duration: 3000 });
    } else {
      setDevPasswordError(true);
    }
  };

  const update = (key: string, value: string) => setSettings((p) => ({ ...p, [key]: value }));

  // ─── Logo handlers ───
  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropSrc(reader.result as string);
        setCrop(undefined);
        setCompletedCrop(undefined);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }, []);

  const handleCropConfirm = async () => {
    if (cropImageRef.current && completedCrop) {
      // Revoke old blob URL to prevent pile-up
      if (logoUrl && logoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(logoUrl);
      }
      const croppedUrl = await getCroppedImage(cropImageRef.current, completedCrop, logoFormat);
      setLogoUrl(croppedUrl);
      setCropDialogOpen(false);
      toast.success("Logo berhasil di-crop dan disimpan / Logo cropped & saved", { duration: 4000 });
    }
  };

  const handleSave = () => {
    toast.success("Pengaturan berhasil disimpan / Settings saved successfully", { duration: 4000 });
  };

  const handleSystemSave = () => {
    applyTheme(pendingTheme, pendingTheme === 'custom' ? pendingCustomColor : undefined);
    toast.success("Pengaturan sistem berhasil disimpan / System settings saved", { duration: 4000 });
  };

  // ─── Contact handlers ───
  const handleAddContact = () => {
    setEditingContact(null);
    setContactForm({ type: "Telepon", label: "", value: "", isActive: true });
    setContactDialogOpen(true);
  };
  const handleEditContact = (c: ContactInfo) => {
    setEditingContact(c);
    setContactForm({ type: c.type, label: c.label, value: c.value, isActive: c.isActive });
    setContactDialogOpen(true);
  };
  const handleSaveContact = () => {
    if (editingContact) {
      setContacts(prev => prev.map(c => c.id === editingContact.id ? { ...c, ...contactForm } : c));
      toast.success("Kontak diperbarui / Contact updated", { duration: 4000 });
    } else {
      const newId = `C${String(contacts.length + 1).padStart(3, "0")}`;
      setContacts(prev => [...prev, { id: newId, ...contactForm }]);
      toast.success("Kontak ditambahkan / Contact added", { duration: 4000 });
    }
    setContactDialogOpen(false);
  };
  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    toast.success("Kontak dihapus / Contact deleted", { duration: 4000 });
  };

  // ─── Social media handlers ───
  const handleAddSocial = () => {
    setEditingSocial(null);
    setSocialForm({ platform: "Instagram", username: "", url: "", isActive: true });
    setSocialDialogOpen(true);
  };
  const handleEditSocial = (s: SocialMedia) => {
    setEditingSocial(s);
    setSocialForm({ platform: s.platform, username: s.username, url: s.url, isActive: s.isActive });
    setSocialDialogOpen(true);
  };
  const handleSaveSocial = () => {
    if (editingSocial) {
      setSocials(prev => prev.map(s => s.id === editingSocial.id ? { ...s, ...socialForm } : s));
      toast.success("Media sosial diperbarui / Social media updated", { duration: 4000 });
    } else {
      const newId = `S${String(socials.length + 1).padStart(3, "0")}`;
      setSocials(prev => [...prev, { id: newId, ...socialForm }]);
      toast.success("Media sosial ditambahkan / Social media added", { duration: 4000 });
    }
    setSocialDialogOpen(false);
  };
  const handleDeleteSocial = (id: string) => {
    setSocials(prev => prev.filter(s => s.id !== id));
    toast.success("Media sosial dihapus / Social media deleted", { duration: 4000 });
  };

  // ─── Derived data for footer preview ───
  const activeContacts = contacts.filter(c => c.isActive);
  const activeSocials = socials.filter(s => s.isActive);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6">
        <h1 className="text-lg font-bold">Pengaturan / Settings</h1>
        <p className="text-sm text-muted-foreground">Konfigurasi sistem dan informasi pesantren</p>
      </div>

      <Tabs defaultValue="general" className="max-w-5xl">
        <TabsList>
          <TabsTrigger value="general">Umum / General</TabsTrigger>
          
          <TabsTrigger value="finance">Keuangan / Finance</TabsTrigger>
          <TabsTrigger value="system">Sistem / System</TabsTrigger>
        </TabsList>

        {/* ═══════════ GENERAL TAB ═══════════ */}
        <TabsContent value="general" className="space-y-6 mt-4">
          {/* ── Institution Profile with Logo ── */}
          <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
            <h3 className="text-sm font-semibold">Profil Pesantren / Institution Profile</h3>

            {/* Logo Mode Toggle */}
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Mode Logo / Logo Mode</p>
                  <p className="text-xs text-muted-foreground">
                    {logoMode === "complete"
                      ? "Logo sudah lengkap (gambar berisi nama & tagline)"
                      : "Logo terpisah (gambar + nama & tagline manual)"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${logoMode === "manual" ? "text-foreground font-medium" : "text-muted-foreground"}`}>Manual</span>
                  <Switch
                    checked={logoMode === "complete"}
                    onCheckedChange={(checked) => setLogoMode(checked ? "complete" : "manual")}
                  />
                  <span className={`text-xs ${logoMode === "complete" ? "text-foreground font-medium" : "text-muted-foreground"}`}>Lengkap</span>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-md bg-info/10 p-3">
                <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  {logoMode === "complete"
                    ? "Gunakan mode ini jika logo Anda sudah menyertakan nama dan tagline dalam satu gambar. Nama & tagline tidak akan ditampilkan di navbar."
                    : "Gunakan mode ini jika logo hanya berupa ikon/simbol. Nama pesantren dan tagline akan ditampilkan di samping logo."}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              {/* Logo upload & preview */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`relative ${logoMode === "complete" ? "h-28 w-48" : "h-28 w-28"} rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-all`}
                  onClick={() => logoInputRef.current?.click()}
                >
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="h-full w-full object-contain p-1" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <ImageIcon className="h-8 w-8" />
                      <span className="text-[10px]">{logoMode === "complete" ? "Logo Lengkap" : "Logo Ikon"}</span>
                    </div>
                  )}
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoSelect}
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => logoInputRef.current?.click()}>
                    <Upload className="h-3 w-3 mr-1" /> Unggah Logo
                  </Button>
                  {logoUrl && (
                    <Button variant="ghost" size="sm" className="text-xs h-7 text-destructive hover:text-destructive" onClick={() => { setLogoUrl(null); toast.success("Logo dihapus / Logo removed", { duration: 4000 }); }}>
                      <Trash2 className="h-3 w-3 mr-1" /> Hapus
                    </Button>
                  )}
                </div>
              </div>

              {/* Profile fields */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nama Pesantren / Institution Name</Label>
                    <Input value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} />
                    {logoMode === "complete" && (
                      <p className="text-[10px] text-muted-foreground">Tidak ditampilkan di navbar (sudah ada di logo)</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
                    {logoMode === "complete" && (
                      <p className="text-[10px] text-muted-foreground">Tidak ditampilkan di navbar (sudah ada di logo)</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi / Description</Label>
                  <Textarea value={settings.description} onChange={(e) => update("description", e.target.value)} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Alamat / Address</Label>
                  <Textarea value={settings.address} onChange={(e) => update("address", e.target.value)} rows={2} />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="text-xs font-medium text-muted-foreground mb-3">Preview Navbar Logo</p>
              <div className="flex items-center gap-3 bg-background rounded-lg border p-3 w-fit">
                {logoUrl ? (
                  logoMode === "complete" ? (
                    <img src={logoUrl} alt="Logo" className="h-9 object-contain" />
                  ) : (
                    <>
                      <img src={logoUrl} alt="Logo" className="h-9 w-9 rounded-lg object-contain" />
                      <div>
                        <span className="text-sm font-bold text-foreground leading-none block">{institutionName}</span>
                        <span className="text-[10px] text-muted-foreground leading-tight block">{tagline}</span>
                      </div>
                    </>
                  )
                ) : (
                  <>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-gold shadow-md">
                      <span className="text-sm font-bold text-accent-foreground">B</span>
                    </div>
                    {logoMode === "manual" && (
                      <div>
                        <span className="text-sm font-bold text-foreground leading-none block">{institutionName}</span>
                        <span className="text-[10px] text-muted-foreground leading-tight block">{tagline}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── Contacts ── */}
          <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Kontak / Contacts</h3>
              <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={handleAddContact}><Plus className="h-4 w-4 mr-1" /> Tambah / Add</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingContact ? "Edit Kontak" : "Tambah Kontak / Add Contact"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tipe / Type</Label>
                      <Select value={contactForm.type} onValueChange={(v) => setContactForm(p => ({ ...p, type: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {contactTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input value={contactForm.label} onChange={(e) => setContactForm(p => ({ ...p, label: e.target.value }))} placeholder="Nama label kontak" />
                    </div>
                    <div className="space-y-2">
                      <Label>Nilai / Value</Label>
                      <Input value={contactForm.value} onChange={(e) => setContactForm(p => ({ ...p, value: e.target.value }))} placeholder="Informasi kontak" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Status</Label>
                      <Select value={contactForm.isActive ? "active" : "inactive"} onValueChange={(v) => setContactForm(p => ({ ...p, isActive: v === "active" }))}>
                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Aktif / Active</SelectItem>
                          <SelectItem value="inactive">Nonaktif / Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveContact}>Simpan / Save</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipe / Type</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Nilai / Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((c) => {
                  const Icon = getContactIcon(c.type);
                  return (
                    <TableRow key={c.id}>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="secondary" className="text-xs">{c.type}</Badge>
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{c.label}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate">{c.value}</TableCell>
                      <TableCell>
                        <Badge variant={c.isActive ? "default" : "outline"} className="text-xs">{c.isActive ? "Aktif" : "Nonaktif"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditContact(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteContact(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* ── Social Media ── */}
          <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Media Sosial / Social Media</h3>
              <Dialog open={socialDialogOpen} onOpenChange={setSocialDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={handleAddSocial}><Plus className="h-4 w-4 mr-1" /> Tambah / Add</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingSocial ? "Edit Media Sosial" : "Tambah Media Sosial / Add Social Media"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Platform</Label>
                      <Select value={socialForm.platform} onValueChange={(v) => setSocialForm(p => ({ ...p, platform: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {socialPlatforms.map(p => {
                            const PIcon = p.icon;
                            return (
                              <SelectItem key={p.value} value={p.value}>
                                <span className="flex items-center gap-2"><PIcon className="h-4 w-4" />{p.value}</span>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Username / Nama Akun</Label>
                      <Input value={socialForm.username} onChange={(e) => setSocialForm(p => ({ ...p, username: e.target.value }))} placeholder="@namaakun" />
                    </div>
                    <div className="space-y-2">
                      <Label>URL</Label>
                      <Input value={socialForm.url} onChange={(e) => setSocialForm(p => ({ ...p, url: e.target.value }))} placeholder="https://..." />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Status</Label>
                      <Select value={socialForm.isActive ? "active" : "inactive"} onValueChange={(v) => setSocialForm(p => ({ ...p, isActive: v === "active" }))}>
                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Aktif / Active</SelectItem>
                          <SelectItem value="inactive">Nonaktif / Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveSocial}>Simpan / Save</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {socials.map((s) => {
                  const SIcon = getSocialIcon(s.platform);
                  return (
                    <TableRow key={s.id}>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <SIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{s.platform}</span>
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{s.username}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{s.url}</TableCell>
                      <TableCell>
                        <Badge variant={s.isActive ? "default" : "outline"} className="text-xs">{s.isActive ? "Aktif" : "Nonaktif"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditSocial(s)}><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteSocial(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Simpan Semua / Save All</Button>
          </div>

          {/* ═══════════ FOOTER PREVIEW ═══════════ */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Preview Footer</h3>
            <div className="border rounded-xl overflow-hidden">
              <footer className="bg-card border-t">
                <div className="px-6 py-8">
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Column 1: Brand */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        {logoUrl ? (
                          <img src={logoUrl} alt="Logo" className="h-7 w-7 rounded-md object-contain" />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                            <span className="text-[9px] font-bold text-primary-foreground">B</span>
                          </div>
                        )}
                        <div>
                          <span className="text-xs font-bold text-foreground block leading-none">{institutionName}</span>
                          <span className="text-[9px] text-muted-foreground">{tagline}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{settings.description}</p>
                    </div>

                    {/* Column 2: Menu */}
                    <div>
                      <h4 className="text-xs font-semibold text-foreground mb-3">Menu</h4>
                      <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                        <li>Tentang</li>
                        <li>Program</li>
                        <li>Galeri</li>
                        <li>Berita</li>
                      </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div>
                      <h4 className="text-xs font-semibold text-foreground mb-3">Kontak</h4>
                      <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                        {settings.address && (
                          <li className="flex items-start gap-1.5"><MapPin className="h-3 w-3 mt-0.5 shrink-0" /> {settings.address}</li>
                        )}
                        {activeContacts.map(c => {
                          const CIcon = getContactIcon(c.type);
                          return (
                            <li key={c.id} className="flex items-center gap-1.5"><CIcon className="h-3 w-3 shrink-0" /> {c.value}</li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Column 4: Social Media */}
                    <div>
                      <h4 className="text-xs font-semibold text-foreground mb-3">Media Sosial</h4>
                      {activeSocials.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {activeSocials.map(s => {
                            const SIcon = getSocialIcon(s.platform);
                            return (
                              <div key={s.id} className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/50 rounded-md px-2 py-1">
                                <SIcon className="h-3.5 w-3.5" />
                                <span>{s.username}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-[11px] text-muted-foreground italic">Belum ada media sosial aktif</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-[10px] text-muted-foreground">© {new Date().getFullYear()} {institutionName}. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                      {activeSocials.map(s => {
                        const SIcon = getSocialIcon(s.platform);
                        return (
                          <div key={s.id} className="h-6 w-6 rounded-full bg-muted flex items-center justify-center" title={s.platform}>
                            <SIcon className="h-3 w-3 text-muted-foreground" />
                          </div>
                        );
                      })}
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground ml-2">
                        <ShieldCheck className="h-3 w-3" /> Login Administrator
                      </div>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </TabsContent>


        {/* ═══════════ FINANCE TAB ═══════════ */}
        <TabsContent value="finance" className="space-y-6 mt-4">
          {!devUnlocked ? (
            <div className="min-h-[60vh] flex items-center justify-center">
            <div className="bg-card border rounded-xl p-8 shadow-card flex flex-col items-center gap-5 max-w-md w-full">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10">
                <Lock className="h-8 w-8 text-warning" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground mb-1">Akses Terbatas / Restricted Access</h3>
                <p className="text-sm text-muted-foreground">Menu ini memerlukan password developer untuk mengakses pengaturan keuangan.</p>
              </div>
              <div className="w-full space-y-3">
                <Input
                  type="password"
                  placeholder="Masukkan password developer..."
                  value={devPasswordInput}
                  onChange={(e) => { setDevPasswordInput(e.target.value); setDevPasswordError(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handleDevPasswordSubmit()}
                  className={devPasswordError ? "border-destructive" : ""}
                />
                {devPasswordError && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Password salah. Coba lagi.
                  </p>
                )}
                <Button onClick={handleDevPasswordSubmit} className="w-full">
                  <Lock className="h-4 w-4 mr-2" /> Buka Akses / Unlock
                </Button>
              </div>
            </div>
            </div>
           ) : (
            <FinanceDashboard settings={settings} update={update} handleSave={handleSave} />
           )}
        </TabsContent>

        {/* ═══════════ SYSTEM TAB ═══════════ */}
        <TabsContent value="system" className="space-y-6 mt-4">
          {!devUnlocked ? (
            <div className="min-h-[60vh] flex items-center justify-center">
            <div className="bg-card border rounded-xl p-8 shadow-card flex flex-col items-center gap-5 max-w-md w-full">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10">
                <Lock className="h-8 w-8 text-warning" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground mb-1">Akses Terbatas / Restricted Access</h3>
                <p className="text-sm text-muted-foreground">Menu ini memerlukan password developer untuk mengakses pengaturan sistem.</p>
              </div>
              <div className="w-full space-y-3">
                <Input
                  type="password"
                  placeholder="Masukkan password developer..."
                  value={devPasswordInput}
                  onChange={(e) => { setDevPasswordInput(e.target.value); setDevPasswordError(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handleDevPasswordSubmit()}
                  className={devPasswordError ? "border-destructive" : ""}
                />
                {devPasswordError && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Password salah. Coba lagi.
                  </p>
                )}
                <Button onClick={handleDevPasswordSubmit} className="w-full">
                  <Lock className="h-4 w-4 mr-2" /> Buka Akses / Unlock
                </Button>
              </div>
            </div>
            </div>
          ) : (
            <>
              {/* Maintenance Mode */}
              <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isMaintenanceMode ? "bg-destructive/10" : "bg-success/10"}`}>
                      <Power className={`h-5 w-5 ${isMaintenanceMode ? "text-destructive" : "text-success"}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Status Website / Website Status</h3>
                      <p className="text-xs text-muted-foreground">
                        {isMaintenanceMode ? "Website sedang dalam mode pemeliharaan (maintenance)" : "Website aktif dan dapat diakses publik"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${isMaintenanceMode ? "text-destructive" : "text-success"}`}>
                      {isMaintenanceMode ? "Maintenance" : "Aktif"}
                    </span>
                    <Switch
                      checked={isMaintenanceMode}
                      onCheckedChange={(checked) => {
                        setMaintenancePendingState(checked);
                        setMaintenanceConfirmOpen(true);
                      }}
                    />
                  </div>
                </div>
                {isMaintenanceMode && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">Mode Pemeliharaan Aktif</span>
                    </div>
                    <div className="space-y-2">
                      <Label>Pesan Maintenance / Maintenance Message</Label>
                      <Textarea
                        value={maintenanceMessage}
                        onChange={(e) => setMaintenanceMessage(e.target.value)}
                        rows={2}
                        placeholder="Pesan yang ditampilkan kepada pengunjung..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Estimasi Selesai / Estimated End</Label>
                      <Input
                        value={estimatedEnd}
                        onChange={(e) => setEstimatedEnd(e.target.value)}
                        placeholder="Contoh: 1 April 2026, 18:00 WIB"
                      />
                    </div>
                  </div>
                )}
              </div>

               {/* System Settings */}
              <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
                <h3 className="text-sm font-semibold">Sistem / System</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bahasa / Language</Label>
                    <Select value={settings.language} onValueChange={(v) => update("language", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bilingual">Bilingual (ID/EN)</SelectItem>
                        <SelectItem value="id">Bahasa Indonesia</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Zona Waktu / Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(v) => update("timezone", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Jakarta">WIB (Asia/Jakarta)</SelectItem>
                        <SelectItem value="Asia/Makassar">WITA (Asia/Makassar)</SelectItem>
                        <SelectItem value="Asia/Jayapura">WIT (Asia/Jayapura)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Theme Color */}
              <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Warna Tema / Theme Color</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Pilih warna tema sesuai identitas pesantren. Perubahan berlaku setelah menekan Simpan.
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {themePresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setPendingTheme(preset.id)}
                      className={`relative flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all hover:shadow-md ${
                        pendingTheme === preset.id ? "border-primary shadow-md ring-2 ring-primary/20" : "border-border"
                      }`}
                    >
                      <div
                        className="h-8 w-8 rounded-full border-2 border-background shadow-sm"
                        style={{ backgroundColor: preset.preview }}
                      />
                      {pendingTheme === preset.id && (
                        <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <span className="text-[10px] font-medium text-foreground text-center leading-tight">{preset.name}</span>
                    </button>
                  ))}
                  {/* Custom option */}
                  <button
                    onClick={() => setPendingTheme("custom")}
                    className={`relative flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all hover:shadow-md ${
                      pendingTheme === "custom" ? "border-primary shadow-md ring-2 ring-primary/20" : "border-border"
                    }`}
                  >
                    <div
                      className="h-8 w-8 rounded-full border-2 border-background shadow-sm overflow-hidden"
                      style={{ background: `conic-gradient(red, yellow, lime, aqua, blue, magenta, red)` }}
                    />
                    {pendingTheme === "custom" && (
                      <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                    <span className="text-[10px] font-medium text-foreground text-center leading-tight">Custom</span>
                  </button>
                </div>
                {pendingTheme === "custom" && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                    <Label className="text-xs shrink-0">Pilih Warna:</Label>
                    <input
                      type="color"
                      value={pendingCustomColor}
                      onChange={(e) => setPendingCustomColor(e.target.value)}
                      className="h-9 w-14 rounded-md border cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground font-mono">{pendingCustomColor}</span>
                    <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: pendingCustomColor }} />
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSystemSave}>Simpan / Save</Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* ═══════════ MAINTENANCE CONFIRMATION ═══════════ */}
      <AlertDialog open={maintenanceConfirmOpen} onOpenChange={setMaintenanceConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {maintenancePendingState ? "Aktifkan Mode Pemeliharaan?" : "Nonaktifkan Mode Pemeliharaan?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {maintenancePendingState
                ? "Website akan tidak dapat diakses oleh publik. Pengunjung akan melihat halaman pemeliharaan. Dashboard admin tetap berfungsi normal."
                : "Website akan kembali aktif dan dapat diakses oleh publik. Pastikan semua pemeliharaan telah selesai."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal / Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={maintenancePendingState ? "bg-destructive hover:bg-destructive/90" : ""}
              onClick={() => {
                setMaintenanceMode(maintenancePendingState);
                toast.success(
                  maintenancePendingState ? "Website dalam mode Maintenance" : "Website kembali Aktif",
                  {
                    description: maintenancePendingState
                      ? "Pengunjung akan melihat halaman pemeliharaan."
                      : "Website dapat diakses kembali oleh publik.",
                    duration: 4000,
                  }
                );
              }}
            >
              {maintenancePendingState ? "Ya, Aktifkan Maintenance" : "Ya, Aktifkan Kembali"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Crop Logo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Label>Format Output</Label>
              <Select value={logoFormat} onValueChange={setLogoFormat}>
                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {imageFormats.map(f => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {cropSrc && (
              <div className="flex justify-center bg-muted/30 rounded-lg p-2 max-h-[400px] overflow-auto">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop={false}
                >
                  <img
                    ref={cropImageRef}
                    src={cropSrc}
                    alt="Crop preview"
                    onLoad={onImageLoad}
                    className="max-h-[350px] object-contain"
                  />
                </ReactCrop>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCropDialogOpen(false)}>Batal / Cancel</Button>
              <Button onClick={handleCropConfirm} disabled={!completedCrop}>Terapkan / Apply</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Settings;
