import { useState } from "react";
import { motion } from "framer-motion";
import { PiggyBank, TrendingUp, ArrowUpRight, ArrowDownRight, Plus, CreditCard, Wallet, Building2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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

const paymentMethods = [
  { id: "gopay", label: "GoPay", icon: Wallet, color: "bg-green-100 text-green-600" },
  { id: "ovo", label: "OVO", icon: Wallet, color: "bg-purple-100 text-purple-600" },
  { id: "dana", label: "DANA", icon: Wallet, color: "bg-blue-100 text-blue-600" },
  { id: "va_bca", label: "VA BCA", icon: Building2, color: "bg-blue-100 text-blue-700" },
  { id: "va_bni", label: "VA BNI", icon: Building2, color: "bg-orange-100 text-orange-600" },
  { id: "va_mandiri", label: "VA Mandiri", icon: Building2, color: "bg-amber-100 text-amber-700" },
];

const quickAmounts = [50000, 100000, 200000, 500000];
const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

const PortalSavings = () => {
  const [showTransfer, setShowTransfer] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [step, setStep] = useState<"amount" | "method" | "confirm">("amount");

  const handleSubmitTransfer = () => {
    toast.success("Transfer berhasil diproses! Saldo akan bertambah setelah pembayaran dikonfirmasi.", { duration: 4000 });
    setShowTransfer(false);
    setAmount("");
    setSelectedMethod("");
    setStep("amount");
  };

  const numAmount = Number(amount) || 0;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">Tabungan Santri</h2>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setShowTransfer(true)}>
          <Plus className="h-3.5 w-3.5" />
          Transfer Saldo
        </Button>
      </div>

      {/* Balance Card */}
      <div className="rounded-2xl gradient-primary p-6 text-primary-foreground">
        <div className="flex items-center gap-2 mb-2">
          <PiggyBank className="h-5 w-5 text-primary-foreground/70" />
          <p className="text-primary-foreground/70 text-sm">Total Saldo Tabungan</p>
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

      {/* Transfer Dialog */}
      <Dialog open={showTransfer} onOpenChange={(open) => { setShowTransfer(open); if (!open) { setStep("amount"); setAmount(""); setSelectedMethod(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Transfer Saldo Tabungan
            </DialogTitle>
          </DialogHeader>

          {step === "amount" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Jumlah Transfer</label>
                <Input
                  type="number"
                  placeholder="Masukkan jumlah (min. Rp 10.000)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg font-semibold"
                  min={10000}
                />
                {numAmount > 0 && <p className="text-xs text-muted-foreground mt-1">{formatRp(numAmount)}</p>}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Pilih cepat:</p>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map(a => (
                    <button
                      key={a}
                      onClick={() => setAmount(a.toString())}
                      className={`px-2 py-2 text-xs rounded-lg border font-medium transition-colors ${
                        amount === a.toString() ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"
                      }`}
                    >
                      {formatRp(a)}
                    </button>
                  ))}
                </div>
              </div>
              <Button className="w-full" disabled={numAmount < 10000} onClick={() => setStep("method")}>
                Lanjutkan
              </Button>
            </div>
          )}

          {step === "method" && (
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Jumlah transfer:</span>
                <span className="text-sm font-bold text-foreground">{formatRp(numAmount)}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Pilih Metode Pembayaran</p>
                <div className="space-y-2">
                  {paymentMethods.map(pm => (
                    <button
                      key={pm.id}
                      onClick={() => setSelectedMethod(pm.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        selectedMethod === pm.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted"
                      }`}
                    >
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${pm.color}`}>
                        <pm.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{pm.label}</span>
                      {selectedMethod === pm.id && (
                        <div className="ml-auto h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep("amount")}>Kembali</Button>
                <Button className="flex-1" disabled={!selectedMethod} onClick={() => setStep("confirm")}>Lanjutkan</Button>
              </div>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Santri</span>
                  <span className="font-medium text-foreground">Muhammad Azzam Ridwan</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jumlah Transfer</span>
                  <span className="font-bold text-foreground">{formatRp(numAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Biaya Admin</span>
                  <span className="font-medium text-foreground">Rp 0</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Metode</span>
                  <span className="font-medium text-foreground">{paymentMethods.find(p => p.id === selectedMethod)?.label}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-sm font-semibold text-foreground">Total Bayar</span>
                  <span className="text-lg font-bold text-primary">{formatRp(numAmount)}</span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground text-center">
                Pembayaran akan diproses melalui <span className="font-semibold">Midtrans</span>. Saldo tabungan akan bertambah setelah pembayaran berhasil dikonfirmasi.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep("method")}>Kembali</Button>
                <Button className="flex-1" onClick={handleSubmitTransfer}>Bayar Sekarang</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PortalSavings;
