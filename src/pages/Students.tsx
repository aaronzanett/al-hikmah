import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Search, Filter, Plus, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockStudents = [
  { nis: "2024001", name: "Ahmad Fauzi", gender: "L", branch: "Pusat", class: "X-A", room: "Asrama 1 - K.01", year: 2024, status: "Aktif" },
  { nis: "2024002", name: "Siti Aisyah", gender: "P", branch: "Pusat", class: "X-B", room: "Asrama 2 - K.05", year: 2024, status: "Aktif" },
  { nis: "2024003", name: "Muhammad Rizki", gender: "L", branch: "Cabang 1", class: "XI-A", room: "Asrama 3 - K.02", year: 2023, status: "Aktif" },
  { nis: "2023004", name: "Fatimah Zahra", gender: "P", branch: "Pusat", class: "XII-A", room: "Asrama 2 - K.08", year: 2022, status: "Aktif" },
  { nis: "2023005", name: "Umar Hadi", gender: "L", branch: "Cabang 2", class: "XI-B", room: "Asrama 1 - K.04", year: 2023, status: "Cuti" },
  { nis: "2024006", name: "Khadijah Nur", gender: "P", branch: "Cabang 1", class: "X-A", room: "Asrama 4 - K.01", year: 2024, status: "Aktif" },
  { nis: "2022007", name: "Ibrahim Malik", gender: "L", branch: "Pusat", class: "XII-B", room: "Asrama 1 - K.06", year: 2022, status: "Alumni" },
  { nis: "2024008", name: "Aisyah Putri", gender: "P", branch: "Cabang 2", class: "X-C", room: "Asrama 4 - K.03", year: 2024, status: "Aktif" },
];

const statusVariant = (status: string) => {
  switch (status) {
    case "Aktif": return "default";
    case "Cuti": return "secondary";
    case "Alumni": return "outline";
    default: return "default";
  }
};

const Students = () => {
  return (
    <DashboardLayout title="Santri / Students" subtitle="Kelola data santri pesantren">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari santri... / Search students..."
              className="w-full rounded-lg border bg-card pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Tambah Santri
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border rounded-xl shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">NIS</TableHead>
                <TableHead className="text-xs">Nama / Name</TableHead>
                <TableHead className="text-xs">L/P</TableHead>
                <TableHead className="text-xs">Cabang / Branch</TableHead>
                <TableHead className="text-xs">Kelas / Class</TableHead>
                <TableHead className="text-xs">Kamar / Room</TableHead>
                <TableHead className="text-xs">Tahun / Year</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStudents.map((s) => (
                <TableRow key={s.nis} className="cursor-pointer">
                  <TableCell className="text-xs font-mono">{s.nis}</TableCell>
                  <TableCell className="text-sm font-medium">{s.name}</TableCell>
                  <TableCell className="text-xs">{s.gender}</TableCell>
                  <TableCell className="text-xs">{s.branch}</TableCell>
                  <TableCell className="text-xs">{s.class}</TableCell>
                  <TableCell className="text-xs">{s.room}</TableCell>
                  <TableCell className="text-xs">{s.year}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(s.status)} className="text-[10px]">
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button className="p-1 rounded hover:bg-muted">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t text-xs text-muted-foreground">
            <span>Menampilkan 1-8 dari 380 santri</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded hover:bg-muted"><ChevronLeft className="h-4 w-4" /></button>
              <button className="px-2 py-1 rounded bg-primary text-primary-foreground font-medium">1</button>
              <button className="px-2 py-1 rounded hover:bg-muted">2</button>
              <button className="px-2 py-1 rounded hover:bg-muted">3</button>
              <button className="p-1 rounded hover:bg-muted"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Students;
