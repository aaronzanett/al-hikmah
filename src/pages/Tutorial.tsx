import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Users, GraduationCap, Shield, ChevronDown, ChevronRight,
  CheckCircle2, RotateCcw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  type UserType, type TutorialStepData, type TutorialSectionData,
  loadTutorialData, loadProgress, saveProgress, getIconComponent
} from "@/data/tutorialData";

const userTypeConfig: Record<UserType, { label: string; icon: React.ReactNode; color: string }> = {
  admin: {
    label: "Administrator Pesantren",
    icon: <Shield className="h-5 w-5" />,
    color: "bg-primary text-primary-foreground",
  },
  guardian: {
    label: "Wali Santri",
    icon: <Users className="h-5 w-5" />,
    color: "bg-accent text-accent-foreground",
  },
  student: {
    label: "Santri",
    icon: <GraduationCap className="h-5 w-5" />,
    color: "bg-secondary text-secondary-foreground",
  }
};

function getStepIds(sections: TutorialSectionData[]): string[] {
  return sections
    .filter(s => s.isVisible)
    .flatMap(s => s.steps.filter(st => st.isVisible).map(st => st.id));
}

function StepCard({ step, index, completed, onToggleComplete }: { 
  step: TutorialStepData; 
  index: number; 
  completed: boolean;
  onToggleComplete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const IconComp = getIconComponent(step.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className={`cursor-pointer hover:shadow-md transition-all border-border/60 ${completed ? 'bg-primary/5 border-primary/20' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <CardHeader className="p-4 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 rounded-lg p-2 shrink-0 ${completed ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
                {completed ? <CheckCircle2 className="h-5 w-5" /> : <IconComp className="h-5 w-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs font-normal">
                    Langkah {index + 1}
                  </Badge>
                  {completed && (
                    <Badge className="text-xs bg-primary/15 text-primary border-0 hover:bg-primary/20">
                      ✓ Selesai
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base leading-snug">{step.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>
            <div className="shrink-0 mt-1 text-muted-foreground">
              {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <CardContent className="px-4 pt-0 pb-5">
                <Separator className="mb-3" />
                <ol className="space-y-2.5 ml-1">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ol>
                {step.tips && (
                  <div className="mt-4 rounded-lg bg-accent/20 border border-accent/30 p-3">
                    <p className="text-sm text-accent-foreground">
                      <span className="font-semibold">💡 Tips:</span> {step.tips}
                    </p>
                  </div>
                )}
                <div className="mt-4 flex justify-end">
                  <Button
                    size="sm"
                    variant={completed ? "outline" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(step.id);
                    }}
                  >
                    {completed ? (
                      <>
                        <RotateCcw className="h-3.5 w-3.5 mr-1" />
                        Tandai Belum Selesai
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Tandai Selesai
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export default function Tutorial() {
  const [activeTab, setActiveTab] = useState<UserType>("admin");
  const [progress, setProgress] = useState<Record<string, boolean>>(loadProgress);
  const { toast } = useToast();

  // Load managed tutorial data from localStorage
  const tutorialData = loadTutorialData();

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const toggleComplete = useCallback((id: string) => {
    setProgress(prev => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({});
    toast({ title: "Progress direset", description: "Semua langkah ditandai belum selesai." });
  }, [toast]);

  // Get visible sections for current tab
  const currentSections = tutorialData[activeTab].filter(s => s.isVisible);
  const currentStepIds = getStepIds(tutorialData[activeTab]);
  const completedCount = currentStepIds.filter(id => progress[id]).length;
  const totalCount = currentStepIds.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Get visible FAQ
  const visibleFaq = tutorialData.faq.filter(f => f.isVisible);

  const config = userTypeConfig[activeTab];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <BookOpen className="h-4 w-4" />
              Panduan Pengguna
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tutorial Penggunaan Aplikasi
            </h1>
            <p className="text-muted-foreground text-lg">
              Panduan lengkap untuk semua pengguna — administrator pesantren, wali santri, dan santri.
              Ikuti langkah-langkah di bawah ini untuk memaksimalkan penggunaan sistem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as UserType)}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            {(Object.entries(userTypeConfig) as [UserType, typeof config][]).map(([key, cfg]) => (
              <TabsTrigger key={key} value={key} className="gap-2 text-xs sm:text-sm">
                {cfg.icon}
                <span className="hidden sm:inline">{cfg.label}</span>
                <span className="sm:hidden">
                  {key === "admin" ? "Admin" : key === "guardian" ? "Wali" : "Santri"}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {(Object.entries(userTypeConfig) as [UserType, typeof config][]).map(([key, cfg]) => (
            <TabsContent key={key} value={key}>
              {/* Progress bar */}
              <Card className="mb-6 border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={cfg.color}>{cfg.label}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {completedCount}/{totalCount} langkah selesai
                      </span>
                    </div>
                    {completedCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={resetProgress} className="text-xs h-7">
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Reset
                      </Button>
                    )}
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {key === "admin" && "Panduan lengkap untuk Super Admin, Branch Admin, Treasurer, Academic Staff, dan Dormitory Supervisor."}
                    {key === "guardian" && "Panduan untuk orang tua / wali santri dalam memantau perkembangan anak."}
                    {key === "student" && "Panduan untuk santri dalam mengakses informasi akademik dan keuangan."}
                  </p>
                  {progressPercent === 100 && (
                    <div className="mt-2 rounded-lg bg-primary/10 border border-primary/20 p-2 text-center">
                      <p className="text-sm font-medium text-primary">🎉 Selamat! Anda telah menyelesaikan semua tutorial.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-8">
                {currentSections.map((section, si) => (
                  <div key={section.id}>
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                        {si + 1}
                      </span>
                      {section.title}
                    </h2>
                    <div className="space-y-3">
                      {section.steps.filter(st => st.isVisible).map((step, i) => (
                        <StepCard 
                          key={step.id} 
                          step={step} 
                          index={i} 
                          completed={!!progress[step.id]}
                          onToggleComplete={toggleComplete}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* FAQ */}
        {visibleFaq.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-foreground mb-6 text-center">Pertanyaan Umum (FAQ)</h2>
            <div className="space-y-3 max-w-2xl mx-auto">
              {visibleFaq.map((faq) => (
                <Card key={faq.id} className="border-border/60">
                  <CardContent className="p-4">
                    <p className="font-medium text-sm text-foreground">{faq.question}</p>
                    <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
