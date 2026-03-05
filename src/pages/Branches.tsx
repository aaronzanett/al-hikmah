import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Building2, Users, MapPin, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const branches = [
  { id: 1, name: "Pesantren Pusat", location: "Bandung, Jawa Barat", students: 180, rooms: 24, status: "Aktif" },
  { id: 2, name: "Cabang 1 - Al Hikmah", location: "Garut, Jawa Barat", students: 120, rooms: 16, status: "Aktif" },
  { id: 3, name: "Cabang 2 - Ar Rahman", location: "Tasikmalaya, Jawa Barat", students: 80, rooms: 10, status: "Aktif" },
];

const Branches = () => {
  return (
    <DashboardLayout title="Cabang / Branches" subtitle="Kelola cabang pesantren">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">{branches.length} cabang terdaftar</p>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Tambah Cabang
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((branch, i) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <button className="p-1 rounded hover:bg-muted">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <h3 className="font-semibold text-sm mb-1">{branch.name}</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                <MapPin className="h-3 w-3" />
                {branch.location}
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{branch.students} santri</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>{branch.rooms} kamar</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Branches;
