import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Menu, XIcon } from "lucide-react";
import { LogoBrand } from "@/components/LogoBrand";

const navLinks = [
  { label: "Tentang", href: "#about", type: "anchor" },
  { label: "Program", href: "#programs", type: "anchor" },
  { label: "Pendaftaran", href: "/registration", type: "route" },
  { label: "Galeri", href: "/gallery", type: "route" },
  { label: "Berita", href: "/news", type: "route" },
  { label: "Kontak", href: "#contact", type: "anchor" },
];

export default function PublicNavbar() {
  const [mobileNav, setMobileNav] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const handleAnchorClick = (hash: string) => {
    setMobileNav(false);
    if (isHome) {
      const el = document.querySelector(hash);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      // Wait for home page to render, then scroll to section
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center">
          <LogoBrand size="md" />
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
              <button
                key={link.href}
                onClick={() => handleAnchorClick(link.href)}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
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
              <button key={link.href} onClick={() => handleAnchorClick(link.href)} className="block text-sm font-medium text-muted-foreground hover:text-foreground text-left w-full">
                {link.label}
              </button>
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
