import { CrudPage } from "@/components/CrudPage";
import { OptionsManager, useManagedOptions } from "@/components/OptionsManager";

const mockClasses = [
  { id: "CLS001", name: "X-A", branch: "Pusat", level: "X", year: "2024/2025", teacher: "Ust. Ahmad Syafii", students: "30", lastModifiedBy: "Admin Pusat", lastModifiedAt: "2026-03-11 10:00" },
  { id: "CLS002", name: "X-B", branch: "Pusat", level: "X", year: "2024/2025", teacher: "Ust. Muhammad Ali", students: "28", lastModifiedBy: "Admin Pusat", lastModifiedAt: "2026-03-10 14:30" },
  { id: "CLS003", name: "X-C", branch: "Cabang 2", level: "X", year: "2024/2025", teacher: "Ustz. Fatimah", students: "25", lastModifiedBy: "Ustz. Fatimah", lastModifiedAt: "2026-03-09 09:15" },
  { id: "CLS004", name: "XI-A", branch: "Pusat", level: "XI", year: "2024/2025", teacher: "Ust. Ibrahim", students: "32", lastModifiedBy: "Admin Pusat", lastModifiedAt: "2026-03-08 16:45" },
  { id: "CLS005", name: "XI-B", branch: "Cabang 2", level: "XI", year: "2024/2025", teacher: "Ust. Hasan", students: "27", lastModifiedBy: "Ust. Hasan", lastModifiedAt: "2026-03-07 11:00" },
  { id: "CLS006", name: "XII-A", branch: "Pusat", level: "XII", year: "2024/2025", teacher: "Ust. Yusuf", students: "30", lastModifiedBy: "Admin Pusat", lastModifiedAt: "2026-03-06 08:20" },
  { id: "CLS007", name: "XII-B", branch: "Pusat", level: "XII", year: "2024/2025", teacher: "Ustz. Aisyah", students: "29", lastModifiedBy: "Ustz. Aisyah", lastModifiedAt: "2026-03-05 13:10" },
  { id: "CLS008", name: "X-A", branch: "Cabang 1", level: "X", year: "2024/2025", teacher: "Ust. Bilal", students: "26", lastModifiedBy: "Ust. Bilal", lastModifiedAt: "2026-03-04 10:30" },
  { id: "CLS009", name: "X-B", branch: "Cabang 1", level: "X", year: "2024/2025", teacher: "Ustz. Maryam", students: "24", lastModifiedBy: "Admin Pusat", lastModifiedAt: "2026-03-03 15:00" },
  { id: "CLS010", name: "XI-A", branch: "Cabang 1", level: "XI", year: "2024/2025", teacher: "Ust. Ridwan", students: "28", lastModifiedBy: "Ust. Ridwan", lastModifiedAt: "2026-03-02 09:45" },
  { id: "CLS011", name: "XI-A", branch: "Cabang 2", level: "XI", year: "2024/2025", teacher: "Ust. Salman", students: "26", lastModifiedBy: "Admin Pusat", lastModifiedAt: "2026-03-01 14:00" },
  { id: "CLS012", name: "XII-A", branch: "Cabang 1", level: "XII", year: "2024/2025", teacher: "Ustz. Hafsa", students: "22", lastModifiedBy: "Ustz. Hafsa", lastModifiedAt: "2026-02-28 11:30" },
  { id: "CLS013", name: "X-A", branch: "Pusat", level: "X", year: "2023/2024", teacher: "Ust. Ahmad Syafii", students: "31", lastModifiedBy: "Admin Pusat", lastModifiedAt: "2026-02-27 16:15" },
  { id: "CLS014", name: "XII-A", branch: "Cabang 2", level: "XII", year: "2024/2025", teacher: "Ust. Zubair", students: "20", lastModifiedBy: "Ust. Zubair", lastModifiedAt: "2026-02-26 08:00" },
];

const DEFAULT_LEVELS = [
  { value: "X", label: "X" },
  { value: "XI", label: "XI" },
  { value: "XII", label: "XII" },
];

const Classes = () => {
  const [levels, setLevels] = useManagedOptions("class_levels_options", DEFAULT_LEVELS);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <OptionsManager
          title="Kelola Tingkat Kelas / Manage Class Levels"
          description="Tingkat yang Anda tambahkan akan muncul di dropdown filter dan form kelas."
          triggerLabel="Kelola Tingkat"
          options={levels}
          onChange={setLevels}
        />
      </div>
      <CrudPage
        title="Kelas / Classes"
        subtitle="Kelola kelas dan jadwal"
        idKey="id"
        searchPlaceholder="Cari kelas... / Search classes..."
        searchKeys={["name", "branch", "teacher"]}
        addLabel="Tambah Kelas"
        initialData={mockClasses}
        filters={[
          { key: "branch", label: "Cabang", options: [{ value: "Pusat", label: "Pusat" }, { value: "Cabang 1", label: "Cabang 1" }, { value: "Cabang 2", label: "Cabang 2" }] },
          { key: "level", label: "Tingkat", options: levels },
          { key: "year", label: "Tahun Ajaran", options: [{ value: "2024/2025", label: "2024/2025" }, { value: "2023/2024", label: "2023/2024" }] },
        ]}
        columns={[
          { key: "name", label: "Nama Kelas / Class", className: "font-medium" },
          { key: "branch", label: "Cabang / Branch" },
          { key: "level", label: "Tingkat / Level" },
          { key: "year", label: "Tahun Ajaran / Year" },
          { key: "teacher", label: "Wali Kelas / Teacher" },
          { key: "students", label: "Santri" },
          { key: "lastModifiedBy", label: "Diubah Oleh / Modified By", className: "text-xs text-muted-foreground" },
          { key: "lastModifiedAt", label: "Terakhir Diubah / Last Modified", className: "text-xs text-muted-foreground" },
        ]}
        formFields={[
          { key: "name", label: "Nama Kelas / Class Name", type: "text", placeholder: "X-A" },
          { key: "branch", label: "Cabang / Branch", type: "select", options: [{ value: "Pusat", label: "Pusat" }, { value: "Cabang 1", label: "Cabang 1" }, { value: "Cabang 2", label: "Cabang 2" }] },
          { key: "level", label: "Tingkat / Level", type: "select", options: levels },
          { key: "year", label: "Tahun Ajaran / Academic Year", type: "text", placeholder: "2024/2025" },
          { key: "teacher", label: "Wali Kelas / Homeroom Teacher", type: "text", placeholder: "Nama guru" },
          { key: "students", label: "Jumlah Santri / Students", type: "number", placeholder: "30" },
        ]}
      />
    </div>
  );
};

export default Classes;
