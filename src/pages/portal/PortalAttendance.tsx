import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";

type Status = "hadir" | "sakit" | "izin" | "alpa";

interface AttendanceRecord {
  date: string;
  day: string;
  status: Status;
  session: string;
  note?: string;
}

const records: AttendanceRecord[] = [
  { date: "7 Mar 2026", day: "Sabtu", status: "hadir", session: "Pagi & Siang" },
  { date: "6 Mar 2026", day: "Jumat", status: "hadir", session: "Pagi & Siang" },
  { date: "5 Mar 2026", day: "Kamis", status: "sakit", session: "Pagi", note: "Demam - laporan klinik" },
  { date: "4 Mar 2026", day: "Rabu", status: "sakit", session: "Pagi & Siang", note: "Demam - laporan klinik" },
  { date: "3 Mar 2026", day: "Selasa", status: "hadir", session: "Pagi & Siang" },
  { date: "2 Mar 2026", day: "Senin", status: "hadir", session: "Pagi & Siang" },
  { date: "28 Feb 2026", day: "Jumat", status: "izin", session: "Siang", note: "Keperluan keluarga" },
  { date: "27 Feb 2026", day: "Kamis", status: "hadir", session: "Pagi & Siang" },
  { date: "26 Feb 2026", day: "Rabu", status: "hadir", session: "Pagi & Siang" },
  { date: "25 Feb 2026", day: "Selasa", status: "alpa", session: "Pagi" },
];

const statusConfig: Record<Status, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  hadir: { icon: CheckCircle2, label: "Hadir", color: "text-green-600", bg: "bg-green-100 text-green-700" },
  sakit: { icon: AlertCircle, label: "Sakit", color: "text-blue-600", bg: "bg-blue-100 text-blue-700" },
  izin: { icon: Clock, label: "Izin", color: "text-amber-600", bg: "bg-amber-100 text-amber-700" },
  alpa: { icon: XCircle, label: "Alpa", color: "text-red-600", bg: "bg-red-100 text-red-700" },
};

const PortalAttendance = () => {
  const hadir = records.filter(r => r.status === "hadir").length;
  const percentage = Math.round((hadir / records.length) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <h2 className="text-base font-bold text-foreground">Absensi / Kehadiran</h2>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {(["hadir", "sakit", "izin", "alpa"] as Status[]).map((status) => {
          const count = records.filter(r => r.status === status).length;
          const cfg = statusConfig[status];
          return (
            <div key={status} className="bg-card border rounded-xl p-3 text-center">
              <cfg.icon className={`h-5 w-5 mx-auto mb-1.5 ${cfg.color}`} />
              <p className="text-xl font-bold text-foreground">{count}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {/* Percentage */}
      <div className="bg-card border rounded-xl p-5">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Persentase Kehadiran</h3>
            <p className="text-xs text-muted-foreground">10 hari terakhir</p>
          </div>
          <p className={`text-2xl font-bold ${percentage >= 80 ? "text-green-600" : "text-amber-600"}`}>
            {percentage}%
          </p>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${percentage >= 80 ? "bg-green-500" : "bg-amber-500"}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className={`text-xs mt-2 ${percentage >= 80 ? "text-green-600" : "text-amber-600"}`}>
          {percentage >= 80 ? "✓ Kehadiran baik" : "⚠ Kehadiran perlu ditingkatkan"}
        </p>
      </div>

      {/* Attendance Records */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b">
          <h3 className="text-sm font-semibold text-foreground">Riwayat Kehadiran</h3>
        </div>
        <div className="divide-y">
          {records.map((record) => {
            const cfg = statusConfig[record.status];
            return (
              <div key={record.date} className="flex items-center px-5 py-3.5 gap-4">
                <div className="w-20 shrink-0">
                  <p className="text-xs font-medium text-foreground">{record.date}</p>
                  <p className="text-[10px] text-muted-foreground">{record.day}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{record.session}</p>
                  {record.note && <p className="text-[10px] text-muted-foreground italic">{record.note}</p>}
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cfg.bg}`}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default PortalAttendance;
