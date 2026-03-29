import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, MoreHorizontal, ChevronLeft, ChevronRight,
  Pencil, Trash2, Filter, Users, Award, TrendingUp, GraduationCap,
  X, Download, Share2, FileText, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

interface GradeEntry {
  id: string;
  studentId: string;
  student: string;
  class: string;
  dormitory: string;
  subject: string;
  semester: string;
  type: string; // Tugas, UTS, UAS, Praktik
  score: number;
  grade: string;
}

const mockGrades: GradeEntry[] = [
  // Ahmad Fauzi - X-A - Al-Farabi (8 subjects)
  { id: "G001", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Fiqih", semester: "Ganjil 2024", type: "Tugas", score: 82, grade: "A-" },
  { id: "G002", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Fiqih", semester: "Ganjil 2024", type: "UTS", score: 85, grade: "A" },
  { id: "G003", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Fiqih", semester: "Ganjil 2024", type: "UAS", score: 88, grade: "A" },
  { id: "G004", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Matematika", semester: "Ganjil 2024", type: "Tugas", score: 75, grade: "B+" },
  { id: "G005", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Matematika", semester: "Ganjil 2024", type: "UTS", score: 78, grade: "B+" },
  { id: "G006", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Matematika", semester: "Ganjil 2024", type: "UAS", score: 82, grade: "A-" },
  { id: "G007", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Bahasa Arab", semester: "Ganjil 2024", type: "Tugas", score: 88, grade: "A" },
  { id: "G008", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Bahasa Arab", semester: "Ganjil 2024", type: "UTS", score: 90, grade: "A" },
  { id: "G009", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Bahasa Arab", semester: "Ganjil 2024", type: "UAS", score: 92, grade: "A" },
  { id: "G010", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Al-Quran & Tajwid", semester: "Ganjil 2024", type: "Tugas", score: 93, grade: "A" },
  { id: "G011", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Al-Quran & Tajwid", semester: "Ganjil 2024", type: "UTS", score: 95, grade: "A+" },
  { id: "G012", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Al-Quran & Tajwid", semester: "Ganjil 2024", type: "UAS", score: 96, grade: "A+" },
  { id: "G013", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Hadits", semester: "Ganjil 2024", type: "UTS", score: 86, grade: "A" },
  { id: "G014", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Hadits", semester: "Ganjil 2024", type: "UAS", score: 88, grade: "A" },
  { id: "G015", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "IPA", semester: "Ganjil 2024", type: "Tugas", score: 80, grade: "A-" },
  { id: "G016", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "IPA", semester: "Ganjil 2024", type: "UTS", score: 77, grade: "B+" },
  { id: "G017", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "IPA", semester: "Ganjil 2024", type: "UAS", score: 81, grade: "A-" },
  { id: "G018", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Bahasa Indonesia", semester: "Ganjil 2024", type: "UTS", score: 83, grade: "A-" },
  { id: "G019", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Bahasa Indonesia", semester: "Ganjil 2024", type: "UAS", score: 85, grade: "A" },
  { id: "G020", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Bahasa Inggris", semester: "Ganjil 2024", type: "UTS", score: 79, grade: "B+" },
  { id: "G021", studentId: "S001", student: "Ahmad Fauzi", class: "X-A", dormitory: "Al-Farabi", subject: "Bahasa Inggris", semester: "Ganjil 2024", type: "UAS", score: 82, grade: "A-" },

  // Siti Aisyah - X-A - Khadijah
  { id: "G022", studentId: "S002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "Fiqih", semester: "Ganjil 2024", type: "Tugas", score: 90, grade: "A" },
  { id: "G023", studentId: "S002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "Fiqih", semester: "Ganjil 2024", type: "UTS", score: 92, grade: "A" },
  { id: "G024", studentId: "S002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "Fiqih", semester: "Ganjil 2024", type: "UAS", score: 90, grade: "A" },
  { id: "G025", studentId: "S002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "Matematika", semester: "Ganjil 2024", type: "Tugas", score: 85, grade: "A" },
  { id: "G026", studentId: "S002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "Matematika", semester: "Ganjil 2024", type: "UTS", score: 88, grade: "A" },
  { id: "G027", studentId: "S002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "Matematika", semester: "Ganjil 2024", type: "UAS", score: 91, grade: "A" },
  { id: "G028", studentId: "S002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "Bahasa Arab", semester: "Ganjil 2024", type: "UTS", score: 86, grade: "A" },
  { id: "G029", studentId: "S002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "Bahasa Arab", semester: "Ganjil 2024", type: "UAS", score: 89, grade: "A" },
  { id: "G030", studentId: "S002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "Al-Quran & Tajwid", semester: "Ganjil 2024", type: "UTS", score: 88, grade: "A" },
  { id: "G031", studentId: "S002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "Al-Quran & Tajwid", semester: "Ganjil 2024", type: "UAS", score: 91, grade: "A" },
  { id: "G032", studentId: "S002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "Hadits", semester: "Ganjil 2024", type: "UTS", score: 84, grade: "A-" },
  { id: "G033", studentId: "S002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "Hadits", semester: "Ganjil 2024", type: "UAS", score: 87, grade: "A" },
  { id: "G034", studentId: "S002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "IPA", semester: "Ganjil 2024", type: "Tugas", score: 91, grade: "A" },
  { id: "G035", studentId: "S002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "IPA", semester: "Ganjil 2024", type: "UTS", score: 89, grade: "A" },
  { id: "G036", studentId: "S002", student: "Siti Aisyah", class: "X-A", dormitory: "Khadijah", subject: "IPA", semester: "Ganjil 2024", type: "UAS", score: 93, grade: "A" },

  // Muhammad Rizki - XI-A - Al-Farabi
  { id: "G037", studentId: "S003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "Al-Quran & Tajwid", semester: "Ganjil 2024", type: "UTS", score: 95, grade: "A+" },
  { id: "G038", studentId: "S003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "Al-Quran & Tajwid", semester: "Ganjil 2024", type: "UAS", score: 97, grade: "A+" },
  { id: "G039", studentId: "S003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "Hadits", semester: "Ganjil 2024", type: "Tugas", score: 70, grade: "B" },
  { id: "G040", studentId: "S003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "Hadits", semester: "Ganjil 2024", type: "UTS", score: 72, grade: "B" },
  { id: "G041", studentId: "S003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "Hadits", semester: "Ganjil 2024", type: "UAS", score: 75, grade: "B+" },
  { id: "G042", studentId: "S003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "IPA", semester: "Ganjil 2024", type: "UTS", score: 80, grade: "A-" },
  { id: "G043", studentId: "S003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "IPA", semester: "Ganjil 2024", type: "UAS", score: 83, grade: "A-" },
  { id: "G044", studentId: "S003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "Fiqih", semester: "Ganjil 2024", type: "Tugas", score: 78, grade: "B+" },
  { id: "G045", studentId: "S003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "Fiqih", semester: "Ganjil 2024", type: "UTS", score: 80, grade: "A-" },
  { id: "G046", studentId: "S003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "Fiqih", semester: "Ganjil 2024", type: "UAS", score: 82, grade: "A-" },
  { id: "G047", studentId: "S003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "Matematika", semester: "Ganjil 2024", type: "UTS", score: 68, grade: "B-" },
  { id: "G048", studentId: "S003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "Matematika", semester: "Ganjil 2024", type: "UAS", score: 72, grade: "B" },
  { id: "G049", studentId: "S003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "Bahasa Arab", semester: "Ganjil 2024", type: "UTS", score: 85, grade: "A" },
  { id: "G050", studentId: "S003", student: "Muhammad Rizki", class: "XI-A", dormitory: "Al-Farabi", subject: "Bahasa Arab", semester: "Ganjil 2024", type: "UAS", score: 87, grade: "A" },

  // Fatimah Zahra - XII-A - Khadijah
  { id: "G051", studentId: "S004", student: "Fatimah Zahra", class: "XII-A", dormitory: "Khadijah", subject: "Bahasa Inggris", semester: "Ganjil 2024", type: "Tugas", score: 78, grade: "B+" },
  { id: "G052", studentId: "S004", student: "Fatimah Zahra", class: "XII-A", dormitory: "Khadijah", subject: "Bahasa Inggris", semester: "Ganjil 2024", type: "UTS", score: 80, grade: "A-" },
  { id: "G053", studentId: "S004", student: "Fatimah Zahra", class: "XII-A", dormitory: "Khadijah", subject: "Bahasa Inggris", semester: "Ganjil 2024", type: "UAS", score: 84, grade: "A-" },
  { id: "G054", studentId: "S004", student: "Fatimah Zahra", class: "XII-A", dormitory: "Khadijah", subject: "Fiqih", semester: "Ganjil 2024", type: "UTS", score: 88, grade: "A" },
  { id: "G055", studentId: "S004", student: "Fatimah Zahra", class: "XII-A", dormitory: "Khadijah", subject: "Fiqih", semester: "Ganjil 2024", type: "UAS", score: 90, grade: "A" },
  { id: "G056", studentId: "S004", student: "Fatimah Zahra", class: "XII-A", dormitory: "Khadijah", subject: "Matematika", semester: "Ganjil 2024", type: "Tugas", score: 73, grade: "B" },
  { id: "G057", studentId: "S004", student: "Fatimah Zahra", class: "XII-A", dormitory: "Khadijah", subject: "Matematika", semester: "Ganjil 2024", type: "UTS", score: 76, grade: "B+" },
  { id: "G058", studentId: "S004", student: "Fatimah Zahra", class: "XII-A", dormitory: "Khadijah", subject: "Matematika", semester: "Ganjil 2024", type: "UAS", score: 79, grade: "B+" },
  { id: "G059", studentId: "S004", student: "Fatimah Zahra", class: "XII-A", dormitory: "Khadijah", subject: "Al-Quran & Tajwid", semester: "Ganjil 2024", type: "UTS", score: 90, grade: "A" },
  { id: "G060", studentId: "S004", student: "Fatimah Zahra", class: "XII-A", dormitory: "Khadijah", subject: "Al-Quran & Tajwid", semester: "Ganjil 2024", type: "UAS", score: 92, grade: "A" },
  { id: "G061", studentId: "S004", student: "Fatimah Zahra", class: "XII-A", dormitory: "Khadijah", subject: "Bahasa Arab", semester: "Ganjil 2024", type: "UTS", score: 82, grade: "A-" },
  { id: "G062", studentId: "S004", student: "Fatimah Zahra", class: "XII-A", dormitory: "Khadijah", subject: "Bahasa Arab", semester: "Ganjil 2024", type: "UAS", score: 85, grade: "A" },

  // Umar Hadi - XI-B - Ibn Sina
  { id: "G063", studentId: "S005", student: "Umar Hadi", class: "XI-B", dormitory: "Ibn Sina", subject: "IPA", semester: "Ganjil 2024", type: "Tugas", score: 62, grade: "C+" },
  { id: "G064", studentId: "S005", student: "Umar Hadi", class: "XI-B", dormitory: "Ibn Sina", subject: "IPA", semester: "Ganjil 2024", type: "UTS", score: 65, grade: "C+" },
  { id: "G065", studentId: "S005", student: "Umar Hadi", class: "XI-B", dormitory: "Ibn Sina", subject: "IPA", semester: "Ganjil 2024", type: "UAS", score: 70, grade: "B" },
  { id: "G066", studentId: "S005", student: "Umar Hadi", class: "XI-B", dormitory: "Ibn Sina", subject: "Matematika", semester: "Ganjil 2024", type: "Tugas", score: 58, grade: "C" },
  { id: "G067", studentId: "S005", student: "Umar Hadi", class: "XI-B", dormitory: "Ibn Sina", subject: "Matematika", semester: "Ganjil 2024", type: "UTS", score: 60, grade: "C" },
  { id: "G068", studentId: "S005", student: "Umar Hadi", class: "XI-B", dormitory: "Ibn Sina", subject: "Matematika", semester: "Ganjil 2024", type: "UAS", score: 68, grade: "B-" },
  { id: "G069", studentId: "S005", student: "Umar Hadi", class: "XI-B", dormitory: "Ibn Sina", subject: "Fiqih", semester: "Ganjil 2024", type: "UTS", score: 75, grade: "B+" },
  { id: "G070", studentId: "S005", student: "Umar Hadi", class: "XI-B", dormitory: "Ibn Sina", subject: "Fiqih", semester: "Ganjil 2024", type: "UAS", score: 78, grade: "B+" },
  { id: "G071", studentId: "S005", student: "Umar Hadi", class: "XI-B", dormitory: "Ibn Sina", subject: "Bahasa Arab", semester: "Ganjil 2024", type: "Tugas", score: 70, grade: "B" },
  { id: "G072", studentId: "S005", student: "Umar Hadi", class: "XI-B", dormitory: "Ibn Sina", subject: "Bahasa Arab", semester: "Ganjil 2024", type: "UTS", score: 72, grade: "B" },
  { id: "G073", studentId: "S005", student: "Umar Hadi", class: "XI-B", dormitory: "Ibn Sina", subject: "Bahasa Arab", semester: "Ganjil 2024", type: "UAS", score: 74, grade: "B" },

  // Khadijah Nur - X-B - Khadijah
  { id: "G074", studentId: "S006", student: "Khadijah Nur", class: "X-B", dormitory: "Khadijah", subject: "Matematika", semester: "Ganjil 2024", type: "Tugas", score: 88, grade: "A" },
  { id: "G075", studentId: "S006", student: "Khadijah Nur", class: "X-B", dormitory: "Khadijah", subject: "Matematika", semester: "Ganjil 2024", type: "UTS", score: 90, grade: "A" },
  { id: "G076", studentId: "S006", student: "Khadijah Nur", class: "X-B", dormitory: "Khadijah", subject: "Matematika", semester: "Ganjil 2024", type: "UAS", score: 93, grade: "A" },
  { id: "G077", studentId: "S006", student: "Khadijah Nur", class: "X-B", dormitory: "Khadijah", subject: "Fiqih", semester: "Ganjil 2024", type: "UTS", score: 87, grade: "A" },
  { id: "G078", studentId: "S006", student: "Khadijah Nur", class: "X-B", dormitory: "Khadijah", subject: "Fiqih", semester: "Ganjil 2024", type: "UAS", score: 89, grade: "A" },
  { id: "G079", studentId: "S006", student: "Khadijah Nur", class: "X-B", dormitory: "Khadijah", subject: "IPA", semester: "Ganjil 2024", type: "Tugas", score: 92, grade: "A" },
  { id: "G080", studentId: "S006", student: "Khadijah Nur", class: "X-B", dormitory: "Khadijah", subject: "IPA", semester: "Ganjil 2024", type: "UTS", score: 90, grade: "A" },
  { id: "G081", studentId: "S006", student: "Khadijah Nur", class: "X-B", dormitory: "Khadijah", subject: "IPA", semester: "Ganjil 2024", type: "UAS", score: 94, grade: "A" },
  { id: "G082", studentId: "S006", student: "Khadijah Nur", class: "X-B", dormitory: "Khadijah", subject: "Bahasa Inggris", semester: "Ganjil 2024", type: "UTS", score: 85, grade: "A" },
  { id: "G083", studentId: "S006", student: "Khadijah Nur", class: "X-B", dormitory: "Khadijah", subject: "Bahasa Inggris", semester: "Ganjil 2024", type: "UAS", score: 88, grade: "A" },

  // Ibrahim Malik - XII-B - Ibn Sina
  { id: "G084", studentId: "S007", student: "Ibrahim Malik", class: "XII-B", dormitory: "Ibn Sina", subject: "Fiqih", semester: "Ganjil 2024", type: "Tugas", score: 85, grade: "A" },
  { id: "G085", studentId: "S007", student: "Ibrahim Malik", class: "XII-B", dormitory: "Ibn Sina", subject: "Fiqih", semester: "Ganjil 2024", type: "UTS", score: 87, grade: "A" },
  { id: "G086", studentId: "S007", student: "Ibrahim Malik", class: "XII-B", dormitory: "Ibn Sina", subject: "Fiqih", semester: "Ganjil 2024", type: "UAS", score: 85, grade: "A" },
  { id: "G087", studentId: "S007", student: "Ibrahim Malik", class: "XII-B", dormitory: "Ibn Sina", subject: "Hadits", semester: "Ganjil 2024", type: "UTS", score: 82, grade: "A-" },
  { id: "G088", studentId: "S007", student: "Ibrahim Malik", class: "XII-B", dormitory: "Ibn Sina", subject: "Hadits", semester: "Ganjil 2024", type: "UAS", score: 80, grade: "A-" },
  { id: "G089", studentId: "S007", student: "Ibrahim Malik", class: "XII-B", dormitory: "Ibn Sina", subject: "Al-Quran & Tajwid", semester: "Ganjil 2024", type: "UTS", score: 88, grade: "A" },
  { id: "G090", studentId: "S007", student: "Ibrahim Malik", class: "XII-B", dormitory: "Ibn Sina", subject: "Al-Quran & Tajwid", semester: "Ganjil 2024", type: "UAS", score: 90, grade: "A" },
  { id: "G091", studentId: "S007", student: "Ibrahim Malik", class: "XII-B", dormitory: "Ibn Sina", subject: "Matematika", semester: "Ganjil 2024", type: "Tugas", score: 74, grade: "B" },
  { id: "G092", studentId: "S007", student: "Ibrahim Malik", class: "XII-B", dormitory: "Ibn Sina", subject: "Matematika", semester: "Ganjil 2024", type: "UTS", score: 76, grade: "B+" },
  { id: "G093", studentId: "S007", student: "Ibrahim Malik", class: "XII-B", dormitory: "Ibn Sina", subject: "Matematika", semester: "Ganjil 2024", type: "UAS", score: 78, grade: "B+" },

  // Aisyah Putri - X-C - Khadijah (Genap)
  { id: "G094", studentId: "S008", student: "Aisyah Putri", class: "X-C", dormitory: "Khadijah", subject: "Bahasa Arab", semester: "Genap 2024", type: "Tugas", score: 74, grade: "B" },
  { id: "G095", studentId: "S008", student: "Aisyah Putri", class: "X-C", dormitory: "Khadijah", subject: "Bahasa Arab", semester: "Genap 2024", type: "UTS", score: 76, grade: "B+" },
  { id: "G096", studentId: "S008", student: "Aisyah Putri", class: "X-C", dormitory: "Khadijah", subject: "Bahasa Arab", semester: "Genap 2024", type: "UAS", score: 80, grade: "A-" },
  { id: "G097", studentId: "S008", student: "Aisyah Putri", class: "X-C", dormitory: "Khadijah", subject: "Fiqih", semester: "Genap 2024", type: "UTS", score: 84, grade: "A-" },
  { id: "G098", studentId: "S008", student: "Aisyah Putri", class: "X-C", dormitory: "Khadijah", subject: "Fiqih", semester: "Genap 2024", type: "UAS", score: 86, grade: "A" },
  { id: "G099", studentId: "S008", student: "Aisyah Putri", class: "X-C", dormitory: "Khadijah", subject: "Matematika", semester: "Genap 2024", type: "Tugas", score: 78, grade: "B+" },
  { id: "G100", studentId: "S008", student: "Aisyah Putri", class: "X-C", dormitory: "Khadijah", subject: "Matematika", semester: "Genap 2024", type: "UTS", score: 80, grade: "A-" },
  { id: "G101", studentId: "S008", student: "Aisyah Putri", class: "X-C", dormitory: "Khadijah", subject: "Matematika", semester: "Genap 2024", type: "UAS", score: 83, grade: "A-" },

  // Zainab Amira - XI-A - Khadijah (Genap)
  { id: "G102", studentId: "S009", student: "Zainab Amira", class: "XI-A", dormitory: "Khadijah", subject: "Matematika", semester: "Genap 2024", type: "Tugas", score: 80, grade: "A-" },
  { id: "G103", studentId: "S009", student: "Zainab Amira", class: "XI-A", dormitory: "Khadijah", subject: "Matematika", semester: "Genap 2024", type: "UTS", score: 82, grade: "A-" },
  { id: "G104", studentId: "S009", student: "Zainab Amira", class: "XI-A", dormitory: "Khadijah", subject: "Matematika", semester: "Genap 2024", type: "UAS", score: 85, grade: "A" },
  { id: "G105", studentId: "S009", student: "Zainab Amira", class: "XI-A", dormitory: "Khadijah", subject: "Bahasa Inggris", semester: "Genap 2024", type: "Tugas", score: 76, grade: "B+" },
  { id: "G106", studentId: "S009", student: "Zainab Amira", class: "XI-A", dormitory: "Khadijah", subject: "Bahasa Inggris", semester: "Genap 2024", type: "UTS", score: 78, grade: "B+" },
  { id: "G107", studentId: "S009", student: "Zainab Amira", class: "XI-A", dormitory: "Khadijah", subject: "Bahasa Inggris", semester: "Genap 2024", type: "UAS", score: 81, grade: "A-" },
  { id: "G108", studentId: "S009", student: "Zainab Amira", class: "XI-A", dormitory: "Khadijah", subject: "Fiqih", semester: "Genap 2024", type: "UTS", score: 86, grade: "A" },
  { id: "G109", studentId: "S009", student: "Zainab Amira", class: "XI-A", dormitory: "Khadijah", subject: "Fiqih", semester: "Genap 2024", type: "UAS", score: 88, grade: "A" },

  // Bilal Hakim - XI-B - Al-Farabi (Genap)
  { id: "G110", studentId: "S010", student: "Bilal Hakim", class: "XI-B", dormitory: "Al-Farabi", subject: "Al-Quran & Tajwid", semester: "Genap 2024", type: "Tugas", score: 92, grade: "A" },
  { id: "G111", studentId: "S010", student: "Bilal Hakim", class: "XI-B", dormitory: "Al-Farabi", subject: "Al-Quran & Tajwid", semester: "Genap 2024", type: "UTS", score: 94, grade: "A+" },
  { id: "G112", studentId: "S010", student: "Bilal Hakim", class: "XI-B", dormitory: "Al-Farabi", subject: "Al-Quran & Tajwid", semester: "Genap 2024", type: "UAS", score: 96, grade: "A+" },
  { id: "G113", studentId: "S010", student: "Bilal Hakim", class: "XI-B", dormitory: "Al-Farabi", subject: "Hadits", semester: "Genap 2024", type: "Tugas", score: 86, grade: "A" },
  { id: "G114", studentId: "S010", student: "Bilal Hakim", class: "XI-B", dormitory: "Al-Farabi", subject: "Hadits", semester: "Genap 2024", type: "UTS", score: 88, grade: "A" },
  { id: "G115", studentId: "S010", student: "Bilal Hakim", class: "XI-B", dormitory: "Al-Farabi", subject: "Hadits", semester: "Genap 2024", type: "UAS", score: 90, grade: "A" },
  { id: "G116", studentId: "S010", student: "Bilal Hakim", class: "XI-B", dormitory: "Al-Farabi", subject: "Fiqih", semester: "Genap 2024", type: "UTS", score: 84, grade: "A-" },
  { id: "G117", studentId: "S010", student: "Bilal Hakim", class: "XI-B", dormitory: "Al-Farabi", subject: "Fiqih", semester: "Genap 2024", type: "UAS", score: 86, grade: "A" },

  // Yusuf Rahman - XII-A - Al-Farabi (Genap)
  { id: "G118", studentId: "S011", student: "Yusuf Rahman", class: "XII-A", dormitory: "Al-Farabi", subject: "Hadits", semester: "Genap 2024", type: "Praktik", score: 90, grade: "A" },
  { id: "G119", studentId: "S011", student: "Yusuf Rahman", class: "XII-A", dormitory: "Al-Farabi", subject: "Hadits", semester: "Genap 2024", type: "UTS", score: 91, grade: "A" },
  { id: "G120", studentId: "S011", student: "Yusuf Rahman", class: "XII-A", dormitory: "Al-Farabi", subject: "Hadits", semester: "Genap 2024", type: "UAS", score: 93, grade: "A" },
  { id: "G121", studentId: "S011", student: "Yusuf Rahman", class: "XII-A", dormitory: "Al-Farabi", subject: "Fiqih", semester: "Genap 2024", type: "UTS", score: 86, grade: "A" },
  { id: "G122", studentId: "S011", student: "Yusuf Rahman", class: "XII-A", dormitory: "Al-Farabi", subject: "Fiqih", semester: "Genap 2024", type: "UAS", score: 88, grade: "A" },
  { id: "G123", studentId: "S011", student: "Yusuf Rahman", class: "XII-A", dormitory: "Al-Farabi", subject: "Al-Quran & Tajwid", semester: "Genap 2024", type: "Praktik", score: 94, grade: "A+" },
  { id: "G124", studentId: "S011", student: "Yusuf Rahman", class: "XII-A", dormitory: "Al-Farabi", subject: "Al-Quran & Tajwid", semester: "Genap 2024", type: "UTS", score: 92, grade: "A" },
  { id: "G125", studentId: "S011", student: "Yusuf Rahman", class: "XII-A", dormitory: "Al-Farabi", subject: "Al-Quran & Tajwid", semester: "Genap 2024", type: "UAS", score: 95, grade: "A+" },
];

const examTypes = ["Tugas", "UTS", "UAS", "Praktik"];

const gradeColorBadge = (grade: string) => {
  if (grade === "A+" || grade === "A") return "default";
  if (grade.startsWith("A")) return "secondary";
  if (grade.startsWith("B")) return "outline";
  return "destructive" as const;
};

const scoreColor = (score: number) => {
  if (score >= 90) return "text-green-600";
  if (score >= 80) return "text-primary";
  if (score >= 70) return "text-amber-600";
  return "text-destructive";
};

const scoreBarColor = (score: number) => {
  if (score >= 90) return "bg-green-500";
  if (score >= 80) return "bg-primary";
  if (score >= 70) return "bg-amber-500";
  return "bg-destructive";
};

interface StudentSummary {
  studentId: string;
  student: string;
  class: string;
  dormitory: string;
  grades: GradeEntry[];
  avg: number;
  highest: number;
  lowest: number;
  subjectCount: number;
}

// ─── Student Detail Modal ───
function StudentDetailModal({
  summary,
  onClose,
  onEdit,
  onDelete,
}: {
  summary: StudentSummary;
  onClose: () => void;
  onEdit: (g: GradeEntry) => void;
  onDelete: (g: GradeEntry) => void;
}) {
  const { toast } = useToast();

  // Group grades by subject
  const subjectGroups = useMemo(() => {
    const map = new Map<string, GradeEntry[]>();
    summary.grades.forEach((g) => {
      if (!map.has(g.subject)) map.set(g.subject, []);
      map.get(g.subject)!.push(g);
    });
    return Array.from(map.entries()).map(([subject, grades]) => {
      const scores = grades.map((g) => g.score);
      const avg = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
      return { subject, grades, avg };
    }).sort((a, b) => a.subject.localeCompare(b.subject));
  }, [summary.grades]);

  // Semesters in this student's data
  const semesters = [...new Set(summary.grades.map((g) => g.semester))];

  const handleDownload = () => {
    toast({ title: "Rapor sedang diunduh...", description: `Rapor ${summary.student} - ${semesters.join(", ")}` });
  };

  const handleShare = () => {
    const text = `Rapor ${summary.student} (${summary.class}) - Rata-rata: ${summary.avg}`;
    if (navigator.share) {
      navigator.share({ title: "Rapor Santri", text });
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: "Link rapor disalin ke clipboard" });
    }
  };

  // Lock scroll
  useState(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  });

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97 }}
          className="bg-card border rounded-2xl shadow-2xl w-full max-w-4xl my-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{summary.student}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{summary.class}</Badge>
                  <Badge variant="secondary" className="text-xs">{summary.dormitory}</Badge>
                  <span className="text-xs text-muted-foreground">{semesters.join(" • ")}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" /> Unduh Rapor
              </Button>
              <Button size="sm" variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" /> Bagikan
              </Button>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-3 p-6 border-b bg-muted/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{summary.avg}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Rata-rata</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{summary.highest}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Tertinggi</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{summary.lowest}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Terendah</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{summary.subjectCount}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Mata Pelajaran</p>
            </div>
          </div>

          {/* Grades Table */}
          <div className="p-6">
            <div className="bg-card border rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-muted/30">
                    <TableHead className="text-xs font-semibold w-[180px]">Mata Pelajaran</TableHead>
                    {examTypes.map((type) => (
                      <TableHead key={type} className="text-xs font-semibold text-center">{type}</TableHead>
                    ))}
                    <TableHead className="text-xs font-semibold text-center">Rata-rata</TableHead>
                    <TableHead className="text-xs font-semibold text-center w-[60px]">Nilai</TableHead>
                    <TableHead className="text-xs w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjectGroups.map(({ subject, grades, avg }) => {
                    const gradesByType: Record<string, GradeEntry | undefined> = {};
                    grades.forEach((g) => { gradesByType[g.type] = g; });
                    const finalGrade = avg >= 90 ? "A" : avg >= 85 ? "A-" : avg >= 80 ? "B+" : avg >= 75 ? "B" : avg >= 70 ? "B-" : avg >= 65 ? "C+" : "C";
                    return (
                      <TableRow key={subject}>
                        <TableCell className="text-sm font-medium">{subject}</TableCell>
                        {examTypes.map((type) => {
                          const entry = gradesByType[type];
                          return (
                            <TableCell key={type} className="text-center">
                              {entry ? (
                                <span className={cn("text-sm font-semibold", scoreColor(entry.score))}>
                                  {entry.score}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground/40">—</span>
                              )}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full", scoreBarColor(avg))} style={{ width: `${avg}%` }} />
                            </div>
                            <span className={cn("text-sm font-bold", scoreColor(avg))}>{avg}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={gradeColorBadge(finalGrade)} className="text-[10px]">{finalGrade}</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 rounded hover:bg-muted">
                                <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {grades.map((g) => (
                                <DropdownMenuItem key={g.id} onClick={() => onEdit(g)}>
                                  <Pencil className="h-3.5 w-3.5 mr-2" /> Edit {g.type} - {g.subject}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> ≥ 90 (Sangat Baik)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> ≥ 80 (Baik)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> ≥ 70 (Cukup)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" /> &lt; 70 (Kurang)</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// ─── Main Grades Page ───
const Grades = () => {
  const { toast } = useToast();
  const [data, setData] = useState<GradeEntry[]>(mockGrades);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedDormitory, setSelectedDormitory] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [page, setPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<GradeEntry | null>(null);
  const [deleteItem, setDeleteItem] = useState<GradeEntry | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedStudent, setSelectedStudent] = useState<StudentSummary | null>(null);

  const classes = [...new Set(data.map((g) => g.class))].sort();
  const dormitories = [...new Set(data.map((g) => g.dormitory))].sort();
  const semesters = [...new Set(data.map((g) => g.semester))];
  const subjects = [...new Set(data.map((g) => g.subject))].sort();

  const filtered = useMemo(() => {
    let result = data;
    if (selectedClass !== "all") result = result.filter((g) => g.class === selectedClass);
    if (selectedDormitory !== "all") result = result.filter((g) => g.dormitory === selectedDormitory);
    if (selectedSemester !== "all") result = result.filter((g) => g.semester === selectedSemester);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((g) => g.student.toLowerCase().includes(q) || g.subject.toLowerCase().includes(q));
    }
    return result;
  }, [data, selectedClass, selectedDormitory, selectedSemester, search]);

  const studentSummaries = useMemo((): StudentSummary[] => {
    const map = new Map<string, GradeEntry[]>();
    filtered.forEach((g) => {
      if (!map.has(g.studentId)) map.set(g.studentId, []);
      map.get(g.studentId)!.push(g);
    });
    return Array.from(map.entries()).map(([studentId, grades]) => {
      const scores = grades.map((g) => g.score);
      const uniqueSubjects = new Set(grades.map((g) => g.subject));
      return {
        studentId,
        student: grades[0].student,
        class: grades[0].class,
        dormitory: grades[0].dormitory,
        grades,
        avg: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
        highest: Math.max(...scores),
        lowest: Math.min(...scores),
        subjectCount: uniqueSubjects.size,
      };
    }).sort((a, b) => b.avg - a.avg);
  }, [filtered]);

  // Stats
  const totalStudents = studentSummaries.length;
  const overallAvg = totalStudents > 0 ? (studentSummaries.reduce((a, b) => a + b.avg, 0) / totalStudents).toFixed(1) : "0";
  const topStudent = studentSummaries[0];

  // Pagination
  const totalPages = Math.max(1, Math.ceil(studentSummaries.length / currentPageSize));
  const paginatedStudents = studentSummaries.slice((page - 1) * currentPageSize, page * currentPageSize);

  const formFields = [
    { key: "student", label: "Santri", type: "text" as const, placeholder: "Nama santri" },
    { key: "studentId", label: "ID Santri", type: "text" as const, placeholder: "S001" },
    { key: "class", label: "Kelas", type: "select" as const, options: classes.map((c) => ({ value: c, label: c })) },
    { key: "dormitory", label: "Asrama", type: "select" as const, options: dormitories.map((d) => ({ value: d, label: d })) },
    { key: "subject", label: "Mata Pelajaran", type: "select" as const, options: subjects.map((s) => ({ value: s, label: s })) },
    { key: "semester", label: "Semester", type: "select" as const, options: semesters.map((s) => ({ value: s, label: s })) },
    { key: "type", label: "Jenis Ujian", type: "select" as const, options: examTypes.map((t) => ({ value: t, label: t })) },
    { key: "score", label: "Skor", type: "number" as const, placeholder: "85" },
    { key: "grade", label: "Nilai Huruf", type: "select" as const, options: ["A+","A","A-","B+","B","B-","C+","C"].map((g) => ({ value: g, label: g })) },
  ];

  const openAdd = () => {
    setEditItem(null);
    const defaults: Record<string, any> = {};
    formFields.forEach((f) => { defaults[f.key] = ""; });
    setFormData(defaults);
    setDialogOpen(true);
  };

  const openEdit = (item: GradeEntry) => {
    setEditItem(item);
    setFormData({ ...item });
    setDialogOpen(true);
    setSelectedStudent(null);
  };

  const openDelete = (item: GradeEntry) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSave = () => {
    if (editItem) {
      setData((prev) => prev.map((item) => item.id === editItem.id ? { ...item, ...formData, score: Number(formData.score) } as GradeEntry : item));
      toast({ title: "Nilai berhasil diperbarui" });
    } else {
      const newItem: GradeEntry = { ...formData, id: `G-${Date.now()}`, score: Number(formData.score) } as GradeEntry;
      setData((prev) => [newItem, ...prev]);
      toast({ title: "Nilai berhasil ditambahkan" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Nilai berhasil dihapus" });
    }
    setDeleteOpen(false);
  };

  const resetFilters = () => {
    setSelectedClass("all");
    setSelectedDormitory("all");
    setSelectedSemester("all");
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters = selectedClass !== "all" || selectedDormitory !== "all" || selectedSemester !== "all" || search;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-bold text-foreground">Nilai / Grades</h1>
        <p className="text-sm text-muted-foreground">Kelola nilai santri — klik nama santri untuk melihat rapor lengkap</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total Santri</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-xs text-muted-foreground">Rata-rata</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{overallAvg}</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Award className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-muted-foreground">Nilai Terbaik</span>
          </div>
          <p className="text-2xl font-bold text-foreground truncate">{topStudent?.student || "-"}</p>
          <p className="text-xs text-muted-foreground">Avg: {topStudent?.avg || 0}</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="h-4 w-4 text-blue-600" />
            <span className="text-xs text-muted-foreground">Total Entri Nilai</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{filtered.length}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari santri atau mata pelajaran..."
              className="w-full rounded-lg border border-input bg-card pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4 mr-1" /> Tambah Nilai
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedClass} onValueChange={(v) => { setSelectedClass(v); setPage(1); }}>
            <SelectTrigger className="h-8 w-auto min-w-[100px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              {classes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedDormitory} onValueChange={(v) => { setSelectedDormitory(v); setPage(1); }}>
            <SelectTrigger className="h-8 w-auto min-w-[110px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Asrama</SelectItem>
              {dormitories.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedSemester} onValueChange={(v) => { setSelectedSemester(v); setPage(1); }}>
            <SelectTrigger className="h-8 w-auto min-w-[130px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Semester</SelectItem>
              {semesters.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={resetFilters}>
              Reset Filter
            </Button>
          )}
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-card border rounded-xl shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs w-10">#</TableHead>
              <TableHead className="text-xs">Nama Santri</TableHead>
              <TableHead className="text-xs">Kelas</TableHead>
              <TableHead className="text-xs">Asrama</TableHead>
              <TableHead className="text-xs text-center">Mapel</TableHead>
              <TableHead className="text-xs text-center">Rata-rata</TableHead>
              <TableHead className="text-xs text-center">Tertinggi</TableHead>
              <TableHead className="text-xs text-center">Terendah</TableHead>
              <TableHead className="text-xs text-center">Predikat</TableHead>
              <TableHead className="text-xs w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-sm text-muted-foreground py-8">
                  Tidak ada data nilai ditemukan
                </TableCell>
              </TableRow>
            ) : (
              paginatedStudents.map((s, idx) => {
                const predikat = s.avg >= 90 ? "Sangat Baik" : s.avg >= 80 ? "Baik" : s.avg >= 70 ? "Cukup" : "Kurang";
                const predikatColor = s.avg >= 90 ? "default" : s.avg >= 80 ? "secondary" : s.avg >= 70 ? "outline" : "destructive";
                return (
                  <TableRow
                    key={s.studentId}
                    className="cursor-pointer hover:bg-primary/5 transition-colors"
                    onClick={() => setSelectedStudent(s)}
                  >
                    <TableCell className="text-sm text-muted-foreground">{(page - 1) * currentPageSize + idx + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {s.student.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-foreground">{s.student}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{s.class}</TableCell>
                    <TableCell className="text-sm">{s.dormitory}</TableCell>
                    <TableCell className="text-center text-sm">{s.subjectCount}</TableCell>
                    <TableCell className="text-center">
                      <span className={cn("text-sm font-bold", scoreColor(s.avg))}>{s.avg}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-semibold text-green-600">{s.highest}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-semibold text-amber-600">{s.lowest}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={predikatColor as any} className="text-[10px]">{predikat}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); setSelectedStudent(s); }}>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>
              {studentSummaries.length > 0
                ? `Menampilkan ${(page - 1) * currentPageSize + 1}-${Math.min(page * currentPageSize, studentSummaries.length)} dari ${studentSummaries.length}`
                : "Tidak ada data"}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground/70">Baris:</span>
              <Select value={String(currentPageSize)} onValueChange={(v) => { setCurrentPageSize(Number(v)); setPage(1); }}>
                <SelectTrigger className="h-7 w-[70px] text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20, 25, 50].map((size) => (
                    <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-muted disabled:opacity-30" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn("px-2 py-1 rounded", p === page ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted")}
              >
                {p}
              </button>
            ))}
            <button className="p-1 rounded hover:bg-muted disabled:opacity-30" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal
          summary={selectedStudent}
          onClose={() => { setSelectedStudent(null); document.body.style.overflow = ""; }}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Nilai" : "Tambah Nilai Baru"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {formFields.map((field) => {
              const value = formData[field.key] ?? "";
              return (
                <div key={field.key} className={cn("space-y-2", field.key === "student" && "col-span-2")}>
                  <Label className="text-xs">{field.label}</Label>
                  {field.type === "select" ? (
                    <Select value={String(value)} onValueChange={(v) => setFormData((p) => ({ ...p, [field.key]: v }))}>
                      <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={field.type}
                      value={value}
                      onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Nilai</AlertDialogTitle>
            <AlertDialogDescription>Apakah Anda yakin ingin menghapus nilai ini? Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default Grades;
