import { CrudPage, ExcelConfig } from "@/components/CrudPage";
import { Badge } from "@/components/ui/badge";

const mockStudents = [
  { id: "2024001", nis: "2024001", name: "Ahmad Fauzi", gender: "L", branch: "Pusat", class: "X-A", room: "Asrama 1 - K.01", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024002", nis: "2024002", name: "Siti Aisyah", gender: "P", branch: "Pusat", class: "X-B", room: "Asrama 2 - K.05", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024003", nis: "2024003", name: "Muhammad Rizki", gender: "L", branch: "Cabang 1", class: "XI-A", room: "Asrama 3 - K.02", year: "2023", academicYear: "2024/2025", status: "Aktif" },
  { id: "2023004", nis: "2023004", name: "Fatimah Zahra", gender: "P", branch: "Pusat", class: "XII-A", room: "Asrama 2 - K.08", year: "2022", academicYear: "2024/2025", status: "Aktif" },
  { id: "2023005", nis: "2023005", name: "Umar Hadi", gender: "L", branch: "Cabang 2", class: "XI-B", room: "Asrama 1 - K.04", year: "2023", academicYear: "2024/2025", status: "Cuti" },
  { id: "2024006", nis: "2024006", name: "Khadijah Nur", gender: "P", branch: "Cabang 1", class: "X-A", room: "Asrama 4 - K.01", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2022007", nis: "2022007", name: "Ibrahim Malik", gender: "L", branch: "Pusat", class: "XII-B", room: "Asrama 1 - K.06", year: "2022", academicYear: "2023/2024", status: "Alumni" },
  { id: "2024008", nis: "2024008", name: "Aisyah Putri", gender: "P", branch: "Cabang 2", class: "X-C", room: "Asrama 4 - K.03", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024009", nis: "2024009", name: "Zainab Amira", gender: "P", branch: "Pusat", class: "XI-A", room: "Asrama 2 - K.02", year: "2023", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024010", nis: "2024010", name: "Yusuf Rahman", gender: "L", branch: "Pusat", class: "XII-A", room: "Asrama 1 - K.07", year: "2022", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024011", nis: "2024011", name: "Halimah Sadia", gender: "P", branch: "Cabang 1", class: "X-B", room: "Asrama 3 - K.05", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024012", nis: "2024012", name: "Bilal Hakim", gender: "L", branch: "Cabang 2", class: "XI-B", room: "Asrama 4 - K.02", year: "2023", academicYear: "2024/2025", status: "Aktif" },
  { id: "2023013", nis: "2023013", name: "Ruqayyah Hasan", gender: "P", branch: "Pusat", class: "XII-A", room: "Asrama 2 - K.06", year: "2022", academicYear: "2023/2024", status: "Alumni" },
  { id: "2024014", nis: "2024014", name: "Hamzah Ridwan", gender: "L", branch: "Cabang 1", class: "X-C", room: "Asrama 3 - K.04", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024015", nis: "2024015", name: "Maryam Azzahra", gender: "P", branch: "Pusat", class: "XI-A", room: "Asrama 2 - K.03", year: "2023", academicYear: "2024/2025", status: "Cuti" },
];

const statusVariant = (status: string) => {
  switch (status) {
    case "Aktif": return "default";
    case "Cuti": return "secondary";
    case "Alumni": return "outline";
    default: return "default";
  }
};

type Student = typeof mockStudents[0];

const excelConfig: ExcelConfig<Student> = {
  enabled: true,
  columnMap: [
    { excelHeader: ["NIS", "nis"], dataKey: "nis" },
    { excelHeader: ["Nama", "Name", "nama", "name"], dataKey: "name" },
    { excelHeader: ["L/P", "Gender", "gender", "Jenis Kelamin"], dataKey: "gender" },
    { excelHeader: ["Cabang", "Branch", "branch", "cabang"], dataKey: "branch" },
    { excelHeader: ["Kelas", "Class", "class", "kelas"], dataKey: "class" },
    { excelHeader: ["Kamar", "Room", "room", "kamar"], dataKey: "room" },
    { excelHeader: ["Tahun", "Year", "year", "tahun", "Tahun Masuk"], dataKey: "year" },
    { excelHeader: ["Tahun Ajaran", "Academic Year", "tahun ajaran"], dataKey: "academicYear" },
    { excelHeader: ["Status", "status"], dataKey: "status" },
  ],
  exportColumns: [
    { header: "NIS", key: "nis" },
    { header: "Nama", key: "name" },
    { header: "L/P", key: "gender" },
    { header: "Cabang", key: "branch" },
    { header: "Kelas", key: "class" },
    { header: "Kamar", key: "room" },
    { header: "Tahun Masuk", key: "year" },
    { header: "Tahun Ajaran", key: "academicYear" },
    { header: "Status", key: "status" },
  ],
  templateData: [
    { "NIS": "2024001", "Nama": "Ahmad Fauzi", "L/P": "L", "Cabang": "Pusat", "Kelas": "X-A", "Kamar": "Asrama 1 - K.01", "Tahun Masuk": "2024", "Tahun Ajaran": "2024/2025", "Status": "Aktif" },
    { "NIS": "2024002", "Nama": "Siti Aisyah", "L/P": "P", "Cabang": "Pusat", "Kelas": "X-B", "Kamar": "Asrama 2 - K.05", "Tahun Masuk": "2024", "Tahun Ajaran": "2024/2025", "Status": "Aktif" },
  ],
  fileName: "data-santri",
};

const Students = () => (
  <CrudPage<Student>
    title="Santri / Students"
    subtitle="Kelola data santri pesantren"
    idKey="id"
    searchPlaceholder="Cari santri... / Search students..."
    searchKeys={["name", "nis", "branch", "class"]}
    addLabel="Tambah Santri"
    initialData={mockStudents}
    excelConfig={excelConfig}
    filters={[
      { key: "academicYear", label: "Tahun Ajaran", options: [{ value: "2024/2025", label: "2024/2025" }, { value: "2023/2024", label: "2023/2024" }, { value: "2022/2023", label: "2022/2023" }] },
      { key: "class", label: "Kelas", options: [{ value: "X-A", label: "X-A" }, { value: "X-B", label: "X-B" }, { value: "X-C", label: "X-C" }, { value: "XI-A", label: "XI-A" }, { value: "XI-B", label: "XI-B" }, { value: "XII-A", label: "XII-A" }, { value: "XII-B", label: "XII-B" }] },
      { key: "gender", label: "Gender", options: [{ value: "L", label: "Laki-laki" }, { value: "P", label: "Perempuan" }] },
      { key: "branch", label: "Cabang", options: [{ value: "Pusat", label: "Pusat" }, { value: "Cabang 1", label: "Cabang 1" }, { value: "Cabang 2", label: "Cabang 2" }] },
      { key: "status", label: "Status", options: [{ value: "Aktif", label: "Aktif" }, { value: "Cuti", label: "Cuti" }, { value: "Alumni", label: "Alumni" }] },
    ]}
    columns={[
      { key: "nis", label: "NIS", className: "font-mono text-xs" },
      { key: "name", label: "Nama / Name", className: "font-medium" },
      { key: "gender", label: "L/P", className: "text-xs" },
      { key: "branch", label: "Cabang / Branch", className: "text-xs" },
      { key: "class", label: "Kelas / Class", className: "text-xs" },
      { key: "room", label: "Kamar / Room", className: "text-xs" },
      { key: "academicYear", label: "Tahun Ajaran", className: "text-xs" },
      { key: "status", label: "Status", render: (val) => <Badge variant={statusVariant(val)} className="text-[10px]">{val}</Badge> },
    ]}
    formFields={[
      { key: "nis", label: "NIS", type: "text", placeholder: "2024001" },
      { key: "name", label: "Nama Lengkap / Full Name", type: "text", placeholder: "Nama santri" },
      { key: "gender", label: "Jenis Kelamin / Gender", type: "select", options: [{ value: "L", label: "Laki-laki / Male" }, { value: "P", label: "Perempuan / Female" }] },
      { key: "branch", label: "Cabang / Branch", type: "select", options: [{ value: "Pusat", label: "Pusat" }, { value: "Cabang 1", label: "Cabang 1" }, { value: "Cabang 2", label: "Cabang 2" }] },
      { key: "class", label: "Kelas / Class", type: "text", placeholder: "X-A" },
      { key: "room", label: "Kamar / Room", type: "text", placeholder: "Asrama 1 - K.01" },
      { key: "year", label: "Tahun Masuk / Admission Year", type: "number", placeholder: "2024" },
      { key: "academicYear", label: "Tahun Ajaran / Academic Year", type: "select", options: [{ value: "2024/2025", label: "2024/2025" }, { value: "2023/2024", label: "2023/2024" }, { value: "2022/2023", label: "2022/2023" }] },
      { key: "status", label: "Status", type: "select", options: [{ value: "Aktif", label: "Aktif" }, { value: "Cuti", label: "Cuti" }, { value: "Alumni", label: "Alumni" }] },
    ]}
  />
);

export default Students;
