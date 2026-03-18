import { CrudPage, ExcelConfig } from "@/components/CrudPage";

const mockGuardians = [
  { id: "WL001", name: "Hasan Abdullah", phone: "081234567890", email: "hasan@email.com", address: "Bandung", children: "Ahmad Fauzi" },
  { id: "WL002", name: "Aminah Sari", phone: "081298765432", email: "aminah@email.com", address: "Garut", children: "Siti Aisyah" },
  { id: "WL003", name: "Rizki Pratama", phone: "081345678901", email: "rizki.p@email.com", address: "Bandung", children: "Muhammad Rizki" },
  { id: "WL004", name: "Fatimah Wati", phone: "081456789012", email: "fatimah.w@email.com", address: "Tasikmalaya", children: "Fatimah Zahra" },
  { id: "WL005", name: "Umar Bakri", phone: "081567890123", email: "umar.b@email.com", address: "Garut", children: "Umar Hadi" },
  { id: "WL006", name: "Nurul Hidayah", phone: "081678901234", email: "nurul.h@email.com", address: "Bandung", children: "Khadijah Nur" },
  { id: "WL007", name: "Mahmud Salim", phone: "081789012345", email: "mahmud.s@email.com", address: "Tasikmalaya", children: "Ibrahim Malik" },
  { id: "WL008", name: "Zahra Amalia", phone: "081890123456", email: "zahra.a@email.com", address: "Bandung", children: "Aisyah Putri" },
  { id: "WL009", name: "Syafii Hendra", phone: "081901234567", email: "syafii@email.com", address: "Garut", children: "Zainab Amira" },
  { id: "WL010", name: "Khadijah Dewi", phone: "082012345678", email: "khadijah.d@email.com", address: "Bandung", children: "Yusuf Rahman" },
  { id: "WL011", name: "Akbar Maulana", phone: "082123456789", email: "akbar.m@email.com", address: "Tasikmalaya", children: "Halimah Sadia" },
  { id: "WL012", name: "Rina Sulastri", phone: "082234567890", email: "rina.s@email.com", address: "Garut", children: "Bilal Hakim" },
  { id: "WL013", name: "Dedi Kurniawan", phone: "082345678901", email: "dedi.k@email.com", address: "Bandung", children: "Ruqayyah Hasan" },
  { id: "WL014", name: "Siti Mariam", phone: "082456789012", email: "siti.m@email.com", address: "Tasikmalaya", children: "Hamzah Ridwan" },
  { id: "WL015", name: "Lukman Hakim", phone: "082567890123", email: "lukman.h@email.com", address: "Bandung", children: "Maryam Azzahra" },
];

type Guardian = typeof mockGuardians[0];

const excelConfig: ExcelConfig<Guardian> = {
  enabled: true,
  columnMap: [
    { excelHeader: ["Nama", "Name", "nama", "name"], dataKey: "name" },
    { excelHeader: ["Telepon", "Phone", "phone", "telepon", "No. Telepon", "HP"], dataKey: "phone" },
    { excelHeader: ["Email", "email"], dataKey: "email" },
    { excelHeader: ["Alamat", "Address", "address", "alamat"], dataKey: "address" },
    { excelHeader: ["Anak", "Children", "children", "Santri", "santri"], dataKey: "children" },
  ],
  exportColumns: [
    { header: "Nama", key: "name" },
    { header: "Telepon", key: "phone" },
    { header: "Email", key: "email" },
    { header: "Alamat", key: "address" },
    { header: "Anak / Santri", key: "children" },
  ],
  templateData: [
    { "Nama": "Hasan Abdullah", "Telepon": "081234567890", "Email": "hasan@email.com", "Alamat": "Bandung", "Anak": "Ahmad Fauzi" },
    { "Nama": "Aminah Sari", "Telepon": "081298765432", "Email": "aminah@email.com", "Alamat": "Garut", "Anak": "Siti Aisyah" },
  ],
  fileName: "data-wali",
};

const Guardians = () => (
  <CrudPage<Guardian>
    title="Wali Santri / Guardians"
    subtitle="Kelola data wali santri"
    idKey="id"
    searchPlaceholder="Cari wali... / Search guardians..."
    searchKeys={["name", "phone", "children"]}
    addLabel="Tambah Wali"
    initialData={mockGuardians}
    excelConfig={excelConfig}
    filters={[
      { key: "address", label: "Kota", options: [{ value: "Bandung", label: "Bandung" }, { value: "Garut", label: "Garut" }, { value: "Tasikmalaya", label: "Tasikmalaya" }] },
    ]}
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
