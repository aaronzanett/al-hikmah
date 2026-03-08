import { CrudPage } from "@/components/CrudPage";
import { Badge } from "@/components/ui/badge";

const mockAttendance = [
  { id: "ATT001", date: "2026-03-07", student: "Ahmad Fauzi", class: "X-A", status: "Hadir" },
  { id: "ATT002", date: "2026-03-07", student: "Siti Aisyah", class: "X-B", status: "Hadir" },
  { id: "ATT003", date: "2026-03-07", student: "Muhammad Rizki", class: "XI-A", status: "Sakit" },
  { id: "ATT004", date: "2026-03-07", student: "Fatimah Zahra", class: "XII-A", status: "Hadir" },
  { id: "ATT005", date: "2026-03-07", student: "Umar Hadi", class: "XI-B", status: "Izin" },
  { id: "ATT006", date: "2026-03-07", student: "Khadijah Nur", class: "X-A", status: "Hadir" },
  { id: "ATT007", date: "2026-03-07", student: "Ibrahim Malik", class: "XII-B", status: "Alpha" },
  { id: "ATT008", date: "2026-03-07", student: "Aisyah Putri", class: "X-C", status: "Hadir" },
  { id: "ATT009", date: "2026-03-06", student: "Ahmad Fauzi", class: "X-A", status: "Hadir" },
  { id: "ATT010", date: "2026-03-06", student: "Siti Aisyah", class: "X-B", status: "Izin" },
];

const statusColor = (status: string) => {
  switch (status) {
    case "Hadir": return "default";
    case "Sakit": return "secondary";
    case "Izin": return "outline";
    case "Alpha": return "destructive";
    default: return "default";
  }
};

const Attendance = () => (
  <CrudPage
    title="Absensi / Attendance"
    subtitle="Kelola kehadiran santri"
    idKey="id"
    searchPlaceholder="Cari absensi... / Search attendance..."
    searchKeys={["student", "class", "date"]}
    addLabel="Tambah Absensi"
    initialData={mockAttendance}
    columns={[
      { key: "date", label: "Tanggal / Date" },
      { key: "student", label: "Santri / Student", className: "font-medium" },
      { key: "class", label: "Kelas / Class" },
      { key: "status", label: "Status", render: (val) => <Badge variant={statusColor(val)} className="text-[10px]">{val}</Badge> },
    ]}
    formFields={[
      { key: "date", label: "Tanggal / Date", type: "date" },
      { key: "student", label: "Santri / Student", type: "text", placeholder: "Nama santri" },
      { key: "class", label: "Kelas / Class", type: "text", placeholder: "X-A" },
      { key: "status", label: "Status", type: "select", options: [{ value: "Hadir", label: "Hadir / Present" }, { value: "Sakit", label: "Sakit / Sick" }, { value: "Izin", label: "Izin / Permitted" }, { value: "Alpha", label: "Alpha / Absent" }] },
    ]}
  />
);

export default Attendance;
