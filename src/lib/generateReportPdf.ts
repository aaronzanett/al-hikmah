interface SubjectScore {
  name: string;
  score: number;
  grade: string;
  tugas: number;
  uts: number;
  uas: number;
  praktik: number;
}

interface ReportData {
  studentName: string;
  nis: string;
  kelas: string;
  semester: string;
  subjects: SubjectScore[];
  avg: string;
  rank: number;
  totalClass: number;
  hafalan: number;
}

export const generateReportPdf = (data: ReportData) => {
  const { studentName, nis, kelas, semester, subjects, avg, rank, totalClass, hafalan } = data;

  const pageW = 595;
  const pageH = 842;
  const margin = 40;
  const colWidths = [180, 50, 50, 50, 50, 55, 50];
  const tableW = colWidths.reduce((a, b) => a + b, 0);
  const tableX = (pageW - tableW) / 2;

  let y = 0;
  const lines: string[] = [];

  const addText = (x: number, yPos: number, text: string, size = 10, bold = false, align: "left" | "center" | "right" = "left") => {
    const font = bold ? "Helvetica-Bold" : "Helvetica";
    lines.push(`BT /${font} ${size} Tf`);
    let tx = x;
    if (align === "center") tx = x - (text.length * size * 0.28);
    if (align === "right") tx = x - (text.length * size * 0.55);
    lines.push(`${tx} ${pageH - yPos} Td`);
    lines.push(`(${text.replace(/[()\\]/g, "\\$&")}) Tj`);
    lines.push("ET");
  };

  const addLine = (x1: number, y1: number, x2: number, y2: number, width = 0.5) => {
    lines.push(`${width} w ${x1} ${pageH - y1} m ${x2} ${pageH - y2} l S`);
  };

  const addRect = (x: number, yPos: number, w: number, h: number, fill: string) => {
    lines.push(`${fill} ${x} ${pageH - yPos - h} ${w} ${h} re f`);
  };

  // Header
  y = 50;
  addText(pageW / 2, y, "LAPORAN HASIL BELAJAR SANTRI", 16, true, "center");
  y += 20;
  addText(pageW / 2, y, "Pondok Pesantren Modern", 11, false, "center");
  y += 14;
  addLine(margin, y + 4, pageW - margin, y + 4, 1);
  y += 20;

  // Student info
  const infoItems = [
    ["Nama Santri", studentName],
    ["NIS", nis],
    ["Kelas", kelas],
    ["Semester", semester],
  ];
  for (const [label, val] of infoItems) {
    addText(margin + 10, y, `${label}`, 10, true);
    addText(margin + 120, y, `: ${val}`, 10);
    y += 16;
  }
  y += 10;

  // Table header
  const headers = ["Mata Pelajaran", "Tugas", "UTS", "UAS", "Praktik", "Rata-rata", "Grade"];
  const rowH = 22;
  addRect(tableX, y, tableW, rowH, "0.9 0.9 0.9 rg");
  let cx = tableX;
  for (let i = 0; i < headers.length; i++) {
    addText(cx + 4, y + 15, headers[i], 8, true);
    cx += colWidths[i];
  }
  addLine(tableX, y + rowH, tableX + tableW, y + rowH, 0.5);
  y += rowH;

  // Table rows
  for (let r = 0; r < subjects.length; r++) {
    const sub = subjects[r];
    if (r % 2 === 0) addRect(tableX, y, tableW, rowH, "0.97 0.97 0.97 rg");
    cx = tableX;
    addText(cx + 4, y + 15, sub.name, 8);
    cx += colWidths[0];
    const vals = [sub.tugas, sub.uts, sub.uas, sub.praktik, sub.score];
    for (let v = 0; v < vals.length; v++) {
      addText(cx + colWidths[v + 1] / 2, y + 15, vals[v].toString(), 8, v === 4, "center");
      cx += colWidths[v + 1];
    }
    addText(cx + colWidths[6] / 2, y + 15, sub.grade, 8, true, "center");
    addLine(tableX, y + rowH, tableX + tableW, y + rowH, 0.3);
    y += rowH;
  }

  // Average row
  addRect(tableX, y, tableW, rowH, "0.92 0.92 0.95 rg");
  addText(tableX + 4, y + 15, "Rata-rata Keseluruhan", 9, true);
  const avgX = tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4];
  addText(avgX + colWidths[5] / 2, y + 15, avg, 9, true, "center");
  y += rowH + 15;

  // Summary
  addText(margin + 10, y, `Peringkat Kelas  : ${rank} dari ${totalClass} santri`, 10, true);
  y += 18;
  addText(margin + 10, y, `Hafalan Al-Qur'an : ${hafalan} dari 30 Juz`, 10, true);
  y += 40;

  // Signature
  addText(pageW - margin - 150, y, `Tanggal: 6 April 2026`, 9);
  y += 30;
  addText(pageW - margin - 150, y, "Wali Kelas,", 9);
  y += 40;
  addText(pageW - margin - 150, y, "________________________", 9);

  // Build minimal PDF
  const streamContent = lines.join("\n");
  const objects: string[] = [];
  let objCount = 0;

  const addObj = (content: string) => {
    objCount++;
    objects.push(`${objCount} 0 obj\n${content}\nendobj`);
    return objCount;
  };

  const catalogId = addObj("<< /Type /Catalog /Pages 2 0 R >>");
  const pagesId = addObj("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  const pageId = addObj(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Contents 4 0 R /Resources << /Font << /Helvetica 5 0 R /Helvetica-Bold 6 0 R >> >> >>`
  );
  const streamId = addObj(
    `<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream`
  );
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

  const body = objects.join("\n\n");
  const xrefOffset = body.length + 30;

  const pdf = `%PDF-1.4
${body}

xref
0 ${objCount + 1}
0000000000 65535 f 

trailer
<< /Size ${objCount + 1} /Root 1 0 R >>
startxref
${xrefOffset}
%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Rapor_${semester.replace(/[\s\/]/g, "_")}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
