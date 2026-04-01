import { motion } from "framer-motion";
import { Construction, Clock, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMaintenance } from "@/contexts/MaintenanceContext";

export default function MaintenancePage() {
  const { maintenanceMessage, estimatedEnd } = useMaintenance();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full text-center space-y-8"
      >
        {/* Animated icon */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-warning/10 border-2 border-warning/30"
        >
          <Construction className="h-12 w-12 text-warning" />
        </motion.div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">
            Sedang Dalam Pemeliharaan
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            {maintenanceMessage}
          </p>
        </div>

        {/* Estimated time */}
        {estimatedEnd && (
          <div className="inline-flex items-center gap-2 bg-muted/50 border rounded-full px-4 py-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Estimasi selesai: <strong className="text-foreground">{estimatedEnd}</strong></span>
          </div>
        )}

        {/* Progress dots animation */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2.5 w-2.5 rounded-full bg-primary/60"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>

        {/* Contact info */}
        <div className="bg-card border rounded-xl p-5 space-y-3">
          <p className="text-sm font-medium text-foreground">
            Ada pertanyaan? Hubungi kami:
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:info@alhikmah.sch.id"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4" />
              info@alhikmah.sch.id
            </a>
          </div>
        </div>

        {/* Admin login link */}
        <div className="pt-2">
          <Link to="/login/admin">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground gap-1.5">
              Administrator Login
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
