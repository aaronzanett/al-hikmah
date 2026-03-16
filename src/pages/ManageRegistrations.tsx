import { CrudPage, CrudColumn, CrudFormField, CrudFilter } from "@/components/CrudPage";

interface RegistrationItem {
  id: string;
  studentName: string;
  program: string;
  wave: string;
  guardianName: string;
  guardianPhone: string;
  prevSchool: string;
  gender: string;
  status: string;
  testScore: number;
  registeredAt: string;
}

const initialData: RegistrationItem[] = [
  { id: "REG001", studentName: "Ahmad Fathir Rahman", program: "Tahfidz Al-Qur'an", wave: "Gelombang 1", guardianName: "H. Rahman Fauzi", guardianPhone: "081234567890", prevSchool: "SDN 1 Bekasi", gender: "L", status: "Lulus Seleksi", testScore: 88, registeredAt: "2026-01-15" },
  { id: "REG002", studentName: "Siti Aisyah Putri", program: "Reguler", wave: "Gelombang 1", guardianName: "Hj. Nurul Hidayah", guardianPhone: "081298765432", prevSchool: "SD Al-Azhar Cikarang", gender: "P", status: "Lulus Seleksi", testScore: 92, registeredAt: "2026-01-18" },
  { id: "REG003", studentName: "Muhammad Rizki Aditya", program: "Bilingual", wave: "Gelombang 1", guardianName: "Ir. Aditya Pratama", guardianPhone: "081377889900", prevSchool: "SDIT Bina Ilmu", gender: "L", status: "Daftar Ulang", testScore: 85, registeredAt: "2026-01-20" },
  { id: "REG004", studentName: "Fatimah Az-Zahra", program: "Tahfidz Al-Qur'an", wave: "Gelombang 1", guardianName: "Dr. Zainal Abidin", guardianPhone: "081456123789", prevSchool: "MI Al-Ikhlas", gender: "P", status: "Menunggu Tes", testScore: 0, registeredAt: "2026-02-01" },
  { id: "REG005", studentName: "Abdullah Hakim", program: "STEM & Digital", wave: "Gelombang 2", guardianName: "Bambang Hakim, S.T.", guardianPhone: "081567234890", prevSchool: "SDN 5 Jakarta", gender: "L", status: "Verifikasi Berkas", testScore: 0, registeredAt: "2026-02-10" },
  { id: "REG006", studentName: "Khadijah Amira", program: "Reguler", wave: "Gelombang 1", guardianName: "Siti Maryam", guardianPhone: "081678345901", prevSchool: "SD Muhammadiyah 3", gender: "P", status: "Tidak Lulus", testScore: 55, registeredAt: "2026-01-22" },
  { id: "REG007", studentName: "Umar Faruq Hidayat", program: "Tahfidz Al-Qur'an", wave: "Gelombang 2", guardianName: "H. Hidayat, Lc.", guardianPhone: "081789456012", prevSchool: "SDIT Harapan", gender: "L", status: "Baru Mendaftar", testScore: 0, registeredAt: "2026-03-01" },
  { id: "REG008", studentName: "Zainab Safira", program: "Bilingual", wave: "Gelombang 2", guardianName: "Dra. Safira Wati", guardianPhone: "081890567123", prevSchool: "SD Global Islamic", gender: "P", status: "Baru Mendaftar", testScore: 0, registeredAt: "2026-03-05" },
  { id: "REG009", studentName: "Bilal Ahmad Syafii", program: "Reguler", wave: "Gelombang 1", guardianName: "Ahmad Syafii, S.Ag.", guardianPhone: "081901678234", prevSchool: "MI Al-Falah", gender: "L", status: "Lulus Seleksi", testScore: 90, registeredAt: "2026-01-25" },
  { id: "REG010", studentName: "Hafsa Nur Aini", program: "STEM & Digital", wave: "Gelombang 2", guardianName: "Nur Aini, M.Pd.", guardianPhone: "082012789345", prevSchool: "SDN 2 Depok", gender: "P", status: "Verifikasi Berkas", testScore: 0, registeredAt: "2026-03-10" },
  { id: "REG011", studentName: "Yusuf Iskandar", program: "Tahfidz Al-Qur'an", wave: "Gelombang 1", guardianName: "Iskandar, S.E.", guardianPhone: "082123890456", prevSchool: "SD IT Nurul Fikri", gender: "L", status: "Daftar Ulang", testScore: 87, registeredAt: "2026-02-05" },
  { id: "REG012", studentName: "Maryam Azzahra", program: "Reguler", wave: "Gelombang 2", guardianName: "Hj. Azzahra", guardianPhone: "082234901567", prevSchool: "SDN 8 Tangerang", gender: "P", status: "Baru Mendaftar", testScore: 0, registeredAt: "2026-03-12" },
];

const columns: CrudColumn<RegistrationItem>[] = [
  { key: "id", label: "No. Pendaftaran", className: "w-28" },
  { key: "studentName", label: "Nama Calon Santri" },
  {
    key: "program",
    label: "Program",
    render: (val) => (
      <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">{val}</span>
    ),
  },
  { key: "wave", label: "Gelombang" },
  {
    key: "gender",
    label: "L/P",
    className: "w-12 text-center",
    render: (val) => (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${val === "L" ? "bg-info/10 text-info" : "bg-accent/15 text-accent-foreground"}`}>
        {val}
      </span>
    ),
  },
  { key: "guardianName", label: "Nama Wali" },
  { key: "guardianPhone", label: "No. HP Wali" },
  {
    key: "testScore",
    label: "Nilai Tes",
    className: "w-20 text-center",
    render: (val) => (
      <span className={`text-xs font-bold ${Number(val) >= 70 ? "text-success" : Number(val) > 0 ? "text-destructive" : "text-muted-foreground"}`}>
        {Number(val) > 0 ? val : "-"}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (val) => {
      const styles: Record<string, string> = {
        "Baru Mendaftar": "bg-muted text-muted-foreground",
        "Verifikasi Berkas": "bg-info/10 text-info",
        "Menunggu Tes": "bg-warning/10 text-warning",
        "Lulus Seleksi": "bg-success/10 text-success",
        "Tidak Lulus": "bg-destructive/10 text-destructive",
        "Daftar Ulang": "bg-accent/15 text-accent-foreground",
      };
      return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[val as string] || "bg-muted text-muted-foreground"}`}>
          {val}
        </span>
      );
    },
  },
  { key: "registeredAt", label: "Tgl Daftar" },
];

const formFields: CrudFormField[] = [
  { key: "studentName", label: "Nama Calon Santri", type: "text", placeholder: "Nama lengkap" },
  {
    key: "program",
    label: "Program",
    type: "select",
    options: [
      { value: "Tahfidz Al-Qur'an", label: "Tahfidz Al-Qur'an" },
      { value: "Reguler", label: "Reguler" },
      { value: "Bilingual", label: "Bilingual" },
      { value: "STEM & Digital", label: "STEM & Digital" },
    ],
  },
  {
    key: "wave",
    label: "Gelombang",
    type: "select",
    options: [
      { value: "Gelombang 1", label: "Gelombang 1" },
      { value: "Gelombang 2", label: "Gelombang 2" },
      { value: "Gelombang 3", label: "Gelombang 3" },
    ],
  },
  {
    key: "gender",
    label: "Jenis Kelamin",
    type: "select",
    options: [
      { value: "L", label: "Laki-laki" },
      { value: "P", label: "Perempuan" },
    ],
  },
  { key: "prevSchool", label: "Asal Sekolah", type: "text", placeholder: "Nama sekolah asal" },
  { key: "guardianName", label: "Nama Wali", type: "text", placeholder: "Nama wali/orang tua" },
  { key: "guardianPhone", label: "No. HP Wali", type: "text", placeholder: "08xx-xxxx-xxxx" },
  { key: "testScore", label: "Nilai Tes", type: "number", placeholder: "0-100" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "Baru Mendaftar", label: "Baru Mendaftar" },
      { value: "Verifikasi Berkas", label: "Verifikasi Berkas" },
      { value: "Menunggu Tes", label: "Menunggu Tes" },
      { value: "Lulus Seleksi", label: "Lulus Seleksi" },
      { value: "Tidak Lulus", label: "Tidak Lulus" },
      { value: "Daftar Ulang", label: "Daftar Ulang" },
    ],
  },
];

const filters: CrudFilter[] = [
  {
    key: "program",
    label: "Program",
    options: [
      { value: "Tahfidz Al-Qur'an", label: "Tahfidz Al-Qur'an" },
      { value: "Reguler", label: "Reguler" },
      { value: "Bilingual", label: "Bilingual" },
      { value: "STEM & Digital", label: "STEM & Digital" },
    ],
  },
  {
    key: "wave",
    label: "Gelombang",
    options: [
      { value: "Gelombang 1", label: "Gelombang 1" },
      { value: "Gelombang 2", label: "Gelombang 2" },
      { value: "Gelombang 3", label: "Gelombang 3" },
    ],
  },
  {
    key: "status",
    label: "Status",
    options: [
      { value: "Baru Mendaftar", label: "Baru Mendaftar" },
      { value: "Verifikasi Berkas", label: "Verifikasi Berkas" },
      { value: "Menunggu Tes", label: "Menunggu Tes" },
      { value: "Lulus Seleksi", label: "Lulus Seleksi" },
      { value: "Tidak Lulus", label: "Tidak Lulus" },
      { value: "Daftar Ulang", label: "Daftar Ulang" },
    ],
  },
  {
    key: "gender",
    label: "L/P",
    options: [
      { value: "L", label: "Laki-laki" },
      { value: "P", label: "Perempuan" },
    ],
  },
];

const ManageRegistrations = () => {
  return (
    <CrudPage<RegistrationItem>
      title="Pendaftaran / Registrations"
      subtitle="Kelola data pendaftaran calon santri baru dari semua gelombang."
      columns={columns}
      formFields={formFields}
      initialData={initialData}
      filters={filters}
      searchKeys={["studentName", "guardianName", "prevSchool", "guardianPhone"]}
      searchPlaceholder="Cari pendaftar..."
      idKey="id"
      addLabel="Tambah Pendaftar"
    />
  );
};

export default ManageRegistrations;
