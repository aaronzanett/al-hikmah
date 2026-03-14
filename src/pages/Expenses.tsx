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
  { id: "EXP009", category: "Pendidikan", description: "Pembelian buku referensi guru", amount: "1200000", date: "2026-03-08", branch: "Pusat" },
  { id: "EXP010", category: "Listrik & Air", description: "Tagihan air PDAM Maret", amount: "1500000", date: "2026-03-01", branch: "Pusat" },
  { id: "EXP011", category: "Konsumsi", description: "Belanja bahan makanan minggu 2", amount: "2300000", date: "2026-03-13", branch: "Pusat" },
  { id: "EXP012", category: "Transport", description: "Sewa bus study tour", amount: "3000000", date: "2026-03-10", branch: "Cabang 1" },
  { id: "EXP013", category: "Asrama", description: "Cat ulang asrama putri", amount: "2800000", date: "2026-03-09", branch: "Cabang 2" },
  { id: "EXP014", category: "Listrik & Air", description: "Tagihan listrik Maret", amount: "2100000", date: "2026-03-01", branch: "Cabang 1" },
  { id: "EXP015", category: "Konsumsi", description: "Snack acara wisuda tahfidz", amount: "950000", date: "2026-03-12", branch: "Pusat" },
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
    filters={[
      { key: "category", label: "Kategori", options: [{ value: "Konsumsi", label: "Konsumsi" }, { value: "Asrama", label: "Asrama" }, { value: "Pendidikan", label: "Pendidikan" }, { value: "Listrik & Air", label: "Listrik & Air" }, { value: "Transport", label: "Transport" }] },
      { key: "branch", label: "Cabang", options: [{ value: "Pusat", label: "Pusat" }, { value: "Cabang 1", label: "Cabang 1" }, { value: "Cabang 2", label: "Cabang 2" }] },
    ]}
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
