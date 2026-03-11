import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Calendar,
  Users,
  Filter,
} from "lucide-react";
import { format, startOfWeek, addDays, subWeeks, addWeeks, isSameDay, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";

type Status = "Hadir" | "Sakit" | "Izin" | "Alpha";

interface AttendanceRecord {
  id: string;
  date: string;
  student: string;
  class: string;
  status: Status;
}

const students = [
  { name: "Ahmad Fauzi", class: "X-A" },
  { name: "Siti Aisyah", class: "X-B" },
  { name: "Muhammad Rizki", class: "XI-A" },
  { name: "Fatimah Zahra", class: "XII-A" },
  { name: "Umar Hadi", class: "XI-B" },
  { name: "Khadijah Nur", class: "X-A" },
  { name: "Ibrahim Malik", class: "XII-B" },
  { name: "Aisyah Putri", class: "X-C" },
  { name: "Zainab Amira", class: "XI-A" },
  { name: "Yusuf Rahman", class: "XII-A" },
];

// Generate mock data for the current week
const generateMockData = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const statuses: Status[] = ["Hadir", "Hadir", "Hadir", "Hadir", "Hadir", "Sakit", "Izin", "Alpha"];
  let id = 1;

  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const date = addDays(new Date(2026, 2, 2), dayOffset); // Start from March 2
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) continue; // Skip Sunday

    students.forEach((student) => {
      records.push({
        id: `ATT${String(id++).padStart(3, "0")}`,
        date: format(date, "yyyy-MM-dd"),
        student: student.name,
        class: student.class,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });
    });
  }
  return records;
};

const mockData = generateMockData();

const statusConfig: Record<Status, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  Hadir: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 border-green-200 text-green-700", label: "Hadir" },
  Sakit: { icon: AlertCircle, color: "text-blue-600", bg: "bg-blue-50 border-blue-200 text-blue-700", label: "Sakit" },
  Izin: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border-amber-200 text-amber-700", label: "Izin" },
  Alpha: { icon: XCircle, color: "text-red-600", bg: "bg-red-50 border-red-200 text-red-700", label: "Alpha" },
};

const StatusBadge = ({ status }: { status: Status }) => {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium", cfg.bg)}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
};

const StatusDot = ({ status, onClick }: { status: Status | null; onClick?: () => void }) => {
  if (!status) {
    return (
      <button onClick={onClick} className="h-8 w-8 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center hover:border-primary/40 transition-colors">
        <span className="text-muted-foreground/30 text-xs">—</span>
      </button>
    );
  }
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <button onClick={onClick} className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-all hover:scale-110", cfg.bg)} title={cfg.label}>
      <Icon className="h-4 w-4" />
    </button>
  );
};

const Attendance = () => {
  const { toast } = useToast();
  const [data, setData] = useState<AttendanceRecord[]>(mockData);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(2026, 2, 9), { weekStartsOn: 1 }));
  const [classFilter, setClassFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{ student: string; date: string; currentStatus: Status | null } | null>(null);

  const weekDays = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => addDays(currentWeekStart, i)); // Mon-Sat
  }, [currentWeekStart]);

  const classes = useMemo(() => {
    const unique = [...new Set(students.map((s) => s.class))].sort();
    return unique;
  }, []);

  const filteredStudents = useMemo(() => {
    if (classFilter === "all") return students;
    return students.filter((s) => s.class === classFilter);
  }, [classFilter]);

  const getStatus = (studentName: string, date: Date): Status | null => {
    const dateStr = format(date, "yyyy-MM-dd");
    const record = data.find((r) => r.student === studentName && r.date === dateStr);
    return record?.status ?? null;
  };

  const handleCellClick = (student: string, date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const currentStatus = getStatus(student, date);
    setEditingCell({ student, date: dateStr, currentStatus });
    setDialogOpen(true);
  };

  const handleStatusChange = (status: Status) => {
    if (!editingCell) return;
    const { student, date } = editingCell;
    const studentInfo = students.find((s) => s.name === student);

    setData((prev) => {
      const existing = prev.findIndex((r) => r.student === student && r.date === date);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], status };
        return updated;
      }
      return [
        ...prev,
        {
          id: `ATT-${Date.now()}`,
          date,
          student,
          class: studentInfo?.class || "",
          status,
        },
      ];
    });

    toast({ title: `Absensi ${student} diperbarui menjadi ${status}` });
    setDialogOpen(false);
    setEditingCell(null);
  };

  // Summary stats for the week
  const weekStats = useMemo(() => {
    const stats = { Hadir: 0, Sakit: 0, Izin: 0, Alpha: 0, total: 0 };
    filteredStudents.forEach((student) => {
      weekDays.forEach((day) => {
        const status = getStatus(student.name, day);
        if (status) {
          stats[status]++;
          stats.total++;
        }
      });
    });
    return stats;
  }, [data, filteredStudents, weekDays]);

  const today = new Date(2026, 2, 11); // Current date from context

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-foreground">Absensi / Attendance</h1>
        <p className="text-sm text-muted-foreground">Kelola kehadiran santri per minggu</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["Hadir", "Sakit", "Izin", "Alpha"] as Status[]).map((status) => {
          const cfg = statusConfig[status];
          const Icon = cfg.icon;
          const count = weekStats[status];
          const pct = weekStats.total > 0 ? Math.round((count / weekStats.total) * 100) : 0;
          return (
            <div key={status} className="bg-card border rounded-xl p-4 flex items-center gap-3">
              <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", cfg.bg)}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{count}</p>
                <p className="text-[11px] text-muted-foreground">{cfg.label} ({pct}%)</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Week Navigator */}
        <div className="flex items-center gap-2 bg-card border rounded-xl px-3 py-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentWeekStart((w) => subWeeks(w, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground min-w-[200px] justify-center">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(weekDays[0], "d MMM", { locale: idLocale })} — {format(weekDays[5], "d MMM yyyy", { locale: idLocale })}
            </span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentWeekStart((w) => addWeeks(w, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Semua Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Attendance Grid Table */}
      <div className="bg-card border rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wider sticky left-0 bg-muted/30 z-10 min-w-[180px]">
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" />
                    Santri
                  </div>
                </th>
                <th className="px-2 py-3 font-medium text-muted-foreground text-xs min-w-[60px]">Kelas</th>
                {weekDays.map((day) => {
                  const isToday = isSameDay(day, today);
                  const dayName = format(day, "EEE", { locale: idLocale });
                  const dayNum = format(day, "d");
                  return (
                    <th
                      key={day.toISOString()}
                      className={cn(
                        "px-2 py-3 text-center min-w-[70px]",
                        isToday && "bg-primary/5"
                      )}
                    >
                      <div className={cn(
                        "flex flex-col items-center gap-0.5",
                        isToday && "text-primary"
                      )}>
                        <span className="text-[10px] uppercase font-medium tracking-wider">{dayName}</span>
                        <span className={cn(
                          "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full",
                          isToday && "bg-primary text-primary-foreground"
                        )}>
                          {dayNum}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, idx) => (
                <tr key={student.name} className={cn("border-b last:border-0 hover:bg-muted/20 transition-colors", idx % 2 === 0 && "bg-muted/5")}>
                  <td className="px-4 py-2.5 font-medium text-foreground text-sm sticky left-0 bg-inherit z-10">
                    {student.name}
                  </td>
                  <td className="px-2 py-2.5">
                    <Badge variant="outline" className="text-[10px] font-normal">{student.class}</Badge>
                  </td>
                  {weekDays.map((day) => {
                    const status = getStatus(student.name, day);
                    const isToday = isSameDay(day, today);
                    return (
                      <td
                        key={day.toISOString()}
                        className={cn("px-2 py-2.5 text-center", isToday && "bg-primary/5")}
                      >
                        <div className="flex justify-center">
                          <StatusDot
                            status={status}
                            onClick={() => handleCellClick(student.name, day)}
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="px-4 py-3 border-t bg-muted/10 flex flex-wrap items-center gap-4">
          <span className="text-[11px] text-muted-foreground font-medium">Keterangan:</span>
          {(["Hadir", "Sakit", "Izin", "Alpha"] as Status[]).map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
          <span className="text-[11px] text-muted-foreground ml-auto">
            Klik sel untuk mengubah status
          </span>
        </div>
      </div>

      {/* Status Change Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Ubah Status Kehadiran</DialogTitle>
            {editingCell && (
              <p className="text-sm text-muted-foreground">
                {editingCell.student} — {format(parseISO(editingCell.date), "EEEE, d MMMM yyyy", { locale: idLocale })}
              </p>
            )}
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-4">
            {(["Hadir", "Sakit", "Izin", "Alpha"] as Status[]).map((status) => {
              const cfg = statusConfig[status];
              const Icon = cfg.icon;
              const isActive = editingCell?.currentStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:scale-[1.02]",
                    isActive ? "border-primary bg-primary/5 shadow-sm" : "border-muted hover:border-primary/30"
                  )}
                >
                  <Icon className={cn("h-6 w-6", cfg.color)} />
                  <span className="text-sm font-medium text-foreground">{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Attendance;
