import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getIconComponent } from "@/lib/iconMap";

import heroPesantren from "@/assets/hero-pesantren.jpg";

import {
  registrationSteps,
  scheduleData,
  requirementsData,
  costData,
  faqData,
  formatDateDisplay,
  formatPeriodDisplay,
} from "@/data/registrationData";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const activeFaqs = faqData.filter(f => f.status === "Aktif");
  return (
    <div className="space-y-3">
      {activeFaqs.map((faq, i) => (
        <div key={faq.id} className="rounded-xl border bg-card overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full text-left flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm font-semibold text-foreground pr-4">{faq.question}</span>
            {openIndex === i ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
          </button>
          {openIndex === i && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="px-5 pb-5"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

const Registration = () => {
  const activeSteps = registrationSteps.filter(s => s.status === "Aktif");
  const activeSchedule = scheduleData;
  const activeRequirements = requirementsData.filter(r => r.status === "Aktif");
  const activeCosts = costData.filter(c => c.status === "Aktif");

  const totalCost = activeCosts
    .filter(c => c.note !== "Per bulan")
    .reduce((sum, c) => {
      const num = parseInt(c.amount.replace(/[^\d]/g, ""), 10);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);

  return (
    <div className="bg-background">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroPesantren} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-20 md:py-28 lg:py-36">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30 px-4 py-1.5 text-xs font-medium text-accent">
              <Star className="h-3.5 w-3.5" />
              Pendaftaran Santri Baru 2026/2027
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-5">
              Bergabung Bersama <span className="text-accent">Pesantren Al-Hikmah</span>
            </h1>
            <p className="text-base md:text-lg text-white/75 max-w-xl mb-8 leading-relaxed">
              Daftarkan putra-putri Anda untuk menjadi generasi Qur'ani yang berilmu, berkarakter, dan siap menghadapi masa depan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/registration/form">
                <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg">
                  Daftar Sekarang <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#steps">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white bg-white/5">
                  Lihat Alur Pendaftaran
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="relative -mt-10 z-10">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="rounded-2xl border bg-card shadow-xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Periode Pendaftaran</p>
                <p className="text-sm font-bold text-foreground">Jan – Jun 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10 shrink-0">
                <Users className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kuota Tersedia</p>
                <p className="text-sm font-bold text-foreground">120 Santri</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 shrink-0">
                <Clock className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm font-bold text-success">Gelombang 1 Dibuka</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Steps */}
      <section id="steps" className="py-20 lg:py-28 islamic-pattern">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Alur Pendaftaran</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {activeSteps.length} Langkah Menuju Pesantren
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Proses pendaftaran yang mudah dan terstruktur untuk memastikan setiap calon santri mendapat layanan terbaik.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeSteps.map((phase, i) => {
              const Icon = getIconComponent(phase.iconKey);
              return (
                <motion.div
                  key={phase.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="group rounded-2xl border bg-card p-7 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${phase.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-extrabold text-muted-foreground/20">0{phase.step}</span>
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{phase.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{phase.desc}</p>
                  <ul className="space-y-1.5">
                    {phase.details.map((d, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Schedule by Program */}
      <section className="py-20 lg:py-28 bg-muted/30 islamic-pattern-star">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Jadwal Pendaftaran</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Gelombang Pendaftaran Per Program
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Setiap program memiliki jadwal gelombang pendaftaran tersendiri. Pilih program yang diminati untuk melihat jadwalnya.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            {(() => {
              const programs = Array.from(new Set(activeSchedule.map(s => s.program))).filter(Boolean);
              if (programs.length === 0) return null;
              return (
                <Tabs defaultValue={programs[0]} className="space-y-6">
                  <TabsList className="w-full flex flex-wrap h-auto gap-1.5 bg-card border p-2 rounded-xl shadow-card">
                    {programs.map(prog => (
                      <TabsTrigger
                        key={prog}
                        value={prog}
                        className="px-4 py-2.5 rounded-lg text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                      >
                        {prog}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {programs.map(prog => (
                    <TabsContent key={prog} value={prog}>
                      <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead>
                              <tr className="border-b bg-muted/50">
                                <th className="p-3 pl-4 font-semibold text-foreground text-sm">Gelombang</th>
                                <th className="p-3 font-semibold text-foreground text-sm">Periode Daftar</th>
                                <th className="p-3 font-semibold text-foreground text-sm">Tes Seleksi</th>
                                <th className="p-3 font-semibold text-foreground text-sm">Pengumuman</th>
                                <th className="p-3 pr-4 font-semibold text-foreground text-sm">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeSchedule.filter(s => s.program === prog).map((s) => (
                                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                  <td className="p-3 pl-4 font-semibold text-foreground">{s.wave}</td>
                                  <td className="p-3 text-muted-foreground">{formatPeriodDisplay(s.periodStart, s.periodEnd)}</td>
                                  <td className="p-3 text-muted-foreground">{formatDateDisplay(s.testDate)}</td>
                                  <td className="p-3 text-muted-foreground">{formatDateDisplay(s.resultDate)}</td>
                                  <td className="p-3 pr-4">
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                      s.status === "Dibuka" ? "bg-success/10 text-success" :
                                      s.status === "Segera" ? "bg-warning/10 text-warning" :
                                      "bg-muted text-muted-foreground"
                                    }`}>
                                      {s.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Requirements & Costs */}
      <section className="py-20 lg:py-28 islamic-pattern-arabesque">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Persyaratan</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-5">
                Syarat Pendaftaran
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Siapkan dokumen-dokumen berikut untuk melengkapi proses pendaftaran calon santri baru.
              </p>
              <div className="space-y-3">
                {activeRequirements.map((req, i) => (
                  <motion.div
                    key={req.id}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="flex items-start gap-3 rounded-xl border bg-card p-4"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{req.title}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Costs */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Biaya Pendidikan</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-5">
                Rincian Biaya
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Berikut adalah rincian biaya pendidikan untuk tahun ajaran 2026/2027.
              </p>
              <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
                {activeCosts.map((cost, i) => (
                  <div key={cost.id} className={`flex items-center justify-between p-5 ${i < activeCosts.length - 1 ? "border-b" : ""}`}>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{cost.item}</p>
                      <p className="text-xs text-muted-foreground">{cost.note}</p>
                    </div>
                    <span className="text-sm font-bold text-primary">{cost.amount}</span>
                  </div>
                ))}
                <div className="p-5 bg-primary/5 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">Total Biaya Awal</span>
                    <span className="text-lg font-extrabold text-primary">
                      Rp {totalCost.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">*Belum termasuk SPP bulanan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28 bg-muted/30 islamic-pattern-star">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">FAQ</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>
          <FAQ />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="rounded-3xl gradient-primary p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
                Siap Mendaftarkan Putra-Putri Anda?
              </h2>
              <p className="text-primary-foreground/75 max-w-xl mx-auto mb-8">
                Kuota terbatas! Segera isi formulir pendaftaran online dan amankan tempat untuk anak Anda.
              </p>
              <Link to="/registration/form">
                <Button size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
                  Mulai Pendaftaran <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Registration;
