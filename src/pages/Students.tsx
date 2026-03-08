import { CrudPage } from "@/components/CrudPage";
import { Badge } from "@/components/ui/badge";

const mockStudents = [
  { id: "2024001", nis: "2024001", name: "Ahmad Fauzi", gender: "L", branch: "Pusat", class: "X-A", room: "Asrama 1 - K.01", year: "2024", status: "Aktif" },
  { id: "2024002", nis: "2024002", name: "Siti Aisyah", gender: "P", branch: "Pusat", class: "X-B", room: "Asrama 2 - K.05", year: "2024", status: "Aktif" },
  { id: "2024003", nis: "2024003", name: "Muhammad Rizki", gender: "L", branch: "Cabang 1", class: "XI-A", room: "Asrama 3 - K.02", year: "2023", status: "Aktif" },
  { id: "2023004", nis: "2023004", name: "Fatimah Zahra", gender: "P", branch: "Pusat", class: "XII-A", room: "Asrama 2 - K.08", year: "2022", status: "Aktif" },
  { id: "2023005", nis: "2023005", name: "Umar Hadi", gender: "L", branch: "Cabang 2", class: "XI-B", room: "Asrama 1 - K.04", year: "2023", status: "Cuti" },
  { id: "2024006", nis: "2024006", name: "Khadijah Nur", gender: "P", branch: "Cabang 1", class: "X-A", room: "Asrama 4 - K.01", year: "2024", status: "Aktif" },
  { id: "2022007", nis: "2022007", name: "Ibrahim Malik", gender: "L", branch: "Pusat", class: "XII-B", room: "Asrama 1 - K.06", year: "2022", status: "Alumni" },
  { id: "2024008", nis: "2024008", name: "Aisyah Putri", gender: "P", branch: "Cabang 2", class: "X-C", room: "Asrama 4 - K.03", year: "2024", status: "Aktif" },
];

const statusVariant = (status: string) => {
  switch (status) {
    case "Aktif": return "default";
    case "Cuti": return "secondary";
    case "Alumni": return "outline";
    default: return "default";
  }
};

const Students = () => (
  <CrudPage
    title="Santri / Students"
    subtitle="Kelola data santri pesantren"
    idKey="id"
    searchPlaceholder="Cari santri... / Search students..."
    searchKeys={["name", "nis", "branch", "class"]}
    addLabel="Tambah Santri"
    initialData={mockStudents}
    columns={[
      { key: "nis", label: "NIS", className: "font-mono text-xs" },
      { key: "name", label: "Nama / Name", className: "font-medium" },
      { key: "gender", label: "L/P", className: "text-xs" },
      { key: "branch", label: "Cabang / Branch", className: "text-xs" },
      { key: "class", label: "Kelas / Class", className: "text-xs" },
      { key: "room", label: "Kamar / Room", className: "text-xs" },
      { key: "year", label: "Tahun", className: "text-xs" },
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
      { key: "status", label: "Status", type: "select", options: [{ value: "Aktif", label: "Aktif" }, { value: "Cuti", label: "Cuti" }, { value: "Alumni", label: "Alumni" }] },
    ]}
  />
);

export default Students;
