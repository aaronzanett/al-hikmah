import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ListOrdered, Calendar, HelpCircle, DollarSign, Plus, Pencil, Trash2,
  CheckCircle2, ChevronUp, ChevronDown, Eye, EyeOff,
} from "lucide-react";

import {
  registrationSteps,
  scheduleData,
  requirementsData,
  costData,
  faqData,
  stepIcons,
  stepColors,
  type AlurItem,
  type JadwalItem,
  type PersyaratanItem,
  type BiayaItem,
  type FAQItem,
} from "@/data/registrationData";

// ─── Tab Sections ───
const tabs = [
  { value: "alur", label: "Alur Pendaftaran", icon: ListOrdered, count: 0 },
  { value: "jadwal", label: "Jadwal", icon: Calendar, count: 0 },
  { value: "persyaratan", label: "Persyaratan", icon: CheckCircle2, count: 0 },
  { value: "biaya", label: "Biaya", icon: DollarSign, count: 0 },
  { value: "faq", label: "FAQ", icon: HelpCircle, count: 0 },
];

const ManageRegistrationInfo = () => {
  const [alur, setAlur] = useState<AlurItem[]>(registrationSteps);
  const [jadwal, setJadwal] = useState<JadwalItem[]>(scheduleData);
  const [persyaratan, setPersyaratan] = useState<PersyaratanItem[]>(requirementsData);
  const [biaya, setBiaya] = useState<BiayaItem[]>(costData);
  const [faq, setFaq] = useState<FAQItem[]>(faqData);

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
      const newItem = { ...data, icon: stepIcons[data.step - 1] || stepIcons[0], color: stepColors[data.step - 1] || stepColors[0] };
      setAlur((prev) => isNew ? [...prev, { ...newItem, id: `A${Date.now()}` }] : prev.map((i) => (i.id === data.id ? newItem : i)));
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
    const reorder = <T extends { id: string }>(items: T[]): T[] => {
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
            <p className="text-sm text-muted-foreground">Kelola daftar persyaratan pendaftaran.</p>
            <Button size="sm" onClick={() => setEditDialog({
              type: "persyaratan", isNew: true,
              data: { title: "", order: persyaratan.length + 1, status: "Aktif" },
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
              data: { item: "", amount: "", note: "", order: biaya.length + 1, status: "Aktif" },
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
              data: { question: "", answer: "", order: faq.length + 1, status: "Aktif" },
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editDialog?.isNew ? "Tambah Item Baru" : "Edit Item"}</DialogTitle>
          </DialogHeader>
          {editDialog?.type === "alur" && (
            <div className="space-y-4">
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
              <div className="space-y-2"><label className="text-sm font-medium">Detail (satu per baris)</label>
                <Textarea value={(editDialog.data.details || []).join("\n")} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, details: e.target.value.split("\n") } })} rows={4} />
              </div>
            </div>
          )}
          {editDialog?.type === "jadwal" && (
            <div className="space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium">Gelombang</label><Input value={editDialog.data.wave} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, wave: e.target.value } })} /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Periode</label><Input value={editDialog.data.period} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, period: e.target.value } })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Tanggal Tes</label><Input value={editDialog.data.testDate} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, testDate: e.target.value } })} /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Tanggal Hasil</label><Input value={editDialog.data.resultDate} onChange={(e) => setEditDialog({ ...editDialog, data: { ...editDialog.data, resultDate: e.target.value } })} /></div>
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
