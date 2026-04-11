import { CrudPage } from "@/components/CrudPage";
import { Badge } from "@/components/ui/badge";

const mockPayments = [
  { id: "PAY001", orderId: "ORD-20260307-001", student: "Ahmad Fauzi", amount: "600500", method: "VA BCA", date: "2026-03-05", status: "Sukses", fee: "500" },
  { id: "PAY002", orderId: "ORD-20260307-002", student: "Siti Aisyah", amount: "550700", method: "GoPay", date: "2026-03-04", status: "Sukses", fee: "700" },
  { id: "PAY003", orderId: "ORD-20260307-003", student: "Muhammad Rizki", amount: "600600", method: "VA Mandiri", date: "2026-03-03", status: "Sukses", fee: "600" },
  { id: "PAY004", orderId: "ORD-20260307-004", student: "Khadijah Nur", amount: "600500", method: "VA BNI", date: "2026-03-02", status: "Sukses", fee: "500" },
  { id: "PAY005", orderId: "ORD-20260307-005", student: "Aisyah Putri", amount: "600800", method: "DANA", date: "2026-03-01", status: "Sukses", fee: "800" },
  { id: "PAY006", orderId: "ORD-20260307-006", student: "Ahmad Fauzi", amount: "300500", method: "VA BCA", date: "2026-03-06", status: "Pending", fee: "500" },
  { id: "PAY007", orderId: "ORD-20260307-007", student: "Umar Hadi", amount: "300500", method: "OVO", date: "2026-03-07", status: "Gagal", fee: "500" },
  { id: "PAY008", orderId: "ORD-20260308-001", student: "Fatimah Zahra", amount: "500600", method: "VA Mandiri", date: "2026-03-08", status: "Sukses", fee: "600" },
  { id: "PAY009", orderId: "ORD-20260308-002", student: "Ibrahim Malik", amount: "150500", method: "VA BCA", date: "2026-03-08", status: "Sukses", fee: "500" },
  { id: "PAY010", orderId: "ORD-20260309-001", student: "Zainab Amira", amount: "600700", method: "GoPay", date: "2026-03-09", status: "Sukses", fee: "700" },
  { id: "PAY011", orderId: "ORD-20260309-002", student: "Yusuf Rahman", amount: "300500", method: "VA BNI", date: "2026-03-09", status: "Pending", fee: "500" },
  { id: "PAY012", orderId: "ORD-20260310-001", student: "Halimah Sadia", amount: "525800", method: "DANA", date: "2026-03-10", status: "Sukses", fee: "800" },
  { id: "PAY013", orderId: "ORD-20260310-002", student: "Bilal Hakim", amount: "200500", method: "OVO", date: "2026-03-10", status: "Gagal", fee: "500" },
  { id: "PAY014", orderId: "ORD-20260311-001", student: "Hamzah Ridwan", amount: "600600", method: "VA Mandiri", date: "2026-03-11", status: "Sukses", fee: "600" },
  { id: "PAY015", orderId: "ORD-20260311-002", student: "Maryam Azzahra", amount: "600500", method: "VA BCA", date: "2026-03-11", status: "Pending", fee: "500" },
];

const statusColor = (s: string) => {
  switch (s) {
    case "Sukses": return "default";
    case "Pending": return "secondary";
    case "Gagal": return "destructive";
    default: return "default";
  }
};

const formatRp = (val: string) => `Rp ${Number(val).toLocaleString("id-ID")}`;

const Payments = () => (
  <CrudPage
    title="Pembayaran / Payments"
    subtitle="Riwayat pembayaran sistem"
    idKey="id"
    searchPlaceholder="Cari pembayaran... / Search payments..."
    searchKeys={["student", "orderId", "method"]}
    addLabel="Tambah Pembayaran"
    initialData={mockPayments}
    readOnly
    filters={[
      { key: "method", label: "Metode", options: [{ value: "VA BCA", label: "VA BCA" }, { value: "VA Mandiri", label: "VA Mandiri" }, { value: "VA BNI", label: "VA BNI" }, { value: "GoPay", label: "GoPay" }, { value: "OVO", label: "OVO" }, { value: "DANA", label: "DANA" }] },
      { key: "status", label: "Status", options: [{ value: "Sukses", label: "Sukses" }, { value: "Pending", label: "Pending" }, { value: "Gagal", label: "Gagal" }] },
    ]}
    columns={[
      { key: "orderId", label: "Order ID", className: "font-mono text-xs" },
      { key: "student", label: "Santri / Student", className: "font-medium" },
      { key: "amount", label: "Jumlah / Amount", render: (val) => formatRp(val) },
      { key: "fee", label: "Micro-Fee", render: (val) => formatRp(val) },
      { key: "method", label: "Metode / Method" },
      { key: "date", label: "Tanggal / Date" },
      { key: "status", label: "Status", render: (val) => <Badge variant={statusColor(val)} className="text-[10px]">{val}</Badge> },
    ]}
    formFields={[]}
  />
);

export default Payments;
