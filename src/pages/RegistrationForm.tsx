import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  GraduationCap,
  Upload,
  User,
  Users,
  X,
  File,
  Image,
  DollarSign,
  CreditCard,
  Wallet,
  Building2,
  Smartphone,
  Copy,
  XCircle,
  PartyPopper,
  RotateCcw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { loadFeeConfig, type RegistrationFeeConfig } from "@/data/registrationData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";

const programOptions = [
  { value: "tahfidz", label: "Tahfidz Al-Qur'an", desc: "Program unggulan hafalan 30 juz" },
  { value: "regular", label: "Reguler (Nasional + Diniyah)", desc: "Kurikulum terintegrasi" },
  { value: "bilingual", label: "Bilingual (Arab & Inggris)", desc: "Program bahasa intensif" },
  { value: "stem", label: "STEM & Digital", desc: "Sains, teknologi, dan digital" },
];

const programNameMap: Record<string, string> = {
  tahfidz: "Tahfidz Al-Qur'an",
  regular: "Kurikulum Nasional + Diniyah",
  bilingual: "Bahasa Arab & Inggris",
  stem: "STEM & Digital",
};

const ACCEPTED_FORMATS = ".pdf,.jpg,.jpeg,.png,.webp";
const ACCEPTED_MIME = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const documentList = [
  "Akta Kelahiran",
  "Kartu Keluarga",
  "Rapor Semester Terakhir",
  "Surat Keterangan Sehat",
  "Pas Foto 3x4 (Background Biru)",
  "KTP Orang Tua/Wali",
];

const paymentMethods = [
  { id: "va_bca", label: "BCA Virtual Account", icon: Building2, group: "Virtual Account" },
  { id: "va_bni", label: "BNI Virtual Account", icon: Building2, group: "Virtual Account" },
  { id: "va_mandiri", label: "Mandiri Virtual Account", icon: Building2, group: "Virtual Account" },
  { id: "gopay", label: "GoPay", icon: Wallet, group: "E-Wallet" },
  { id: "ovo", label: "OVO", icon: Wallet, group: "E-Wallet" },
  { id: "dana", label: "DANA", icon: Wallet, group: "E-Wallet" },
  { id: "qris", label: "QRIS", icon: Smartphone, group: "QRIS" },
];

type ResultStatus = null | "success" | "failed";

const RegistrationForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    program: "",
    wave: "",
    studentName: "",
    birthPlace: "",
    birthDate: "",
    gender: "",
    prevSchool: "",
    nisn: "",
    address: "",
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",
    guardianEmail: "",
    guardianJob: "",
    guardianAddress: "",
    agreeTerms: false,
  });
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [feeConfig, setFeeConfig] = useState<RegistrationFeeConfig>(() => loadFeeConfig());
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [pendingExit, setPendingExit] = useState<string | null>(null);

  // Payment step state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentProgress, setPaymentProgress] = useState(0);

  // Result state
  const [resultStatus, setResultStatus] = useState<ResultStatus>(null);
  const [registrationId, setRegistrationId] = useState("");

  // Reload fee config on mount
  useEffect(() => {
    setFeeConfig(loadFeeConfig());
  }, []);

  // Get fee for selected program
  const getRegistrationFee = useCallback(() => {
    if (feeConfig.mode === "free") return null;
    if (feeConfig.mode === "global") return feeConfig.globalAmount;
    if (feeConfig.mode === "per-program") {
      return feeConfig.programFees[programNameMap[formData.program] || ""] || "Rp 0";
    }
    return null;
  }, [feeConfig, formData.program]);

  const hasFee = getRegistrationFee() !== null;

  // Dynamic steps based on fee
  const steps = useMemo(() => {
    const base = [
      { id: 1, label: "Pilih\nProgram", icon: BookOpen },
      { id: 2, label: "Data\nSantri", icon: User },
      { id: 3, label: "Data\nWali", icon: Users },
      { id: 4, label: "Upload\nDokumen", icon: FileText },
      { id: 5, label: "Konfirmasi\nData", icon: CheckCircle2 },
    ];
    if (hasFee) {
      base.push({ id: 6, label: "Pembayaran", icon: CreditCard });
    }
    return base;
  }, [hasFee]);

  const totalSteps = steps.length;

  // Track dirty form
  const isFormDirty = useCallback(() => {
    return !!(formData.program || formData.studentName || formData.guardianName || Object.keys(uploadedFiles).length > 0);
  }, [formData, uploadedFiles]);

  const handleNavigation = (to: string) => {
    if (isFormDirty() && resultStatus === null) {
      setPendingExit(to);
      setShowExitWarning(true);
    } else {
      navigate(to);
    }
  };

  const confirmExit = () => {
    setShowExitWarning(false);
    if (pendingExit) navigate(pendingExit);
  };

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isFormDirty() && resultStatus === null) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isFormDirty, resultStatus]);

  const updateField = (key: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.program || !formData.wave) {
          toast({ title: "Data Belum Lengkap", description: "Pilih program dan gelombang pendaftaran.", variant: "destructive" });
          return false;
        }
        return true;
      case 2:
        if (!formData.studentName || !formData.birthPlace || !formData.birthDate || !formData.gender || !formData.nisn || !formData.prevSchool || !formData.address) {
          toast({ title: "Data Belum Lengkap", description: "Lengkapi semua data calon santri.", variant: "destructive" });
          return false;
        }
        return true;
      case 3:
        if (!formData.guardianName || !formData.guardianRelation || !formData.guardianPhone || !formData.guardianEmail || !formData.guardianJob || !formData.guardianAddress) {
          toast({ title: "Data Belum Lengkap", description: "Lengkapi semua data wali/orang tua.", variant: "destructive" });
          return false;
        }
        return true;
      case 4:
        if (Object.keys(uploadedFiles).length < documentList.length) {
          toast({ title: "Dokumen Belum Lengkap", description: "Upload semua dokumen persyaratan.", variant: "destructive" });
          return false;
        }
        return true;
      case 5:
        if (!formData.agreeTerms) {
          toast({ title: "Persetujuan Diperlukan", description: "Centang pernyataan persetujuan untuk melanjutkan.", variant: "destructive" });
          return false;
        }
        return true;
      case 6:
        if (!selectedPaymentMethod) {
          toast({ title: "Pilih Metode Pembayaran", description: "Pilih metode pembayaran terlebih dahulu.", variant: "destructive" });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFileUpload = (docName: string, file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED_MIME.includes(file.type)) {
      toast({ title: "Format Tidak Didukung", description: "Hanya file PDF dan gambar (JPG, PNG, WEBP) yang diperbolehkan.", variant: "destructive" });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "Ukuran Terlalu Besar", description: "Ukuran file maksimal 2MB.", variant: "destructive" });
      return;
    }
    setUploadedFiles((prev) => ({ ...prev, [docName]: file }));
    toast({ title: "File Berhasil Diupload", description: `${file.name} telah diupload untuk ${docName}.` });
  };

  const removeFile = (docName: string) => {
    setUploadedFiles((prev) => {
      const next = { ...prev };
      delete next[docName];
      return next;
    });
    if (fileInputRefs.current[docName]) {
      fileInputRefs.current[docName]!.value = "";
    }
  };

  const generateRegId = () => {
    const yr = new Date().getFullYear();
    const num = Math.floor(Math.random() * 9000) + 1000;
    return `PSB-${yr}-${num}`;
  };

  // Submit for free registration
  const handleSubmitFree = () => {
    if (!formData.agreeTerms) {
      toast({ title: "Persetujuan Diperlukan", description: "Centang persetujuan terlebih dahulu.", variant: "destructive" });
      return;
    }
    setRegistrationId(generateRegId());
    setResultStatus("success");
  };

  // Submit with payment simulation
  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      toast({ title: "Pilih Metode Pembayaran", description: "Pilih metode pembayaran terlebih dahulu.", variant: "destructive" });
      return;
    }
    setPaymentProcessing(true);
    setPaymentProgress(0);

    // Simulate payment processing
    const interval = setInterval(() => {
      setPaymentProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setPaymentProgress(100);
      setPaymentProcessing(false);

      // 90% success rate simulation
      const success = Math.random() > 0.1;
      if (success) {
        setRegistrationId(generateRegId());
        setResultStatus("success");
      } else {
        setResultStatus("failed");
      }
    }, 3000);
  };

  const handleRetry = () => {
    setResultStatus(null);
    setPaymentProcessing(false);
    setPaymentProgress(0);
  };

  const getFileIcon = (file: File) => {
    if (file.type === "application/pdf") return <File className="h-4 w-4 text-destructive" />;
    return <Image className="h-4 w-4 text-primary" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Disalin!", description: "Nomor berhasil disalin ke clipboard." });
  };

  // ─── Result Screen ───
  if (resultStatus !== null) {
    return (
      <div className="bg-background min-h-screen">
        <div className="flex-1 py-8 lg:py-12">
          <div className="mx-auto max-w-2xl px-4 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={resultStatus}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center"
              >
                {resultStatus === "success" ? (
                  <div className="space-y-6">
                    {/* Success animation */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-success/10"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      >
                        <PartyPopper className="h-12 w-12 text-success" />
                      </motion.div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                      <h1 className="text-2xl md:text-3xl font-bold text-foreground">Pendaftaran Berhasil! 🎉</h1>
                      <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                        Selamat! Data pendaftaran Anda telah berhasil dikirim. Tim kami akan segera memproses pendaftaran Anda.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                      className="rounded-2xl border bg-card p-6 md:p-8 shadow-card space-y-4 text-left"
                    >
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Nomor Pendaftaran</p>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-2xl font-bold text-primary font-mono">{registrationId}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(registrationId)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="h-px bg-border" />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Nama Santri</p>
                          <p className="font-medium text-foreground">{formData.studentName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Program</p>
                          <p className="font-medium text-foreground">{programOptions.find(p => p.value === formData.program)?.label}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Gelombang</p>
                          <p className="font-medium text-foreground">Gelombang {formData.wave}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status Pembayaran</p>
                          <p className="font-medium text-success">{hasFee ? "Lunas" : "Gratis"}</p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 space-y-2">
                        <p className="text-sm font-semibold text-foreground">📋 Langkah Selanjutnya</p>
                        <ul className="text-xs text-muted-foreground space-y-1.5">
                          <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" /> Simpan nomor pendaftaran sebagai bukti</li>
                          <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" /> Konfirmasi akan dikirim via email & WhatsApp</li>
                          <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" /> Pantau jadwal tes seleksi di halaman pendaftaran</li>
                          <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" /> Siapkan dokumen asli untuk verifikasi saat tes</li>
                        </ul>
                      </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex justify-center gap-3">
                      <Button variant="outline" onClick={() => navigate("/registration")} className="gap-1.5">
                        <ArrowLeft className="h-4 w-4" /> Kembali ke Info Pendaftaran
                      </Button>
                      <Button onClick={() => navigate("/")} className="gap-1.5">
                        Halaman Utama
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Failure animation */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10"
                    >
                      <XCircle className="h-12 w-12 text-destructive" />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                      <h1 className="text-2xl md:text-3xl font-bold text-foreground">Pembayaran Gagal</h1>
                      <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                        Maaf, pembayaran Anda tidak dapat diproses. Silakan coba lagi atau pilih metode pembayaran yang berbeda.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                      className="rounded-2xl border bg-card p-6 shadow-card space-y-4"
                    >
                      <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-4 space-y-2">
                        <p className="text-sm font-semibold text-foreground">Kemungkinan penyebab:</p>
                        <ul className="text-xs text-muted-foreground space-y-1.5">
                          <li>• Saldo tidak mencukupi</li>
                          <li>• Koneksi internet terputus</li>
                          <li>• Timeout dari penyedia layanan pembayaran</li>
                          <li>• Metode pembayaran sedang mengalami gangguan</li>
                        </ul>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Data pendaftaran Anda tetap tersimpan. Anda dapat mencoba pembayaran kembali tanpa mengisi ulang formulir.
                      </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex justify-center gap-3">
                      <Button variant="outline" onClick={() => navigate("/registration")} className="gap-1.5">
                        <ArrowLeft className="h-4 w-4" /> Kembali
                      </Button>
                      <Button onClick={handleRetry} className="gap-1.5">
                        <RotateCcw className="h-4 w-4" /> Coba Lagi
                      </Button>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="flex-1 py-8 lg:py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button onClick={() => handleNavigation("/registration")} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" /> Kembali ke Info Pendaftaran
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Formulir Pendaftaran Online</h1>
            <p className="text-muted-foreground mt-1">Isi formulir berikut untuk mendaftarkan calon santri baru.</p>
          </div>

          {/* Step Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative px-[20px]">
              <div className="absolute top-5 left-[20px] right-[20px] h-0.5 bg-border" />
              <div
                className="absolute top-5 left-[20px] h-0.5 bg-primary transition-all duration-500"
                style={{
                  width: currentStep === 1 ? "0px" : `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - ${((currentStep - 1) / (steps.length - 1)) * 40}px)`,
                }}
              />
              {steps.map((step) => (
                <div key={step.id} className="relative z-10 flex flex-col items-center" style={{ width: "40px" }}>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                      currentStep > step.id
                        ? "bg-primary border-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "bg-background border-primary text-primary"
                        : "bg-background border-border text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className={`mt-2 text-[10px] font-medium text-center block h-[28px] leading-tight whitespace-pre-line ${
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Steps */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border bg-card p-6 md:p-8 shadow-card"
          >
            {/* Step 1: Program */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-1">Pilih Program</h2>
                  <p className="text-sm text-muted-foreground">Pilih program pendidikan yang sesuai untuk calon santri.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {programOptions.map((prog) => (
                    <button
                      key={prog.value}
                      onClick={() => updateField("program", prog.value)}
                      className={`text-left rounded-xl border p-5 transition-all hover:-translate-y-0.5 ${
                        formData.program === prog.value
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "hover:border-primary/50 hover:shadow-card"
                      }`}
                    >
                      <GraduationCap className={`h-5 w-5 mb-2 ${formData.program === prog.value ? "text-primary" : "text-muted-foreground"}`} />
                      <p className="font-semibold text-sm text-foreground">{prog.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{prog.desc}</p>
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Gelombang Pendaftaran <span className="text-destructive">*</span></Label>
                  <Select value={formData.wave} onValueChange={(v) => updateField("wave", v)}>
                    <SelectTrigger><SelectValue placeholder="Pilih gelombang" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Gelombang 1 (Jan – Feb 2026)</SelectItem>
                      <SelectItem value="2">Gelombang 2 (Mar – Apr 2026)</SelectItem>
                      <SelectItem value="3">Gelombang 3 (Mei – Jun 2026)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Registration Fee Display */}
                {(() => {
                  const fee = getRegistrationFee();
                  if (fee === null) {
                    return (
                      <div className="rounded-xl border bg-success/5 border-success/30 p-4 flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">Pendaftaran Gratis</p>
                          <p className="text-xs text-muted-foreground">Tidak ada biaya pendaftaran yang dikenakan.</p>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="rounded-xl border bg-primary/5 border-primary/30 p-4 flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Biaya Pendaftaran</p>
                        <p className="text-xs text-muted-foreground">
                          {feeConfig.mode === "per-program" && !formData.program
                            ? "Pilih program untuk melihat biaya pendaftaran"
                            : <span>Biaya pendaftaran: <span className="font-bold text-primary">{fee}</span></span>}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Step 2: Student Data */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-1">Data Calon Santri</h2>
                  <p className="text-sm text-muted-foreground">Isi data pribadi calon santri dengan lengkap dan benar.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Nama Lengkap <span className="text-destructive">*</span></Label>
                    <Input placeholder="Nama lengkap sesuai akta" value={formData.studentName} onChange={(e) => updateField("studentName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tempat Lahir <span className="text-destructive">*</span></Label>
                    <Input placeholder="Kota kelahiran" value={formData.birthPlace} onChange={(e) => updateField("birthPlace", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tanggal Lahir <span className="text-destructive">*</span></Label>
                    <Input type="date" value={formData.birthDate} onChange={(e) => updateField("birthDate", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Jenis Kelamin <span className="text-destructive">*</span></Label>
                    <Select value={formData.gender} onValueChange={(v) => updateField("gender", v)}>
                      <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Laki-laki</SelectItem>
                        <SelectItem value="P">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>NISN <span className="text-destructive">*</span></Label>
                    <Input placeholder="Nomor Induk Siswa Nasional" value={formData.nisn} onChange={(e) => updateField("nisn", e.target.value)} />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Asal Sekolah <span className="text-destructive">*</span></Label>
                    <Input placeholder="Nama sekolah asal" value={formData.prevSchool} onChange={(e) => updateField("prevSchool", e.target.value)} />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Alamat Lengkap <span className="text-destructive">*</span></Label>
                    <Textarea placeholder="Alamat lengkap calon santri" value={formData.address} onChange={(e) => updateField("address", e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Guardian Data */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-1">Data Wali / Orang Tua</h2>
                  <p className="text-sm text-muted-foreground">Isi data wali atau orang tua yang bertanggung jawab.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Nama Lengkap Wali <span className="text-destructive">*</span></Label>
                    <Input placeholder="Nama lengkap" value={formData.guardianName} onChange={(e) => updateField("guardianName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hubungan <span className="text-destructive">*</span></Label>
                    <Select value={formData.guardianRelation} onValueChange={(v) => updateField("guardianRelation", v)}>
                      <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ayah">Ayah</SelectItem>
                        <SelectItem value="ibu">Ibu</SelectItem>
                        <SelectItem value="wali">Wali</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pekerjaan <span className="text-destructive">*</span></Label>
                    <Input placeholder="Pekerjaan" value={formData.guardianJob} onChange={(e) => updateField("guardianJob", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>No. HP / WhatsApp <span className="text-destructive">*</span></Label>
                    <Input placeholder="08xx-xxxx-xxxx" value={formData.guardianPhone} onChange={(e) => updateField("guardianPhone", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email <span className="text-destructive">*</span></Label>
                    <Input type="email" placeholder="email@example.com" value={formData.guardianEmail} onChange={(e) => updateField("guardianEmail", e.target.value)} />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Alamat Wali <span className="text-destructive">*</span></Label>
                    <Textarea placeholder="Alamat lengkap wali" value={formData.guardianAddress} onChange={(e) => updateField("guardianAddress", e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Documents */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-1">Upload Dokumen</h2>
                  <p className="text-sm text-muted-foreground">Upload berkas persyaratan dalam format PDF atau gambar (JPG, PNG, WEBP). Maks 2MB per file.</p>
                </div>
                <div className="space-y-3">
                  {documentList.map((doc) => {
                    const uploaded = uploadedFiles[doc];
                    return (
                      <div key={doc} className={`rounded-xl border p-4 transition-all ${uploaded ? "border-primary/50 bg-primary/5" : "bg-background"}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0">
                            <FileText className={`h-5 w-5 shrink-0 ${uploaded ? "text-primary" : "text-muted-foreground"}`} />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground">{doc} <span className="text-destructive">*</span></p>
                              {uploaded && (
                                <div className="flex items-center gap-2 mt-1">
                                  {getFileIcon(uploaded)}
                                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">{uploaded.name}</span>
                                  <span className="text-xs text-muted-foreground">({formatFileSize(uploaded.size)})</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {uploaded && (
                              <Button variant="ghost" size="sm" onClick={() => removeFile(doc)} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant={uploaded ? "outline" : "default"} size="sm" className="gap-1.5" onClick={() => fileInputRefs.current[doc]?.click()}>
                              <Upload className="h-3.5 w-3.5" />
                              {uploaded ? "Ganti" : "Upload"}
                            </Button>
                            <input
                              ref={(el) => { fileInputRefs.current[doc] = el; }}
                              type="file"
                              accept={ACCEPTED_FORMATS}
                              className="hidden"
                              onChange={(e) => { handleFileUpload(doc, e.target.files?.[0]); e.target.value = ""; }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">Format yang diperbolehkan: PDF, JPG, PNG, WEBP. Maksimal 2MB per file.</p>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-1">Konfirmasi Pendaftaran</h2>
                  <p className="text-sm text-muted-foreground">Periksa kembali data pendaftaran Anda sebelum mengirim.</p>
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl border bg-background p-5 space-y-3">
                    <h3 className="text-sm font-bold text-foreground">Data Santri</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-muted-foreground">Nama:</span> <span className="font-medium text-foreground">{formData.studentName || "-"}</span></div>
                      <div><span className="text-muted-foreground">Program:</span> <span className="font-medium text-foreground">{programOptions.find(p => p.value === formData.program)?.label || "-"}</span></div>
                      <div><span className="text-muted-foreground">TTL:</span> <span className="font-medium text-foreground">{formData.birthPlace}, {formData.birthDate || "-"}</span></div>
                      <div><span className="text-muted-foreground">Asal Sekolah:</span> <span className="font-medium text-foreground">{formData.prevSchool || "-"}</span></div>
                    </div>
                  </div>
                  <div className="rounded-xl border bg-background p-5 space-y-3">
                    <h3 className="text-sm font-bold text-foreground">Data Wali</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-muted-foreground">Nama:</span> <span className="font-medium text-foreground">{formData.guardianName || "-"}</span></div>
                      <div><span className="text-muted-foreground">Hubungan:</span> <span className="font-medium text-foreground">{formData.guardianRelation || "-"}</span></div>
                      <div><span className="text-muted-foreground">No. HP:</span> <span className="font-medium text-foreground">{formData.guardianPhone || "-"}</span></div>
                      <div><span className="text-muted-foreground">Email:</span> <span className="font-medium text-foreground">{formData.guardianEmail || "-"}</span></div>
                    </div>
                  </div>
                  <div className="rounded-xl border bg-background p-5 space-y-3">
                    <h3 className="text-sm font-bold text-foreground">Dokumen</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {documentList.map((doc) => (
                        <div key={doc} className="flex items-center gap-2">
                          <CheckCircle2 className={`h-3.5 w-3.5 ${uploadedFiles[doc] ? "text-primary" : "text-muted-foreground"}`} />
                          <span className="text-muted-foreground">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fee Summary */}
                  {(() => {
                    const fee = getRegistrationFee();
                    return (
                      <div className={`rounded-xl border p-5 space-y-2 ${fee === null ? "bg-success/5 border-success/30" : "bg-primary/5 border-primary/30"}`}>
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Biaya Pendaftaran
                        </h3>
                        <p className="text-lg font-bold text-primary">{fee === null ? "GRATIS" : fee}</p>
                        {fee !== null && (
                          <p className="text-xs text-muted-foreground">Pembayaran akan dilakukan di langkah selanjutnya.</p>
                        )}
                      </div>
                    );
                  })()}

                  <label className="flex items-start gap-3 rounded-xl border bg-background p-4 cursor-pointer hover:bg-muted/50">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => updateField("agreeTerms", e.target.checked)}
                      className="mt-1 rounded border-input"
                    />
                    <span className="text-sm text-muted-foreground">
                      Saya menyatakan bahwa data yang diisi adalah benar dan bersedia mengikuti seluruh proses seleksi serta mematuhi peraturan pesantren.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 6: Payment (only if hasFee) */}
            {currentStep === 6 && hasFee && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-1">Pembayaran Pendaftaran</h2>
                  <p className="text-sm text-muted-foreground">Pilih metode pembayaran dan selesaikan pembayaran biaya pendaftaran.</p>
                </div>

                {/* Amount Summary */}
                <div className="rounded-xl border bg-primary/5 border-primary/30 p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Pembayaran</p>
                    <p className="text-2xl font-bold text-primary mt-1">{getRegistrationFee()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Program</p>
                    <p className="text-sm font-medium text-foreground">{programOptions.find(p => p.value === formData.program)?.label}</p>
                  </div>
                </div>

                {/* Payment Methods */}
                {!paymentProcessing && (
                  <div className="space-y-4">
                    {["Virtual Account", "E-Wallet", "QRIS"].map((group) => {
                      const methods = paymentMethods.filter((m) => m.group === group);
                      return (
                        <div key={group} className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{group}</p>
                          <div className={`grid gap-2 ${group === "QRIS" ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3"}`}>
                            {methods.map((method) => (
                              <button
                                key={method.id}
                                onClick={() => setSelectedPaymentMethod(method.id)}
                                className={`flex items-center gap-3 rounded-xl border p-4 transition-all text-left ${
                                  selectedPaymentMethod === method.id
                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                    : "hover:border-primary/50 hover:bg-muted/30"
                                }`}
                              >
                                <method.icon className={`h-5 w-5 shrink-0 ${selectedPaymentMethod === method.id ? "text-primary" : "text-muted-foreground"}`} />
                                <span className="text-sm font-medium text-foreground">{method.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Payment Processing */}
                {paymentProcessing && (
                  <div className="text-center space-y-4 py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
                    >
                      <CreditCard className="h-8 w-8 text-primary" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Memproses Pembayaran...</p>
                      <p className="text-xs text-muted-foreground mt-1">Mohon tunggu, jangan tutup halaman ini.</p>
                    </div>
                    <div className="max-w-xs mx-auto">
                      <Progress value={Math.min(paymentProgress, 100)} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">{Math.min(Math.round(paymentProgress), 100)}%</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || paymentProcessing}
                className="gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" /> Sebelumnya
              </Button>

              {/* Determine what the next action is */}
              {(() => {
                const isLastConfirmStep = currentStep === 5 && !hasFee;
                const isPaymentStep = currentStep === 6 && hasFee;
                const canGoNext = currentStep < totalSteps;

                if (isLastConfirmStep) {
                  return (
                    <Button onClick={handleSubmitFree} disabled={!formData.agreeTerms} className="gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Kirim Pendaftaran
                    </Button>
                  );
                }
                if (isPaymentStep) {
                  return (
                    <Button onClick={handlePayment} disabled={!selectedPaymentMethod || paymentProcessing} className="gap-1.5">
                      {paymentProcessing ? (
                        <>Memproses...</>
                      ) : (
                        <><CreditCard className="h-4 w-4" /> Bayar & Kirim</>
                      )}
                    </Button>
                  );
                }
                if (canGoNext) {
                  return (
                    <Button onClick={nextStep} className="gap-1.5">
                      Selanjutnya <ArrowRight className="h-4 w-4" />
                    </Button>
                  );
                }
                return null;
              })()}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Unsaved Data Warning Dialog */}
      <AlertDialog open={showExitWarning} onOpenChange={setShowExitWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keluar dari Formulir?</AlertDialogTitle>
            <AlertDialogDescription>
              Data yang sudah Anda isi belum disimpan dan akan hilang jika Anda meninggalkan halaman ini. Yakin ingin keluar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowExitWarning(false)}>Tetap di Halaman</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExit} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RegistrationForm;
