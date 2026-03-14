import { CrudPage, CrudColumn, CrudFormField } from "@/components/CrudPage";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  branch: string;
  status: string;
  lastLogin: string;
}

const initialData: UserAccount[] = [
  { id: "U001", name: "Ahmad Fauzi", email: "ahmad@boardingcore.id", role: "Super Admin", branch: "Semua / All", status: "Aktif", lastLogin: "2026-03-11" },
  { id: "U002", name: "Siti Nurhaliza", email: "siti@boardingcore.id", role: "Admin Cabang", branch: "Cabang Pusat", status: "Aktif", lastLogin: "2026-03-10" },
  { id: "U003", name: "Budi Santoso", email: "budi@boardingcore.id", role: "Bendahara", branch: "Cabang Pusat", status: "Aktif", lastLogin: "2026-03-09" },
  { id: "U004", name: "Dewi Lestari", email: "dewi@boardingcore.id", role: "Staff Akademik", branch: "Cabang Pusat", status: "Aktif", lastLogin: "2026-03-08" },
  { id: "U005", name: "Rizki Ramadhan", email: "rizki@boardingcore.id", role: "Musyrif Asrama", branch: "Cabang Timur", status: "Aktif", lastLogin: "2026-03-07" },
  { id: "U006", name: "Fatimah Zahra", email: "fatimah@boardingcore.id", role: "Admin Cabang", branch: "Cabang Timur", status: "Nonaktif", lastLogin: "2026-02-15" },
  { id: "U007", name: "Hasan Basri", email: "hasan@boardingcore.id", role: "Staff Akademik", branch: "Cabang Barat", status: "Aktif", lastLogin: "2026-03-06" },
  { id: "U008", name: "Aisyah Rahmawati", email: "aisyah@boardingcore.id", role: "Bendahara", branch: "Cabang Timur", status: "Aktif", lastLogin: "2026-03-05" },
  { id: "U009", name: "Umar Faruq", email: "umar@boardingcore.id", role: "Musyrif Asrama", branch: "Cabang Pusat", status: "Aktif", lastLogin: "2026-03-04" },
  { id: "U010", name: "Khadijah Amalia", email: "khadijah@boardingcore.id", role: "Admin Cabang", branch: "Cabang Barat", status: "Aktif", lastLogin: "2026-03-03" },
  { id: "U011", name: "Yusuf Abdillah", email: "yusuf@boardingcore.id", role: "Musyrif Asrama", branch: "Cabang Barat", status: "Nonaktif", lastLogin: "2026-01-20" },
  { id: "U012", name: "Maryam Salwa", email: "maryam@boardingcore.id", role: "Staff Akademik", branch: "Cabang Timur", status: "Aktif", lastLogin: "2026-03-02" },
  { id: "U013", name: "Ibrahim Hakim", email: "ibrahim@boardingcore.id", role: "Bendahara", branch: "Cabang Barat", status: "Aktif", lastLogin: "2026-03-01" },
];

const columns: CrudColumn<UserAccount>[] = [
  { key: "id", label: "ID", className: "w-20" },
  { key: "name", label: "Nama / Name", render: (val) => <span className="font-medium">{val}</span> },
  { key: "email", label: "Email", render: (val) => <span className="text-sm text-muted-foreground">{val}</span> },
  { key: "role", label: "Peran / Role",
    render: (val) => (
      <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">{val}</span>
    ),
  },
  { key: "branch", label: "Cabang / Branch" },
  { key: "status", label: "Status",
    render: (val) => (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${val === "Aktif" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
        {val}
      </span>
    ),
  },
  { key: "lastLogin", label: "Login Terakhir / Last Login" },
];

const formFields: CrudFormField[] = [
  { key: "name", label: "Nama / Name", type: "text", placeholder: "Nama lengkap" },
  { key: "email", label: "Email", type: "text", placeholder: "alamat@email.com" },
  { key: "role", label: "Peran / Role", type: "select", options: [
    { value: "Super Admin", label: "Super Admin" },
    { value: "Admin Cabang", label: "Admin Cabang / Branch Admin" },
    { value: "Bendahara", label: "Bendahara / Treasurer" },
    { value: "Staff Akademik", label: "Staff Akademik / Academic Staff" },
    { value: "Musyrif Asrama", label: "Musyrif Asrama / Dormitory Supervisor" },
  ]},
  { key: "branch", label: "Cabang / Branch", type: "select", options: [
    { value: "Semua / All", label: "Semua / All" },
    { value: "Cabang Pusat", label: "Cabang Pusat / Main Branch" },
    { value: "Cabang Timur", label: "Cabang Timur / East Branch" },
    { value: "Cabang Barat", label: "Cabang Barat / West Branch" },
  ]},
  { key: "status", label: "Status", type: "select", options: [
    { value: "Aktif", label: "Aktif / Active" },
    { value: "Nonaktif", label: "Nonaktif / Inactive" },
  ]},
];

export default function Users() {
  return (
    <CrudPage<UserAccount>
      title="Pengguna / Users"
      subtitle="Kelola akun administrator pesantren."
      columns={columns}
      initialData={initialData}
      formFields={formFields}
      searchPlaceholder="Cari pengguna... / Search users..."
      searchKeys={["name", "email", "role", "branch"]}
      idKey="id"
      addLabel="Tambah Pengguna / Add User"
      filters={[
        { key: "role", label: "Peran", options: [{ value: "Super Admin", label: "Super Admin" }, { value: "Admin Cabang", label: "Admin Cabang" }, { value: "Bendahara", label: "Bendahara" }, { value: "Staff Akademik", label: "Staff Akademik" }, { value: "Musyrif Asrama", label: "Musyrif Asrama" }] },
        { key: "status", label: "Status", options: [{ value: "Aktif", label: "Aktif" }, { value: "Nonaktif", label: "Nonaktif" }] },
      ]}
    />
  );
}
