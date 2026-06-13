import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Settings2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export interface ManagedOption {
  value: string;
  label: string;
}

export function useManagedOptions(storageKey: string, defaults: ManagedOption[]) {
  const [options, setOptions] = useState<ManagedOption[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_e) { /* ignore */ }
    return defaults;
  });

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(options)); } catch (_e) { /* ignore */ }
  }, [storageKey, options]);

  return [options, setOptions] as const;
}

interface OptionsManagerProps {
  title: string;
  description?: string;
  triggerLabel: string;
  options: ManagedOption[];
  onChange: (next: ManagedOption[]) => void;
}

export function OptionsManager({ title, description, triggerLabel, options, onChange }: OptionsManagerProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [editingValue, setEditingValue] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");

  const existingValues = useMemo(() => new Set(options.map((o) => o.value.toLowerCase())), [options]);

  const handleAdd = () => {
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    if (existingValues.has(trimmed.toLowerCase())) {
      toast({ title: "Sudah ada / Already exists", variant: "destructive", duration: 2500 });
      return;
    }
    onChange([...options, { value: trimmed, label: trimmed }]);
    setNewLabel("");
    toast({ title: "Ditambahkan / Added", duration: 2000 });
  };

  const handleStartEdit = (opt: ManagedOption) => {
    setEditingValue(opt.value);
    setEditingLabel(opt.label);
  };

  const handleSaveEdit = () => {
    const trimmed = editingLabel.trim();
    if (!trimmed || !editingValue) return;
    onChange(
      options.map((o) => (o.value === editingValue ? { value: trimmed, label: trimmed } : o)),
    );
    setEditingValue(null);
    setEditingLabel("");
    toast({ title: "Diperbarui / Updated", duration: 2000 });
  };

  const handleDelete = (value: string) => {
    onChange(options.filter((o) => o.value !== value));
    toast({ title: "Dihapus / Deleted", duration: 2000 });
  };

  return (
    <>
      <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setOpen(true)}>
        <Settings2 className="h-3.5 w-3.5" />
        <span className="text-xs">{triggerLabel}</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Tambah item baru / Add new item"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }}
              />
              <Button onClick={handleAdd} size="sm" className="gap-1">
                <Plus className="h-4 w-4" /> Tambah
              </Button>
            </div>

            <div className="border rounded-lg divide-y max-h-[50vh] overflow-y-auto">
              {options.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Belum ada item / No items yet
                </div>
              ) : (
                options.map((opt) => (
                  <div key={opt.value} className="flex items-center justify-between gap-2 px-3 py-2">
                    {editingValue === opt.value ? (
                      <>
                        <Input
                          value={editingLabel}
                          onChange={(e) => setEditingLabel(e.target.value)}
                          className="h-8 text-sm"
                          autoFocus
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSaveEdit(); } }}
                        />
                        <div className="flex items-center gap-1 shrink-0">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleSaveEdit}>
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingValue(null)}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-medium">{opt.label}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleStartEdit(opt)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(opt.value)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Tutup / Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}