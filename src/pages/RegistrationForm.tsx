import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useBlocker } from "react-router-dom";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { defaultFeeConfig } from "@/data/registrationData";
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

const steps = [
  { id: 1, label: "Pilih\nProgram", icon: BookOpen },
  { id: 2, label: "Data\nSantri", icon: User },
  { id: 3, label: "Data\nWali", icon: Users },
  { id: 4, label: "Upload\nDokumen", icon: FileText },
  { id: 5, label: "Konfirmasi\nData", icon: CheckCircle2 },
];

const programOptions = [
  { value: "tahfidz", label: "Tahfidz Al-Qur'an", desc: "Program unggulan hafalan 30 juz" },
  { value: "regular", label: "Reguler (Nasional + Diniyah)", desc: "Kurikulum terintegrasi" },
  { value: "bilingual", label: "Bilingual (Arab & Inggris)", desc: "Program bahasa intensif" },
  { value: "stem", label: "STEM & Digital", desc: "Sains, teknologi, dan digital" },
];

const ACCEPTED_FORMATS = ".pdf,.jpg,.jpeg,.png,.webp";
const ACCEPTED_MIME = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const documentList = [
  "Akta Kelahiran",
  "Kartu Keluarga",
  "Rapor Semester Terakhir",
  "Surat Keterangan Sehat",
  "Pas Foto 3x4 (Background Biru)",
  "KTP Orang Tua/Wali",
];

const RegistrationForm = () => {
  const { toast } = useToast();
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
  const [feeConfig] = useState(() => ({ ...defaultFeeConfig }));

  // Track if form has been touched
  const isFormDirty = useCallback(() => {
    return !!(formData.program || formData.studentName || formData.guardianName || Object.keys(uploadedFiles).length > 0);
  }, [formData, uploadedFiles]);

  // Block navigation via react-router
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return isFormDirty() && currentLocation.pathname !== nextLocation.pathname;
  });

  // Block browser close/reload
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isFormDirty()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isFormDirty]);

  // Get fee for selected program
  const getRegistrationFee = () => {
    if (feeConfig.mode === "free") return null;
    if (feeConfig.mode === "global") return feeConfig.globalAmount;
    if (feeConfig.mode === "per-program") {
      const prog = programOptions.find(p => p.value === formData.program);
      if (!prog) return null;
      // Map program value to schedule program name
      const nameMap: Record<string, string> = {
        tahfidz: "Tahfidz Al-Qur'an",
        regular: "Kurikulum Nasional + Diniyah",
        bilingual: "Bahasa Arab & Inggris",
        stem: "STEM & Digital",
      };
      return feeConfig.programFees[nameMap[formData.program] || ""] || "Rp 0";
    }
    return null;
  };

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
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 5) {
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

  const handleSubmit = () => {
    toast({
      title: "Pendaftaran Berhasil!",
      description: "Data pendaftaran Anda telah berhasil dikirim. Kami akan menghubungi Anda melalui email/WhatsApp.",
    });
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

  return (
    <div className="bg-background">
      <div className="flex-1 py-8 lg:py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link to="/registration" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" /> Kembali ke Info Pendaftaran
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Formulir Pendaftaran Online</h1>
            <p className="text-muted-foreground mt-1">Isi formulir berikut untuk mendaftarkan calon santri baru.</p>
          </div>

          {/* Step Indicator - Fixed gap */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative px-[20px]">
              {/* Background line connecting circle centers */}
              <div className="absolute top-5 left-[20px] right-[20px] h-0.5 bg-border" />
              {/* Active progress line */}
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
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(doc)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant={uploaded ? "outline" : "default"}
                              size="sm"
                              className="gap-1.5"
                              onClick={() => fileInputRefs.current[doc]?.click()}
                            >
                              <Upload className="h-3.5 w-3.5" />
                              {uploaded ? "Ganti" : "Upload"}
                            </Button>
                            <input
                              ref={(el) => { fileInputRefs.current[doc] = el; }}
                              type="file"
                              accept={ACCEPTED_FORMATS}
                              className="hidden"
                              onChange={(e) => {
                                handleFileUpload(doc, e.target.files?.[0]);
                                e.target.value = "";
                              }}
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

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" /> Sebelumnya
              </Button>
              {currentStep < 5 ? (
                <Button onClick={nextStep} className="gap-1.5">
                  Selanjutnya <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!formData.agreeTerms} className="gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Kirim Pendaftaran
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
