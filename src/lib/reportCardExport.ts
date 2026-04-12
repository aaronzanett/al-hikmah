import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, WidthType, BorderStyle, ShadingType,
  Header, Footer, PageNumber, HeadingLevel,
} from "docx";
import { saveAs } from "file-saver";

// ─── Shared Types ───
export interface ReportSubject {
  name: string;
  tugas: number | null;
  uts: number | null;
  uas: number | null;
  praktik: number | null;
}

export interface ReportConfig {
  institutionName: string;
  institutionAddress: string;
  institutionPhone: string;
  institutionEmail: string;
  npsn: string;
  curriculum: string;
  academicYear: string;
  principalName: string;
  principalNip: string;
  paperSize: string;
  orientation: string;
  showLogo: boolean;
  showSchoolHeader: boolean;
  headerStyle: string;
  gradeScales: { grade: string; min: number; max: number; description: string }[];
  examWeights: { type: string; weight: number; enabled: boolean }[];
  reportElements: { id: string; label: string; enabled: boolean; description: string }[];
  classTeacherNote: boolean;
  principalSignature: boolean;
  parentSignature: boolean;
  stampSeal: boolean;
  attendanceSummary: boolean;
  extracurricularSection: boolean;
  behaviorGrades: boolean;
  rankingDisplay: string;
  passingGrade: number;
  showPercentage: boolean;
  showBarChart: boolean;
}

export interface StudentReportData {
  studentName: string;
  nis: string;
  kelas: string;
  semester: string;
  subjects: ReportSubject[];
  rank?: number;
  totalClass?: number;
  hafalan?: number;
  attendance?: { hadir: number; sakit: number; izin: number; alpha: number };
  teacherNote?: string;
  teacherName?: string;
}

const has = (config: ReportConfig, id: string) =>
  config.reportElements.some(e => e.id === id && e.enabled);

const enabledWeights = (config: ReportConfig) =>
  config.examWeights.filter(w => w.enabled);

const calcWeightedAvg = (subj: ReportSubject, config: ReportConfig) => {
  const weights = enabledWeights(config);
  let totalW = 0, totalS = 0;
  for (const w of weights) {
    const key = w.type.toLowerCase() as keyof ReportSubject;
    const val = subj[key] as number | null;
    if (val !== null && val !== undefined) {
      totalS += val * w.weight;
      totalW += w.weight;
    }
  }
  return totalW > 0 ? Math.round(totalS / totalW) : 0;
};

const getGrade = (score: number, config: ReportConfig) => {
  for (const s of config.gradeScales) {
    if (score >= s.min && score <= s.max) return s.grade;
  }
  return "D";
};

// ─── DOCX Export ───
export async function exportReportDocx(data: StudentReportData, config: ReportConfig) {
  const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: "999999" };
  const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
  const margins = { top: 60, bottom: 60, left: 100, right: 100 };
  const weights = enabledWeights(config);

  // Calculate column widths
  const nameColW = 3200;
  const numColW = 500;
  const scoreColW = 900;
  const totalCols = 2 + weights.length + 1 + 1 + (config.showPercentage ? 1 : 0); // No, Name, scores..., avg, grade, %?
  const remainingW = 9360 - nameColW - numColW;
  const perCol = Math.floor(remainingW / (totalCols - 2));

  const children: any[] = [];

  // Header
  if (has(config, "header")) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: config.institutionName.toUpperCase(), bold: true, size: 28, font: "Arial" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 20 },
        children: [new TextRun({ text: config.institutionAddress, size: 18, font: "Arial" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 20 },
        children: [new TextRun({ text: `${config.institutionPhone} | ${config.institutionEmail}`, size: 18, font: "Arial" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: `NPSN: ${config.npsn}`, size: 18, font: "Arial" })],
      }),
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000", space: 1 } },
        spacing: { after: 200 },
        children: [],
      })
    );
  }

  // Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 60 },
      children: [new TextRun({ text: "LAPORAN HASIL BELAJAR SANTRI", bold: true, size: 26, font: "Arial" })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: `Tahun Pelajaran ${config.academicYear} — ${data.semester}`, size: 20, font: "Arial" })],
    })
  );

  // Student Info
  if (has(config, "student_info")) {
    const infoPairs = [
      ["Nama Santri", data.studentName],
      ["NIS", data.nis],
      ["Kelas", data.kelas],
      ["Semester", data.semester],
    ];
    for (const [label, val] of infoPairs) {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: `${label}`, bold: true, size: 20, font: "Arial" }),
            new TextRun({ text: `\t: ${val}`, size: 20, font: "Arial" }),
          ],
          tabStops: [{ type: "left" as any, position: 2400 }],
        })
      );
    }
    children.push(new Paragraph({ spacing: { after: 200 }, children: [] }));
  }

  // Grade Table
  if (has(config, "grade_table")) {
    const headerCells = [
      new TableCell({
        borders, margins, width: { size: numColW, type: WidthType.DXA },
        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "No", bold: true, size: 18, font: "Arial" })] })],
      }),
      new TableCell({
        borders, margins, width: { size: nameColW, type: WidthType.DXA },
        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
        children: [new Paragraph({ children: [new TextRun({ text: "Mata Pelajaran", bold: true, size: 18, font: "Arial" })] })],
      }),
    ];

    if (has(config, "score_detail")) {
      for (const w of weights) {
        headerCells.push(
          new TableCell({
            borders, margins, width: { size: perCol, type: WidthType.DXA },
            shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: w.type, bold: true, size: 18, font: "Arial" })] })],
          })
        );
      }
    }

    headerCells.push(
      new TableCell({
        borders, margins, width: { size: perCol, type: WidthType.DXA },
        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Rata²", bold: true, size: 18, font: "Arial" })] })],
      }),
      new TableCell({
        borders, margins, width: { size: perCol, type: WidthType.DXA },
        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Nilai", bold: true, size: 18, font: "Arial" })] })],
      })
    );

    if (config.showPercentage) {
      headerCells.push(
        new TableCell({
          borders, margins, width: { size: perCol, type: WidthType.DXA },
          shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "%", bold: true, size: 18, font: "Arial" })] })],
        })
      );
    }

    const tableRows = [new TableRow({ children: headerCells })];

    let totalAvg = 0;
    for (let i = 0; i < data.subjects.length; i++) {
      const subj = data.subjects[i];
      const avg = calcWeightedAvg(subj, config);
      totalAvg += avg;
      const grade = getGrade(avg, config);
      const rowFill = i % 2 === 0 ? "FFFFFF" : "F5F5F5";

      const cells = [
        new TableCell({
          borders, margins, width: { size: numColW, type: WidthType.DXA },
          shading: { fill: rowFill, type: ShadingType.CLEAR },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${i + 1}`, size: 18, font: "Arial" })] })],
        }),
        new TableCell({
          borders, margins, width: { size: nameColW, type: WidthType.DXA },
          shading: { fill: rowFill, type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: subj.name, size: 18, font: "Arial" })] })],
        }),
      ];

      if (has(config, "score_detail")) {
        for (const w of weights) {
          const key = w.type.toLowerCase() as keyof ReportSubject;
          const val = subj[key] as number | null;
          cells.push(
            new TableCell({
              borders, margins, width: { size: perCol, type: WidthType.DXA },
              shading: { fill: rowFill, type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: val !== null ? `${val}` : "—", size: 18, font: "Arial" })] })],
            })
          );
        }
      }

      cells.push(
        new TableCell({
          borders, margins, width: { size: perCol, type: WidthType.DXA },
          shading: { fill: rowFill, type: ShadingType.CLEAR },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${avg}`, bold: true, size: 18, font: "Arial" })] })],
        }),
        new TableCell({
          borders, margins, width: { size: perCol, type: WidthType.DXA },
          shading: { fill: rowFill, type: ShadingType.CLEAR },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: grade, bold: true, size: 18, font: "Arial" })] })],
        })
      );

      if (config.showPercentage) {
        cells.push(
          new TableCell({
            borders, margins, width: { size: perCol, type: WidthType.DXA },
            shading: { fill: rowFill, type: ShadingType.CLEAR },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${avg}%`, size: 18, font: "Arial" })] })],
          })
        );
      }

      tableRows.push(new TableRow({ children: cells }));
    }

    // Average row
    if (has(config, "average")) {
      const overallAvg = data.subjects.length > 0 ? Math.round(totalAvg / data.subjects.length) : 0;
      const avgCells: TableCell[] = [
        new TableCell({
          borders, margins,
          columnSpan: 2 + (has(config, "score_detail") ? weights.length : 0),
          shading: { fill: "E8EDF2", type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: "Rata-rata Keseluruhan", bold: true, size: 18, font: "Arial" })] })],
        }),
        new TableCell({
          borders, margins, width: { size: perCol, type: WidthType.DXA },
          shading: { fill: "E8EDF2", type: ShadingType.CLEAR },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${overallAvg}`, bold: true, size: 18, font: "Arial" })] })],
        }),
        new TableCell({
          borders, margins, width: { size: perCol, type: WidthType.DXA },
          shading: { fill: "E8EDF2", type: ShadingType.CLEAR },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: getGrade(overallAvg, config), bold: true, size: 18, font: "Arial" })] })],
        }),
      ];
      if (config.showPercentage) {
        avgCells.push(
          new TableCell({
            borders, margins, width: { size: perCol, type: WidthType.DXA },
            shading: { fill: "E8EDF2", type: ShadingType.CLEAR },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${overallAvg}%`, bold: true, size: 18, font: "Arial" })] })],
          })
        );
      }
      tableRows.push(new TableRow({ children: avgCells }));
    }

    const colCount = headerCells.length;
    const colWidths = [numColW, nameColW, ...Array(colCount - 2).fill(perCol)];

    children.push(
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: colWidths,
        rows: tableRows,
      })
    );

    children.push(new Paragraph({ spacing: { after: 200 }, children: [] }));
  }

  // Ranking
  if (has(config, "ranking") && data.rank && data.totalClass) {
    children.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({ text: `Peringkat Kelas: ${data.rank} dari ${data.totalClass} santri`, bold: true, size: 20, font: "Arial" })],
      })
    );
  }

  // Attendance
  if (has(config, "attendance") && data.attendance) {
    children.push(
      new Paragraph({
        spacing: { before: 100, after: 60 },
        children: [new TextRun({ text: "Kehadiran / Attendance:", bold: true, size: 20, font: "Arial" })],
      }),
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: `Hadir: ${data.attendance.hadir}  |  Sakit: ${data.attendance.sakit}  |  Izin: ${data.attendance.izin}  |  Alpha: ${data.attendance.alpha}`, size: 20, font: "Arial" })],
      })
    );
  }

  // Behavior
  if (has(config, "behavior")) {
    children.push(
      new Paragraph({
        spacing: { before: 100, after: 60 },
        children: [new TextRun({ text: "Sikap & Perilaku / Behavior:", bold: true, size: 20, font: "Arial" })],
      }),
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: "Kedisiplinan: A  |  Akhlak: A  |  Kebersihan: B+  |  Keaktifan: A", size: 20, font: "Arial" })],
      })
    );
  }

  // Teacher Note
  if (has(config, "teacher_note")) {
    children.push(
      new Paragraph({
        spacing: { before: 100, after: 60 },
        children: [new TextRun({ text: "Catatan Wali Kelas:", bold: true, size: 20, font: "Arial" })],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: data.teacherNote || "Santri menunjukkan perkembangan yang baik di semester ini.", italics: true, size: 20, font: "Arial" })],
      })
    );
  }

  // Signatures
  if (has(config, "signatures")) {
    const today = new Date();
    const dateStr = `${today.getDate()} ${["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"][today.getMonth()]} ${today.getFullYear()}`;

    children.push(
      new Paragraph({ spacing: { before: 300 }, children: [] }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 200 },
        children: [new TextRun({ text: `Tanggal: ${dateStr}`, size: 20, font: "Arial" })],
      })
    );

    const sigCells: TableCell[] = [];
    const sigBottomCells: TableCell[] = [];
    const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
    const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

    if (config.parentSignature) {
      sigCells.push(new TableCell({
        borders: noBorders, margins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Orang Tua/Wali", size: 20, font: "Arial" })] })],
      }));
      sigBottomCells.push(new TableCell({
        borders: noBorders, margins,
        children: [
          new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(......................)", size: 20, font: "Arial" })] }),
        ],
      }));
    }

    sigCells.push(new TableCell({
      borders: noBorders, margins,
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Wali Kelas", size: 20, font: "Arial" })] })],
    }));
    sigBottomCells.push(new TableCell({
      borders: noBorders, margins,
      children: [
        new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: data.teacherName || "Ust. Abdullah, S.Pd", size: 20, font: "Arial" })] }),
      ],
    }));

    if (config.principalSignature) {
      sigCells.push(new TableCell({
        borders: noBorders, margins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Kepala Sekolah", size: 20, font: "Arial" })] })],
      }));
      sigBottomCells.push(new TableCell({
        borders: noBorders, margins,
        children: [
          new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: config.principalName, size: 20, font: "Arial" })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `NIP. ${config.principalNip}`, size: 16, font: "Arial" })] }),
        ],
      }));
    }

    const sigColW = Math.floor(9360 / sigCells.length);
    const sigColWidths = sigCells.map(() => sigColW);

    children.push(
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: sigColWidths,
        rows: [
          new TableRow({ children: sigCells }),
          new TableRow({ children: sigBottomCells }),
        ],
      })
    );
  }

  // KKM footer
  children.push(
    new Paragraph({
      spacing: { before: 300 },
      children: [new TextRun({ text: `KKM (Kriteria Ketuntasan Minimal): ${config.passingGrade}`, size: 16, font: "Arial", color: "666666" })],
    })
  );

  const pageW = config.paperSize === "letter" ? 12240 : config.paperSize === "f4" ? 12326 : 11906;
  const pageH = config.paperSize === "letter" ? 15840 : config.paperSize === "f4" ? 18898 : 16838;

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 20 } } },
    },
    sections: [{
      properties: {
        page: {
          size: { width: pageW, height: pageH },
          margin: { top: 1440, right: 1200, bottom: 1440, left: 1200 },
        },
      },
      children,
    }],
  });

  const buffer = await Packer.toBlob(doc);
  saveAs(buffer, `Rapor_${data.studentName.replace(/\s+/g, "_")}_${data.semester.replace(/[\s\/]/g, "_")}.docx`);
}

// ─── PDF Export (enhanced) ───
export function exportReportPdf(data: StudentReportData, config: ReportConfig) {
  const weights = enabledWeights(config);
  const pageW = config.paperSize === "letter" ? 612 : config.paperSize === "f4" ? 612 : 595;
  const pageH = config.paperSize === "letter" ? 792 : config.paperSize === "f4" ? 936 : 842;
  const margin = 40;

  // Dynamic columns based on config
  const baseColWidths: number[] = [30]; // No column
  const nameW = 150;
  baseColWidths.push(nameW);

  if (has(config, "score_detail")) {
    for (const w of weights) {
      baseColWidths.push(50);
    }
  }
  baseColWidths.push(55); // avg
  baseColWidths.push(45); // grade
  if (config.showPercentage) baseColWidths.push(40);

  const tableW = baseColWidths.reduce((a, b) => a + b, 0);
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
  y = 45;
  if (has(config, "header")) {
    addText(pageW / 2, y, config.institutionName.toUpperCase(), 14, true, "center");
    y += 16;
    addText(pageW / 2, y, config.institutionAddress, 7, false, "center");
    y += 10;
    addText(pageW / 2, y, `${config.institutionPhone} | ${config.institutionEmail}`, 7, false, "center");
    y += 10;
    addText(pageW / 2, y, `NPSN: ${config.npsn}`, 7, true, "center");
    y += 8;
    addLine(margin, y + 4, pageW - margin, y + 4, 1);
    y += 16;
  }

  addText(pageW / 2, y, "LAPORAN HASIL BELAJAR SANTRI", 13, true, "center");
  y += 16;
  addText(pageW / 2, y, `Tahun Pelajaran ${config.academicYear} - ${data.semester}`, 9, false, "center");
  y += 18;

  // Student info
  if (has(config, "student_info")) {
    const info = [["Nama Santri", data.studentName], ["NIS", data.nis], ["Kelas", data.kelas], ["Semester", data.semester]];
    for (const [label, val] of info) {
      addText(margin + 10, y, label, 9, true);
      addText(margin + 100, y, `: ${val}`, 9);
      y += 14;
    }
    y += 8;
  }

  // Grade Table
  if (has(config, "grade_table")) {
    const rowH = 20;
    const headers: string[] = ["No", "Mata Pelajaran"];
    if (has(config, "score_detail")) {
      for (const w of weights) headers.push(w.type);
    }
    headers.push("Rata²", "Nilai");
    if (config.showPercentage) headers.push("%");

    // Header row
    addRect(tableX, y, tableW, rowH, "0.85 0.9 0.95 rg");
    let cx = tableX;
    for (let i = 0; i < headers.length; i++) {
      addText(cx + (i === 1 ? 4 : baseColWidths[i] / 2), y + 14, headers[i], 7, true, i === 1 ? "left" : "center");
      cx += baseColWidths[i];
    }
    addLine(tableX, y + rowH, tableX + tableW, y + rowH, 0.5);
    y += rowH;

    // Data rows
    let totalAvg = 0;
    for (let r = 0; r < data.subjects.length; r++) {
      const subj = data.subjects[r];
      const avg = calcWeightedAvg(subj, config);
      totalAvg += avg;
      const grade = getGrade(avg, config);

      if (r % 2 === 0) addRect(tableX, y, tableW, rowH, "0.97 0.97 0.97 rg");

      cx = tableX;
      addText(cx + baseColWidths[0] / 2, y + 14, `${r + 1}`, 7, false, "center");
      cx += baseColWidths[0];
      addText(cx + 4, y + 14, subj.name, 7);
      cx += baseColWidths[1];

      if (has(config, "score_detail")) {
        for (let w = 0; w < weights.length; w++) {
          const key = weights[w].type.toLowerCase() as keyof ReportSubject;
          const val = subj[key] as number | null;
          addText(cx + baseColWidths[2 + w] / 2, y + 14, val !== null ? `${val}` : "-", 7, false, "center");
          cx += baseColWidths[2 + w];
        }
      }

      const avgIdx = 2 + (has(config, "score_detail") ? weights.length : 0);
      addText(cx + baseColWidths[avgIdx] / 2, y + 14, `${avg}`, 7, true, "center");
      cx += baseColWidths[avgIdx];
      addText(cx + baseColWidths[avgIdx + 1] / 2, y + 14, grade, 7, true, "center");
      cx += baseColWidths[avgIdx + 1];

      if (config.showPercentage) {
        addText(cx + baseColWidths[avgIdx + 2] / 2, y + 14, `${avg}%`, 7, false, "center");
      }

      addLine(tableX, y + rowH, tableX + tableW, y + rowH, 0.3);
      y += rowH;
    }

    // Average row
    if (has(config, "average")) {
      const overallAvg = data.subjects.length > 0 ? Math.round(totalAvg / data.subjects.length) : 0;
      addRect(tableX, y, tableW, rowH, "0.9 0.9 0.94 rg");
      addText(tableX + 4, y + 14, "Rata-rata Keseluruhan", 8, true);
      const avgIdx = 2 + (has(config, "score_detail") ? weights.length : 0);
      let avgX = tableX;
      for (let i = 0; i < avgIdx; i++) avgX += baseColWidths[i];
      addText(avgX + baseColWidths[avgIdx] / 2, y + 14, `${overallAvg}`, 8, true, "center");
      y += rowH;
    }

    y += 12;
  }

  // Ranking
  if (has(config, "ranking") && data.rank && data.totalClass) {
    addText(margin + 10, y, `Peringkat Kelas: ${data.rank} dari ${data.totalClass} santri`, 9, true);
    y += 16;
  }

  // Attendance
  if (has(config, "attendance") && data.attendance) {
    addText(margin + 10, y, "Kehadiran:", 9, true);
    y += 14;
    addText(margin + 10, y, `Hadir: ${data.attendance.hadir}  |  Sakit: ${data.attendance.sakit}  |  Izin: ${data.attendance.izin}  |  Alpha: ${data.attendance.alpha}`, 8);
    y += 16;
  }

  // Behavior
  if (has(config, "behavior")) {
    addText(margin + 10, y, "Sikap & Perilaku:", 9, true);
    y += 14;
    addText(margin + 10, y, "Kedisiplinan: A  |  Akhlak: A  |  Kebersihan: B+  |  Keaktifan: A", 8);
    y += 16;
  }

  // Teacher Note
  if (has(config, "teacher_note")) {
    addText(margin + 10, y, "Catatan Wali Kelas:", 9, true);
    y += 14;
    addText(margin + 10, y, data.teacherNote || "Santri menunjukkan perkembangan yang baik.", 8);
    y += 24;
  }

  // Signatures
  if (has(config, "signatures")) {
    const today = new Date();
    const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    addText(pageW - margin - 160, y, `Tanggal: ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`, 8);
    y += 24;

    const sigPositions: { x: number; label: string; name: string; extra?: string }[] = [];
    let sigCount = 1 + (config.parentSignature ? 1 : 0) + (config.principalSignature ? 1 : 0);
    const sigSpacing = (pageW - 2 * margin) / sigCount;
    let sx = margin;

    if (config.parentSignature) {
      sigPositions.push({ x: sx + sigSpacing / 2, label: "Orang Tua/Wali", name: "(......................)" });
      sx += sigSpacing;
    }
    sigPositions.push({ x: sx + sigSpacing / 2, label: "Wali Kelas", name: data.teacherName || "Ust. Abdullah, S.Pd" });
    sx += sigSpacing;
    if (config.principalSignature) {
      sigPositions.push({ x: sx + sigSpacing / 2, label: "Kepala Sekolah", name: config.principalName, extra: `NIP. ${config.principalNip}` });
    }

    for (const sig of sigPositions) {
      addText(sig.x, y, sig.label, 8, false, "center");
    }
    y += 40;
    for (const sig of sigPositions) {
      addText(sig.x, y, sig.name, 8, false, "center");
      if (sig.extra) {
        addText(sig.x, y + 12, sig.extra, 7, false, "center");
      }
    }
    y += 20;
  }

  // KKM
  addText(margin, y + 16, `KKM: ${config.passingGrade}`, 7, false);

  // Build PDF
  const streamContent = lines.join("\n");
  const objects: string[] = [];
  let objCount = 0;
  const addObj = (content: string) => { objCount++; objects.push(`${objCount} 0 obj\n${content}\nendobj`); return objCount; };

  addObj("<< /Type /Catalog /Pages 2 0 R >>");
  addObj("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  addObj(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Contents 4 0 R /Resources << /Font << /Helvetica 5 0 R /Helvetica-Bold 6 0 R >> >> >>`);
  addObj(`<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream`);
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
  a.download = `Rapor_${data.studentName.replace(/\s+/g, "_")}_${data.semester.replace(/[\s\/]/g, "_")}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── localStorage helpers ───
const STORAGE_KEY = "reportCardConfig";

export function loadReportConfig(): ReportConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function saveReportConfig(config: ReportConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {}
}
