import { CrudPage, CrudColumn, CrudFormField } from "@/components/CrudPage";

interface ContactInfo {
  id: string;
  type: string;
  label: string;
  value: string;
  icon: string;
  isActive: string;
}

const initialData: ContactInfo[] = [
  { id: "C001", type: "Alamat", label: "Alamat Pesantren", value: "Jl. Pondok Pesantren No. 123, Kec. Cikarang, Kabupaten Bekasi, Jawa Barat 17530", icon: "MapPin", isActive: "Aktif" },
  { id: "C002", type: "Telepon", label: "Telepon Kantor", value: "(021) 8888-1234", icon: "Phone", isActive: "Aktif" },
  { id: "C003", type: "WhatsApp", label: "WhatsApp Pendaftaran", value: "+62 812-3456-7890", icon: "Phone", isActive: "Aktif" },
  { id: "C004", type: "Email", label: "Email Resmi", value: "info@alhikmah.sch.id", icon: "Mail", isActive: "Aktif" },
  { id: "C005", type: "Jam Operasional", label: "Jam Kerja", value: "Senin–Sabtu: 07.00–16.00 WIB", icon: "Clock", isActive: "Aktif" },
  { id: "C006", type: "Media Sosial", label: "Instagram", value: "@pesantren.alhikmah", icon: "Globe", isActive: "Aktif" },
  { id: "C007", type: "Media Sosial", label: "YouTube", value: "Pesantren Al-Hikmah Official", icon: "Globe", isActive: "Nonaktif" },
];

const columns: CrudColumn<ContactInfo>[] = [
  { key: "id", label: "ID", className: "w-20" },
  { key: "type", label: "Tipe / Type",
    render: (val) => (
      <span className="text-xs font-medium bg-accent/10 text-accent-foreground px-2 py-0.5 rounded-full">{val}</span>
    ),
  },
  { key: "label", label: "Label", render: (val) => <span className="font-medium">{val}</span> },
  { key: "value", label: "Nilai / Value", className: "max-w-[250px]",
    render: (val) => <span className="text-sm text-muted-foreground">{val}</span>,
  },
  { key: "isActive", label: "Status",
    render: (val) => (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${val === "Aktif" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
        {val}
      </span>
    ),
  },
];

const formFields: CrudFormField[] = [
  { key: "type", label: "Tipe / Type", type: "select", options: [
    { value: "Alamat", label: "Alamat / Address" },
    { value: "Telepon", label: "Telepon / Phone" },
    { value: "WhatsApp", label: "WhatsApp" },
    { value: "Email", label: "Email" },
    { value: "Jam Operasional", label: "Jam Operasional / Hours" },
    { value: "Media Sosial", label: "Media Sosial / Social Media" },
  ]},
  { key: "label", label: "Label", type: "text", placeholder: "Nama label kontak" },
  { key: "value", label: "Nilai / Value", type: "text", placeholder: "Informasi kontak" },
  { key: "isActive", label: "Status", type: "select", options: [
    { value: "Aktif", label: "Aktif / Active" },
    { value: "Nonaktif", label: "Nonaktif / Inactive" },
  ]},
];

export default function ManageContact() {
  return (
    <CrudPage<ContactInfo>
      title="Kelola Kontak / Manage Contact"
      subtitle="Kelola informasi kontak yang ditampilkan di halaman landing page."
      columns={columns}
      initialData={initialData}
      formFields={formFields}
      searchPlaceholder="Cari kontak... / Search contact..."
      searchKeys={["type", "label", "value"]}
      idKey="id"
      addLabel="Tambah Kontak / Add Contact"
    />
  );
}
