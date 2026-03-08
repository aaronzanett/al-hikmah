import { CrudPage } from "@/components/CrudPage";
import { Badge } from "@/components/ui/badge";

const mockBranches = [
  { id: "BR001", name: "Pesantren Pusat", location: "Bandung, Jawa Barat", students: "180", rooms: "24", status: "Aktif" },
  { id: "BR002", name: "Cabang 1 - Al Hikmah", location: "Garut, Jawa Barat", students: "120", rooms: "16", status: "Aktif" },
  { id: "BR003", name: "Cabang 2 - Ar Rahman", location: "Tasikmalaya, Jawa Barat", students: "80", rooms: "10", status: "Aktif" },
];

const Branches = () => (
  <CrudPage
    title="Cabang / Branches"
    subtitle="Kelola cabang pesantren"
    idKey="id"
    searchPlaceholder="Cari cabang... / Search branches..."
    searchKeys={["name", "location"]}
    addLabel="Tambah Cabang"
    initialData={mockBranches}
    columns={[
      { key: "name", label: "Nama / Name", className: "font-medium" },
      { key: "location", label: "Lokasi / Location" },
      { key: "students", label: "Santri" },
      { key: "rooms", label: "Kamar" },
      { key: "status", label: "Status", render: (val) => <Badge variant="default" className="text-[10px]">{val}</Badge> },
    ]}
    formFields={[
      { key: "name", label: "Nama Cabang / Branch Name", type: "text", placeholder: "Nama cabang" },
      { key: "location", label: "Lokasi / Location", type: "text", placeholder: "Kota, Provinsi" },
      { key: "students", label: "Jumlah Santri / Students", type: "number", placeholder: "0" },
      { key: "rooms", label: "Jumlah Kamar / Rooms", type: "number", placeholder: "0" },
      { key: "status", label: "Status", type: "select", options: [{ value: "Aktif", label: "Aktif" }, { value: "Nonaktif", label: "Nonaktif" }] },
    ]}
  />
);

export default Branches;
