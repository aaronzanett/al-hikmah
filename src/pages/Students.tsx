import { useMemo } from "react";
import { CrudPage, ExcelConfig } from "@/components/CrudPage";
import { Badge } from "@/components/ui/badge";
import { mockStudents, getBranchOptions } from "@/data/mockData";

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

const Students = () => {
  const branchOptions = useMemo(() => getBranchOptions(), []);

  return (
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
        { key: "branch", label: "Cabang", options: branchOptions },
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
        { key: "branch", label: "Cabang / Branch", type: "select", options: branchOptions },
        { key: "class", label: "Kelas / Class", type: "text", placeholder: "X-A" },
        { key: "room", label: "Kamar / Room", type: "text", placeholder: "Asrama 1 - K.01" },
        { key: "year", label: "Tahun Masuk / Admission Year", type: "number", placeholder: "2024" },
        { key: "academicYear", label: "Tahun Ajaran / Academic Year", type: "select", options: [{ value: "2024/2025", label: "2024/2025" }, { value: "2023/2024", label: "2023/2024" }, { value: "2022/2023", label: "2022/2023" }] },
        { key: "status", label: "Status", type: "select", options: [{ value: "Aktif", label: "Aktif" }, { value: "Cuti", label: "Cuti" }, { value: "Alumni", label: "Alumni" }] },
      ]}
    />
  );
};

export default Students;
