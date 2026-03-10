import { motion } from "framer-motion";
import { PiggyBank, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface SavingsRecord {
  date: string;
  description: string;
  type: "deposit" | "withdraw";
  amount: string;
  balance: string;
}

const records: SavingsRecord[] = [
  { date: "5 Mar 2026", description: "Setoran dari wali", type: "deposit", amount: "Rp 200.000", balance: "Rp 1.200.000" },
  { date: "20 Feb 2026", description: "Setoran dari wali", type: "deposit", amount: "Rp 300.000", balance: "Rp 1.000.000" },
  { date: "15 Feb 2026", description: "Penarikan jajan mingguan", type: "withdraw", amount: "Rp 100.000", balance: "Rp 700.000" },
  { date: "10 Feb 2026", description: "Setoran dari wali", type: "deposit", amount: "Rp 200.000", balance: "Rp 800.000" },
  { date: "1 Feb 2026", description: "Penarikan jajan mingguan", type: "withdraw", amount: "Rp 100.000", balance: "Rp 600.000" },
  { date: "25 Jan 2026", description: "Setoran dari wali", type: "deposit", amount: "Rp 400.000", balance: "Rp 700.000" },
  { date: "15 Jan 2026", description: "Penarikan jajan mingguan", type: "withdraw", amount: "Rp 100.000", balance: "Rp 300.000" },
  { date: "5 Jan 2026", description: "Setoran awal", type: "deposit", amount: "Rp 400.000", balance: "Rp 400.000" },
];

const StudentSavings = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <h2 className="text-base font-bold text-foreground">Tabungan Saya</h2>

      {/* Balance Card */}
      <div className="rounded-2xl gradient-primary p-6 text-primary-foreground">
        <div className="flex items-center gap-2 mb-2">
          <PiggyBank className="h-5 w-5 text-primary-foreground/70" />
          <p className="text-primary-foreground/70 text-sm">Saldo Tabungan</p>
        </div>
        <p className="text-3xl font-extrabold mb-1">Rp 1.200.000</p>
        <p className="text-primary-foreground/60 text-xs">Muhammad Azzam Ridwan · NIS 2024.001</p>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <ArrowUpRight className="h-3.5 w-3.5 text-green-300" />
              <p className="text-[11px] text-primary-foreground/70">Total Setoran</p>
            </div>
            <p className="font-bold text-sm">Rp 1.500.000</p>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <ArrowDownRight className="h-3.5 w-3.5 text-red-300" />
              <p className="text-[11px] text-primary-foreground/70">Total Penarikan</p>
            </div>
            <p className="font-bold text-sm">Rp 300.000</p>
          </div>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="bg-card border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Aktivitas Bulan Ini</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Setoran</p>
            <p className="text-lg font-bold text-green-600">Rp 500.000</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Penarikan</p>
            <p className="text-lg font-bold text-red-500">Rp 100.000</p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b">
          <h3 className="text-sm font-semibold text-foreground">Riwayat Transaksi</h3>
        </div>
        <div className="divide-y">
          {records.map((record, i) => (
            <div key={i} className="flex items-center px-5 py-3.5 gap-4">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                record.type === "deposit" ? "bg-green-100" : "bg-red-100"
              }`}>
                {record.type === "deposit" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{record.description}</p>
                <p className="text-[10px] text-muted-foreground">{record.date}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${record.type === "deposit" ? "text-green-600" : "text-red-500"}`}>
                  {record.type === "deposit" ? "+" : "-"}{record.amount}
                </p>
                <p className="text-[10px] text-muted-foreground">Saldo: {record.balance}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StudentSavings;
