import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, mockUsers } from "@/contexts/AuthContext";
import { UserRole, roleDisplayNames } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Admin roles that can login through this page
const adminRoles: UserRole[] = [
  'super_admin',
  'branch_admin',
  'treasurer',
  'academic_staff',
  'dormitory_supervisor',
];

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('super_admin');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo: login with selected role
    const user = mockUsers[selectedRole];
    if (user) {
      login(user);
      toast({
        title: "Berhasil masuk / Login successful",
        description: `Selamat datang, ${user.name} (${roleDisplayNames[user.role].id})`,
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary flex-col justify-between p-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-gold">
            <span className="text-sm font-bold text-accent-foreground">B</span>
          </div>
          <h1 className="text-xl font-bold text-primary-foreground">BoardingCore</h1>
        </Link>
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80"
          >
            <ShieldCheck className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-primary-foreground leading-tight mb-4 font-display"
          >
            Portal Administrator
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-primary-foreground/70 text-sm max-w-md"
          >
            Akses penuh untuk mengelola seluruh sistem pesantren. Hanya untuk administrator resmi.
          </motion.p>
          
          {/* Role descriptions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 space-y-2 text-xs text-primary-foreground/60"
          >
            <p><span className="text-primary-foreground/80 font-medium">Super Admin:</span> Akses penuh ke seluruh sistem</p>
            <p><span className="text-primary-foreground/80 font-medium">Admin Cabang:</span> Kelola data santri & operasional cabang</p>
            <p><span className="text-primary-foreground/80 font-medium">Bendahara:</span> Kelola tagihan, pembayaran & keuangan</p>
            <p><span className="text-primary-foreground/80 font-medium">Staff Akademik:</span> Kelola nilai, absensi & jadwal</p>
            <p><span className="text-primary-foreground/80 font-medium">Musyrif:</span> Kelola kamar & kegiatan asrama</p>
          </motion.div>
        </div>
        <p className="text-primary-foreground/40 text-xs">© 2026 BoardingCore. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>

          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-gold">
              <span className="text-sm font-bold text-accent-foreground">B</span>
            </div>
            <h1 className="text-lg font-bold text-foreground">BoardingCore</h1>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Masuk — Administrator</h2>
              <p className="text-xs text-muted-foreground">Akses dashboard pesantren</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role Selector */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Peran / Role
              </label>
              <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih peran" />
                </SelectTrigger>
                <SelectContent>
                  {adminRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {roleDisplayNames[role].id} / {roleDisplayNames[role].en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                placeholder="admin@pesantren.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border bg-card px-4 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                <input type="checkbox" className="rounded border" />
                Ingat saya
              </label>
              <a href="#" className="text-primary font-medium hover:underline">Lupa sandi?</a>
            </div>

            <Button type="submit" className="w-full">
              Masuk sebagai {roleDisplayNames[selectedRole].id}
            </Button>
          </form>

          <div className="mt-6 p-3 rounded-lg bg-muted/50 border">
            <p className="text-xs text-muted-foreground text-center">
              <span className="font-medium text-foreground">Demo Mode:</span> Pilih role dan klik masuk untuk mencoba akses berdasarkan peran.
            </p>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Hubungi super admin jika Anda belum memiliki akun administrator.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
