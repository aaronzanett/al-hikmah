import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Menu, XIcon } from "lucide-react";

const navLinks = [
  { label: "Tentang", href: "#about", type: "anchor" },
  { label: "Program", href: "#programs", type: "anchor" },
  { label: "Galeri", href: "/gallery", type: "route" },
  { label: "Berita", href: "/news", type: "route" },
  { label: "Kontak", href: "#contact", type: "anchor" },
];

export default function PublicNavbar() {
  const [mobileNav, setMobileNav] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-gold shadow-md">
            <span className="text-sm font-bold text-accent-foreground">B</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-base font-bold text-foreground leading-none">Pesantren Al-Hikmah</span>
            <span className="block text-[10px] text-muted-foreground leading-tight">Modern Islamic Boarding School</span>
          </div>
        </Link>
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {navLinks.map((link) =>
            link.type === "route" ? (
              <Link
                key={link.href}
                to={link.href}
                className={`hover:text-foreground transition-colors ${location.pathname === link.href ? "text-foreground" : ""}`}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={isHome ? link.href : `/${link.href}`}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            )
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden sm:inline-flex">
            <Button size="sm" className="gap-1.5">
              Portal Masuk <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <button onClick={() => setMobileNav(!mobileNav)} className="lg:hidden p-2 rounded-md hover:bg-muted">
            {mobileNav ? <XIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {mobileNav && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="lg:hidden border-t bg-background px-4 py-4 space-y-3"
        >
          {navLinks.map((link) =>
            link.type === "route" ? (
              <Link key={link.href} to={link.href} onClick={() => setMobileNav(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground">
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={isHome ? link.href : `/${link.href}`} onClick={() => setMobileNav(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground">
                {link.label}
              </a>
            )
          )}
          <Link to="/login" onClick={() => setMobileNav(false)}>
            <Button size="sm" className="w-full mt-2">Portal Masuk</Button>
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
