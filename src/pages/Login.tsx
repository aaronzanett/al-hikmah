import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff, Users, GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, mockUsers } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LogoBrand } from "@/components/LogoBrand";

type Role = "guardian" | "student";

const roleConfig: Record<Role, { title: string; subtitle: string; icon: React.ElementType; placeholder: string; inputType: string; inputLabel: string }> = {
  guardian: {
    title: "Wali Santri",
    subtitle: "Pantau perkembangan dan tagihan anak Anda",
    icon: Users,
    placeholder: "email@example.com",
    inputType: "email",
    inputLabel: "Email",
  },
  student: {
    title: "Santri",
    subtitle: "Lihat jadwal, nilai, dan informasi akademik",
    icon: GraduationCap,
    placeholder: "Masukkan NIS atau username",
    inputType: "text",
    inputLabel: "NIS / Username",
  },
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState<Role>("guardian");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const config = roleConfig[activeRole];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo: login as guardian
    if (activeRole === "guardian") {
      const guardianUser = mockUsers.guardian;
      login(guardianUser);
      toast({
        title: "Berhasil masuk / Login successful",
        description: `Selamat datang, ${guardianUser.name}`,
      });
      navigate("/portal");
    } else {
      const studentUser = mockUsers.student;
      login(studentUser);
      toast({
        title: "Berhasil masuk / Login successful",
        description: `Selamat datang, ${studentUser.name}`,
      });
      navigate("/student");
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
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-primary-foreground leading-tight mb-4 font-display"
          >
            Portal Santri &<br />Wali Santri
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-primary-foreground/70 text-sm max-w-md"
          >
            Akses informasi akademik, keuangan, dan perkembangan santri dalam satu platform terintegrasi.
          </motion.p>
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

          {/* Role Switcher */}
          <div className="flex rounded-lg border bg-muted p-1 mb-6">
            {(["guardian", "student"] as Role[]).map((role) => {
              const Icon = roleConfig[role].icon;
              return (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-all ${
                    activeRole === role
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {roleConfig[role].title}
                </button>
              );
            })}
          </div>

          <motion.div key={activeRole} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
            <h2 className="text-lg font-bold text-foreground mb-1">Masuk — {config.title}</h2>
            <p className="text-xs text-muted-foreground mb-5">{config.subtitle}</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  {config.inputLabel}
                </label>
                <input
                  type={config.inputType}
                  placeholder={config.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Kata Sandi
                </label>
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
                Masuk sebagai {config.title}
              </Button>
            </form>
          </motion.div>

          <p className="text-xs text-center text-muted-foreground mt-6">
            Hubungi administrator jika Anda belum memiliki akun.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
