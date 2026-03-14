import { CrudPage } from "@/components/CrudPage";
import { Badge } from "@/components/ui/badge";

const formatRp = (val: string) => `Rp ${Number(val).toLocaleString("id-ID")}`;

const mockSavings = [
  { id: "SAV001", student: "Ahmad Fauzi", type: "Setoran", amount: "100000", date: "2026-03-01", balance: "500000" },
  { id: "SAV002", student: "Ahmad Fauzi", type: "Penarikan", amount: "50000", date: "2026-03-05", balance: "450000" },
  { id: "SAV003", student: "Siti Aisyah", type: "Setoran", amount: "200000", date: "2026-03-02", balance: "750000" },
  { id: "SAV004", student: "Muhammad Rizki", type: "Setoran", amount: "150000", date: "2026-03-01", balance: "320000" },
  { id: "SAV005", student: "Fatimah Zahra", type: "Setoran", amount: "100000", date: "2026-03-03", balance: "1200000" },
  { id: "SAV006", student: "Fatimah Zahra", type: "Penarikan", amount: "200000", date: "2026-03-06", balance: "1000000" },
  { id: "SAV007", student: "Khadijah Nur", type: "Setoran", amount: "50000", date: "2026-03-04", balance: "180000" },
  { id: "SAV008", student: "Aisyah Putri", type: "Setoran", amount: "300000", date: "2026-03-01", balance: "900000" },
  { id: "SAV009", student: "Zainab Amira", type: "Setoran", amount: "75000", date: "2026-03-07", balance: "275000" },
  { id: "SAV010", student: "Yusuf Rahman", type: "Setoran", amount: "200000", date: "2026-03-08", balance: "620000" },
  { id: "SAV011", student: "Halimah Sadia", type: "Setoran", amount: "100000", date: "2026-03-09", balance: "350000" },
  { id: "SAV012", student: "Bilal Hakim", type: "Penarikan", amount: "100000", date: "2026-03-10", balance: "150000" },
  { id: "SAV013", student: "Ibrahim Malik", type: "Setoran", amount: "250000", date: "2026-03-11", balance: "800000" },
  { id: "SAV014", student: "Umar Hadi", type: "Setoran", amount: "50000", date: "2026-03-12", balance: "230000" },
  { id: "SAV015", student: "Hamzah Ridwan", type: "Setoran", amount: "175000", date: "2026-03-13", balance: "475000" },
];

const typeColor = (t: string) => t === "Setoran" ? "default" : "secondary";

const Savings = () => (
  <CrudPage
    title="Tabungan / Savings"
    subtitle="Kelola tabungan santri"
    idKey="id"
    searchPlaceholder="Cari tabungan... / Search savings..."
    searchKeys={["student", "type"]}
    addLabel="Tambah Transaksi"
    initialData={mockSavings}
    filters={[
      { key: "type", label: "Jenis", options: [{ value: "Setoran", label: "Setoran" }, { value: "Penarikan", label: "Penarikan" }] },
    ]}
    columns={[
      { key: "student", label: "Santri / Student", className: "font-medium" },
      { key: "type", label: "Jenis / Type", render: (val) => <Badge variant={typeColor(val)} className="text-[10px]">{val}</Badge> },
      { key: "amount", label: "Jumlah / Amount", render: (val) => formatRp(val) },
      { key: "date", label: "Tanggal / Date" },
      { key: "balance", label: "Saldo / Balance", render: (val) => <span className="font-semibold">{formatRp(val)}</span> },
    ]}
    formFields={[
      { key: "student", label: "Santri / Student", type: "text", placeholder: "Nama santri" },
      { key: "type", label: "Jenis / Type", type: "select", options: [{ value: "Setoran", label: "Setoran / Deposit" }, { value: "Penarikan", label: "Penarikan / Withdrawal" }] },
      { key: "amount", label: "Jumlah / Amount (Rp)", type: "number", placeholder: "100000" },
      { key: "date", label: "Tanggal / Date", type: "date" },
      { key: "balance", label: "Saldo / Balance (Rp)", type: "number", placeholder: "500000" },
    ]}
  />
);

export default Savings;
