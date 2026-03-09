import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type BillStatus = "paid" | "unpaid" | "overdue";

interface Bill {
  id: string;
  name: string;
  amount: string;
  due: string;
  status: BillStatus;
  category: string;
  paidAt?: string;
}

const bills: Bill[] = [
  { id: "1", name: "SPP Maret 2026", amount: "Rp 750.000", due: "31 Mar 2026", status: "unpaid", category: "SPP" },
  { id: "2", name: "Biaya Kitab Semester Genap", amount: "Rp 250.000", due: "15 Mar 2026", status: "unpaid", category: "Perlengkapan" },
  { id: "3", name: "SPP Februari 2026", amount: "Rp 750.000", due: "28 Feb 2026", status: "paid", category: "SPP", paidAt: "20 Feb 2026" },
  { id: "4", name: "Biaya Seragam", amount: "Rp 350.000", due: "15 Feb 2026", status: "paid", category: "Perlengkapan", paidAt: "10 Feb 2026" },
  { id: "5", name: "SPP Januari 2026", amount: "Rp 750.000", due: "31 Jan 2026", status: "paid", category: "SPP", paidAt: "25 Jan 2026" },
  { id: "6", name: "Biaya Ekskul Tahfidz", amount: "Rp 150.000", due: "10 Jan 2026", status: "overdue", category: "Ekskul" },
];

const statusConfig: Record<BillStatus, { icon: React.ElementType; label: string; bg: string; color: string }> = {
  paid: { icon: CheckCircle2, label: "Lunas", bg: "bg-green-100 text-green-700", color: "text-green-600" },
  unpaid: { icon: AlertCircle, label: "Belum Bayar", bg: "bg-amber-100 text-amber-700", color: "text-amber-600" },
  overdue: { icon: Clock, label: "Terlambat", bg: "bg-red-100 text-red-700", color: "text-red-600" },
};

const PortalBills = () => {
  const { toast } = useToast();
  const totalUnpaid = bills.filter(b => b.status !== "paid").length;

  const handlePay = (bill: Bill) => {
    toast({
      title: "Fitur Pembayaran",
      description: `Proses pembayaran ${bill.name} akan segera tersedia via payment gateway.`,
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <h2 className="text-base font-bold text-foreground">Tagihan & Pembayaran</h2>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Tagihan", value: bills.length, color: "text-foreground" },
          { label: "Belum Lunas", value: totalUnpaid, color: "text-amber-600" },
          { label: "Sudah Lunas", value: bills.filter(b => b.status === "paid").length, color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-card border rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Unpaid Bills (action needed) */}
      {bills.filter(b => b.status !== "paid").length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-amber-800">Tagihan Perlu Dibayar</h3>
          </div>
          <div className="space-y-3">
            {bills.filter(b => b.status !== "paid").map((bill) => {
              const cfg = statusConfig[bill.status];
              return (
                <div key={bill.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-100">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{bill.name}</p>
                    <p className="text-[10px] text-muted-foreground">Jatuh tempo: {bill.due}</p>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-1 inline-block ${cfg.bg}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-bold text-foreground mb-1.5">{bill.amount}</p>
                    <Button size="sm" className="h-7 text-xs gap-1" onClick={() => handlePay(bill)}>
                      <CreditCard className="h-3 w-3" />
                      Bayar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Bills */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b">
          <h3 className="text-sm font-semibold text-foreground">Riwayat Tagihan</h3>
        </div>
        <div className="divide-y">
          {bills.map((bill) => {
            const cfg = statusConfig[bill.status];
            const Icon = cfg.icon;
            return (
              <div key={bill.id} className="flex items-center px-5 py-3.5 gap-4">
                <Icon className={`h-4 w-4 shrink-0 ${cfg.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{bill.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {bill.status === "paid" ? `Dibayar: ${bill.paidAt}` : `Jatuh tempo: ${bill.due}`}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-foreground">{bill.amount}</p>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${cfg.bg}`}>
                    {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default PortalBills;
