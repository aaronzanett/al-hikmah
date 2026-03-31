import { useMemo } from "react";
import { CrudPage } from "@/components/CrudPage";
import { Badge } from "@/components/ui/badge";
import { mockBranches, getStudentCountByBranch, getRoomCountByBranch } from "@/data/mockData";

const Branches = () => {
  const branchData = useMemo(
    () =>
      mockBranches.map((b) => ({
        ...b,
        students: String(getStudentCountByBranch(b.key)),
        rooms: String(getRoomCountByBranch(b.key)),
      })),
    []
  );

  return (
    <CrudPage
      title="Cabang / Branches"
      subtitle="Kelola cabang pesantren"
      idKey="id"
      searchPlaceholder="Cari cabang... / Search branches..."
      searchKeys={["name", "location"]}
      addLabel="Tambah Cabang"
      initialData={branchData}
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
        { key: "status", label: "Status", type: "select", options: [{ value: "Aktif", label: "Aktif" }, { value: "Nonaktif", label: "Nonaktif" }] },
      ]}
    />
  );
};

export default Branches;
