import { CrudPage } from "@/components/CrudPage";
import { Badge } from "@/components/ui/badge";

const mockInventory = [
  { id: "INV001", code: "INV-001", name: "Kasur Single", category: "Furniture", quantity: "50", condition: "Baik", location: "Asrama 1" },
  { id: "INV002", code: "INV-002", name: "Lemari Pakaian", category: "Furniture", quantity: "48", condition: "Baik", location: "Asrama 1" },
  { id: "INV003", code: "INV-003", name: "Meja Belajar", category: "Furniture", quantity: "40", condition: "Baik", location: "Asrama 2" },
  { id: "INV004", code: "INV-004", name: "Al-Quran", category: "Buku", quantity: "200", condition: "Baik", location: "Perpustakaan" },
  { id: "INV005", code: "INV-005", name: "Kitab Kuning", category: "Buku", quantity: "150", condition: "Baik", location: "Perpustakaan" },
  { id: "INV006", code: "INV-006", name: "Kipas Angin", category: "Elektronik", quantity: "30", condition: "Sebagian Rusak", location: "Asrama 1-4" },
  { id: "INV007", code: "INV-007", name: "Proyektor", category: "Elektronik", quantity: "5", condition: "Baik", location: "Ruang Kelas" },
  { id: "INV008", code: "INV-008", name: "Sajadah", category: "Ibadah", quantity: "100", condition: "Baik", location: "Musholla" },
];

const conditionColor = (c: string) => c === "Baik" ? "default" : "secondary";

const Inventory = () => (
  <CrudPage
    title="Inventaris / Inventory"
    subtitle="Kelola inventaris pesantren"
    idKey="id"
    searchPlaceholder="Cari inventaris... / Search inventory..."
    searchKeys={["name", "code", "category", "location"]}
    addLabel="Tambah Item"
    initialData={mockInventory}
    columns={[
      { key: "code", label: "Kode / Code", className: "font-mono text-xs" },
      { key: "name", label: "Nama / Name", className: "font-medium" },
      { key: "category", label: "Kategori / Category" },
      { key: "quantity", label: "Jumlah / Qty" },
      { key: "condition", label: "Kondisi / Condition", render: (val) => <Badge variant={conditionColor(val)} className="text-[10px]">{val}</Badge> },
      { key: "location", label: "Lokasi / Location" },
    ]}
    formFields={[
      { key: "code", label: "Kode Item / Item Code", type: "text", placeholder: "INV-001" },
      { key: "name", label: "Nama Item / Item Name", type: "text", placeholder: "Kasur Single" },
      { key: "category", label: "Kategori / Category", type: "select", options: [{ value: "Furniture", label: "Furniture" }, { value: "Buku", label: "Buku / Books" }, { value: "Elektronik", label: "Elektronik / Electronics" }, { value: "Ibadah", label: "Ibadah / Worship" }] },
      { key: "quantity", label: "Jumlah / Quantity", type: "number", placeholder: "10" },
      { key: "condition", label: "Kondisi / Condition", type: "select", options: [{ value: "Baik", label: "Baik / Good" }, { value: "Sebagian Rusak", label: "Sebagian Rusak / Partially Damaged" }, { value: "Rusak", label: "Rusak / Damaged" }] },
      { key: "location", label: "Lokasi / Location", type: "text", placeholder: "Asrama 1" },
    ]}
  />
);

export default Inventory;
