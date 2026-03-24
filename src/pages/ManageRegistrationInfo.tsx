import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ClipboardList, FileText, Users, CreditCard, Trophy, GraduationCap,
  Calendar, HelpCircle, ListOrdered, DollarSign, Plus, Pencil, Trash2,
  GripVertical, CheckCircle2, ChevronUp, ChevronDown, Eye, EyeOff,
} from "lucide-react";

// ─── Types ───
interface AlurItem {
  id: string; step: number; title: string; desc: string; details: string[]; status: string;
}
interface JadwalItem {
  id: string; wave: string; period: string; testDate: string; resultDate: string; status: string;
}
interface PersyaratanItem {
  id: string; title: string; order: number; status: string;
}
interface BiayaItem {
  id: string; item: string; amount: string; note: string; order: number; status: string;
}
interface FAQItem {
  id: string; question: string; answer: string; order: number; status: string;
}

// ─── Initial Data ───
const initialAlur: AlurItem[] = [
  { id: "A1", step: 1, title: "Pendaftaran Online", desc: "Isi formulir pendaftaran online dengan data lengkap calon santri dan wali/orang tua.", details: ["Pilih program yang diminati", "Isi data pribadi calon santri", "Isi data wali/orang tua", "Upload pas foto terbaru"], status: "Aktif" },
  { id: "A2", step: 2, title: "Upload Dokumen", desc: "Lengkapi berkas persyaratan secara digital melalui portal pendaftaran.", details: ["Akta kelahiran", "Kartu keluarga", "Rapor 2 semester terakhir", "Surat keterangan sehat"], status: "Aktif" },
  { id: "A3", step: 3, title: "Tes Seleksi", desc: "Ikuti tes seleksi yang meliputi tes akademik, baca Al-Qur'an, dan wawancara.", details: ["Tes kemampuan akademik dasar", "Tes baca Al-Qur'an & hafalan", "Wawancara calon santri", "Wawancara orang tua/wali"], status: "Aktif" },
  { id: "A4", step: 4, title: "Pengumuman Hasil", desc: "Hasil seleksi akan diumumkan melalui website dan notifikasi ke email/WhatsApp terdaftar.", details: ["Pengumuman via website & email", "Notifikasi WhatsApp", "Surat kelulusan digital", "Panduan langkah selanjutnya"], status: "Aktif" },
  { id: "A5", step: 5, title: "Daftar Ulang & Pembayaran", desc: "Lakukan pembayaran biaya pendaftaran dan perlengkapan sesuai gelombang yang dipilih.", details: ["Pembayaran biaya pendidikan", "Pembayaran perlengkapan santri", "Pembayaran seragam & kitab", "Konfirmasi pembayaran"], status: "Aktif" },
  { id: "A6", step: 6, title: "Orientasi & Masuk Pesantren", desc: "Ikuti kegiatan orientasi dan mulai kehidupan sebagai santri di pesantren.", details: ["Orientasi santri baru (3 hari)", "Penempatan kamar asrama", "Penerimaan jadwal pelajaran", "Perkenalan lingkungan pesantren"], status: "Aktif" },
];

const initialJadwal: JadwalItem[] = [
  { id: "J1", wave: "Gelombang 1", period: "1 Januari – 28 Februari 2026", testDate: "8 Maret 2026", resultDate: "15 Maret 2026", status: "Dibuka" },
  { id: "J2", wave: "Gelombang 2", period: "1 Maret – 30 April 2026", testDate: "10 Mei 2026", resultDate: "17 Mei 2026", status: "Segera" },
  { id: "J3", wave: "Gelombang 3", period: "1 Mei – 30 Juni 2026", testDate: "12 Juli 2026", resultDate: "19 Juli 2026", status: "Tertutup" },
];

const initialPersyaratan: PersyaratanItem[] = [
  { id: "P1", title: "Fotokopi akta kelahiran (2 lembar)", order: 1, status: "Aktif" },
  { id: "P2", title: "Fotokopi kartu keluarga (2 lembar)", order: 2, status: "Aktif" },
  { id: "P3", title: "Fotokopi rapor 2 semester terakhir yang dilegalisir", order: 3, status: "Aktif" },
  { id: "P4", title: "Surat keterangan sehat dari dokter", order: 4, status: "Aktif" },
  { id: "P5", title: "Pas foto 3x4 dan 4x6 (masing-masing 4 lembar, background biru)", order: 5, status: "Aktif" },
  { id: "P6", title: "Fotokopi KTP orang tua/wali (2 lembar)", order: 6, status: "Aktif" },
  { id: "P7", title: "Surat keterangan berkelakuan baik dari sekolah asal", order: 7, status: "Aktif" },
  { id: "P8", title: "Mengisi formulir pendaftaran online", order: 8, status: "Aktif" },
];

const initialBiaya: BiayaItem[] = [
  { id: "B1", item: "Biaya Pendaftaran", amount: "Rp 350.000", note: "Sekali bayar", order: 1, status: "Aktif" },
  { id: "B2", item: "SPP Bulanan", amount: "Rp 1.500.000", note: "Per bulan", order: 2, status: "Aktif" },
  { id: "B3", item: "Biaya Pembangunan", amount: "Rp 5.000.000", note: "Sekali bayar", order: 3, status: "Aktif" },
  { id: "B4", item: "Perlengkapan Santri", amount: "Rp 2.500.000", note: "Sekali bayar", order: 4, status: "Aktif" },
  { id: "B5", item: "Seragam & Kitab", amount: "Rp 1.800.000", note: "Sekali bayar", order: 5, status: "Aktif" },
];

const initialFAQ: FAQItem[] = [
  { id: "F1", question: "Berapa usia minimal untuk mendaftar?", answer: "Calon santri minimal berusia 12 tahun atau setara kelas 7 SMP pada saat masuk pesantren.", order: 1, status: "Aktif" },
  { id: "F2", question: "Apakah ada beasiswa untuk santri berprestasi?", answer: "Ya, kami menyediakan beasiswa prestasi akademik, tahfidz, dan bantuan bagi keluarga kurang mampu.", order: 2, status: "Aktif" },
  { id: "F3", question: "Bagaimana sistem pembayaran SPP?", answer: "Pembayaran SPP dilakukan setiap bulan melalui transfer bank, virtual account, atau e-wallet.", order: 3, status: "Aktif" },
  { id: "F4", question: "Apakah orang tua bisa berkunjung?", answer: "Kunjungan orang tua dijadwalkan setiap 2 minggu sekali pada hari Ahad.", order: 4, status: "Aktif" },
  { id: "F5", question: "Apa kurikulum yang digunakan?", answer: "Kami menggunakan kurikulum nasional (Kemendikbud) yang dipadukan dengan kurikulum pesantren (Diniyah).", order: 5, status: "Aktif" },
  { id: "F6", question: "Apakah ada program tahfidz?", answer: "Ya, program tahfidz adalah salah satu program unggulan kami dengan target hafalan 30 juz.", order: 6, status: "Aktif" },
];

const stepIcons = [ClipboardList, FileText, Users, Trophy, CreditCard, GraduationCap];
const stepColors = [
  "bg-primary/10 text-primary",
  "bg-accent/15 text-accent-foreground",
  "bg-info/10 text-info",
  "bg-success/10 text-success",
  "bg-accent/15 text-accent-foreground",
  "bg-primary/10 text-primary",
];

// ─── Tab Sections ───
const tabs = [
  { value: "alur", label: "Alur Pendaftaran", icon: ListOrdered, count: 0 },
  { value: "jadwal", label: "Jadwal", icon: Calendar, count: 0 },
  { value: "persyaratan", label: "Persyaratan", icon: CheckCircle2, count: 0 },
  { value: "biaya", label: "Biaya", icon: DollarSign, count: 0 },
  { value: "faq", label: "FAQ", icon: HelpCircle, count: 0 },
];

const ManageRegistrationInfo = () => {
  const [alur, setAlur] = useState(initialAlur);
  const [jadwal, setJadwal] = useState(initialJadwal);
  const [persyaratan, setPersyaratan] = useState(initialPersyaratan);
  const [biaya, setBiaya] = useState(initialBiaya);
  const [faq, setFaq] = useState(initialFAQ);

  const [editDialog, setEditDialog] = useState<{ type: string; data: any; isNew: boolean } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ type: string; id: string } | null>(null);

  const showToast = (msg: string) => toast.success(msg, { duration: 2500 });

  // ─── Generic handlers ───
  const handleDelete = () => {
    if (!deleteDialog) return;
    const { type, id } = deleteDialog;
    if (type === "alur") setAlur((prev) => prev.filter((i) => i.id !== id));
    if (type === "jadwal") setJadwal((prev) => prev.filter((i) => i.id !== id));
    if (type === "persyaratan") setPersyaratan((prev) => prev.filter((i) => i.id !== id));
    if (type === "biaya") setBiaya((prev) => prev.filter((i) => i.id !== id));
    if (type === "faq") setFaq((prev) => prev.filter((i) => i.id !== id));
    setDeleteDialog(null);
    showToast("Item berhasil dihapus");
  };

  const handleSave = () => {
    if (!editDialog) return;
    const { type, data, isNew } = editDialog;
    if (type === "alur") {
      setAlur((prev) => isNew ? [...prev, { ...data, id: `A${Date.now()}` }] : prev.map((i) => (i.id === data.id ? data : i)));
    }
    if (type === "jadwal") {
      setJadwal((prev) => isNew ? [...prev, { ...data, id: `J${Date.now()}` }] : prev.map((i) => (i.id === data.id ? data : i)));
    }
    if (type === "persyaratan") {
      setPersyaratan((prev) => isNew ? [...prev, { ...data, id: `P${Date.now()}` }] : prev.map((i) => (i.id === data.id ? data : i)));
    }
    if (type === "biaya") {
      setBiaya((prev) => isNew ? [...prev, { ...data, id: `B${Date.now()}` }] : prev.map((i) => (i.id === data.id ? data : i)));
    }
    if (type === "faq") {
      setFaq((prev) => isNew ? [...prev, { ...data, id: `F${Date.now()}` }] : prev.map((i) => (i.id === data.id ? data : i)));
    }
    setEditDialog(null);
    showToast(isNew ? "Item berhasil ditambahkan" : "Item berhasil diperbarui");
  };

  const toggleStatus = (type: string, id: string) => {
    const toggle = (item: any) => ({ ...item, status: item.status === "Aktif" ? "Nonaktif" : "Aktif" });
    if (type === "alur") setAlur((prev) => prev.map((i) => (i.id === id ? toggle(i) : i)));
    if (type === "persyaratan") setPersyaratan((prev) => prev.map((i) => (i.id === id ? toggle(i) : i)));
    if (type === "biaya") setBiaya((prev) => prev.map((i) => (i.id === id ? toggle(i) : i)));
    if (type === "faq") setFaq((prev) => prev.map((i) => (i.id === id ? toggle(i) : i)));
    showToast("Status berhasil diubah");
  };

  const moveItem = (type: string, id: string, direction: "up" | "down") => {
    const reorder = <T extends { id: string; order?: number }>(items: T[]): T[] => {
      const idx = items.findIndex((i) => i.id === id);
      if ((direction === "up" && idx === 0) || (direction === "down" && idx === items.length - 1)) return items;
      const newItems = [...items];
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      [newItems[idx], newItems[swapIdx]] = [newItems[swapIdx], newItems[idx]];
      return newItems;
    };
    if (type === "persyaratan") setPersyaratan(reorder);
    if (type === "biaya") setBiaya(reorder);
    if (type === "faq") setFaq(reorder);
  };

  // ─── Tab counts ───
  const tabsWithCount = tabs.map((t) => {
    if (t.value === "alur") return { ...t, count: alur.length };
    if (t.value === "jadwal") return { ...t, count: jadwal.length };
    if (t.value === "persyaratan") return { ...t, count: persyaratan.length };
    if (t.value === "biaya") return { ...t, count: biaya.length };
    if (t.value === "faq") return { ...t, count: faq.length };
    return t;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Kelola Info Pendaftaran</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola konten halaman pendaftaran website — alur, jadwal, persyaratan, biaya, dan FAQ.
        </p>
      </div>

      <Tabs defaultValue="alur" className="space-y-6">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1.5 rounded-xl">
          {tabsWithCount.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-background/20">{tab.count}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ═══ ALUR PENDAFTARAN ═══ */}
        <TabsContent value="alur" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Kelola langkah-langkah alur pendaftaran yang ditampilkan di halaman depan.</p>
            <Button size="sm" onClick={() => setEditDialog({
              type: "alur", isNew: true,
              data: { step: alur.length + 1, title: "", desc: "", details: ["", "", "", ""], status: "Aktif" },
            })}>
              <Plus className="h-4 w-4 mr-1" /> Tambah Langkah
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {alur.map((item, i) => {
              const Icon = stepIcons[i % stepIcons.length];
              const color = stepColors[i % stepColors.length];
              return (
                <Card key={item.id} className={`relative group ${item.status === "Nonaktif" ? "opacity-50" : ""}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleStatus("alur", item.id)}>
                          {item.status === "Aktif" ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditDialog({ type: "alur", data: { ...item }, isNew: false })}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteDialog({ type: "alur", id: item.id })}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-bold text-muted-foreground/40">0{item.step}</span>
                      <CardTitle className="text-sm">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.desc}</p>
                    <ul className="space-y-1">
                      {item.details.filter(Boolean).map((d, j) => (
                        <li key={j} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-primary shrink-0" /> {d}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ═══ JADWAL ═══ */}
        <TabsContent value="jadwal" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Kelola gelombang pendaftaran dan jadwal tes seleksi.</p>
            <Button size="sm" onClick={() => setEditDialog({
              type: "jadwal", isNew: true,
              data: { wave: "", period: "", testDate: "", resultDate: "", status: "Dibuka" },
            })}>
              <Plus className="h-4 w-4 mr-1" /> Tambah Gelombang
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold text-foreground">Gelombang</th>
                      <th className="text-left p-4 font-semibold text-foreground">Periode Daftar</th>
                      <th className="text-left p-4 font-semibold text-foreground">Tes Seleksi</th>
                      <th className="text-left p-4 font-semibold text-foreground">Pengumuman</th>
                      <th className="text-left p-4 font-semibold text-foreground">Status</th>
                      <th className="text-right p-4 font-semibold text-foreground">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jadwal.map((item) => (
                      <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-semibold text-foreground">{item.wave}</td>
                        <td className="p-4 text-muted-foreground">{item.period}</td>
                        <td className="p-4 text-muted-foreground">{item.testDate}</td>
                        <td className="p-4 text-muted-foreground">{item.resultDate}</td>
                        <td className="p-4">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            item.status === "Dibuka" ? "bg-success/10 text-success" :
                            item.status === "Segera" ? "bg-warning/10 text-warning" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditDialog({ type: "jadwal", data: { ...item }, isNew: false })}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteDialog({ type: "jadwal", id: item.id })}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ PERSYARATAN ═══ */}
        <TabsContent value="persyaratan" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Kelola daftar persyaratan dokumen yang harus dipenuhi calon santri.</p>
            <Button size="sm" onClick={() => setEditDialog({
              type: "persyaratan", isNew: true,
              data: { title: "", order: persyaratan.length + 1, status: "Aktif" },
            })}>
              <Plus className="h-4 w-4 mr-1" /> Tambah Persyaratan
            </Button>
          </div>
          <Card>
            <CardContent className="p-4 space-y-2">
              {persyaratan.map((item, i) => (
                <div key={item.id} className={`flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/30 ${item.status === "Nonaktif" ? "opacity-50" : ""}`}>
                  <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <span className="flex-1 text-sm text-foreground">{item.title}</span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveItem("persyaratan", item.id, "up")} disabled={i === 0}>
                      <ChevronUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveItem("persyaratan", item.id, "down")} disabled={i === persyaratan.length - 1}>
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleStatus("persyaratan", item.id)}>
                      {item.status === "Aktif" ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditDialog({ type: "persyaratan", data: { ...item }, isNew: false })}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteDialog({ type: "persyaratan", id: item.id })}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ BIAYA ═══ */}
        <TabsContent value="biaya" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Kelola rincian biaya pendidikan yang ditampilkan di halaman pendaftaran.</p>
            <Button size="sm" onClick={() => setEditDialog({
              type: "biaya", isNew: true,
              data: { item: "", amount: "", note: "", order: biaya.length + 1, status: "Aktif" },
            })}>
              <Plus className="h-4 w-4 mr-1" /> Tambah Biaya
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              {biaya.map((item, i) => (
                <div key={item.id} className={`flex items-center justify-between p-5 ${i < biaya.length - 1 ? "border-b" : ""} hover:bg-muted/30 transition-colors group ${item.status === "Nonaktif" ? "opacity-50" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent-foreground shrink-0">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.item}</p>
                      <p className="text-xs text-muted-foreground">{item.note}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary">{item.amount}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveItem("biaya", item.id, "up")} disabled={i === 0}>
                        <ChevronUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveItem("biaya", item.id, "down")} disabled={i === biaya.length - 1}>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleStatus("biaya", item.id)}>
                        {item.status === "Aktif" ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditDialog({ type: "biaya", data: { ...item }, isNew: false })}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteDialog({ type: "biaya", id: item.id })}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-5 bg-primary/5 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">Total Biaya Awal</span>
                  <span className="text-lg font-extrabold text-primary">Rp 11.150.000</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">*Belum termasuk SPP bulanan</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ FAQ ═══ */}
        <TabsContent value="faq" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Kelola pertanyaan yang sering diajukan (FAQ) calon santri dan orang tua.</p>
            <Button size="sm" onClick={() => setEditDialog({
              type: "faq", isNew: true,
              data: { question: "", answer: "", order: faq.length + 1, status: "Aktif" },
            })}>
              <Plus className="h-4 w-4 mr-1" /> Tambah FAQ
            </Button>
          </div>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <Card key={item.id} className={`group ${item.status === "Nonaktif" ? "opacity-50" : ""}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-info/10 text-info shrink-0">
                          <HelpCircle className="h-3.5 w-3.5" />
                        </div>
                        <h4 className="text-sm font-semibold text-foreground">{item.question}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed pl-8">{item.answer}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveItem("faq", item.id, "up")} disabled={i === 0}>
                        <ChevronUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveItem("faq", item.id, "down")} disabled={i === faq.length - 1}>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleStatus("faq", item.id)}>
                        {item.status === "Aktif" ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditDialog({ type: "faq", data: { ...item }, isNew: false })}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteDialog({ type: "faq", id: item.id })}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* ═══ EDIT DIALOG ═══ */}
      <Dialog open={!!editDialog} onOpenChange={() => setEditDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editDialog?.isNew ? "Tambah" : "Edit"}{" "}
              {editDialog?.type === "alur" ? "Langkah" : editDialog?.type === "jadwal" ? "Gelombang" : editDialog?.type === "persyaratan" ? "Persyaratan" : editDialog?.type === "biaya" ? "Biaya" : "FAQ"}
            </DialogTitle>
          </DialogHeader>
          {editDialog && (
            <div className="space-y-4">
              {editDialog.type === "alur" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">Langkah ke-</label>
                      <Input type="number" value={editDialog.data.step} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, step: +e.target.value } })} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">Status</label>
                      <Select value={editDialog.data.status} onValueChange={(v) => setEditDialog({ ...editDialog, data: { ...editDialog.data, status: v } })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Aktif">Aktif</SelectItem>
                          <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Judul</label>
                    <Input value={editDialog.data.title} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, title: e.target.value } })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Deskripsi</label>
                    <Textarea value={editDialog.data.desc} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, desc: e.target.value } })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Detail (1 per baris)</label>
                    {editDialog.data.details.map((d: string, j: number) => (
                      <Input key={j} className="mb-2" value={d} placeholder={`Detail ${j + 1}`}
                        onChange={(e) => {
                          const details = [...editDialog.data.details];
                          details[j] = e.target.value;
                          setEditDialog({ ...editDialog, data: { ...editDialog.data, details } });
                        }}
                      />
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setEditDialog({ ...editDialog, data: { ...editDialog.data, details: [...editDialog.data.details, ""] } })}>
                      + Tambah Detail
                    </Button>
                  </div>
                </>
              )}

              {editDialog.type === "jadwal" && (
                <>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Nama Gelombang</label>
                    <Input value={editDialog.data.wave} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, wave: e.target.value } })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Periode Pendaftaran</label>
                    <Input value={editDialog.data.period} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, period: e.target.value } })} placeholder="Contoh: 1 Januari – 28 Februari 2026" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">Tanggal Tes</label>
                      <Input value={editDialog.data.testDate} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, testDate: e.target.value } })} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">Tanggal Pengumuman</label>
                      <Input value={editDialog.data.resultDate} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, resultDate: e.target.value } })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Status</label>
                    <Select value={editDialog.data.status} onValueChange={(v) => setEditDialog({ ...editDialog, data: { ...editDialog.data, status: v } })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dibuka">Dibuka</SelectItem>
                        <SelectItem value="Segera">Segera</SelectItem>
                        <SelectItem value="Tertutup">Tertutup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {editDialog.type === "persyaratan" && (
                <>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Persyaratan</label>
                    <Input value={editDialog.data.title} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, title: e.target.value } })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Status</label>
                    <Select value={editDialog.data.status} onValueChange={(v) => setEditDialog({ ...editDialog, data: { ...editDialog.data, status: v } })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {editDialog.type === "biaya" && (
                <>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Nama Biaya</label>
                    <Input value={editDialog.data.item} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, item: e.target.value } })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">Nominal</label>
                      <Input value={editDialog.data.amount} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, amount: e.target.value } })} placeholder="Rp 1.000.000" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">Keterangan</label>
                      <Input value={editDialog.data.note} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, note: e.target.value } })} placeholder="Sekali bayar / Per bulan" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Status</label>
                    <Select value={editDialog.data.status} onValueChange={(v) => setEditDialog({ ...editDialog, data: { ...editDialog.data, status: v } })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {editDialog.type === "faq" && (
                <>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Pertanyaan</label>
                    <Input value={editDialog.data.question} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, question: e.target.value } })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Jawaban</label>
                    <Textarea rows={4} value={editDialog.data.answer} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, answer: e.target.value } })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Status</label>
                    <Select value={editDialog.data.status} onValueChange={(v) => setEditDialog({ ...editDialog, data: { ...editDialog.data, status: v } })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(null)}>Batal</Button>
            <Button onClick={handleSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ DELETE DIALOG ═══ */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Item?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Item yang dihapus tidak dapat dikembalikan. Lanjutkan?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageRegistrationInfo;
