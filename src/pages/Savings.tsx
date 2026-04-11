import { useState } from "react";
import { motion } from "framer-motion";
import { Search, PiggyBank, ArrowUpRight, ArrowDownRight, MinusCircle, X, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  nis: string;
  class: string;
  balance: number;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: "deposit" | "withdraw";
  amount: number;
  operator?: string;
}

const computeBalance = (txs: Transaction[]) => {
  return txs.reduce((sum, t) => t.type === "deposit" ? sum + t.amount : sum - t.amount, 0);
};

const txData = (txs: { id: string; date: string; description: string; type: "deposit" | "withdraw"; amount: number; operator?: string }[]) => txs;

const mockStudents: Student[] = [
  {
    id: "S001", name: "Ahmad Fauzi", nis: "2024.001", class: "10 IPA-A",
    balance: 0,
    transactions: txData([
      { id: "T1", date: "2026-03-10", description: "Setoran dari wali", type: "deposit", amount: 200000, operator: "Admin Pusat" },
      { id: "T2", date: "2026-03-05", description: "Penarikan jajan mingguan", type: "withdraw", amount: 50000, operator: "Ust. Hasan" },
      { id: "T3", date: "2026-03-01", description: "Setoran dari wali", type: "deposit", amount: 300000, operator: "Admin Pusat" },
      { id: "T4", date: "2026-02-20", description: "Setoran dari wali", type: "deposit", amount: 100000, operator: "Admin Pusat" },
      { id: "T5", date: "2026-02-10", description: "Penarikan jajan mingguan", type: "withdraw", amount: 50000, operator: "Ust. Hasan" },
    ]),
  },
  {
    id: "S002", name: "Siti Aisyah", nis: "2024.002", class: "10 IPA-A",
    balance: 0,
    transactions: txData([
      { id: "T6", date: "2026-03-08", description: "Setoran dari wali", type: "deposit", amount: 500000, operator: "Admin Pusat" },
      { id: "T7", date: "2026-03-02", description: "Setoran dari wali", type: "deposit", amount: 250000, operator: "Admin Pusat" },
    ]),
  },
  {
    id: "S003", name: "Muhammad Rizki", nis: "2024.003", class: "10 IPA-B",
    balance: 0,
    transactions: txData([
      { id: "T8", date: "2026-03-07", description: "Setoran dari wali", type: "deposit", amount: 150000, operator: "Admin Pusat" },
      { id: "T9", date: "2026-03-04", description: "Penarikan jajan mingguan", type: "withdraw", amount: 30000, operator: "Ust. Ahmad" },
      { id: "T10", date: "2026-03-01", description: "Setoran dari wali", type: "deposit", amount: 200000, operator: "Admin Pusat" },
    ]),
  },
  {
    id: "S004", name: "Fatimah Zahra", nis: "2024.004", class: "10 IPS-A",
    balance: 0,
    transactions: txData([
      { id: "T11", date: "2026-03-06", description: "Setoran dari wali", type: "deposit", amount: 1000000, operator: "Admin Pusat" },
      { id: "T12", date: "2026-03-03", description: "Penarikan jajan mingguan", type: "withdraw", amount: 200000, operator: "Ust. Hasan" },
      { id: "T13", date: "2026-02-28", description: "Setoran dari wali", type: "deposit", amount: 400000, operator: "Admin Pusat" },
    ]),
  },
  {
    id: "S005", name: "Khadijah Nur", nis: "2024.005", class: "10 IPS-A",
    balance: 0,
    transactions: txData([
      { id: "T14", date: "2026-03-04", description: "Setoran dari wali", type: "deposit", amount: 180000, operator: "Admin Pusat" },
    ]),
  },
  {
    id: "S006", name: "Yusuf Rahman", nis: "2024.006", class: "11 IPA-A",
    balance: 0,
    transactions: txData([
      { id: "T15", date: "2026-03-08", description: "Setoran dari wali", type: "deposit", amount: 400000, operator: "Admin Pusat" },
      { id: "T16", date: "2026-03-05", description: "Penarikan jajan mingguan", type: "withdraw", amount: 80000, operator: "Ust. Ahmad" },
      { id: "T17", date: "2026-03-02", description: "Setoran dari wali", type: "deposit", amount: 300000, operator: "Admin Pusat" },
    ]),
  },
].map(s => ({ ...s, balance: computeBalance(s.transactions) }));

const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

const Savings = () => {
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDesc, setWithdrawDesc] = useState("Penarikan jajan mingguan");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredStudents = search.length >= 2
    ? mockStudents.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.nis.includes(search)
      )
    : [];

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setSearch("");
    setShowDropdown(false);
  };

  const handleWithdraw = () => {
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) { toast.error("Masukkan jumlah penarikan yang valid"); return; }
    if (selectedStudent && amt > selectedStudent.balance) { toast.error("Saldo tidak mencukupi"); return; }
    toast.success(`Penarikan ${formatRp(amt)} berhasil diproses`);
    setShowWithdraw(false);
    setWithdrawAmount("");
    setWithdrawDesc("Penarikan jajan mingguan");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tabungan / Savings</h1>
        <p className="text-sm text-muted-foreground">Kelola tabungan santri — cari santri untuk melihat detail transaksi</p>
      </div>

      {/* Search Bar */}
      {!selectedStudent && (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama santri atau NIS..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              className="pl-10 h-12 text-base"
            />
            {search && (
              <button onClick={() => { setSearch(""); setShowDropdown(false); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Dropdown Results */}
          {showDropdown && filteredStudents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-20 top-full mt-1 w-full bg-card border rounded-xl shadow-lg overflow-hidden"
            >
              {filteredStudents.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSelectStudent(s)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors text-left border-b last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-[11px] text-muted-foreground">NIS: {s.nis} · {s.class}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{formatRp(s.balance)}</p>
                    <p className="text-[10px] text-muted-foreground">Saldo</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {showDropdown && search.length >= 2 && filteredStudents.length === 0 && (
            <div className="absolute z-20 top-full mt-1 w-full bg-card border rounded-xl shadow-lg p-6 text-center">
              <p className="text-sm text-muted-foreground">Santri tidak ditemukan</p>
            </div>
          )}

          {/* Empty State */}
          {search.length < 2 && (
            <div className="mt-12 text-center">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <PiggyBank className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Cari Santri</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Ketik minimal 2 karakter nama atau NIS santri untuk melihat detail tabungan dan transaksi.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Student Detail View */}
      {selectedStudent && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <button onClick={() => setSelectedStudent(null)} className="flex items-center gap-1 text-sm text-primary hover:underline">
            <ChevronLeft className="h-4 w-4" />
            Kembali ke pencarian
          </button>

          {/* Balance Card */}
          <div className="rounded-2xl gradient-primary p-6 text-primary-foreground">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-primary-foreground/70 text-xs mb-1">Saldo Tabungan</p>
                <p className="text-3xl font-extrabold">{formatRp(selectedStudent.balance)}</p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="gap-1.5 text-xs bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
                onClick={() => setShowWithdraw(true)}
              >
                <MinusCircle className="h-3.5 w-3.5" />
                Penarikan
              </Button>
            </div>
            <p className="text-primary-foreground/60 text-xs">{selectedStudent.name} · NIS {selectedStudent.nis} · {selectedStudent.class}</p>

            <div className="grid grid-cols-2 gap-4 mt-5">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 mb-1">
                  <ArrowUpRight className="h-3.5 w-3.5 text-green-300" />
                  <p className="text-[11px] text-primary-foreground/70">Total Setoran</p>
                </div>
                <p className="font-bold text-sm">
                  {formatRp(selectedStudent.transactions.filter(t => t.type === "deposit").reduce((s, t) => s + t.amount, 0))}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 mb-1">
                  <ArrowDownRight className="h-3.5 w-3.5 text-red-300" />
                  <p className="text-[11px] text-primary-foreground/70">Total Penarikan</p>
                </div>
                <p className="font-bold text-sm">
                  {formatRp(selectedStudent.transactions.filter(t => t.type === "withdraw").reduce((s, t) => s + t.amount, 0))}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-card border rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b">
              <h3 className="text-sm font-semibold text-foreground">Riwayat Transaksi</h3>
              <p className="text-xs text-muted-foreground">{selectedStudent.transactions.length} transaksi tercatat</p>
            </div>
            <div className="divide-y">
              {selectedStudent.transactions.map((t) => {
                // Calculate running balance
                const idx = selectedStudent.transactions.indexOf(t);
                const laterTxs = selectedStudent.transactions.slice(0, idx + 1);
                const runningBal = computeBalance(selectedStudent.transactions) -
                  selectedStudent.transactions.slice(0, idx).reduce((s, tx) => tx.type === "deposit" ? s + tx.amount : s - tx.amount, 0) +
                  selectedStudent.transactions.slice(0, idx).reduce((s, tx) => tx.type === "deposit" ? s + tx.amount : s - tx.amount, 0);

                return (
                  <div key={t.id} className="flex items-center px-5 py-3.5 gap-4">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                      t.type === "deposit" ? "bg-green-100" : "bg-red-100"
                    }`}>
                      {t.type === "deposit" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{t.description}</p>
                      <p className="text-[10px] text-muted-foreground">{t.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${t.type === "deposit" ? "text-green-600" : "text-red-500"}`}>
                        {t.type === "deposit" ? "+" : "-"}{formatRp(t.amount)}
                      </p>
                      <Badge variant="outline" className="text-[10px]">{t.type === "deposit" ? "Setoran" : "Penarikan"}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Withdraw Dialog */}
      <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MinusCircle className="h-5 w-5 text-red-500" />
              Penarikan Tabungan
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Santri</p>
                <p className="text-sm font-medium text-foreground">{selectedStudent?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Saldo saat ini</p>
                <p className="text-sm font-bold text-primary">{selectedStudent && formatRp(selectedStudent.balance)}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Jumlah Penarikan</label>
              <Input
                type="number"
                placeholder="Masukkan jumlah"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="text-lg font-semibold"
              />
              {Number(withdrawAmount) > 0 && (
                <p className="text-xs text-muted-foreground mt-1">{formatRp(Number(withdrawAmount))}</p>
              )}
              {selectedStudent && Number(withdrawAmount) > selectedStudent.balance && (
                <p className="text-xs text-red-500 mt-1">Saldo tidak mencukupi</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Keterangan</label>
              <Input
                placeholder="Keterangan penarikan"
                value={withdrawDesc}
                onChange={(e) => setWithdrawDesc(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              variant="destructive"
              disabled={!withdrawAmount || Number(withdrawAmount) <= 0 || (selectedStudent ? Number(withdrawAmount) > selectedStudent.balance : true)}
              onClick={handleWithdraw}
            >
              Proses Penarikan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Savings;
