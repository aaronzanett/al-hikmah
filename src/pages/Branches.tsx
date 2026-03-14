import { CrudPage } from "@/components/CrudPage";
import { Badge } from "@/components/ui/badge";

const mockBranches = [
  { id: "BR001", name: "Pesantren Pusat", location: "Bandung, Jawa Barat", students: "180", rooms: "24", status: "Aktif" },
  { id: "BR002", name: "Cabang 1 - Al Hikmah", location: "Garut, Jawa Barat", students: "120", rooms: "16", status: "Aktif" },
  { id: "BR003", name: "Cabang 2 - Ar Rahman", location: "Tasikmalaya, Jawa Barat", students: "80", rooms: "10", status: "Aktif" },
  { id: "BR004", name: "Cabang 3 - An Nur", location: "Cirebon, Jawa Barat", students: "95", rooms: "12", status: "Aktif" },
  { id: "BR005", name: "Cabang 4 - Al Falah", location: "Sukabumi, Jawa Barat", students: "60", rooms: "8", status: "Aktif" },
  { id: "BR006", name: "Cabang 5 - Al Ikhlas", location: "Cianjur, Jawa Barat", students: "45", rooms: "6", status: "Nonaktif" },
  { id: "BR007", name: "Cabang 6 - Al Furqan", location: "Subang, Jawa Barat", students: "70", rooms: "9", status: "Aktif" },
  { id: "BR008", name: "Cabang 7 - Darussalam", location: "Karawang, Jawa Barat", students: "55", rooms: "7", status: "Aktif" },
  { id: "BR009", name: "Cabang 8 - Baitul Ilmi", location: "Purwakarta, Jawa Barat", students: "40", rooms: "5", status: "Nonaktif" },
  { id: "BR010", name: "Cabang 9 - Al Amin", location: "Majalengka, Jawa Barat", students: "85", rooms: "11", status: "Aktif" },
  { id: "BR011", name: "Cabang 10 - Al Hidayah", location: "Kuningan, Jawa Barat", students: "50", rooms: "7", status: "Aktif" },
  { id: "BR012", name: "Cabang 11 - Riyadhul Jannah", location: "Indramayu, Jawa Barat", students: "65", rooms: "8", status: "Aktif" },
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
    filters={[
      { key: "status", label: "Status", options: [{ value: "Aktif", label: "Aktif" }, { value: "Nonaktif", label: "Nonaktif" }] },
    ]}
    columns={[
      { key: "name", label: "Nama / Name", className: "font-medium" },
      { key: "location", label: "Lokasi / Location" },
      { key: "students", label: "Santri" },
      { key: "rooms", label: "Kamar" },
      { key: "status", label: "Status", render: (val) => <Badge variant={val === "Aktif" ? "default" : "secondary"} className="text-[10px]">{val}</Badge> },
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
