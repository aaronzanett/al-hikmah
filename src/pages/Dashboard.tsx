import { StatCard } from "@/components/StatCard";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  Receipt,
  Wallet,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const monthlyPayments = [
  { month: "Jan", paid: 45, unpaid: 12 },
  { month: "Feb", paid: 50, unpaid: 8 },
  { month: "Mar", paid: 42, unpaid: 15 },
  { month: "Apr", paid: 55, unpaid: 5 },
  { month: "Mei", paid: 48, unpaid: 10 },
  { month: "Jun", paid: 52, unpaid: 6 },
];

const paymentStatus = [
  { name: "Lunas / Paid", value: 320, color: "hsl(152, 55%, 40%)" },
  { name: "Belum Bayar / Unpaid", value: 45, color: "hsl(38, 92%, 50%)" },
  { name: "Jatuh Tempo / Overdue", value: 15, color: "hsl(0, 72%, 51%)" },
];

const recentActivities = [
  { id: 1, text: "Ahmad Fauzi membayar SPP bulan Maret", time: "5 menit lalu", type: "payment" },
  { id: 2, text: "Santri baru: Siti Aisyah terdaftar", time: "1 jam lalu", type: "student" },
  { id: 3, text: "Pelanggaran dicatat untuk kamar 12", time: "2 jam lalu", type: "violation" },
  { id: 4, text: "Pengeluaran: Rp 2.500.000 untuk konsumsi", time: "3 jam lalu", type: "expense" },
  { id: 5, text: "Tagihan April berhasil di-generate", time: "5 jam lalu", type: "bill" },
];

const Dashboard = () => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Ringkasan data pesantren / Overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Santri / Students" value={380} subtitle="Aktif di semua cabang" icon={Users} trend={{ value: 5.2, label: "vs bulan lalu" }} variant="primary" />
        <StatCard title="Cabang / Branches" value={3} subtitle="Pusat, Cabang 1, Cabang 2" icon={Building2} />
        <StatCard title="Tagihan Bulan Ini / Monthly Bills" value="Rp 228M" subtitle="380 tagihan aktif" icon={Receipt} variant="accent" />
        <StatCard title="Pembayaran Masuk / Income" value="Rp 192M" subtitle="84% terkumpul" icon={Wallet} trend={{ value: 12, label: "vs bulan lalu" }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-2 bg-card border rounded-xl p-5 shadow-card">
          <h3 className="text-sm font-semibold mb-4">Pembayaran Bulanan / Monthly Payments</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyPayments}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 20%, 90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(150, 10%, 45%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(150, 10%, 45%)" />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(40, 20%, 90%)", fontSize: "12px" }} />
              <Bar dataKey="paid" fill="hsl(152, 45%, 28%)" radius={[4, 4, 0, 0]} name="Lunas" />
              <Bar dataKey="unpaid" fill="hsl(42, 75%, 55%)" radius={[4, 4, 0, 0]} name="Belum Bayar" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card border rounded-xl p-5 shadow-card">
          <h3 className="text-sm font-semibold mb-4">Status Pembayaran / Payment Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={paymentStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {paymentStatus.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(40, 20%, 90%)", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {paymentStatus.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard title="Tunggakan / Overdue" value={15} subtitle="Perlu tindak lanjut segera" icon={AlertCircle} variant="info" />
        <StatCard title="Pendapatan Platform / Platform Revenue" value="Rp 1.52M" subtitle="Dari micro-fee transaksi" icon={TrendingUp} trend={{ value: 8.3, label: "bulan ini" }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border rounded-xl p-5 shadow-card">
        <h3 className="text-sm font-semibold mb-4">Aktivitas Terkini / Recent Activity</h3>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-foreground">{activity.text}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default Dashboard;
