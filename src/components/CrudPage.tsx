import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Plus, MoreHorizontal, ChevronLeft, ChevronRight, Pencil, Trash2, Filter, Upload, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface CrudColumn<T> {
  key: keyof T & string;
  label: string;
  className?: string;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface CrudFormField {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "date" | "textarea" | "image";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface CrudFilter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
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
}

export function CrudPage<T extends Record<string, any>>({
  title, subtitle, columns, initialData, formFields, searchPlaceholder,
  searchKeys, idKey, addLabel, pageSize = 10, filters = [],
}: CrudPageProps<T>) {
  const { toast } = useToast();
  const [data, setData] = useState<T[]>(initialData);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<T | null>(null);
  const [deleteItem, setDeleteItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

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
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4 mr-1" />
            {addLabel}
          </Button>
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
          <span>
            {filtered.length > 0
              ? `Menampilkan ${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, filtered.length)} dari ${filtered.length}`
              : "Tidak ada data"}
          </span>
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
    </motion.div>
  );
}
