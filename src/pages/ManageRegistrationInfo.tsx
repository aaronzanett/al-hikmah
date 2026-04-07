import { useState } from "react";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarWidget } from "@/components/ui/calendar";
import { toast } from "sonner";
import {
  ListOrdered, Calendar, HelpCircle, DollarSign, Plus, Pencil, Trash2,
  CheckCircle2, ChevronUp, ChevronDown, Eye, EyeOff, CalendarIcon, GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { iconRegistry, iconKeys, getIconComponent, colorPresets } from "@/lib/iconMap";

import {
  registrationSteps,
  scheduleData,
  requirementsData,
  costData,
  faqData,
  defaultFeeConfig,
  formatDateDisplay,
  formatPeriodDisplay,
  type AlurItem,
  type JadwalItem,
  type PersyaratanItem,
  type BiayaItem,
  type FAQItem,
  type FeeMode,
  type RegistrationFeeConfig,
} from "@/data/registrationData";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// ─── DatePicker helper ───
function DatePickerField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const date = value ? new Date(value + "T00:00:00") : undefined;
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd MMM yyyy") : "Pilih tanggal"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarWidget
            mode="single"
            selected={date}
            onSelect={(d) => { if (d) onChange(format(d, "yyyy-MM-dd")); }}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ─── Tab Sections ───
const tabs = [
  { value: "alur", label: "Alur Pendaftaran", icon: ListOrdered, count: 0 },
  { value: "jadwal", label: "Jadwal", icon: Calendar, count: 0 },
  { value: "persyaratan", label: "Persyaratan", icon: CheckCircle2, count: 0 },
  { value: "biaya", label: "Biaya", icon: DollarSign, count: 0 },
  { value: "faq", label: "FAQ", icon: HelpCircle, count: 0 },
];

const ManageRegistrationInfo = () => {
  const [alur, setAlur] = useState<AlurItem[]>(() => [...registrationSteps].sort((a, b) => a.step - b.step));
  const [jadwal, setJadwal] = useState<JadwalItem[]>(scheduleData);
  const [persyaratan, setPersyaratan] = useState<PersyaratanItem[]>(() => [...requirementsData].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
  const [biaya, setBiaya] = useState<BiayaItem[]>(() => [...costData].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
  const [faq, setFaq] = useState<FAQItem[]>(() => [...faqData].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
  const [feeConfig, setFeeConfig] = useState<RegistrationFeeConfig>(() => ({ ...defaultFeeConfig }));

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

    // Helper: enforce unique order/step, shift others, then sort
    const enforceAndSort = <T extends { id: string }>(items: T[], orderField: string, newOrder: number, currentId: string | null): T[] => {
      const conflict = items.find((i: any) => Number(i[orderField]) === newOrder && i.id !== currentId);
      let result = items;
      if (conflict) {
        toast.success(`Urutan ${newOrder} sudah digunakan, item lain digeser otomatis.`, { duration: 3000 });
        result = items.map((i: any) => {
          if (i.id === currentId) return i;
          if (Number(i[orderField]) >= newOrder) return { ...i, [orderField]: Number(i[orderField]) + 1 };
          return i;
        });
      }
      return result;
    };

    const sortBy = <T extends Record<string, any>>(items: T[], field: string): T[] =>
      [...items].sort((a, b) => Number(a[field]) - Number(b[field]));

    if (type === "alur") {
      setAlur((prev) => {
        const shifted = enforceAndSort(prev, "step", Number(data.step), isNew ? null : data.id);
        const updated = isNew ? [...shifted, { ...data, id: `A${Date.now()}` }] : shifted.map((i) => (i.id === data.id ? data : i));
        return sortBy(updated, "step");
      });
    }
    if (type === "jadwal") {
      setJadwal((prev) => isNew ? [...prev, { ...data, id: `J${Date.now()}` }] : prev.map((i) => (i.id === data.id ? data : i)));
    }
    if (type === "persyaratan") {
      setPersyaratan((prev) => {
        const shifted = enforceAndSort(prev, "order", Number(data.order), isNew ? null : data.id);
        const updated = isNew ? [...shifted, { ...data, id: `P${Date.now()}` }] : shifted.map((i) => (i.id === data.id ? data : i));
        return sortBy(updated, "order");
      });
    }
    if (type === "biaya") {
      setBiaya((prev) => {
        const shifted = enforceAndSort(prev, "order", Number(data.order), isNew ? null : data.id);
        const updated = isNew ? [...shifted, { ...data, id: `B${Date.now()}` }] : shifted.map((i) => (i.id === data.id ? data : i));
        return sortBy(updated, "order");
      });
    }
    if (type === "faq") {
      setFaq((prev) => {
        const shifted = enforceAndSort(prev, "order", Number(data.order), isNew ? null : data.id);
        const updated = isNew ? [...shifted, { ...data, id: `F${Date.now()}` }] : shifted.map((i) => (i.id === data.id ? data : i));
        return sortBy(updated, "order");
      });
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
    const reorder = <T extends { id: string }>(items: T[], orderField: string): T[] => {
      const idx = items.findIndex((i) => i.id === id);
      if ((direction === "up" && idx === 0) || (direction === "down" && idx === items.length - 1)) return items;
      const newItems = [...items];
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      // Swap order values
      const tempOrder = (newItems[idx] as any)[orderField];
      (newItems[idx] as any)[orderField] = (newItems[swapIdx] as any)[orderField];
      (newItems[swapIdx] as any)[orderField] = tempOrder;
      [newItems[idx], newItems[swapIdx]] = [newItems[swapIdx], newItems[idx]];
      return newItems;
    };
    if (type === "persyaratan") setPersyaratan((prev) => reorder(prev, "order"));
    if (type === "biaya") setBiaya((prev) => reorder(prev, "order"));
    if (type === "faq") setFaq((prev) => reorder(prev, "order"));
    showToast("Urutan berhasil diubah");
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
              data: { step: Math.max(0, ...alur.map(a => a.step)) + 1, title: "", desc: "", details: ["", "", "", ""], status: "Aktif", iconKey: "ClipboardList", color: "bg-primary/10 text-primary" },
            })}>
              <Plus className="h-4 w-4 mr-1" /> Tambah Langkah
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {alur.map((item) => {
              const Icon = getIconComponent(item.iconKey);
              return (
                <Card key={item.id} className={`relative group ${item.status === "Nonaktif" ? "opacity-50" : ""}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>
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
            <p className="text-sm text-muted-foreground">Kelola jadwal pendaftaran per program dan gelombang.</p>
            <Button size="sm" onClick={() => {
              const name = prompt("Nama program baru:");
              if (name && name.trim()) {
                setJadwal(prev => [...prev, {
                  id: `J${Date.now()}`, program: name.trim(), wave: "Gelombang 1",
                  periodStart: "", periodEnd: "", testDate: "", resultDate: "", status: "Dibuka",
                }]);
                setFeeConfig(prev => ({
                  ...prev,
                  programFees: { ...prev.programFees, [name.trim()]: "Rp 0" },
                }));
                showToast(`Program "${name.trim()}" berhasil ditambahkan`);
              }
            }}>
              <Plus className="h-4 w-4 mr-1" /> Tambah Program
            </Button>
          </div>

          {/* ═══ BIAYA PENDAFTARAN CONFIG ═══ */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Biaya Pendaftaran
              </CardTitle>
              <p className="text-xs text-muted-foreground">Atur mode biaya pendaftaran yang berlaku untuk semua program.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={feeConfig.mode}
                onValueChange={(v) => setFeeConfig(prev => ({ ...prev, mode: v as FeeMode }))}
                className="grid gap-3 sm:grid-cols-3"
              >
                {[
                  { value: "free", label: "Gratis", desc: "Tidak ada biaya pendaftaran" },
                  { value: "global", label: "Seragam", desc: "Biaya sama untuk semua program" },
                  { value: "per-program", label: "Per Program", desc: "Biaya berbeda tiap program" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all hover:bg-muted/50",
                      feeConfig.mode === opt.value ? "border-primary bg-primary/5 ring-1 ring-primary" : ""
                    )}
                  >
                    <RadioGroupItem value={opt.value} className="mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>

              {feeConfig.mode === "global" && (
                <div className="space-y-2 max-w-xs">
                  <label className="text-sm font-medium">Biaya Pendaftaran</label>
                  <Input
                    value={feeConfig.globalAmount}
                    onChange={(e) => setFeeConfig(prev => ({ ...prev, globalAmount: e.target.value }))}
                    placeholder="Rp 350.000"
                  />
                </div>
              )}

              {feeConfig.mode === "per-program" && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">Biaya per Program</label>
                  {Array.from(new Set(jadwal.map(j => j.program))).filter(Boolean).map(prog => (
                    <div key={prog} className="flex items-center gap-3">
                      <span className="text-sm text-foreground min-w-[180px]">{prog}</span>
                      <Input
                        className="max-w-[200px]"
                        value={feeConfig.programFees[prog] || ""}
                        onChange={(e) => setFeeConfig(prev => ({
                          ...prev,
                          programFees: { ...prev.programFees, [prog]: e.target.value },
                        }))}
                        placeholder="Rp 0"
                      />
                    </div>
                  ))}
                </div>
              )}

              {feeConfig.mode === "free" && (
                <div className="rounded-lg bg-success/10 p-3 text-sm text-success font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Pendaftaran gratis — tidak ada biaya yang dikenakan.
                </div>
              )}
            </CardContent>
          </Card>
          {(() => {
            const programs = Array.from(new Set(jadwal.map(j => j.program))).filter(Boolean);
            return (
              <div className="space-y-6">
                {programs.length === 0 && (
                  <Card className="p-8 text-center">
                    <GraduationCap className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Belum ada program. Klik "Tambah Program" untuk memulai.</p>
                  </Card>
                )}
                {programs.map(prog => {
                  const waves = jadwal.filter(j => j.program === prog);
                  return (
                    <Card key={prog}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-bold">
                            {prog.charAt(0)}
                          </span>
                          {prog}
                          <span className="text-xs font-normal text-muted-foreground">
                            {waves.length} gelombang
                          </span>
                          <div className="ml-auto flex items-center gap-1">
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setEditDialog({
                              type: "jadwal", isNew: true,
                              data: { program: prog, wave: `Gelombang ${waves.length + 1}`, periodStart: "", periodEnd: "", testDate: "", resultDate: "", status: "Dibuka" },
                            })}>
                              <Plus className="h-3.5 w-3.5 mr-1" /> Tambah Gelombang
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => {
                              if (confirm(`Hapus program "${prog}" beserta semua gelombangnya?`)) {
                                setJadwal(prev => prev.filter(j => j.program !== prog));
                                showToast(`Program "${prog}" berhasil dihapus`);
                              }
                            }}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b bg-muted/50">
                                <th className="text-left p-3 font-semibold text-foreground">Gelombang</th>
                                <th className="text-left p-3 font-semibold text-foreground">Periode Daftar</th>
                                <th className="text-left p-3 font-semibold text-foreground">Tes Seleksi</th>
                                <th className="text-left p-3 font-semibold text-foreground">Pengumuman</th>
                                <th className="text-left p-3 font-semibold text-foreground">Status</th>
                                <th className="text-right p-3 font-semibold text-foreground">Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {waves.map(item => (
                                <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                  <td className="p-3 font-semibold text-foreground">{item.wave}</td>
                                  <td className="p-3 text-muted-foreground">{formatPeriodDisplay(item.periodStart, item.periodEnd)}</td>
                                  <td className="p-3 text-muted-foreground">{formatDateDisplay(item.testDate)}</td>
                                  <td className="p-3 text-muted-foreground">{formatDateDisplay(item.resultDate)}</td>
                                  <td className="p-3">
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                      item.status === "Dibuka" ? "bg-success/10 text-success" :
                                      item.status === "Segera" ? "bg-warning/10 text-warning" :
                                      "bg-muted text-muted-foreground"
                                    }`}>{item.status}</span>
                                  </td>
                                  <td className="p-3 text-right">
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
                  );
                })}
              </div>
            );
          })()}
        </TabsContent>

        {/* ═══ PERSYARATAN ═══ */}
        <TabsContent value="persyaratan" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Kelola daftar persyaratan pendaftaran.</p>
            <Button size="sm" onClick={() => setEditDialog({
              type: "persyaratan", isNew: true,
              data: { title: "", order: Math.max(0, ...persyaratan.map(p => p.order ?? 0)) + 1, status: "Aktif" },
            })}>
              <Plus className="h-4 w-4 mr-1" /> Tambah Syarat
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {persyaratan.map((item) => (
                  <div key={item.id} className={`flex items-center gap-3 p-4 ${item.status === "Nonaktif" ? "opacity-50" : ""}`}>
                    <div className="flex flex-col gap-0.5">
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveItem("persyaratan", item.id, "up")}>
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveItem("persyaratan", item.id, "down")}>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="flex-1 text-sm text-foreground">{item.title}</span>
                    <div className="flex items-center gap-1">
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ BIAYA ═══ */}
        <TabsContent value="biaya" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Kelola rincian biaya pendidikan.</p>
            <Button size="sm" onClick={() => setEditDialog({
              type: "biaya", isNew: true,
              data: { item: "", amount: "", note: "", order: Math.max(0, ...biaya.map(b => b.order ?? 0)) + 1, status: "Aktif" },
            })}>
              <Plus className="h-4 w-4 mr-1" /> Tambah Biaya
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {biaya.map((item) => (
                  <div key={item.id} className={`flex items-center gap-3 p-4 ${item.status === "Nonaktif" ? "opacity-50" : ""}`}>
                    <div className="flex flex-col gap-0.5">
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveItem("biaya", item.id, "up")}>
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveItem("biaya", item.id, "down")}>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.item}</p>
                      <p className="text-xs text-muted-foreground">{item.note}</p>
                    </div>
                    <span className="text-sm font-bold text-primary">{item.amount}</span>
                    <div className="flex items-center gap-1">
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
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ FAQ ═══ */}
        <TabsContent value="faq" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Kelola pertanyaan yang sering diajukan.</p>
            <Button size="sm" onClick={() => setEditDialog({
              type: "faq", isNew: true,
              data: { question: "", answer: "", order: Math.max(0, ...faq.map(f => f.order ?? 0)) + 1, status: "Aktif" },
            })}>
              <Plus className="h-4 w-4 mr-1" /> Tambah FAQ
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {faq.map((item) => (
                  <div key={item.id} className={`p-4 ${item.status === "Nonaktif" ? "opacity-50" : ""}`}>
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-0.5 mt-1">
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveItem("faq", item.id, "up")}>
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveItem("faq", item.id, "down")}>
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{item.question}</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.answer}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ═══ EDIT DIALOG ═══ */}
      <Dialog open={!!editDialog} onOpenChange={() => setEditDialog(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editDialog?.isNew ? "Tambah Item Baru" : "Edit Item"}</DialogTitle>
          </DialogHeader>
          {editDialog?.type === "alur" && (
            <div className="space-y-4">
              {/* Live Preview */}
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Preview</p>
                <div className="flex items-start gap-3">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl shrink-0", editDialog.data.color || "bg-primary/10 text-primary")}>
                    {(() => { const Ic = getIconComponent(editDialog.data.iconKey || "ClipboardList"); return <Ic className="h-6 w-6" />; })()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground/40">0{editDialog.data.step}</span>
                      <span className="text-sm font-semibold text-foreground">{editDialog.data.title || "Judul langkah..."}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{editDialog.data.desc || "Deskripsi langkah..."}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Langkah</label><Input type="number" value={editDialog.data.step} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, step: parseInt(e.target.value) || 1 } })} /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Status</label>
                  <Select value={editDialog.data.status} onValueChange={(v) => setEditDialog({ ...editDialog, data: { ...editDialog.data, status: v } })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Aktif">Aktif</SelectItem><SelectItem value="Nonaktif">Nonaktif</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2"><label className="text-sm font-medium">Judul</label><Input value={editDialog.data.title} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, title: e.target.value } })} /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Deskripsi</label><Textarea value={editDialog.data.desc} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, desc: e.target.value } })} rows={2} /></div>

              {/* Icon Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ikon</label>
                <div className="grid grid-cols-7 gap-1.5 max-h-32 overflow-y-auto p-1 rounded-lg border bg-background">
                  {iconKeys.map((key) => {
                    const Ic = iconRegistry[key];
                    const isSelected = editDialog.data.iconKey === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setEditDialog({ ...editDialog, data: { ...editDialog.data, iconKey: key } })}
                        className={cn(
                          "flex flex-col items-center gap-0.5 p-1.5 rounded-lg border transition-all",
                          isSelected
                            ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                            : "border-transparent hover:border-muted-foreground/20 hover:bg-muted/50 text-muted-foreground"
                        )}
                        title={key}
                      >
                        <Ic className="h-4 w-4" />
                        <span className="text-[8px] truncate w-full text-center leading-none">{key.replace(/([A-Z])/g, ' $1').trim().split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Warna</label>
                <div className="grid grid-cols-5 gap-2">
                  {colorPresets.map((preset) => {
                    const isSelected = editDialog.data.color === preset.value;
                    const PreviewIcon = getIconComponent(editDialog.data.iconKey || "ClipboardList");
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setEditDialog({ ...editDialog, data: { ...editDialog.data, color: preset.value } })}
                        className={cn(
                          "flex flex-col items-center gap-1 p-2 rounded-lg border transition-all",
                          isSelected
                            ? "border-primary ring-1 ring-primary/30"
                            : "border-transparent hover:border-muted-foreground/20"
                        )}
                      >
                        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", preset.value)}>
                          <PreviewIcon className="h-4 w-4" />
                        </div>
                        <span className="text-[9px] text-muted-foreground">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2"><label className="text-sm font-medium">Detail (satu per baris)</label>
                <Textarea value={(editDialog.data.details || []).join("\n")} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, details: e.target.value.split("\n") } })} rows={4} />
              </div>
            </div>
          )}
          {editDialog?.type === "jadwal" && (
            <div className="space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium">Program</label><Input placeholder="Contoh: Tahfidz Al-Qur'an" value={editDialog.data.program} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, program: e.target.value } })} /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Gelombang</label><Input value={editDialog.data.wave} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, wave: e.target.value } })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <DatePickerField label="Periode Mulai" value={editDialog.data.periodStart || ""} onChange={(v) => setEditDialog({ ...editDialog, data: { ...editDialog.data, periodStart: v } })} />
                <DatePickerField label="Periode Selesai" value={editDialog.data.periodEnd || ""} onChange={(v) => setEditDialog({ ...editDialog, data: { ...editDialog.data, periodEnd: v } })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DatePickerField label="Tanggal Tes" value={editDialog.data.testDate || ""} onChange={(v) => setEditDialog({ ...editDialog, data: { ...editDialog.data, testDate: v } })} />
                <DatePickerField label="Tanggal Hasil" value={editDialog.data.resultDate || ""} onChange={(v) => setEditDialog({ ...editDialog, data: { ...editDialog.data, resultDate: v } })} />
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">Status</label>
                <Select value={editDialog.data.status} onValueChange={(v) => setEditDialog({ ...editDialog, data: { ...editDialog.data, status: v } })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Dibuka">Dibuka</SelectItem><SelectItem value="Segera">Segera</SelectItem><SelectItem value="Tertutup">Tertutup</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          )}
          {editDialog?.type === "persyaratan" && (
            <div className="space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium">Persyaratan</label><Input value={editDialog.data.title} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, title: e.target.value } })} /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Status</label>
                <Select value={editDialog.data.status} onValueChange={(v) => setEditDialog({ ...editDialog, data: { ...editDialog.data, status: v } })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Aktif">Aktif</SelectItem><SelectItem value="Nonaktif">Nonaktif</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          )}
          {editDialog?.type === "biaya" && (
            <div className="space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium">Nama Biaya</label><Input value={editDialog.data.item} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, item: e.target.value } })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Jumlah</label><Input value={editDialog.data.amount} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, amount: e.target.value } })} /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Keterangan</label><Input value={editDialog.data.note} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, note: e.target.value } })} /></div>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">Status</label>
                <Select value={editDialog.data.status} onValueChange={(v) => setEditDialog({ ...editDialog, data: { ...editDialog.data, status: v } })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Aktif">Aktif</SelectItem><SelectItem value="Nonaktif">Nonaktif</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          )}
          {editDialog?.type === "faq" && (
            <div className="space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium">Pertanyaan</label><Input value={editDialog.data.question} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, question: e.target.value } })} /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Jawaban</label><Textarea value={editDialog.data.answer} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, answer: e.target.value } })} rows={3} /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Status</label>
                <Select value={editDialog.data.status} onValueChange={(v) => setEditDialog({ ...editDialog, data: { ...editDialog.data, status: v } })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Aktif">Aktif</SelectItem><SelectItem value="Nonaktif">Nonaktif</SelectItem></SelectContent>
                </Select>
              </div>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
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
