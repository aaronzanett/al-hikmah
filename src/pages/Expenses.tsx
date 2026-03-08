import { CrudPage } from "@/components/CrudPage";

const formatRp = (val: string) => `Rp ${Number(val).toLocaleString("id-ID")}`;

const mockExpenses = [
  { id: "EXP001", category: "Konsumsi", description: "Belanja bahan makanan minggu 1", amount: "2500000", date: "2026-03-06", branch: "Pusat" },
  { id: "EXP002", category: "Asrama", description: "Perbaikan atap asrama 2", amount: "5000000", date: "2026-03-04", branch: "Pusat" },
  { id: "EXP003", category: "Konsumsi", description: "Gas dan bumbu dapur", amount: "800000", date: "2026-03-05", branch: "Pusat" },
  { id: "EXP004", category: "Pendidikan", description: "Fotokopi materi ujian", amount: "350000", date: "2026-03-03", branch: "Cabang 1" },
  { id: "EXP005", category: "Listrik & Air", description: "Tagihan listrik Maret", amount: "4200000", date: "2026-03-01", branch: "Pusat" },
  { id: "EXP006", category: "Konsumsi", description: "Belanja bahan makanan minggu 1", amount: "1800000", date: "2026-03-06", branch: "Cabang 1" },
  { id: "EXP007", category: "Transport", description: "BBM kendaraan operasional", amount: "600000", date: "2026-03-02", branch: "Pusat" },
  { id: "EXP008", category: "Asrama", description: "Beli kasur baru (5 unit)", amount: "3500000", date: "2026-03-07", branch: "Cabang 2" },
];

const Expenses = () => (
  <CrudPage
    title="Pengeluaran / Expenses"
    subtitle="Kelola pengeluaran pesantren"
    idKey="id"
    searchPlaceholder="Cari pengeluaran... / Search expenses..."
    searchKeys={["category", "description", "branch"]}
    addLabel="Tambah Pengeluaran"
    initialData={mockExpenses}
    columns={[
      { key: "category", label: "Kategori / Category", className: "font-medium" },
      { key: "description", label: "Keterangan / Description" },
      { key: "amount", label: "Jumlah / Amount", render: (val) => formatRp(val) },
      { key: "date", label: "Tanggal / Date" },
      { key: "branch", label: "Cabang / Branch" },
    ]}
    formFields={[
      { key: "category", label: "Kategori / Category", type: "select", options: [{ value: "Konsumsi", label: "Konsumsi / Food" }, { value: "Asrama", label: "Asrama / Dormitory" }, { value: "Pendidikan", label: "Pendidikan / Education" }, { value: "Listrik & Air", label: "Listrik & Air / Utilities" }, { value: "Transport", label: "Transport" }] },
      { key: "description", label: "Keterangan / Description", type: "textarea", placeholder: "Deskripsi pengeluaran" },
      { key: "amount", label: "Jumlah / Amount (Rp)", type: "number", placeholder: "1000000" },
      { key: "date", label: "Tanggal / Date", type: "date" },
      { key: "branch", label: "Cabang / Branch", type: "select", options: [{ value: "Pusat", label: "Pusat" }, { value: "Cabang 1", label: "Cabang 1" }, { value: "Cabang 2", label: "Cabang 2" }] },
    ]}
  />
);

export default Expenses;
