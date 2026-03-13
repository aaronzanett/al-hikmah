import { useState, useRef } from "react";
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
import { Plus, Pencil, Trash2, Phone, Mail, MapPin, Clock, MessageCircle, Instagram, Youtube, Facebook, Twitter, Globe, Music2, ShieldCheck, Upload, ImageIcon } from "lucide-react";

// ─── Types ───
interface ContactInfo {
  id: string;
  type: string;
  label: string;
  value: string;
  isActive: boolean;
}

interface SocialMedia {
  id: string;
  platform: string;
  username: string;
  url: string;
  isActive: boolean;
}

// ─── Social media platforms (WhatsApp included here) ───
const socialPlatforms = [
  { value: "Instagram", icon: Instagram },
  { value: "YouTube", icon: Youtube },
  { value: "Facebook", icon: Facebook },
  { value: "Twitter / X", icon: Twitter },
  { value: "TikTok", icon: Music2 },
  { value: "WhatsApp", icon: MessageCircle },
  { value: "Website", icon: Globe },
];

const getSocialIcon = (platform: string) => {
  const found = socialPlatforms.find(p => p.value === platform);
  return found ? found.icon : Globe;
};

// ─── Contact types (phone, email, hours only — no WhatsApp) ───
const contactTypes = [
  { value: "Telepon", label: "Telepon / Phone" },
  { value: "Email", label: "Email" },
  { value: "Jam Operasional", label: "Jam Operasional / Hours" },
];

const getContactIcon = (type: string) => {
  switch (type) {
    case "Telepon": return Phone;
    case "Email": return Mail;
    case "Jam Operasional": return Clock;
    default: return Phone;
  }
};

// ─── Initial data ───
const initialContacts: ContactInfo[] = [
  { id: "C001", type: "Telepon", label: "Telepon Kantor", value: "(021) 8888-1234", isActive: true },
  { id: "C002", type: "Email", label: "Email Resmi", value: "info@alhikmah.sch.id", isActive: true },
  { id: "C003", type: "Jam Operasional", label: "Jam Kerja", value: "Senin–Sabtu: 07.00–16.00 WIB", isActive: true },
];

const initialSocials: SocialMedia[] = [
  { id: "S001", platform: "Instagram", username: "@pesantren.alhikmah", url: "https://instagram.com/pesantren.alhikmah", isActive: true },
  { id: "S002", platform: "YouTube", username: "Pesantren Al-Hikmah Official", url: "https://youtube.com/@alhikmah", isActive: true },
  { id: "S003", platform: "Facebook", username: "Pesantren Al-Hikmah", url: "https://facebook.com/pesantren.alhikmah", isActive: false },
  { id: "S004", platform: "WhatsApp", username: "+62 812-3456-7890", url: "https://wa.me/6281234567890", isActive: true },
];

const Settings = () => {
  const { toast } = useToast();
  const logoInputRef = useRef<HTMLInputElement>(null);

  // ─── Institution info state (no phone/email/whatsapp here) ───
  const [settings, setSettings] = useState({
    institutionName: "Pesantren Al-Hikmah",
    tagline: "Modern Islamic Boarding School",
    description: "Mencetak generasi Qur'ani yang berilmu, beramal, dan berakhlak mulia sejak 1985.",
    address: "Jl. Pondok Pesantren No. 123, Kec. Cikarang, Kabupaten Bekasi, Jawa Barat 17530",
    microFee: "500",
    paymentGateway: "midtrans",
    language: "bilingual",
    timezone: "Asia/Jakarta",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // ─── Contacts state ───
  const [contacts, setContacts] = useState<ContactInfo[]>(initialContacts);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null);
  const [contactForm, setContactForm] = useState({ type: "Telepon", label: "", value: "", isActive: true });

  // ─── Social media state ───
  const [socials, setSocials] = useState<SocialMedia[]>(initialSocials);
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialMedia | null>(null);
  const [socialForm, setSocialForm] = useState({ platform: "Instagram", username: "", url: "", isActive: true });

  const update = (key: string, value: string) => setSettings((p) => ({ ...p, [key]: value }));

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
      toast({ title: "Logo berhasil diunggah / Logo uploaded" });
    }
  };

  const handleSave = () => {
    toast({ title: "Pengaturan berhasil disimpan / Settings saved successfully" });
  };

  // ─── Contact handlers ───
  const handleAddContact = () => {
    setEditingContact(null);
    setContactForm({ type: "Telepon", label: "", value: "", isActive: true });
    setContactDialogOpen(true);
  };
  const handleEditContact = (c: ContactInfo) => {
    setEditingContact(c);
    setContactForm({ type: c.type, label: c.label, value: c.value, isActive: c.isActive });
    setContactDialogOpen(true);
  };
  const handleSaveContact = () => {
    if (editingContact) {
      setContacts(prev => prev.map(c => c.id === editingContact.id ? { ...c, ...contactForm } : c));
      toast({ title: "Kontak diperbarui / Contact updated" });
    } else {
      const newId = `C${String(contacts.length + 1).padStart(3, "0")}`;
      setContacts(prev => [...prev, { id: newId, ...contactForm }]);
      toast({ title: "Kontak ditambahkan / Contact added" });
    }
    setContactDialogOpen(false);
  };
  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    toast({ title: "Kontak dihapus / Contact deleted" });
  };

  // ─── Social media handlers ───
  const handleAddSocial = () => {
    setEditingSocial(null);
    setSocialForm({ platform: "Instagram", username: "", url: "", isActive: true });
    setSocialDialogOpen(true);
  };
  const handleEditSocial = (s: SocialMedia) => {
    setEditingSocial(s);
    setSocialForm({ platform: s.platform, username: s.username, url: s.url, isActive: s.isActive });
    setSocialDialogOpen(true);
  };
  const handleSaveSocial = () => {
    if (editingSocial) {
      setSocials(prev => prev.map(s => s.id === editingSocial.id ? { ...s, ...socialForm } : s));
      toast({ title: "Media sosial diperbarui / Social media updated" });
    } else {
      const newId = `S${String(socials.length + 1).padStart(3, "0")}`;
      setSocials(prev => [...prev, { id: newId, ...socialForm }]);
      toast({ title: "Media sosial ditambahkan / Social media added" });
    }
    setSocialDialogOpen(false);
  };
  const handleDeleteSocial = (id: string) => {
    setSocials(prev => prev.filter(s => s.id !== id));
    toast({ title: "Media sosial dihapus / Social media deleted" });
  };

  // ─── Derived data for footer preview (only active items) ───
  const activeContacts = contacts.filter(c => c.isActive);
  const activeSocials = socials.filter(s => s.isActive);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6">
        <h1 className="text-lg font-bold">Pengaturan / Settings</h1>
        <p className="text-sm text-muted-foreground">Konfigurasi sistem dan informasi pesantren</p>
      </div>

      <Tabs defaultValue="general" className="max-w-5xl">
        <TabsList>
          <TabsTrigger value="general">Umum / General</TabsTrigger>
          <TabsTrigger value="finance">Keuangan / Finance</TabsTrigger>
          <TabsTrigger value="system">Sistem / System</TabsTrigger>
        </TabsList>

        {/* ═══════════ GENERAL TAB ═══════════ */}
        <TabsContent value="general" className="space-y-6 mt-4">
          {/* ── Institution Profile with Logo ── */}
          <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
            <h3 className="text-sm font-semibold">Profil Pesantren / Institution Profile</h3>
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Logo upload & preview */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="relative h-28 w-28 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => logoInputRef.current?.click()}
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="h-full w-full object-contain p-1" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <ImageIcon className="h-8 w-8" />
                      <span className="text-[10px]">Logo</span>
                    </div>
                  )}
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => logoInputRef.current?.click()}>
                  <Upload className="h-3 w-3 mr-1" /> Unggah Logo
                </Button>
              </div>

              {/* Profile fields */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nama Pesantren / Institution Name</Label>
                    <Input value={settings.institutionName} onChange={(e) => update("institutionName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input value={settings.tagline} onChange={(e) => update("tagline", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi / Description</Label>
                  <Textarea value={settings.description} onChange={(e) => update("description", e.target.value)} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Alamat / Address</Label>
                  <Textarea value={settings.address} onChange={(e) => update("address", e.target.value)} rows={2} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Additional Contacts (Phone, Email, Hours) ── */}
          <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Kontak / Contacts</h3>
              <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={handleAddContact}><Plus className="h-4 w-4 mr-1" /> Tambah / Add</Button>
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
                {contacts.map((c) => {
                  const Icon = getContactIcon(c.type);
                  return (
                    <TableRow key={c.id}>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="secondary" className="text-xs">{c.type}</Badge>
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{c.label}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate">{c.value}</TableCell>
                      <TableCell>
                        <Badge variant={c.isActive ? "default" : "outline"} className="text-xs">{c.isActive ? "Aktif" : "Nonaktif"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditContact(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteContact(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* ── Social Media (includes WhatsApp) ── */}
          <div className="bg-card border rounded-xl p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Media Sosial / Social Media</h3>
              <Dialog open={socialDialogOpen} onOpenChange={setSocialDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={handleAddSocial}><Plus className="h-4 w-4 mr-1" /> Tambah / Add</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingSocial ? "Edit Media Sosial" : "Tambah Media Sosial / Add Social Media"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Platform</Label>
                      <Select value={socialForm.platform} onValueChange={(v) => setSocialForm(p => ({ ...p, platform: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {socialPlatforms.map(p => {
                            const Icon = p.icon;
                            return (
                              <SelectItem key={p.value} value={p.value}>
                                <span className="flex items-center gap-2"><Icon className="h-4 w-4" />{p.value}</span>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Username / Nama Akun</Label>
                      <Input value={socialForm.username} onChange={(e) => setSocialForm(p => ({ ...p, username: e.target.value }))} placeholder="@namaakun" />
                    </div>
                    <div className="space-y-2">
                      <Label>URL</Label>
                      <Input value={socialForm.url} onChange={(e) => setSocialForm(p => ({ ...p, url: e.target.value }))} placeholder="https://..." />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Status</Label>
                      <Select value={socialForm.isActive ? "active" : "inactive"} onValueChange={(v) => setSocialForm(p => ({ ...p, isActive: v === "active" }))}>
                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Aktif / Active</SelectItem>
                          <SelectItem value="inactive">Nonaktif / Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveSocial}>Simpan / Save</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {socials.map((s) => {
                  const Icon = getSocialIcon(s.platform);
                  return (
                    <TableRow key={s.id}>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{s.platform}</span>
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{s.username}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{s.url}</TableCell>
                      <TableCell>
                        <Badge variant={s.isActive ? "default" : "outline"} className="text-xs">{s.isActive ? "Aktif" : "Nonaktif"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditSocial(s)}><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteSocial(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Simpan Semua / Save All</Button>
          </div>

          {/* ═══════════ FOOTER PREVIEW ═══════════ */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Preview Footer</h3>
            <div className="border rounded-xl overflow-hidden">
              <footer className="bg-card border-t">
                <div className="px-6 py-8">
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Column 1: Brand */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo" className="h-7 w-7 rounded-md object-contain" />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                            <span className="text-[9px] font-bold text-primary-foreground">B</span>
                          </div>
                        )}
                        <div>
                          <span className="text-xs font-bold text-foreground block leading-none">{settings.institutionName}</span>
                          <span className="text-[9px] text-muted-foreground">{settings.tagline}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{settings.description}</p>
                    </div>

                    {/* Column 2: Menu */}
                    <div>
                      <h4 className="text-xs font-semibold text-foreground mb-3">Menu</h4>
                      <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                        <li>Tentang</li>
                        <li>Program</li>
                        <li>Galeri</li>
                        <li>Berita</li>
                      </ul>
                    </div>

                    {/* Column 3: Contact (from contacts table only) */}
                    <div>
                      <h4 className="text-xs font-semibold text-foreground mb-3">Kontak</h4>
                      <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                        {settings.address && (
                          <li className="flex items-start gap-1.5"><MapPin className="h-3 w-3 mt-0.5 shrink-0" /> {settings.address}</li>
                        )}
                        {activeContacts.map(c => {
                          const Icon = getContactIcon(c.type);
                          return (
                            <li key={c.id} className="flex items-center gap-1.5"><Icon className="h-3 w-3 shrink-0" /> {c.value}</li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Column 4: Social Media */}
                    <div>
                      <h4 className="text-xs font-semibold text-foreground mb-3">Media Sosial</h4>
                      {activeSocials.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {activeSocials.map(s => {
                            const Icon = getSocialIcon(s.platform);
                            return (
                              <div key={s.id} className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/50 rounded-md px-2 py-1">
                                <Icon className="h-3.5 w-3.5" />
                                <span>{s.username}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-[11px] text-muted-foreground italic">Belum ada media sosial aktif</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-[10px] text-muted-foreground">© {new Date().getFullYear()} {settings.institutionName}. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                      {activeSocials.map(s => {
                        const Icon = getSocialIcon(s.platform);
                        return (
                          <div key={s.id} className="h-6 w-6 rounded-full bg-muted flex items-center justify-center" title={s.platform}>
                            <Icon className="h-3 w-3 text-muted-foreground" />
                          </div>
                        );
                      })}
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground ml-2">
                        <ShieldCheck className="h-3 w-3" /> Login Administrator
                      </div>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </TabsContent>

        {/* ═══════════ FINANCE TAB ═══════════ */}
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

        {/* ═══════════ SYSTEM TAB ═══════════ */}
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
      </Tabs>
    </motion.div>
  );
};

export default Settings;
