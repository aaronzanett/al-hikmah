import { CrudPage } from "@/components/CrudPage";
import { Badge } from "@/components/ui/badge";

const mockBills = [
  { id: "BLL001", student: "Ahmad Fauzi", category: "SPP", amount: "600000", discount: "0", total: "600000", dueDate: "2026-03-15", status: "Belum Bayar" },
  { id: "BLL002", student: "Siti Aisyah", category: "SPP", amount: "600000", discount: "50000", total: "550000", dueDate: "2026-03-15", status: "Lunas" },
  { id: "BLL003", student: "Muhammad Rizki", category: "SPP", amount: "600000", discount: "0", total: "600000", dueDate: "2026-03-15", status: "Lunas" },
  { id: "BLL004", student: "Fatimah Zahra", category: "SPP", amount: "600000", discount: "100000", total: "500000", dueDate: "2026-03-15", status: "Jatuh Tempo" },
  { id: "BLL005", student: "Umar Hadi", category: "Makan", amount: "300000", discount: "0", total: "300000", dueDate: "2026-03-10", status: "Belum Bayar" },
  { id: "BLL006", student: "Khadijah Nur", category: "SPP", amount: "600000", discount: "0", total: "600000", dueDate: "2026-03-15", status: "Lunas" },
  { id: "BLL007", student: "Ibrahim Malik", category: "Buku", amount: "150000", discount: "0", total: "150000", dueDate: "2026-03-20", status: "Belum Bayar" },
  { id: "BLL008", student: "Aisyah Putri", category: "SPP", amount: "600000", discount: "0", total: "600000", dueDate: "2026-03-15", status: "Lunas" },
  { id: "BLL009", student: "Ahmad Fauzi", category: "Makan", amount: "300000", discount: "0", total: "300000", dueDate: "2026-03-10", status: "Lunas" },
  { id: "BLL010", student: "Siti Aisyah", category: "Buku", amount: "150000", discount: "0", total: "150000", dueDate: "2026-03-20", status: "Belum Bayar" },
];

const statusColor = (s: string) => {
  switch (s) {
    case "Lunas": return "default";
    case "Belum Bayar": return "secondary";
    case "Jatuh Tempo": return "destructive";
    default: return "default";
  }
};

const formatRp = (val: string) => `Rp ${Number(val).toLocaleString("id-ID")}`;

const Bills = () => (
  <CrudPage
    title="Tagihan / Bills"
    subtitle="Kelola tagihan santri"
    idKey="id"
    searchPlaceholder="Cari tagihan... / Search bills..."
    searchKeys={["student", "category", "status"]}
    addLabel="Tambah Tagihan"
    initialData={mockBills}
    columns={[
      { key: "student", label: "Santri / Student", className: "font-medium" },
      { key: "category", label: "Kategori / Category" },
      { key: "amount", label: "Jumlah / Amount", render: (val) => formatRp(val) },
      { key: "discount", label: "Diskon / Discount", render: (val) => formatRp(val) },
      { key: "total", label: "Total", render: (val) => <span className="font-semibold">{formatRp(val)}</span> },
      { key: "dueDate", label: "Jatuh Tempo / Due" },
      { key: "status", label: "Status", render: (val) => <Badge variant={statusColor(val)} className="text-[10px]">{val}</Badge> },
    ]}
    formFields={[
      { key: "student", label: "Santri / Student", type: "text", placeholder: "Nama santri" },
      { key: "category", label: "Kategori / Category", type: "select", options: [{ value: "SPP", label: "SPP / Tuition" }, { value: "Makan", label: "Makan / Meals" }, { value: "Buku", label: "Buku / Books" }, { value: "Lainnya", label: "Lainnya / Other" }] },
      { key: "amount", label: "Jumlah / Amount", type: "number", placeholder: "600000" },
      { key: "discount", label: "Diskon / Discount", type: "number", placeholder: "0" },
      { key: "total", label: "Total", type: "number", placeholder: "600000" },
      { key: "dueDate", label: "Jatuh Tempo / Due Date", type: "date" },
      { key: "status", label: "Status", type: "select", options: [{ value: "Belum Bayar", label: "Belum Bayar / Unpaid" }, { value: "Lunas", label: "Lunas / Paid" }, { value: "Jatuh Tempo", label: "Jatuh Tempo / Overdue" }] },
    ]}
  />
);

export default Bills;
