import { CrudPage } from "@/components/CrudPage";

const mockSubjects = [
  { id: "SBJ001", code: "FQH", name: "Fiqih", category: "Agama", hoursPerWeek: "4" },
  { id: "SBJ002", code: "AQD", name: "Aqidah Akhlak", category: "Agama", hoursPerWeek: "3" },
  { id: "SBJ003", code: "QRN", name: "Al-Quran & Tajwid", category: "Agama", hoursPerWeek: "6" },
  { id: "SBJ004", code: "HDT", name: "Hadits", category: "Agama", hoursPerWeek: "3" },
  { id: "SBJ005", code: "MTK", name: "Matematika", category: "Umum", hoursPerWeek: "4" },
  { id: "SBJ006", code: "IPA", name: "Ilmu Pengetahuan Alam", category: "Umum", hoursPerWeek: "4" },
  { id: "SBJ007", code: "BIN", name: "Bahasa Indonesia", category: "Umum", hoursPerWeek: "3" },
  { id: "SBJ008", code: "BAR", name: "Bahasa Arab", category: "Bahasa", hoursPerWeek: "4" },
  { id: "SBJ009", code: "BIG", name: "Bahasa Inggris", category: "Bahasa", hoursPerWeek: "3" },
];

const Subjects = () => (
  <CrudPage
    title="Mata Pelajaran / Subjects"
    subtitle="Kelola mata pelajaran"
    idKey="id"
    searchPlaceholder="Cari mata pelajaran... / Search subjects..."
    searchKeys={["name", "code", "category"]}
    addLabel="Tambah Mapel"
    initialData={mockSubjects}
    columns={[
      { key: "code", label: "Kode / Code", className: "font-mono text-xs" },
      { key: "name", label: "Nama / Name", className: "font-medium" },
      { key: "category", label: "Kategori / Category" },
      { key: "hoursPerWeek", label: "Jam/Minggu / Hrs/Week" },
    ]}
    formFields={[
      { key: "code", label: "Kode Mapel / Subject Code", type: "text", placeholder: "FQH" },
      { key: "name", label: "Nama Mapel / Subject Name", type: "text", placeholder: "Fiqih" },
      { key: "category", label: "Kategori / Category", type: "select", options: [{ value: "Agama", label: "Agama / Religious" }, { value: "Umum", label: "Umum / General" }, { value: "Bahasa", label: "Bahasa / Language" }] },
      { key: "hoursPerWeek", label: "Jam per Minggu / Hours per Week", type: "number", placeholder: "4" },
    ]}
  />
);

export default Subjects;
