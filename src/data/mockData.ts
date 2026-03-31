// Shared mock data for the entire application
// All computed fields (student counts, room counts, occupied) are derived from these base datasets

export const mockBranches = [
  { id: "BR001", key: "Pusat", name: "Pesantren Pusat", location: "Bandung, Jawa Barat", status: "Aktif" },
  { id: "BR002", key: "Cabang 1", name: "Cabang 1 - Al Hikmah", location: "Garut, Jawa Barat", status: "Aktif" },
  { id: "BR003", key: "Cabang 2", name: "Cabang 2 - Ar Rahman", location: "Tasikmalaya, Jawa Barat", status: "Aktif" },
  { id: "BR004", key: "Cabang 3", name: "Cabang 3 - An Nur", location: "Cirebon, Jawa Barat", status: "Aktif" },
  { id: "BR005", key: "Cabang 4", name: "Cabang 4 - Al Falah", location: "Sukabumi, Jawa Barat", status: "Aktif" },
  { id: "BR006", key: "Cabang 5", name: "Cabang 5 - Al Ikhlas", location: "Cianjur, Jawa Barat", status: "Nonaktif" },
  { id: "BR007", key: "Cabang 6", name: "Cabang 6 - Al Furqan", location: "Subang, Jawa Barat", status: "Aktif" },
  { id: "BR008", key: "Cabang 7", name: "Cabang 7 - Darussalam", location: "Karawang, Jawa Barat", status: "Aktif" },
  { id: "BR009", key: "Cabang 8", name: "Cabang 8 - Baitul Ilmi", location: "Purwakarta, Jawa Barat", status: "Nonaktif" },
  { id: "BR010", key: "Cabang 9", name: "Cabang 9 - Al Amin", location: "Majalengka, Jawa Barat", status: "Aktif" },
  { id: "BR011", key: "Cabang 10", name: "Cabang 10 - Al Hidayah", location: "Kuningan, Jawa Barat", status: "Aktif" },
  { id: "BR012", key: "Cabang 11", name: "Cabang 11 - Riyadhul Jannah", location: "Indramayu, Jawa Barat", status: "Aktif" },
];

export const mockRooms = [
  { id: "RM001", name: "Asrama 1 - K.01", branch: "Pusat", floor: "1", capacity: "8" },
  { id: "RM002", name: "Asrama 1 - K.02", branch: "Pusat", floor: "1", capacity: "8" },
  { id: "RM003", name: "Asrama 1 - K.03", branch: "Pusat", floor: "1", capacity: "8" },
  { id: "RM004", name: "Asrama 1 - K.04", branch: "Pusat", floor: "2", capacity: "8" },
  { id: "RM005", name: "Asrama 2 - K.01", branch: "Pusat", floor: "1", capacity: "6" },
  { id: "RM006", name: "Asrama 2 - K.05", branch: "Pusat", floor: "2", capacity: "6" },
  { id: "RM007", name: "Asrama 3 - K.01", branch: "Cabang 1", floor: "1", capacity: "8" },
  { id: "RM008", name: "Asrama 3 - K.02", branch: "Cabang 1", floor: "1", capacity: "8" },
  { id: "RM009", name: "Asrama 4 - K.01", branch: "Cabang 2", floor: "1", capacity: "6" },
  { id: "RM010", name: "Asrama 4 - K.03", branch: "Cabang 2", floor: "1", capacity: "6" },
  { id: "RM011", name: "Asrama 1 - K.05", branch: "Pusat", floor: "2", capacity: "8" },
  { id: "RM012", name: "Asrama 1 - K.06", branch: "Pusat", floor: "2", capacity: "8" },
  { id: "RM013", name: "Asrama 2 - K.02", branch: "Pusat", floor: "1", capacity: "6" },
  { id: "RM014", name: "Asrama 3 - K.03", branch: "Cabang 1", floor: "2", capacity: "8" },
  { id: "RM015", name: "Asrama 4 - K.02", branch: "Cabang 2", floor: "1", capacity: "6" },
  { id: "RM016", name: "Asrama 5 - K.01", branch: "Cabang 3", floor: "1", capacity: "8" },
  { id: "RM017", name: "Asrama 5 - K.02", branch: "Cabang 3", floor: "1", capacity: "8" },
  { id: "RM018", name: "Asrama 5 - K.03", branch: "Cabang 3", floor: "2", capacity: "6" },
  { id: "RM019", name: "Asrama 6 - K.01", branch: "Cabang 4", floor: "1", capacity: "8" },
  { id: "RM020", name: "Asrama 6 - K.02", branch: "Cabang 4", floor: "1", capacity: "6" },
  { id: "RM021", name: "Asrama 7 - K.01", branch: "Cabang 6", floor: "1", capacity: "8" },
  { id: "RM022", name: "Asrama 7 - K.02", branch: "Cabang 6", floor: "1", capacity: "6" },
  { id: "RM023", name: "Asrama 8 - K.01", branch: "Cabang 7", floor: "1", capacity: "8" },
  { id: "RM024", name: "Asrama 9 - K.01", branch: "Cabang 9", floor: "1", capacity: "8" },
  { id: "RM025", name: "Asrama 9 - K.02", branch: "Cabang 9", floor: "1", capacity: "6" },
  { id: "RM026", name: "Asrama 10 - K.01", branch: "Cabang 10", floor: "1", capacity: "8" },
  { id: "RM027", name: "Asrama 11 - K.01", branch: "Cabang 11", floor: "1", capacity: "8" },
  { id: "RM028", name: "Asrama 11 - K.02", branch: "Cabang 11", floor: "1", capacity: "6" },
];

export const mockStudents = [
  { id: "2024001", nis: "2024001", name: "Ahmad Fauzi", gender: "L", branch: "Pusat", class: "X-A", room: "Asrama 1 - K.01", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024002", nis: "2024002", name: "Siti Aisyah", gender: "P", branch: "Pusat", class: "X-B", room: "Asrama 2 - K.05", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024003", nis: "2024003", name: "Muhammad Rizki", gender: "L", branch: "Cabang 1", class: "XI-A", room: "Asrama 3 - K.02", year: "2023", academicYear: "2024/2025", status: "Aktif" },
  { id: "2023004", nis: "2023004", name: "Fatimah Zahra", gender: "P", branch: "Pusat", class: "XII-A", room: "Asrama 2 - K.02", year: "2022", academicYear: "2024/2025", status: "Aktif" },
  { id: "2023005", nis: "2023005", name: "Umar Hadi", gender: "L", branch: "Cabang 2", class: "XI-B", room: "Asrama 4 - K.01", year: "2023", academicYear: "2024/2025", status: "Cuti" },
  { id: "2024006", nis: "2024006", name: "Khadijah Nur", gender: "P", branch: "Cabang 1", class: "X-A", room: "Asrama 3 - K.01", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2022007", nis: "2022007", name: "Ibrahim Malik", gender: "L", branch: "Pusat", class: "XII-B", room: "Asrama 1 - K.06", year: "2022", academicYear: "2023/2024", status: "Alumni" },
  { id: "2024008", nis: "2024008", name: "Aisyah Putri", gender: "P", branch: "Cabang 2", class: "X-C", room: "Asrama 4 - K.03", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024009", nis: "2024009", name: "Zainab Amira", gender: "P", branch: "Pusat", class: "XI-A", room: "Asrama 2 - K.01", year: "2023", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024010", nis: "2024010", name: "Yusuf Rahman", gender: "L", branch: "Pusat", class: "XII-A", room: "Asrama 1 - K.04", year: "2022", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024011", nis: "2024011", name: "Halimah Sadia", gender: "P", branch: "Cabang 1", class: "X-B", room: "Asrama 3 - K.03", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024012", nis: "2024012", name: "Bilal Hakim", gender: "L", branch: "Cabang 2", class: "XI-B", room: "Asrama 4 - K.02", year: "2023", academicYear: "2024/2025", status: "Aktif" },
  { id: "2023013", nis: "2023013", name: "Ruqayyah Hasan", gender: "P", branch: "Pusat", class: "XII-A", room: "Asrama 1 - K.02", year: "2022", academicYear: "2023/2024", status: "Alumni" },
  { id: "2024014", nis: "2024014", name: "Hamzah Ridwan", gender: "L", branch: "Cabang 1", class: "X-C", room: "Asrama 3 - K.01", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024015", nis: "2024015", name: "Maryam Azzahra", gender: "P", branch: "Pusat", class: "XI-A", room: "Asrama 1 - K.03", year: "2023", academicYear: "2024/2025", status: "Cuti" },
  { id: "2024016", nis: "2024016", name: "Ali Akbar", gender: "L", branch: "Cabang 3", class: "X-A", room: "Asrama 5 - K.01", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024017", nis: "2024017", name: "Nadia Safira", gender: "P", branch: "Cabang 3", class: "X-B", room: "Asrama 5 - K.02", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024018", nis: "2024018", name: "Raffi Ananda", gender: "L", branch: "Cabang 4", class: "XI-A", room: "Asrama 6 - K.01", year: "2023", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024019", nis: "2024019", name: "Salma Khairunnisa", gender: "P", branch: "Cabang 6", class: "X-A", room: "Asrama 7 - K.01", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024020", nis: "2024020", name: "Dimas Prasetyo", gender: "L", branch: "Cabang 7", class: "XI-B", room: "Asrama 8 - K.01", year: "2023", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024021", nis: "2024021", name: "Laila Maharani", gender: "P", branch: "Cabang 9", class: "X-A", room: "Asrama 9 - K.01", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024022", nis: "2024022", name: "Fajar Nugroho", gender: "L", branch: "Cabang 9", class: "X-B", room: "Asrama 9 - K.02", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024023", nis: "2024023", name: "Intan Permata", gender: "P", branch: "Cabang 10", class: "XI-A", room: "Asrama 10 - K.01", year: "2023", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024024", nis: "2024024", name: "Rizky Maulana", gender: "L", branch: "Cabang 11", class: "X-A", room: "Asrama 11 - K.01", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024025", nis: "2024025", name: "Dewi Anggraini", gender: "P", branch: "Cabang 11", class: "X-B", room: "Asrama 11 - K.02", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024026", nis: "2024026", name: "Hasan Basri", gender: "L", branch: "Pusat", class: "X-A", room: "Asrama 1 - K.01", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024027", nis: "2024027", name: "Nur Hidayah", gender: "P", branch: "Pusat", class: "X-B", room: "Asrama 1 - K.05", year: "2024", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024028", nis: "2024028", name: "Abdurrahman", gender: "L", branch: "Cabang 1", class: "XI-B", room: "Asrama 3 - K.02", year: "2023", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024029", nis: "2024029", name: "Syifa Aulia", gender: "P", branch: "Cabang 3", class: "XI-A", room: "Asrama 5 - K.03", year: "2023", academicYear: "2024/2025", status: "Aktif" },
  { id: "2024030", nis: "2024030", name: "Farhan Mubarak", gender: "L", branch: "Cabang 4", class: "X-B", room: "Asrama 6 - K.02", year: "2024", academicYear: "2024/2025", status: "Aktif" },
];

// Helper: count students per branch
export function getStudentCountByBranch(branchKey: string): number {
  return mockStudents.filter((s) => s.branch === branchKey && s.status === "Aktif").length;
}

// Helper: count rooms per branch
export function getRoomCountByBranch(branchKey: string): number {
  return mockRooms.filter((r) => r.branch === branchKey).length;
}

// Helper: count students in a specific room
export function getOccupiedByRoom(roomName: string): number {
  return mockStudents.filter((s) => s.room === roomName && s.status === "Aktif").length;
}

// Get all unique branch keys for filters
export function getAllBranchKeys(): string[] {
  return [...new Set(mockBranches.map((b) => b.key))];
}

// Get branch options for select/filter
export function getBranchOptions() {
  return mockBranches.map((b) => ({ value: b.key, label: b.key === "Pusat" ? "Pusat" : b.key }));
}
