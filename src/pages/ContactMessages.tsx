import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Eye, Trash2, Mail, MailOpen, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: "Belum Dibaca" | "Dibaca";
}

const initialMessages: Message[] = [
  { id: "M001", name: "Ahmad Fadillah", email: "ahmad@email.com", phone: "081234567890", subject: "Informasi Pendaftaran", message: "Assalamu'alaikum, saya ingin bertanya mengenai pendaftaran santri baru untuk tahun ajaran 2026/2027. Apakah masih ada kuota untuk jenjang MTs? Mohon informasi lengkap mengenai persyaratan dan biaya pendaftaran. Jazakallahu khairan.", date: "2026-03-08", status: "Belum Dibaca" },
  { id: "M002", name: "Siti Nurhaliza", email: "siti.nur@email.com", phone: "087654321098", subject: "Kunjungan Pesantren", message: "Assalamu'alaikum, kami sekeluarga ingin berkunjung ke pesantren untuk melihat langsung fasilitas dan kegiatan santri. Apakah ada jadwal kunjungan yang bisa kami ikuti? Terima kasih.", date: "2026-03-07", status: "Belum Dibaca" },
  { id: "M003", name: "H. Ridwan Kamil", email: "ridwan@email.com", phone: "085678901234", subject: "Kerja Sama Pendidikan", message: "Assalamu'alaikum, saya dari Yayasan Pendidikan Amanah ingin menawarkan kerja sama dalam bidang pengembangan kurikulum digital. Mohon bisa dihubungkan dengan pihak yang berwenang. Wassalam.", date: "2026-03-06", status: "Dibaca" },
  { id: "M004", name: "Fatimah Zahra", email: "fatimah.z@email.com", phone: "089012345678", subject: "Beasiswa Santri", message: "Assalamu'alaikum, apakah pesantren menyediakan program beasiswa untuk santri kurang mampu? Anak saya berprestasi di sekolah dan ingin melanjutkan pendidikan di pesantren. Mohon informasinya.", date: "2026-03-05", status: "Dibaca" },
  { id: "M005", name: "Usman Hakim", email: "usman.h@email.com", phone: "081345678901", subject: "Program Tahfidz", message: "Assalamu'alaikum, saya ingin mengetahui lebih detail tentang program tahfidz Al-Qur'an di pesantren. Berapa lama waktu yang dibutuhkan untuk menyelesaikan hafalan 30 juz? Syukron.", date: "2026-03-04", status: "Dibaca" },
  { id: "M006", name: "Aisyah Putri", email: "aisyah@email.com", phone: "082456789012", subject: "Fasilitas Asrama Putri", message: "Assalamu'alaikum, saya ingin bertanya mengenai fasilitas asrama putri. Apakah sudah tersedia asrama baru yang ber-AC? Mohon informasinya. Terima kasih.", date: "2026-03-03", status: "Belum Dibaca" },
];

const PAGE_SIZE = 10;

export default function ContactMessages() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewMessage, setViewMessage] = useState<Message | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<Message | null>(null);

  const filtered = useMemo(() => {
    if (!search) return messages;
    const q = search.toLowerCase();
    return messages.filter((m) =>
      m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q)
    );
  }, [messages, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const unreadCount = messages.filter(m => m.status === "Belum Dibaca").length;

  const handleView = (msg: Message) => {
    setViewMessage(msg);
    if (msg.status === "Belum Dibaca") {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: "Dibaca" as const } : m));
    }
  };

  const handleDelete = () => {
    if (deleteMessage) {
      setMessages(prev => prev.filter(m => m.id !== deleteMessage.id));
      toast({ title: "Pesan berhasil dihapus / Message deleted" });
    }
    setDeleteMessage(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6">
        <h1 className="text-lg font-bold">Pesan Masuk / Incoming Messages</h1>
        <p className="text-sm text-muted-foreground">
          Pesan dari pengunjung melalui form kontak di landing page.
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
              <Mail className="h-3 w-3" /> {unreadCount} belum dibaca
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari pesan... / Search messages..."
            className="w-full rounded-lg border bg-card pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs w-10"></TableHead>
              <TableHead className="text-xs">Pengirim / Sender</TableHead>
              <TableHead className="text-xs">Subjek / Subject</TableHead>
              <TableHead className="text-xs">Tanggal / Date</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs w-20">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                  Tidak ada pesan / No messages found
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((msg) => (
                <TableRow key={msg.id} className={cn(msg.status === "Belum Dibaca" && "bg-primary/[0.02]")}>
                  <TableCell>
                    {msg.status === "Belum Dibaca" ? (
                      <Mail className="h-4 w-4 text-primary" />
                    ) : (
                      <MailOpen className="h-4 w-4 text-muted-foreground/40" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className={cn("text-sm", msg.status === "Belum Dibaca" ? "font-semibold" : "font-medium")}>{msg.name}</p>
                      <p className="text-xs text-muted-foreground">{msg.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn("text-sm", msg.status === "Belum Dibaca" && "font-semibold")}>{msg.subject}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{msg.date}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${msg.status === "Belum Dibaca" ? "bg-info/10 text-info" : "bg-muted text-muted-foreground"}`}>
                      {msg.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleView(msg)} className="p-1.5 rounded hover:bg-muted" title="Lihat">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => setDeleteMessage(msg)} className="p-1.5 rounded hover:bg-muted" title="Hapus">
                        <Trash2 className="h-4 w-4 text-destructive/70" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-4 py-3 border-t text-xs text-muted-foreground">
          <span>
            {filtered.length > 0
              ? `Menampilkan ${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, filtered.length)} dari ${filtered.length}`
              : "Tidak ada pesan"}
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-muted disabled:opacity-30" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={cn("px-2 py-1 rounded", p === page ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted")}>
                {p}
              </button>
            ))}
            <button className="p-1 rounded hover:bg-muted disabled:opacity-30" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Message Dialog */}
      <Dialog open={!!viewMessage} onOpenChange={() => setViewMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Pesan / Message Detail</DialogTitle>
          </DialogHeader>
          {viewMessage && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{viewMessage.name}</p>
                  <p className="text-xs text-muted-foreground">{viewMessage.email} · {viewMessage.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {viewMessage.date}</span>
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{viewMessage.subject}</span>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border">
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{viewMessage.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteMessage} onOpenChange={() => setDeleteMessage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pesan / Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pesan dari {deleteMessage?.name}? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal / Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus / Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
