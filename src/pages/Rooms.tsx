import { useMemo } from "react";
import { CrudPage } from "@/components/CrudPage";
import { mockRooms, getOccupiedByRoom, getBranchOptions } from "@/data/mockData";

const Rooms = () => {
  const roomData = useMemo(
    () =>
      mockRooms.map((r) => ({
        ...r,
        occupied: String(getOccupiedByRoom(r.name)),
      })),
    []
  );

  const branchOptions = useMemo(() => getBranchOptions(), []);

  return (
    <CrudPage
      title="Kamar / Rooms"
      subtitle="Kelola kamar asrama"
      idKey="id"
      searchPlaceholder="Cari kamar... / Search rooms..."
      searchKeys={["name", "branch"]}
      addLabel="Tambah Kamar"
      initialData={roomData}
      filters={[
        { key: "branch", label: "Cabang", options: branchOptions },
        { key: "floor", label: "Lantai", options: [{ value: "1", label: "Lantai 1" }, { value: "2", label: "Lantai 2" }] },
      ]}
      columns={[
        { key: "name", label: "Nama Kamar / Room", className: "font-medium" },
        { key: "branch", label: "Cabang / Branch" },
        { key: "floor", label: "Lantai / Floor" },
        { key: "capacity", label: "Kapasitas / Capacity" },
        { key: "occupied", label: "Terisi / Occupied" },
      ]}
      formFields={[
        { key: "name", label: "Nama Kamar / Room Name", type: "text", placeholder: "Asrama 1 - K.01" },
        { key: "branch", label: "Cabang / Branch", type: "select", options: branchOptions },
        { key: "floor", label: "Lantai / Floor", type: "number", placeholder: "1" },
        { key: "capacity", label: "Kapasitas / Capacity", type: "number", placeholder: "8" },
      ]}
    />
  );
};

export default Rooms;
