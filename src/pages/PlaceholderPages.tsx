import { DashboardLayout } from "@/components/DashboardLayout";

const PlaceholderPage = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <DashboardLayout title={title} subtitle={subtitle}>
    <div className="flex items-center justify-center h-64 bg-card border rounded-xl shadow-card">
      <div className="text-center">
        <p className="text-lg font-semibold mb-1">{title}</p>
        <p className="text-sm text-muted-foreground">Halaman ini sedang dalam pengembangan / Coming soon</p>
      </div>
    </div>
  </DashboardLayout>
);

export const Guardians = () => <PlaceholderPage title="Wali Santri / Guardians" subtitle="Kelola data wali santri" />;
export const Classes = () => <PlaceholderPage title="Kelas / Classes" subtitle="Kelola kelas dan jadwal" />;
export const Subjects = () => <PlaceholderPage title="Mata Pelajaran / Subjects" subtitle="Kelola mata pelajaran" />;
export const Grades = () => <PlaceholderPage title="Nilai / Grades" subtitle="Kelola nilai santri" />;
export const Attendance = () => <PlaceholderPage title="Absensi / Attendance" subtitle="Kelola kehadiran santri" />;
export const Rooms = () => <PlaceholderPage title="Kamar / Rooms" subtitle="Kelola kamar asrama" />;
export const Inventory = () => <PlaceholderPage title="Inventaris / Inventory" subtitle="Kelola inventaris pesantren" />;
export const Bills = () => <PlaceholderPage title="Tagihan / Bills" subtitle="Kelola tagihan santri" />;
export const Payments = () => <PlaceholderPage title="Pembayaran / Payments" subtitle="Kelola pembayaran" />;
export const Expenses = () => <PlaceholderPage title="Pengeluaran / Expenses" subtitle="Kelola pengeluaran" />;
export const Savings = () => <PlaceholderPage title="Tabungan / Savings" subtitle="Kelola tabungan santri" />;
export const SettingsPage = () => <PlaceholderPage title="Pengaturan / Settings" subtitle="Konfigurasi sistem" />;
