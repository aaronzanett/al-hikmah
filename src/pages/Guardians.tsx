import { CrudPage } from "@/components/CrudPage";

const mockGuardians = [
  { id: "WL001", name: "Hasan Abdullah", phone: "081234567890", email: "hasan@email.com", address: "Bandung", children: "Ahmad Fauzi" },
  { id: "WL002", name: "Aminah Sari", phone: "081298765432", email: "aminah@email.com", address: "Garut", children: "Siti Aisyah" },
  { id: "WL003", name: "Rizki Pratama", phone: "081345678901", email: "rizki.p@email.com", address: "Bandung", children: "Muhammad Rizki" },
  { id: "WL004", name: "Fatimah Wati", phone: "081456789012", email: "fatimah.w@email.com", address: "Tasikmalaya", children: "Fatimah Zahra" },
  { id: "WL005", name: "Umar Bakri", phone: "081567890123", email: "umar.b@email.com", address: "Garut", children: "Umar Hadi" },
  { id: "WL006", name: "Nurul Hidayah", phone: "081678901234", email: "nurul.h@email.com", address: "Bandung", children: "Khadijah Nur" },
];

const Guardians = () => (
  <CrudPage
    title="Wali Santri / Guardians"
    subtitle="Kelola data wali santri"
    idKey="id"
    searchPlaceholder="Cari wali... / Search guardians..."
    searchKeys={["name", "phone", "children"]}
    addLabel="Tambah Wali"
    initialData={mockGuardians}
    columns={[
      { key: "name", label: "Nama / Name", className: "font-medium" },
      { key: "phone", label: "Telepon / Phone" },
      { key: "email", label: "Email" },
      { key: "address", label: "Alamat / Address" },
      { key: "children", label: "Anak / Children" },
    ]}
    formFields={[
      { key: "name", label: "Nama Lengkap / Full Name", type: "text", placeholder: "Nama wali" },
      { key: "phone", label: "No. Telepon / Phone", type: "text", placeholder: "08xxxxxxxxxx" },
      { key: "email", label: "Email", type: "text", placeholder: "email@contoh.com" },
      { key: "address", label: "Alamat / Address", type: "textarea", placeholder: "Alamat lengkap" },
      { key: "children", label: "Anak / Children", type: "text", placeholder: "Nama santri" },
    ]}
  />
);

export default Guardians;
