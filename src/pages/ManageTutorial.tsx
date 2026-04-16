import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, ChevronDown, ChevronRight, GripVertical,
  BookOpen, Users, GraduationCap, Save, RotateCcw, Eye, EyeOff,
  AlertTriangle, Lock, Copy, ArrowUp, ArrowDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// ─── Types ───
type UserType = "admin" | "guardian" | "student";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
  tips?: string;
  isVisible: boolean;
}

interface TutorialSection {
  id: string;
  title: string;
  steps: TutorialStep[];
  isVisible: boolean;
}

interface TutorialData {
  admin: TutorialSection[];
  guardian: TutorialSection[];
  student: TutorialSection[];
  faq: { id: string; question: string; answer: string; isVisible: boolean }[];
}

const TUTORIAL_DATA_KEY = "managed_tutorial_data";
const DEV_PASSWORD = "developerganteng";

// ─── Icon options ───
const iconOptions = [
  "LogIn", "LayoutDashboard", "Users", "UserPlus", "Building2", "School",
  "ListChecks", "Star", "FileText", "CalendarCheck", "DoorOpen", "Package",
  "CreditCard", "ClipboardCheck", "PiggyBank", "Wallet", "Globe", "Image",
  "Newspaper", "MessageSquare", "BookOpen", "UserCog", "Settings", "Eye",
  "BarChart3", "Clock", "GraduationCap", "Upload"
];

// ─── Default data ───
function getDefaultData(): TutorialData {
  return {
    admin: [
      {
        id: "sec-admin-1",
        title: "Memulai & Login",
        isVisible: true,
        steps: [
          {
            id: "admin-login",
            title: "Login ke Dashboard Admin",
            description: "Akses halaman login admin untuk masuk ke sistem manajemen pesantren.",
            icon: "LogIn",
            details: [
              "Buka halaman /login/admin di browser",
              "Pilih role Anda (Super Admin, Branch Admin, Treasurer, dll.)",
              "Masukkan kredensial yang telah diberikan",
              "Anda akan diarahkan ke dashboard sesuai dengan hak akses role Anda"
            ],
            tips: "Super Admin memiliki akses penuh ke seluruh fitur.",
            isVisible: true
          },
          {
            id: "admin-dashboard",
            title: "Memahami Dashboard",
            description: "Dashboard menampilkan ringkasan data penting pesantren secara real-time.",
            icon: "LayoutDashboard",
            details: [
              "Lihat statistik jumlah santri, kelas, dan cabang aktif",
              "Pantau ringkasan keuangan (pembayaran, tabungan, pengeluaran)",
              "Akses menu navigasi di sidebar kiri untuk fitur spesifik",
              "Gunakan tombol toggle untuk menyembunyikan/menampilkan sidebar"
            ],
            isVisible: true
          }
        ]
      }
    ],
    guardian: [
      {
        id: "sec-guardian-1",
        title: "Memulai",
        isVisible: true,
        steps: [
          {
            id: "guardian-login",
            title: "Login sebagai Wali Santri",
            description: "Masuk ke portal wali untuk memantau perkembangan anak Anda.",
            icon: "LogIn",
            details: [
              "Buka halaman /login di browser",
              "Pilih 'Wali Santri' sebagai jenis akun",
              "Masukkan email dan password yang telah terdaftar"
            ],
            tips: "Hubungi pihak pesantren jika Anda belum memiliki akun.",
            isVisible: true
          }
        ]
      }
    ],
    student: [
      {
        id: "sec-student-1",
        title: "Memulai",
        isVisible: true,
        steps: [
          {
            id: "student-login",
            title: "Login sebagai Santri",
            description: "Masuk ke portal santri untuk melihat jadwal dan nilai.",
            icon: "LogIn",
            details: [
              "Buka halaman /login di browser",
              "Pilih 'Santri' sebagai jenis akun",
              "Masukkan email dan password yang telah terdaftar"
            ],
            isVisible: true
          }
        ]
      }
    ],
    faq: [
      { id: "faq-1", question: "Bagaimana cara reset password?", answer: "Hubungi administrator pesantren untuk mereset password Anda.", isVisible: true },
      { id: "faq-2", question: "Apakah data bisa diakses offline?", answer: "Tidak, aplikasi ini memerlukan koneksi internet.", isVisible: true },
    ]
  };
}

function loadTutorialData(): TutorialData {
  try {
    const raw = localStorage.getItem(TUTORIAL_DATA_KEY);
    return raw ? JSON.parse(raw) : getDefaultData();
  } catch {
    return getDefaultData();
  }
}

function saveTutorialData(data: TutorialData) {
  localStorage.setItem(TUTORIAL_DATA_KEY, JSON.stringify(data));
}

function generateId() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const userTypeLabels: Record<UserType, { label: string; icon: typeof BookOpen }> = {
  admin: { label: "Administrator", icon: GraduationCap },
  guardian: { label: "Wali Santri", icon: Users },
  student: { label: "Santri", icon: BookOpen },
};

// ─── Step Editor Dialog ───
function StepEditorDialog({ open, onOpenChange, step, onSave }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step: TutorialStep | null;
  onSave: (step: TutorialStep) => void;
}) {
  const [form, setForm] = useState<TutorialStep>({
    id: "", title: "", description: "", icon: "BookOpen", details: [""], tips: "", isVisible: true
  });

  useEffect(() => {
    if (step) {
      setForm({ ...step, details: step.details.length > 0 ? [...step.details] : [""] });
    } else {
      setForm({ id: generateId(), title: "", description: "", icon: "BookOpen", details: [""], tips: "", isVisible: true });
    }
  }, [step, open]);

  const addDetail = () => setForm(f => ({ ...f, details: [...f.details, ""] }));
  const removeDetail = (i: number) => setForm(f => ({ ...f, details: f.details.filter((_, idx) => idx !== i) }));
  const updateDetail = (i: number, val: string) => setForm(f => ({ ...f, details: f.details.map((d, idx) => idx === i ? val : d) }));

  const handleSave = () => {
    if (!form.title.trim()) { toast.error("Judul wajib diisi"); return; }
    onSave({ ...form, details: form.details.filter(d => d.trim()) });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{step ? "Edit Langkah" : "Tambah Langkah Baru"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Judul / Title *</Label>
            <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Login ke Dashboard" />
          </div>
          <div className="space-y-2">
            <Label>Deskripsi / Description</Label>
            <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Penjelasan singkat..." rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Ikon / Icon</Label>
            <Select value={form.icon} onValueChange={v => setForm(f => ({ ...f, icon: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {iconOptions.map(ic => (
                  <SelectItem key={ic} value={ic}>{ic}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Detail Langkah / Steps</Label>
              <Button variant="outline" size="sm" onClick={addDetail} className="h-7 text-xs">
                <Plus className="h-3 w-3 mr-1" /> Tambah
              </Button>
            </div>
            <div className="space-y-2">
              {form.details.map((d, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-xs text-muted-foreground mt-2.5 shrink-0 w-5">{i + 1}.</span>
                  <Input value={d} onChange={e => updateDetail(i, e.target.value)} placeholder={`Langkah ${i + 1}...`} className="flex-1" />
                  {form.details.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => removeDetail(i)} className="h-9 w-9 p-0 text-destructive hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tips (opsional)</Label>
            <Input value={form.tips || ""} onChange={e => setForm(f => ({ ...f, tips: e.target.value }))} placeholder="Tips tambahan..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-1.5" /> Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Section Editor ───
function SectionEditor({ section, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: {
  section: TutorialSection;
  onUpdate: (section: TutorialSection) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(section.title);
  const [stepDialogOpen, setStepDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<TutorialStep | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleSaveTitle = () => {
    onUpdate({ ...section, title: titleDraft });
    setEditingTitle(false);
    toast.success("Judul seksi diperbarui");
  };

  const handleSaveStep = (step: TutorialStep) => {
    const exists = section.steps.find(s => s.id === step.id);
    const newSteps = exists
      ? section.steps.map(s => s.id === step.id ? step : s)
      : [...section.steps, step];
    onUpdate({ ...section, steps: newSteps });
    toast.success(exists ? "Langkah diperbarui" : "Langkah ditambahkan");
  };

  const handleDeleteStep = (stepId: string) => {
    onUpdate({ ...section, steps: section.steps.filter(s => s.id !== stepId) });
    toast.success("Langkah dihapus");
  };

  const moveStep = (index: number, direction: -1 | 1) => {
    const newSteps = [...section.steps];
    const target = index + direction;
    if (target < 0 || target >= newSteps.length) return;
    [newSteps[index], newSteps[target]] = [newSteps[target], newSteps[index]];
    onUpdate({ ...section, steps: newSteps });
  };

  return (
    <>
      <Card className={`border ${!section.isVisible ? "opacity-60" : ""}`}>
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <button onClick={() => setExpanded(!expanded)} className="shrink-0">
                {expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </button>
              {editingTitle ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input value={titleDraft} onChange={e => setTitleDraft(e.target.value)} className="h-8 text-sm" onKeyDown={e => e.key === "Enter" && handleSaveTitle()} autoFocus />
                  <Button size="sm" variant="ghost" onClick={handleSaveTitle} className="h-8 px-2"><Save className="h-3.5 w-3.5" /></Button>
                </div>
              ) : (
                <CardTitle className="text-sm font-semibold truncate cursor-pointer" onDoubleClick={() => setEditingTitle(true)}>
                  {section.title}
                </CardTitle>
              )}
              <Badge variant="secondary" className="text-[10px] shrink-0">{section.steps.length} langkah</Badge>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onUpdate({ ...section, isVisible: !section.isVisible })} title={section.isVisible ? "Sembunyikan" : "Tampilkan"}>
                {section.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={isFirst} onClick={onMoveUp}><ArrowUp className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={isLast} onClick={onMoveDown}><ArrowDown className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setEditingTitle(true)}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => setDeleteConfirm(true)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
              <CardContent className="px-4 pt-0 pb-4 space-y-3">
                <Separator />
                {section.steps.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">Belum ada langkah. Klik tombol di bawah untuk menambahkan.</p>
                ) : (
                  <div className="space-y-2">
                    {section.steps.map((step, idx) => (
                      <div key={step.id} className={`flex items-center gap-3 p-3 rounded-lg border bg-muted/20 ${!step.isVisible ? "opacity-50" : ""}`}>
                        <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{step.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-[9px]">{step.icon}</Badge>
                            <span className="text-[10px] text-muted-foreground">{step.details.length} detail</span>
                            {step.tips && <span className="text-[10px] text-primary">+ tips</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={idx === 0} onClick={() => moveStep(idx, -1)}><ArrowUp className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={idx === section.steps.length - 1} onClick={() => moveStep(idx, 1)}><ArrowDown className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => {
                            onUpdate({ ...section, steps: section.steps.map(s => s.id === step.id ? { ...s, isVisible: !s.isVisible } : s) });
                          }}>
                            {step.isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3 text-muted-foreground" />}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setEditingStep(step); setStepDialogOpen(true); }}><Pencil className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => handleDeleteStep(step.id)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button variant="outline" size="sm" className="w-full" onClick={() => { setEditingStep(null); setStepDialogOpen(true); }}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Tambah Langkah
                </Button>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <StepEditorDialog open={stepDialogOpen} onOpenChange={setStepDialogOpen} step={editingStep} onSave={handleSaveStep} />

      <AlertDialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Seksi "{section.title}"?</AlertDialogTitle>
            <AlertDialogDescription>Semua langkah dalam seksi ini akan ikut terhapus. Aksi ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={onDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── FAQ Manager ───
function FaqManager({ faq, onUpdate }: {
  faq: TutorialData["faq"];
  onUpdate: (faq: TutorialData["faq"]) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<TutorialData["faq"][0] | null>(null);
  const [form, setForm] = useState({ question: "", answer: "" });

  const handleAdd = () => {
    setEditingFaq(null);
    setForm({ question: "", answer: "" });
    setDialogOpen(true);
  };

  const handleEdit = (item: TutorialData["faq"][0]) => {
    setEditingFaq(item);
    setForm({ question: item.question, answer: item.answer });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.question.trim() || !form.answer.trim()) { toast.error("Pertanyaan dan jawaban wajib diisi"); return; }
    if (editingFaq) {
      onUpdate(faq.map(f => f.id === editingFaq.id ? { ...f, ...form } : f));
    } else {
      onUpdate([...faq, { id: generateId(), ...form, isVisible: true }]);
    }
    setDialogOpen(false);
    toast.success(editingFaq ? "FAQ diperbarui" : "FAQ ditambahkan");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">FAQ ({faq.length})</h3>
        <Button variant="outline" size="sm" onClick={handleAdd}><Plus className="h-3.5 w-3.5 mr-1" /> Tambah FAQ</Button>
      </div>
      {faq.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-8">Belum ada FAQ.</p>
      ) : (
        <div className="space-y-2">
          {faq.map(item => (
            <div key={item.id} className={`p-3 rounded-lg border bg-card ${!item.isVisible ? "opacity-50" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.question}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.answer}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onUpdate(faq.map(f => f.id === item.id ? { ...f, isVisible: !f.isVisible } : f))}>
                    {item.isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleEdit(item)}><Pencil className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => { onUpdate(faq.filter(f => f.id !== item.id)); toast.success("FAQ dihapus"); }}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingFaq ? "Edit FAQ" : "Tambah FAQ"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Pertanyaan</Label>
              <Input value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} placeholder="Bagaimana cara...?" />
            </div>
            <div className="space-y-2">
              <Label>Jawaban</Label>
              <Textarea value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} placeholder="Jawaban..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Main Page ───
const ManageTutorial = () => {
  const [devPasswordInput, setDevPasswordInput] = useState("");
  const [devUnlocked, setDevUnlocked] = useState(false);
  const [devPasswordError, setDevPasswordError] = useState(false);
  const [activeTab, setActiveTab] = useState<UserType>("admin");
  const [data, setData] = useState<TutorialData>(loadTutorialData);
  const [hasChanges, setHasChanges] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleDevPasswordSubmit = () => {
    if (devPasswordInput === DEV_PASSWORD) {
      setDevUnlocked(true);
      setDevPasswordError(false);
      toast.success("Akses diberikan / Access granted");
    } else {
      setDevPasswordError(true);
    }
  };

  const updateData = (newData: TutorialData) => {
    setData(newData);
    setHasChanges(true);
  };

  const handleSave = () => {
    saveTutorialData(data);
    setHasChanges(false);
    toast.success("Data tutorial berhasil disimpan ke localStorage");
  };

  const handleReset = () => {
    const defaultData = getDefaultData();
    setData(defaultData);
    saveTutorialData(defaultData);
    setHasChanges(false);
    setResetConfirm(false);
    toast.success("Data tutorial direset ke default");
  };

  const addSection = () => {
    const newSection: TutorialSection = {
      id: generateId(),
      title: "Seksi Baru",
      steps: [],
      isVisible: true
    };
    updateData({ ...data, [activeTab]: [...data[activeTab], newSection] });
    toast.success("Seksi baru ditambahkan");
  };

  const updateSection = (index: number, section: TutorialSection) => {
    const sections = [...data[activeTab]];
    sections[index] = section;
    updateData({ ...data, [activeTab]: sections });
  };

  const deleteSection = (index: number) => {
    const sections = data[activeTab].filter((_, i) => i !== index);
    updateData({ ...data, [activeTab]: sections });
    toast.success("Seksi dihapus");
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const sections = [...data[activeTab]];
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    [sections[index], sections[target]] = [sections[target], sections[index]];
    updateData({ ...data, [activeTab]: sections });
  };

  // Stats
  const totalSteps = data.admin.reduce((s, sec) => s + sec.steps.length, 0)
    + data.guardian.reduce((s, sec) => s + sec.steps.length, 0)
    + data.student.reduce((s, sec) => s + sec.steps.length, 0);
  const totalSections = data.admin.length + data.guardian.length + data.student.length;

  if (!devUnlocked) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-lg font-bold">Kelola Tutorial / Manage Tutorial</h1>
          <p className="text-sm text-muted-foreground">Kelola konten halaman tutorial untuk semua pengguna</p>
        </div>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="bg-card border rounded-xl p-8 shadow-card flex flex-col items-center gap-5 max-w-md w-full">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10">
              <Lock className="h-8 w-8 text-warning" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-foreground mb-1">Akses Developer / Developer Access</h3>
              <p className="text-sm text-muted-foreground">Halaman ini memerlukan password developer untuk mengelola konten tutorial.</p>
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
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold">Kelola Tutorial / Manage Tutorial</h1>
          <p className="text-sm text-muted-foreground">Kelola konten halaman tutorial untuk semua pengguna</p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && <Badge variant="outline" className="text-[10px] text-warning border-warning">Belum disimpan</Badge>}
          <Button variant="outline" size="sm" onClick={() => setResetConfirm(true)}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reset
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-3.5 w-3.5 mr-1.5" /> Simpan
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border rounded-xl p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Seksi</p>
          <p className="text-xl font-bold text-foreground">{totalSections}</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Langkah</p>
          <p className="text-xl font-bold text-foreground">{totalSteps}</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">FAQ</p>
          <p className="text-xl font-bold text-foreground">{data.faq.length}</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Storage</p>
          <p className="text-xl font-bold text-foreground">localStorage</p>
        </div>
      </div>

      <div className="max-w-5xl">
        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as UserType)}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              {(Object.keys(userTypeLabels) as UserType[]).map(type => {
                const config = userTypeLabels[type];
                return (
                  <TabsTrigger key={type} value={type} className="gap-1.5 text-xs">
                    <config.icon className="h-3.5 w-3.5" /> {config.label} ({data[type].length})
                  </TabsTrigger>
                );
              })}
              <TabsTrigger value={"faq" as any} className="gap-1.5 text-xs">FAQ ({data.faq.length})</TabsTrigger>
            </TabsList>
          </div>

          {(Object.keys(userTypeLabels) as UserType[]).map(type => (
            <TabsContent key={type} value={type} className="space-y-3 mt-0">
              {data[type].length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground mb-3">Belum ada seksi tutorial untuk {userTypeLabels[type].label}.</p>
                </div>
              ) : (
                data[type].map((section, idx) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    onUpdate={s => updateSection(idx, s)}
                    onDelete={() => deleteSection(idx)}
                    onMoveUp={() => moveSection(idx, -1)}
                    onMoveDown={() => moveSection(idx, 1)}
                    isFirst={idx === 0}
                    isLast={idx === data[type].length - 1}
                  />
                ))
              )}
              <Button variant="outline" className="w-full" onClick={addSection}>
                <Plus className="h-4 w-4 mr-1.5" /> Tambah Seksi Baru
              </Button>
            </TabsContent>
          ))}

          <TabsContent value={"faq" as any} className="mt-0">
            <FaqManager faq={data.faq} onUpdate={faq => updateData({ ...data, faq })} />
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={resetConfirm} onOpenChange={setResetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset semua data tutorial?</AlertDialogTitle>
            <AlertDialogDescription>Semua perubahan akan dihapus dan dikembalikan ke data default. Aksi ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleReset}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default ManageTutorial;
