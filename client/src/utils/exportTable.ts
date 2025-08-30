// src/utils/exportTable.ts
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export type ExportColumn = {
  header: string; // Column header text
  key: string; // Key in data objects
};

/**
 * Export Excel file with a date range header above the data table
 */
export function exportTableToExcelWithDateRange<T>(
  data: T[],
  columns: ExportColumn[],
  startDate: string,
  endDate: string,
  std?: string,
  div?: string,
  filename = "export.xlsx"
) {
  if (!data.length) return;

  const metaRows = [
    [
      `Attendance Report from ${startDate} to ${endDate} of class ${std} ${div}`,
    ],
    [], // empty line for spacing
  ];

  // Create worksheet and add meta header rows at top
  const ws = XLSX.utils.aoa_to_sheet([]);
  XLSX.utils.sheet_add_aoa(ws, metaRows, { origin: 0 });

  // Map data fields to columns headers
  const sheetData = data.map((row) => {
    const mappedRow: Record<string, any> = {};
    columns.forEach(({ header, key }) => {
      mappedRow[header] = (row as any)[key];
    });
    return mappedRow;
  });

  // Append JSON data from third row onwards (origin: 2)
  XLSX.utils.sheet_add_json(ws, sheetData, { origin: 2, skipHeader: true });

  // Merge header cells for date range (first row)
  const lastColLetter = String.fromCharCode(65 + columns.length - 1);
  ws["!merges"] = ws["!merges"] || [];
  ws["!merges"].push(XLSX.utils.decode_range(`A1:${lastColLetter}1`));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Attendance");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), filename);
}

/**
 * Export PDF with date range subtitle below the main title
 */
export function exportTableToPDFWithDateRange<T>(
  data: T[],
  columns: ExportColumn[],
  startDate: string,
  endDate: string,
  title?: string,
  filename = "export.pdf"
) {
  if (!data.length) return;

  const doc = new jsPDF();

  if (title) {
    doc.setFontSize(14);
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    doc.text(`Date Range: ${startDate} to ${endDate}`, 14, 22);
  }

  const tableColumn = columns.map((col) => col.header);
  const tableRows = data.map((row) =>
    columns.map(({ key }) => {
      const val = (row as any)[key];
      return val !== undefined && val !== null ? String(val) : "";
    })
  );

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: title ? 28 : 14,
    theme: "grid",
  });

  doc.save(filename);
}
