import { CrudPage, CrudColumn, CrudFormField, CrudFilter } from "@/components/CrudPage";
import { getIconComponent } from "@/lib/iconMap";
import { programsData, type ProgramItem, programCategories } from "@/data/programsData";

const columns: CrudColumn<ProgramItem>[] = [
  { key: "id", label: "ID", className: "w-20" },
  { key: "title", label: "Judul / Title" },
  {
    key: "category",
    label: "Kategori / Category",
    render: (val) => (
      <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">{val}</span>
    ),
  },
  {
    key: "description",
    label: "Deskripsi / Description",
    className: "max-w-[200px]",
    render: (val) => <span className="line-clamp-2 text-xs text-muted-foreground">{val}</span>,
  },
  {
    key: "iconKey",
    label: "Ikon / Icon",
    render: (val) => {
      const Icon = getIconComponent(val);
      return (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-xs font-mono text-muted-foreground">{val}</span>
        </div>
      );
    },
  },
  {
    key: "badge",
    label: "Label",
    render: (val) =>
      val ? (
        <span className="text-[10px] font-bold uppercase tracking-wider bg-accent/15 text-accent px-2 py-0.5 rounded-full">
          {val}
        </span>
      ) : (
        <span className="text-xs text-muted-foreground">-</span>
      ),
  },
  {
    key: "highlights",
    label: "Tag / Highlights",
    render: (val: string[]) =>
      val && val.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {val.map((h: string) => (
            <span key={h} className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {h}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-xs text-muted-foreground">-</span>
      ),
  },
  { key: "order", label: "Urutan / Order", className: "w-20 text-center" },
  {
    key: "status",
    label: "Status",
    render: (val) => (
      <span
        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          val === "Aktif" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
        }`}
      >
        {val}
      </span>
    ),
  },
  { key: "createdAt", label: "Tanggal / Date" },
];

const formFields: CrudFormField[] = [
  { key: "title", label: "Judul Program / Title", type: "text", placeholder: "Masukkan judul program" },
  {
    key: "category",
    label: "Kategori / Category",
    type: "select",
    options: programCategories.filter(c => c !== "Semua").map(c => ({ value: c, label: c })),
  },
  { key: "description", label: "Deskripsi / Description", type: "textarea", placeholder: "Jelaskan program secara singkat" },
  {
    key: "iconKey",
    label: "Ikon / Icon",
    type: "icon_select",
  },
  { key: "badge", label: "Label / Badge", type: "text", placeholder: "Contoh: Unggulan (kosongkan jika tidak ada)" },
  { key: "highlights", label: "Tag / Highlights", type: "text", placeholder: "Pisahkan dengan koma, contoh: Hafalan 30 juz, Metode Mutqin, Sanad" },
  { key: "order", label: "Urutan / Order", type: "number", placeholder: "Urutan tampil di halaman depan" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "Aktif", label: "Aktif" },
      { value: "Nonaktif", label: "Nonaktif" },
    ],
  },
];

const filters: CrudFilter[] = [
  {
    key: "category",
    label: "Kategori",
    options: programCategories.filter(c => c !== "Semua").map(c => ({ value: c, label: c })),
  },
  {
    key: "status",
    label: "Status",
    options: [
      { value: "Aktif", label: "Aktif" },
      { value: "Nonaktif", label: "Nonaktif" },
    ],
  },
];

const ManagePrograms = () => {
  return (
    <CrudPage<ProgramItem>
      title="Program / Programs"
      subtitle="Kelola program unggulan yang ditampilkan di halaman depan website."
      columns={columns}
      formFields={formFields}
      initialData={programsData}
      filters={filters}
      searchKeys={["title", "category", "description"]}
      searchPlaceholder="Cari program..."
      idKey="id"
      addLabel="Tambah Program"
    />
  );
};

export default ManagePrograms;
