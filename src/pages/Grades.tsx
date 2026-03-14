import { CrudPage } from "@/components/CrudPage";
import { Badge } from "@/components/ui/badge";

const mockGrades = [
  { id: "GRD001", student: "Ahmad Fauzi", class: "X-A", subject: "Fiqih", semester: "Ganjil 2024", score: "85", grade: "A" },
  { id: "GRD002", student: "Ahmad Fauzi", class: "X-A", subject: "Matematika", semester: "Ganjil 2024", score: "78", grade: "B+" },
  { id: "GRD003", student: "Siti Aisyah", class: "X-B", subject: "Fiqih", semester: "Ganjil 2024", score: "92", grade: "A" },
  { id: "GRD004", student: "Siti Aisyah", class: "X-B", subject: "Bahasa Arab", semester: "Ganjil 2024", score: "88", grade: "A" },
  { id: "GRD005", student: "Muhammad Rizki", class: "XI-A", subject: "Al-Quran & Tajwid", semester: "Ganjil 2024", score: "95", grade: "A+" },
  { id: "GRD006", student: "Muhammad Rizki", class: "XI-A", subject: "Hadits", semester: "Ganjil 2024", score: "72", grade: "B" },
  { id: "GRD007", student: "Fatimah Zahra", class: "XII-A", subject: "Bahasa Inggris", semester: "Ganjil 2024", score: "80", grade: "A-" },
  { id: "GRD008", student: "Umar Hadi", class: "XI-B", subject: "IPA", semester: "Ganjil 2024", score: "65", grade: "C+" },
  { id: "GRD009", student: "Khadijah Nur", class: "X-A", subject: "Matematika", semester: "Ganjil 2024", score: "90", grade: "A" },
  { id: "GRD010", student: "Ibrahim Malik", class: "XII-B", subject: "Fiqih", semester: "Ganjil 2024", score: "87", grade: "A" },
  { id: "GRD011", student: "Aisyah Putri", class: "X-C", subject: "Bahasa Arab", semester: "Ganjil 2024", score: "76", grade: "B+" },
  { id: "GRD012", student: "Zainab Amira", class: "XI-A", subject: "Matematika", semester: "Genap 2024", score: "82", grade: "A-" },
  { id: "GRD013", student: "Yusuf Rahman", class: "XII-A", subject: "Hadits", semester: "Genap 2024", score: "91", grade: "A" },
  { id: "GRD014", student: "Halimah Sadia", class: "X-B", subject: "IPA", semester: "Genap 2024", score: "68", grade: "B-" },
  { id: "GRD015", student: "Bilal Hakim", class: "XI-B", subject: "Al-Quran & Tajwid", semester: "Genap 2024", score: "94", grade: "A+" },
];

const gradeColor = (grade: string) => {
  if (grade.startsWith("A")) return "default";
  if (grade.startsWith("B")) return "secondary";
  return "outline";
};

const Grades = () => (
  <CrudPage
    title="Nilai / Grades"
    subtitle="Kelola nilai santri"
    idKey="id"
    searchPlaceholder="Cari nilai... / Search grades..."
    searchKeys={["student", "subject", "class"]}
    addLabel="Tambah Nilai"
    initialData={mockGrades}
    filters={[
      { key: "class", label: "Kelas", options: [{ value: "X-A", label: "X-A" }, { value: "X-B", label: "X-B" }, { value: "X-C", label: "X-C" }, { value: "XI-A", label: "XI-A" }, { value: "XI-B", label: "XI-B" }, { value: "XII-A", label: "XII-A" }, { value: "XII-B", label: "XII-B" }] },
      { key: "semester", label: "Semester", options: [{ value: "Ganjil 2024", label: "Ganjil 2024" }, { value: "Genap 2024", label: "Genap 2024" }] },
      { key: "subject", label: "Mapel", options: [{ value: "Fiqih", label: "Fiqih" }, { value: "Matematika", label: "Matematika" }, { value: "Bahasa Arab", label: "Bahasa Arab" }, { value: "Al-Quran & Tajwid", label: "Al-Quran & Tajwid" }, { value: "Hadits", label: "Hadits" }, { value: "IPA", label: "IPA" }, { value: "Bahasa Inggris", label: "Bahasa Inggris" }] },
    ]}
    columns={[
      { key: "student", label: "Santri / Student", className: "font-medium" },
      { key: "class", label: "Kelas / Class" },
      { key: "subject", label: "Mapel / Subject" },
      { key: "semester", label: "Semester" },
      { key: "score", label: "Skor / Score" },
      { key: "grade", label: "Nilai / Grade", render: (val) => <Badge variant={gradeColor(val)} className="text-[10px]">{val}</Badge> },
    ]}
    formFields={[
      { key: "student", label: "Santri / Student", type: "text", placeholder: "Nama santri" },
      { key: "class", label: "Kelas / Class", type: "text", placeholder: "X-A" },
      { key: "subject", label: "Mata Pelajaran / Subject", type: "text", placeholder: "Fiqih" },
      { key: "semester", label: "Semester", type: "select", options: [{ value: "Ganjil 2024", label: "Ganjil 2024" }, { value: "Genap 2024", label: "Genap 2024" }, { value: "Ganjil 2025", label: "Ganjil 2025" }] },
      { key: "score", label: "Skor / Score", type: "number", placeholder: "85" },
      { key: "grade", label: "Nilai / Grade", type: "select", options: [{ value: "A+", label: "A+" }, { value: "A", label: "A" }, { value: "A-", label: "A-" }, { value: "B+", label: "B+" }, { value: "B", label: "B" }, { value: "B-", label: "B-" }, { value: "C+", label: "C+" }, { value: "C", label: "C" }] },
    ]}
  />
);

export default Grades;
