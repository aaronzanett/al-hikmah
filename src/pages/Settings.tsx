import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    institutionName: "Pesantren BoardingCore",
    address: "Jl. Pesantren No. 1, Bandung, Jawa Barat",
    phone: "022-1234567",
    email: "admin@boardingcore.id",
    microFee: "500",
    paymentGateway: "midtrans",
    language: "bilingual",
    timezone: "Asia/Jakarta",
  });

  const update = (key: string, value: string) => setSettings((p) => ({ ...p, [key]: value }));

  const handleSave = () => {
    toast({ title: "Pengaturan berhasil disimpan / Settings saved successfully" });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6">
        <h1 className="text-lg font-bold">Pengaturan / Settings</h1>
        <p className="text-sm text-muted-foreground">Konfigurasi sistem</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
          <h3 className="text-sm font-semibold">Profil Pesantren / Institution Profile</h3>
          <div className="space-y-2">
            <Label>Nama Pesantren / Institution Name</Label>
            <Input value={settings.institutionName} onChange={(e) => update("institutionName", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Alamat / Address</Label>
            <Textarea value={settings.address} onChange={(e) => update("address", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Telepon / Phone</Label>
              <Input value={settings.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={settings.email} onChange={(e) => update("email", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
          <h3 className="text-sm font-semibold">Keuangan / Finance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Micro-Fee per Transaksi (Rp)</Label>
              <Input type="number" value={settings.microFee} onChange={(e) => update("microFee", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Payment Gateway</Label>
              <Select value={settings.paymentGateway} onValueChange={(v) => update("paymentGateway", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="midtrans">Midtrans</SelectItem>
                  <SelectItem value="xendit">Xendit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
          <h3 className="text-sm font-semibold">Sistem / System</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bahasa / Language</Label>
              <Select value={settings.language} onValueChange={(v) => update("language", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bilingual">Bilingual (ID/EN)</SelectItem>
                  <SelectItem value="id">Bahasa Indonesia</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Zona Waktu / Timezone</Label>
              <Select value={settings.timezone} onValueChange={(v) => update("timezone", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Jakarta">WIB (Asia/Jakarta)</SelectItem>
                  <SelectItem value="Asia/Makassar">WITA (Asia/Makassar)</SelectItem>
                  <SelectItem value="Asia/Jayapura">WIT (Asia/Jayapura)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Simpan Pengaturan / Save Settings</Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
