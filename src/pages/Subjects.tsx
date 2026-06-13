import { CrudPage } from "@/components/CrudPage";
import { OptionsManager, useManagedOptions } from "@/components/OptionsManager";

const mockSubjects = [
  { id: "SBJ001", code: "FQH", name: "Fiqih", category: "Agama", hoursPerWeek: "4", lastModifiedBy: "Ust. Ahmad Syafii", lastModifiedAt: "2026-03-10 14:30" },
  { id: "SBJ002", code: "AQD", name: "Aqidah Akhlak", category: "Agama", hoursPerWeek: "3", lastModifiedBy: "Admin Pusat", lastModifiedAt: "2026-03-09 09:15" },
  { id: "SBJ003", code: "QRN", name: "Al-Quran & Tajwid", category: "Agama", hoursPerWeek: "6", lastModifiedBy: "Ust. Ahmad Syafii", lastModifiedAt: "2026-03-08 16:45" },
  { id: "SBJ004", code: "HDT", name: "Hadits", category: "Agama", hoursPerWeek: "3", lastModifiedBy: "Admin Pusat", lastModifiedAt: "2026-03-07 11:00" },
  { id: "SBJ005", code: "MTK", name: "Matematika", category: "Umum", hoursPerWeek: "4", lastModifiedBy: "Ustz. Fatimah", lastModifiedAt: "2026-03-06 08:20" },
  { id: "SBJ006", code: "IPA", name: "Ilmu Pengetahuan Alam", category: "Umum", hoursPerWeek: "4", lastModifiedBy: "Admin Pusat", lastModifiedAt: "2026-03-05 13:10" },
  { id: "SBJ007", code: "BIN", name: "Bahasa Indonesia", category: "Umum", hoursPerWeek: "3", lastModifiedBy: "Ust. Ibrahim", lastModifiedAt: "2026-03-04 10:30" },
  { id: "SBJ008", code: "BAR", name: "Bahasa Arab", category: "Bahasa", hoursPerWeek: "4", lastModifiedBy: "Admin Pusat", lastModifiedAt: "2026-03-03 15:00" },
  { id: "SBJ009", code: "BIG", name: "Bahasa Inggris", category: "Bahasa", hoursPerWeek: "3", lastModifiedBy: "Ustz. Aisyah", lastModifiedAt: "2026-03-02 09:45" },
  { id: "SBJ010", code: "SKI", name: "Sejarah Kebudayaan Islam", category: "Agama", hoursPerWeek: "2", lastModifiedBy: "Admin Pusat", lastModifiedAt: "2026-03-01 14:00" },
  { id: "SBJ011", code: "IPS", name: "Ilmu Pengetahuan Sosial", category: "Umum", hoursPerWeek: "3", lastModifiedBy: "Ust. Hasan", lastModifiedAt: "2026-02-28 11:30" },
  { id: "SBJ012", code: "PKN", name: "Pendidikan Kewarganegaraan", category: "Umum", hoursPerWeek: "2", lastModifiedBy: "Admin Pusat", lastModifiedAt: "2026-02-27 16:15" },
  { id: "SBJ013", code: "TIK", name: "Teknologi Informasi", category: "Umum", hoursPerWeek: "2", lastModifiedBy: "Ust. Ridwan", lastModifiedAt: "2026-02-26 08:00" },
  { id: "SBJ014", code: "NHW", name: "Nahwu Shorof", category: "Bahasa", hoursPerWeek: "4", lastModifiedBy: "Admin Pusat", lastModifiedAt: "2026-02-25 13:45" },
];

const DEFAULT_CATEGORIES = [
  { value: "Agama", label: "Agama" },
  { value: "Umum", label: "Umum" },
  { value: "Bahasa", label: "Bahasa" },
];

const Subjects = () => {
  const [categories, setCategories] = useManagedOptions("subject_categories_options", DEFAULT_CATEGORIES);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <OptionsManager
          title="Kelola Kategori Mapel / Manage Subject Categories"
          description="Kategori yang Anda tambahkan akan muncul di dropdown filter dan form mata pelajaran."
          triggerLabel="Kelola Kategori"
          options={categories}
          onChange={setCategories}
        />
      </div>
      <CrudPage
        title="Mata Pelajaran / Subjects"
        subtitle="Kelola mata pelajaran"
        idKey="id"
        searchPlaceholder="Cari mata pelajaran... / Search subjects..."
        searchKeys={["name", "code", "category"]}
        addLabel="Tambah Mapel"
        initialData={mockSubjects}
        filters={[
          { key: "category", label: "Kategori", options: categories },
        ]}
        columns={[
          { key: "code", label: "Kode / Code", className: "font-mono text-xs" },
          { key: "name", label: "Nama / Name", className: "font-medium" },
          { key: "category", label: "Kategori / Category" },
          { key: "hoursPerWeek", label: "Jam/Minggu / Hrs/Week" },
          { key: "lastModifiedBy", label: "Diubah Oleh / Modified By", className: "text-xs text-muted-foreground" },
          { key: "lastModifiedAt", label: "Terakhir Diubah / Last Modified", className: "text-xs text-muted-foreground" },
        ]}
        formFields={[
          { key: "code", label: "Kode Mapel / Subject Code", type: "text", placeholder: "FQH" },
          { key: "name", label: "Nama Mapel / Subject Name", type: "text", placeholder: "Fiqih" },
          { key: "category", label: "Kategori / Category", type: "select", options: categories },
          { key: "hoursPerWeek", label: "Jam per Minggu / Hours per Week", type: "number", placeholder: "4" },
        ]}
      />
    </div>
  );
};

export default Subjects;
