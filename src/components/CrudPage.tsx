import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import {
  Search, Plus, MoreHorizontal, ChevronLeft, ChevronRight, Pencil, Trash2,
  Filter, Upload, ImageIcon, X, Download, Send, FileSpreadsheet, Eye, CheckCircle2,
  CheckSquare, Square, ListFilter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { iconRegistry, iconKeys, getIconComponent } from "@/lib/iconMap";

export interface CrudColumn<T> {
  key: keyof T & string;
  label: string;
  className?: string;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface CrudFormField {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "date" | "textarea" | "image" | "icon_select";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface CrudFilter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

// Excel column mapping for import
export interface ExcelColumnMap {
  excelHeader: string[]; // possible header names in Excel (e.g. ["Nama", "Name", "nama"])
  dataKey: string; // key in data object
}

export interface ExcelConfig<T> {
  enabled: true;
  columnMap: ExcelColumnMap[];
  exportColumns: { header: string; key: keyof T & string }[];
  templateData?: Record<string, string>[];
  fileName?: string;
}

// ─── Image Upload Field Component ───
function ImageUploadField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    onChange(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt={label}
            className="w-full h-40 object-cover rounded-lg border"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
              className="h-8 text-xs"
            >
              <Upload className="h-3 w-3 mr-1" /> Ganti
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onChange("")}
              className="h-8 text-xs"
            >
              <X className="h-3 w-3 mr-1" /> Hapus
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 h-40 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/30 hover:border-primary/50 bg-muted/20"
          )}
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
          <div className="text-center">
            <p className="text-xs font-medium text-muted-foreground">
              Klik atau seret gambar ke sini
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
              PNG, JPG, WebP (maks. 5MB)
            </p>
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

interface CrudPageProps<T extends Record<string, any>> {
  title: string;
  subtitle: string;
  columns: CrudColumn<T>[];
  initialData: T[];
  formFields: CrudFormField[];
  searchPlaceholder: string;
  searchKeys: (keyof T & string)[];
  idKey: keyof T & string;
  addLabel: string;
  pageSize?: number;
  filters?: CrudFilter[];
  excelConfig?: ExcelConfig<T>;
  orderKey?: keyof T & string;
}

export function CrudPage<T extends Record<string, any>>({
  title, subtitle, columns, initialData, formFields, searchPlaceholder,
  searchKeys, idKey, addLabel, pageSize = 10, filters = [], excelConfig, orderKey,
}: CrudPageProps<T>) {
  const { toast } = useToast();
  const [data, setData] = useState<T[]>(initialData);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<T | null>(null);
  const [deleteItem, setDeleteItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Excel states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importData, setImportData] = useState<T[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmImportOpen, setConfirmImportOpen] = useState(false);
  const [importFileName, setImportFileName] = useState("");
  const [sendOpen, setSendOpen] = useState(false);
  const [sendMethod, setSendMethod] = useState<"whatsapp" | "email">("whatsapp");
  const [sendTarget, setSendTarget] = useState("");
  const [sendSelectedIds, setSendSelectedIds] = useState<Set<string>>(new Set());
  const [sendFilters, setSendFilters] = useState<Record<string, string>>({});
  const [sendSearch, setSendSearch] = useState("");

  const filtered = useMemo(() => {
    let result = data;
    for (const [key, value] of Object.entries(activeFilters)) {
      if (value && value !== "all") {
        result = result.filter((item) => String(item[key]) === value);
      }
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        searchKeys.some((key) => String(item[key]).toLowerCase().includes(q))
      );
    }
    return result;
  }, [data, search, searchKeys, activeFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / currentPageSize));
  const paginated = filtered.slice((page - 1) * currentPageSize, page * currentPageSize);

  const openAdd = () => {
    setEditItem(null);
    const defaults: Record<string, any> = {};
    formFields.forEach((f) => { defaults[f.key] = ""; });
    setFormData(defaults);
    setDialogOpen(true);
  };

  const openEdit = (item: T) => {
    setEditItem(item);
    setFormData({ ...item });
    setDialogOpen(true);
  };

  const openDelete = (item: T) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSave = () => {
    if (editItem) {
      setData((prev) =>
        prev.map((item) =>
          item[idKey] === editItem[idKey] ? { ...item, ...formData } as T : item
        )
      );
      toast({ title: "Data berhasil diperbarui / Data updated", duration: 2500 });
    } else {
      const newItem = { ...formData, [idKey]: `NEW-${Date.now()}` } as T;
      setData((prev) => [newItem, ...prev]);
      toast({ title: "Data berhasil ditambahkan / Data added", duration: 2500 });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item[idKey] !== deleteItem[idKey]));
      toast({ title: "Data berhasil dihapus / Data deleted", duration: 2500 });
    }
    setDeleteOpen(false);
  };

  // ─── Excel Functions ───
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!excelConfig) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryData = evt.target?.result;
      const workbook = XLSX.read(binaryData, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);

      const parsed: T[] = json.map((row, i) => {
        const obj: Record<string, any> = { [idKey]: `IMP-${Date.now()}-${i}` };
        for (const map of excelConfig.columnMap) {
          const foundKey = map.excelHeader.find((h) => row[h] !== undefined);
          obj[map.dataKey] = foundKey ? String(row[foundKey]) : "";
        }
        return obj as T;
      });

      setImportData(parsed);
      setPreviewOpen(true);
    };
    reader.readAsBinaryString(file);
    e.target.value = "";
  };

  const confirmImport = () => {
    setData((prev) => [...importData, ...prev]);
    toast({ title: `${importData.length} data berhasil diimpor`, duration: 2500 });
    setImportData([]);
    setPreviewOpen(false);
    setConfirmImportOpen(false);
  };

  const downloadExcel = (items: T[]) => {
    if (!excelConfig) return;
    const exportData = items.map((item) => {
      const row: Record<string, any> = {};
      for (const col of excelConfig.exportColumns) {
        row[col.header] = String(item[col.key] ?? "");
      }
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    const fileName = excelConfig.fileName || "data-export";
    XLSX.writeFile(wb, `${fileName}-${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast({ title: "File Excel berhasil diunduh", duration: 2500 });
  };

  const downloadTemplate = () => {
    if (!excelConfig?.templateData) return;
    const ws = XLSX.utils.json_to_sheet(excelConfig.templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, `template-import-${excelConfig.fileName || "data"}.xlsx`);
    toast({ title: "Template Excel berhasil diunduh", duration: 2500 });
  };

  // Filtered data for send dialog
  const sendFiltered = useMemo(() => {
    let result = data;
    for (const [key, value] of Object.entries(sendFilters)) {
      if (value && value !== "all") {
        result = result.filter((item) => String(item[key]) === value);
      }
    }
    if (sendSearch) {
      const q = sendSearch.toLowerCase();
      result = result.filter((item) =>
        searchKeys.some((key) => String(item[key]).toLowerCase().includes(q))
      );
    }
    return result;
  }, [data, sendFilters, sendSearch, searchKeys]);

  const sendFinalItems = useMemo(() => {
    if (sendSelectedIds.size === 0) return sendFiltered;
    return sendFiltered.filter((item) => sendSelectedIds.has(String(item[idKey])));
  }, [sendFiltered, sendSelectedIds, idKey]);

  const toggleSendSelect = (id: string) => {
    setSendSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSendSelectAll = () => {
    if (sendSelectedIds.size === sendFiltered.length) {
      setSendSelectedIds(new Set());
    } else {
      setSendSelectedIds(new Set(sendFiltered.map((item) => String(item[idKey]))));
    }
  };

  const openSendDialog = () => {
    setSendTarget("");
    setSendSearch("");
    setSendFilters({});
    setSendSelectedIds(new Set());
    setSendOpen(true);
  };

  const handleSend = () => {
    const itemsToSend = sendFinalItems;
    if (itemsToSend.length === 0) {
      toast({ title: "Tidak ada data untuk dikirim", variant: "destructive", duration: 2500 });
      return;
    }
    downloadExcel(itemsToSend);

    if (sendMethod === "whatsapp") {
      const message = encodeURIComponent(
        `📋 *Data ${title}*\n\nFile Excel berisi ${itemsToSend.length} data telah disiapkan.\nSilakan cek file yang terunduh.`
      );
      const url = sendTarget
        ? `https://wa.me/${sendTarget.replace(/[^0-9]/g, "")}?text=${message}`
        : `https://wa.me/?text=${message}`;
      window.open(url, "_blank");
    } else {
      const subject = encodeURIComponent(`Data ${title}`);
      const body = encodeURIComponent(
        `Assalamu'alaikum,\n\nTerlampir file Excel berisi data ${title.toLowerCase()}.\nTotal: ${itemsToSend.length} data.\n\nJazakumullah khairan.`
      );
      window.open(`mailto:${sendTarget}?subject=${subject}&body=${body}`, "_self");
    }

    setSendOpen(false);
    toast({ title: `${itemsToSend.length} data berhasil dikirim via ${sendMethod === "whatsapp" ? "WhatsApp" : "Email"}`, duration: 2500 });
  };

  const renderFormField = (field: CrudFormField) => {
    const value = formData[field.key] ?? "";
    switch (field.type) {
      case "image":
        return (
          <ImageUploadField
            value={value}
            onChange={(url) => setFormData((p) => ({ ...p, [field.key]: url }))}
            label={field.label}
          />
        );
      case "icon_select": {
        const SelectedIcon = getIconComponent(value);
        return (
          <div className="space-y-2">
            {value && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 w-fit">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <SelectedIcon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{value}</span>
              </div>
            )}
            <div className="grid grid-cols-6 gap-1.5 max-h-40 overflow-y-auto p-1">
              {iconKeys.map((key) => {
                const Ic = iconRegistry[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, [field.key]: key }))}
                    className={cn(
                      "flex flex-col items-center gap-0.5 p-2 rounded-lg border transition-all text-[10px]",
                      value === key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-transparent hover:border-muted-foreground/20 hover:bg-muted/50 text-muted-foreground"
                    )}
                    title={key}
                  >
                    <Ic className="h-4 w-4" />
                    <span className="truncate w-full text-center">{key.replace(/([A-Z])/g, ' $1').trim().split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      }
      case "select":
        return (
          <Select value={String(value)} onValueChange={(v) => setFormData((p) => ({ ...p, [field.key]: v }))}>
            <SelectTrigger><SelectValue placeholder={field.placeholder || "Pilih..."} /></SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
            placeholder={field.placeholder}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
            placeholder={field.placeholder}
          />
        );
      case "date":
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
          />
        );
      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6">
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border bg-card pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {excelConfig && (
              <>
                {excelConfig.templateData && (
                  <Button size="sm" variant="outline" onClick={downloadTemplate}>
                    <FileSpreadsheet className="h-4 w-4 mr-1" /> Template
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-1" /> Import
                </Button>
                <Button size="sm" variant="outline" onClick={() => downloadExcel(filtered)}>
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
                <Button size="sm" variant="outline" onClick={openSendDialog}>
                  <Send className="h-4 w-4 mr-1" /> Kirim
                </Button>
              </>
            )}
            <Button size="sm" onClick={openAdd}>
              <Plus className="h-4 w-4 mr-1" />
              {addLabel}
            </Button>
          </div>
        </div>
        {filters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {filters.map((filter) => (
              <Select
                key={filter.key}
                value={activeFilters[filter.key] || "all"}
                onValueChange={(v) => {
                  setActiveFilters((prev) => ({ ...prev, [filter.key]: v }));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-auto min-w-[120px] text-xs">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua {filter.label}</SelectItem>
                  {filter.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
            {Object.values(activeFilters).some((v) => v && v !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-muted-foreground"
                onClick={() => { setActiveFilters({}); setPage(1); }}
              >
                Reset Filter
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input for Excel import */}
      {excelConfig && (
        <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileUpload} />
      )}

      <div className="bg-card border rounded-xl shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead key={col.key} className={cn("text-xs", col.className)}>
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="text-xs w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center text-sm text-muted-foreground py-8">
                  Tidak ada data / No data found
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((item) => (
                <TableRow key={String(item[idKey])}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={cn("text-sm", col.className)}>
                      {col.render ? col.render(item[col.key], item) : String(item[col.key])}
                    </TableCell>
                  ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(item)}>
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDelete(item)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" /> Hapus / Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-4 py-3 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>
              {filtered.length > 0
                ? `Menampilkan ${(page - 1) * currentPageSize + 1}-${Math.min(page * currentPageSize, filtered.length)} dari ${filtered.length}`
                : "Tidak ada data"}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground/70">Baris:</span>
              <Select value={String(currentPageSize)} onValueChange={(v) => { setCurrentPageSize(Number(v)); setPage(1); }}>
                <SelectTrigger className="h-7 w-[70px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20, 25, 50].map((size) => (
                    <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-muted disabled:opacity-30" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn("px-2 py-1 rounded", p === page ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted")}
              >
                {p}
              </button>
            ))}
            <button className="p-1 rounded hover:bg-muted disabled:opacity-30" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Data" : "Tambah Data / Add Data"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {formFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label>{field.label}</Label>
                {renderFormField(field)}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal / Cancel</Button>
            <Button onClick={handleSave}>Simpan / Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data / Delete Data</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan. / Are you sure? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal / Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus / Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── Import Preview Dialog ─── */}
      {excelConfig && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" /> Preview Import: {importFileName}
              </DialogTitle>
              <DialogDescription>
                {importData.length} data terdeteksi. Periksa sebelum mengkonfirmasi.
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((col) => (
                      <TableHead key={col.key} className="text-xs">{col.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importData.map((row, idx) => (
                    <TableRow key={idx}>
                      {columns.map((col) => (
                        <TableCell key={col.key} className="text-sm">
                          {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => { setPreviewOpen(false); setImportData([]); }}>
                <X className="h-4 w-4 mr-1" /> Batal
              </Button>
              <Button onClick={() => { setPreviewOpen(false); setConfirmImportOpen(true); }}>
                <CheckCircle2 className="h-4 w-4 mr-1" /> Konfirmasi Import
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ─── Confirm Import Dialog ─── */}
      {excelConfig && (
        <AlertDialog open={confirmImportOpen} onOpenChange={setConfirmImportOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Import Data</AlertDialogTitle>
              <AlertDialogDescription>
                Anda akan mengimpor <strong>{importData.length} data</strong> baru. Lanjutkan?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={confirmImport}>Ya, Import Sekarang</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* ─── Send Dialog ─── */}
      {excelConfig && (
        <Dialog open={sendOpen} onOpenChange={setSendOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" /> Kirim Data via WhatsApp / Email
              </DialogTitle>
              <DialogDescription>
                Pilih data yang ingin dikirim, atau kirim semua hasil filter.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 flex-1 overflow-hidden flex flex-col">
              {/* Send method tabs */}
              <Tabs value={sendMethod} onValueChange={(v) => setSendMethod(v as "whatsapp" | "email")}>
                <TabsList className="w-full">
                  <TabsTrigger value="whatsapp" className="flex-1">WhatsApp</TabsTrigger>
                  <TabsTrigger value="email" className="flex-1">Email</TabsTrigger>
                </TabsList>
                <TabsContent value="whatsapp" className="mt-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Nomor WhatsApp / Grup (opsional)</Label>
                    <Input
                      placeholder="6281234567890"
                      value={sendTarget}
                      onChange={(e) => setSendTarget(e.target.value)}
                    />
                    <p className="text-[11px] text-muted-foreground">Kosongkan untuk memilih kontak di WhatsApp</p>
                  </div>
                </TabsContent>
                <TabsContent value="email" className="mt-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Alamat Email</Label>
                    <Input
                      type="email"
                      placeholder="admin@pesantren.id"
                      value={sendTarget}
                      onChange={(e) => setSendTarget(e.target.value)}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Filter bar inside send dialog */}
              <div className="flex flex-wrap items-center gap-2 border rounded-lg p-2 bg-muted/30">
                <ListFilter className="h-4 w-4 text-muted-foreground" />
                <div className="relative flex-1 min-w-[140px]">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <input
                    type="text"
                    value={sendSearch}
                    onChange={(e) => setSendSearch(e.target.value)}
                    placeholder="Cari..."
                    className="w-full rounded border bg-background pl-7 pr-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                {filters.map((filter) => (
                  <Select
                    key={filter.key}
                    value={sendFilters[filter.key] || "all"}
                    onValueChange={(v) => {
                      setSendFilters((prev) => ({ ...prev, [filter.key]: v }));
                      setSendSelectedIds(new Set());
                    }}
                  >
                    <SelectTrigger className="h-7 w-auto min-w-[100px] text-xs">
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua {filter.label}</SelectItem>
                      {filter.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}
                {(sendSearch || Object.values(sendFilters).some((v) => v && v !== "all")) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[11px] text-muted-foreground"
                    onClick={() => { setSendFilters({}); setSendSearch(""); setSendSelectedIds(new Set()); }}
                  >
                    Reset
                  </Button>
                )}
              </div>

              {/* Summary */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {sendSelectedIds.size > 0
                    ? `${sendSelectedIds.size} dari ${sendFiltered.length} dipilih`
                    : `${sendFiltered.length} data (semua akan dikirim)`}
                </span>
                <Button variant="ghost" size="sm" className="h-6 text-[11px]" onClick={toggleSendSelectAll}>
                  {sendSelectedIds.size === sendFiltered.length && sendFiltered.length > 0 ? (
                    <><CheckSquare className="h-3 w-3 mr-1" /> Batal Pilih Semua</>
                  ) : (
                    <><Square className="h-3 w-3 mr-1" /> Pilih Semua</>
                  )}
                </Button>
              </div>

              {/* Selectable data table */}
              <div className="flex-1 overflow-auto border rounded-lg max-h-[280px]">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-8 text-xs"></TableHead>
                      {columns.slice(0, 5).map((col) => (
                        <TableHead key={col.key} className="text-xs">{col.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sendFiltered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-xs text-muted-foreground py-6">
                          Tidak ada data sesuai filter
                        </TableCell>
                      </TableRow>
                    ) : (
                      sendFiltered.map((item) => {
                        const itemId = String(item[idKey]);
                        const isSelected = sendSelectedIds.has(itemId);
                        return (
                          <TableRow
                            key={itemId}
                            className={cn("cursor-pointer", isSelected && "bg-primary/5")}
                            onClick={() => toggleSendSelect(itemId)}
                          >
                            <TableCell className="w-8 pr-0">
                              {isSelected ? (
                                <CheckSquare className="h-4 w-4 text-primary" />
                              ) : (
                                <Square className="h-4 w-4 text-muted-foreground/40" />
                              )}
                            </TableCell>
                            {columns.slice(0, 5).map((col) => (
                              <TableCell key={col.key} className="text-xs">
                                {col.render ? col.render(item[col.key], item) : String(item[col.key] ?? "")}
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <DialogFooter className="border-t pt-3">
              <Button variant="outline" onClick={() => setSendOpen(false)}>Batal</Button>
              <Button onClick={handleSend} disabled={sendFinalItems.length === 0}>
                <Send className="h-4 w-4 mr-1" /> Kirim {sendFinalItems.length} Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}
