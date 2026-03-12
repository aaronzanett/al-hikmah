import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface ContactInfo {
  id: string;
  type: string;
  label: string;
  value: string;
  isActive: boolean;
}

const initialContacts: ContactInfo[] = [
  { id: "C001", type: "Alamat", label: "Alamat Pesantren", value: "Jl. Pondok Pesantren No. 123, Kec. Cikarang, Kabupaten Bekasi, Jawa Barat 17530", isActive: true },
  { id: "C002", type: "Telepon", label: "Telepon Kantor", value: "(021) 8888-1234", isActive: true },
  { id: "C003", type: "WhatsApp", label: "WhatsApp Pendaftaran", value: "+62 812-3456-7890", isActive: true },
  { id: "C004", type: "Email", label: "Email Resmi", value: "info@alhikmah.sch.id", isActive: true },
  { id: "C005", type: "Jam Operasional", label: "Jam Kerja", value: "Senin–Sabtu: 07.00–16.00 WIB", isActive: true },
  { id: "C006", type: "Media Sosial", label: "Instagram", value: "@pesantren.alhikmah", isActive: true },
  { id: "C007", type: "Media Sosial", label: "YouTube", value: "Pesantren Al-Hikmah Official", isActive: false },
];

const contactTypes = [
  { value: "Alamat", label: "Alamat / Address" },
  { value: "Telepon", label: "Telepon / Phone" },
  { value: "WhatsApp", label: "WhatsApp" },
  { value: "Email", label: "Email" },
  { value: "Jam Operasional", label: "Jam Operasional / Hours" },
  { value: "Media Sosial", label: "Media Sosial / Social Media" },
];

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

  const [contacts, setContacts] = useState<ContactInfo[]>(initialContacts);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null);
  const [contactForm, setContactForm] = useState({ type: "Telepon", label: "", value: "", isActive: true });

  const update = (key: string, value: string) => setSettings((p) => ({ ...p, [key]: value }));

  const handleSave = () => {
    toast({ title: "Pengaturan berhasil disimpan / Settings saved successfully" });
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setContactForm({ type: "Telepon", label: "", value: "", isActive: true });
    setContactDialogOpen(true);
  };

  const handleEditContact = (contact: ContactInfo) => {
    setEditingContact(contact);
    setContactForm({ type: contact.type, label: contact.label, value: contact.value, isActive: contact.isActive });
    setContactDialogOpen(true);
  };

  const handleSaveContact = () => {
    if (editingContact) {
      setContacts(prev => prev.map(c => c.id === editingContact.id ? { ...c, ...contactForm } : c));
      toast({ title: "Kontak berhasil diperbarui / Contact updated" });
    } else {
      const newId = `C${String(contacts.length + 1).padStart(3, "0")}`;
      setContacts(prev => [...prev, { id: newId, ...contactForm }]);
      toast({ title: "Kontak berhasil ditambahkan / Contact added" });
    }
    setContactDialogOpen(false);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    toast({ title: "Kontak berhasil dihapus / Contact deleted" });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6">
        <h1 className="text-lg font-bold">Pengaturan / Settings</h1>
        <p className="text-sm text-muted-foreground">Konfigurasi sistem dan informasi pesantren</p>
      </div>

      <Tabs defaultValue="general" className="max-w-4xl">
        <TabsList>
          <TabsTrigger value="general">Umum / General</TabsTrigger>
          <TabsTrigger value="finance">Keuangan / Finance</TabsTrigger>
          <TabsTrigger value="system">Sistem / System</TabsTrigger>
          <TabsTrigger value="contact">Kontak / Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-4">
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
          <div className="flex justify-end">
            <Button onClick={handleSave}>Simpan / Save</Button>
          </div>
        </TabsContent>

        <TabsContent value="finance" className="space-y-6 mt-4">
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
          <div className="flex justify-end">
            <Button onClick={handleSave}>Simpan / Save</Button>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6 mt-4">
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
            <Button onClick={handleSave}>Simpan / Save</Button>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6 mt-4">
          <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Informasi Kontak / Contact Information</h3>
              <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={handleAddContact}>
                    <Plus className="h-4 w-4 mr-1" /> Tambah / Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingContact ? "Edit Kontak" : "Tambah Kontak / Add Contact"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tipe / Type</Label>
                      <Select value={contactForm.type} onValueChange={(v) => setContactForm(p => ({ ...p, type: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {contactTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input value={contactForm.label} onChange={(e) => setContactForm(p => ({ ...p, label: e.target.value }))} placeholder="Nama label kontak" />
                    </div>
                    <div className="space-y-2">
                      <Label>Nilai / Value</Label>
                      <Input value={contactForm.value} onChange={(e) => setContactForm(p => ({ ...p, value: e.target.value }))} placeholder="Informasi kontak" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Status</Label>
                      <Select value={contactForm.isActive ? "active" : "inactive"} onValueChange={(v) => setContactForm(p => ({ ...p, isActive: v === "active" }))}>
                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Aktif / Active</SelectItem>
                          <SelectItem value="inactive">Nonaktif / Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveContact}>Simpan / Save</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipe / Type</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Nilai / Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{contact.type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{contact.label}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate">{contact.value}</TableCell>
                    <TableCell>
                      <Badge variant={contact.isActive ? "default" : "outline"} className="text-xs">
                        {contact.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditContact(contact)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteContact(contact.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Settings;
