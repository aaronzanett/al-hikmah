import { Outlet, Link } from "react-router-dom";
import PublicNavbar from "@/components/PublicNavbar";
import MaintenancePage from "@/components/MaintenancePage";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import { Phone, Mail, MapPin, ShieldCheck, Instagram, Youtube, Facebook, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const footerLinks = [
  { label: "Tentang", href: "/#about" },
  { label: "Program", href: "/#programs" },
  { label: "Pendaftaran", href: "/registration" },
  { label: "Galeri", href: "/gallery" },
  { label: "Berita", href: "/news" },
];

const contacts = [
  { icon: MapPin, value: "Jl. Pondok Pesantren No. 123, Kec. Cikarang, Kabupaten Bekasi, Jawa Barat 17530", isAddress: true },
  { icon: Phone, value: "(021) 8888-1234" },
  { icon: Mail, value: "info@alhikmah.sch.id" },
  { icon: Clock, value: "Senin–Sabtu: 07.00–16.00 WIB" },
];

const socials = [
  { icon: Instagram, label: "Instagram", username: "@pesantren.alhikmah", href: "https://instagram.com/pesantren.alhikmah" },
  { icon: Youtube, label: "YouTube", username: "Pesantren Al-Hikmah Official", href: "https://youtube.com/@alhikmah" },
  { icon: WhatsAppIcon, label: "WhatsApp", username: "+62 812-3456-7890", href: "https://wa.me/6281234567890" },
];

export default function PublicLayout() {
  const { isMaintenanceMode } = useMaintenance();

  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ─── Footer (matches Settings preview) ─── */}
      <footer className="border-t bg-card">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-md gradient-gold">
                  <span className="text-[10px] font-bold text-accent-foreground">B</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-foreground block leading-none">Pesantren Al-Hikmah</span>
                  <span className="text-[10px] text-muted-foreground">Modern Islamic Boarding School</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Mencetak generasi Qur'ani yang berilmu, beramal, dan berakhlak mulia sejak 1985.
              </p>
            </div>

            {/* Menu */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Menu</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="hover:text-foreground transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Kontak</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {contacts.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <li key={i} className={`flex ${c.isAddress ? "items-start" : "items-center"} gap-2`}>
                      <Icon className={`h-3.5 w-3.5 shrink-0 ${c.isAddress ? "mt-0.5" : ""}`} />
                      {c.value}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Media Sosial</h4>
              <div className="flex flex-wrap gap-2">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-md px-2.5 py-1.5 hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{s.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Pesantren Al-Hikmah. All rights reserved.</p>
            <div className="flex items-center gap-3">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors" title={s.label}>
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                );
              })}
              <Link to="/login/admin" className="ml-2">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-7">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Login Administrator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
