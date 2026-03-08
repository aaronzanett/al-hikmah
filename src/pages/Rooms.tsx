import { CrudPage } from "@/components/CrudPage";

const mockRooms = [
  { id: "RM001", name: "Asrama 1 - K.01", branch: "Pusat", floor: "1", capacity: "8", occupied: "6" },
  { id: "RM002", name: "Asrama 1 - K.02", branch: "Pusat", floor: "1", capacity: "8", occupied: "8" },
  { id: "RM003", name: "Asrama 1 - K.03", branch: "Pusat", floor: "1", capacity: "8", occupied: "5" },
  { id: "RM004", name: "Asrama 1 - K.04", branch: "Pusat", floor: "2", capacity: "8", occupied: "7" },
  { id: "RM005", name: "Asrama 2 - K.01", branch: "Pusat", floor: "1", capacity: "6", occupied: "6" },
  { id: "RM006", name: "Asrama 2 - K.05", branch: "Pusat", floor: "2", capacity: "6", occupied: "4" },
  { id: "RM007", name: "Asrama 3 - K.01", branch: "Cabang 1", floor: "1", capacity: "8", occupied: "7" },
  { id: "RM008", name: "Asrama 3 - K.02", branch: "Cabang 1", floor: "1", capacity: "8", occupied: "6" },
  { id: "RM009", name: "Asrama 4 - K.01", branch: "Cabang 2", floor: "1", capacity: "6", occupied: "5" },
  { id: "RM010", name: "Asrama 4 - K.03", branch: "Cabang 2", floor: "1", capacity: "6", occupied: "4" },
];

const Rooms = () => (
  <CrudPage
    title="Kamar / Rooms"
    subtitle="Kelola kamar asrama"
    idKey="id"
    searchPlaceholder="Cari kamar... / Search rooms..."
    searchKeys={["name", "branch"]}
    addLabel="Tambah Kamar"
    initialData={mockRooms}
    columns={[
      { key: "name", label: "Nama Kamar / Room", className: "font-medium" },
      { key: "branch", label: "Cabang / Branch" },
      { key: "floor", label: "Lantai / Floor" },
      { key: "capacity", label: "Kapasitas / Capacity" },
      { key: "occupied", label: "Terisi / Occupied" },
    ]}
    formFields={[
      { key: "name", label: "Nama Kamar / Room Name", type: "text", placeholder: "Asrama 1 - K.01" },
      { key: "branch", label: "Cabang / Branch", type: "select", options: [{ value: "Pusat", label: "Pusat" }, { value: "Cabang 1", label: "Cabang 1" }, { value: "Cabang 2", label: "Cabang 2" }] },
      { key: "floor", label: "Lantai / Floor", type: "number", placeholder: "1" },
      { key: "capacity", label: "Kapasitas / Capacity", type: "number", placeholder: "8" },
      { key: "occupied", label: "Terisi / Occupied", type: "number", placeholder: "0" },
    ]}
  />
);

export default Rooms;
