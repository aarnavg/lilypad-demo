import { jsPDF } from 'jspdf';

export interface PdfExportOptions {
  title?: string;
  filename?: string;
  orientation?: 'portrait' | 'landscape';
}

export interface ReportRow {
  [key: string]: string | number;
}

export function exportToPdf(
  data: ReportRow[],
  headers: string[],
  options: PdfExportOptions = {}
): void {
  const { title = 'Report', filename = 'report.pdf', orientation = 'portrait' } = options;

  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4'
  });

  doc.setFontSize(18);
  doc.text(title, 14, 20);

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const availableWidth = pageWidth - margin * 2;
  const colWidth = availableWidth / headers.length;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');

  let yPos = 35;
  headers.forEach((header, index) => {
    doc.text(header, margin + index * colWidth, yPos);
  });

  doc.setFont('helvetica', 'normal');
  yPos += 8;

  data.forEach((row) => {
    headers.forEach((header, index) => {
      const value = String(row[header] ?? '');
      doc.text(value, margin + index * colWidth, yPos);
    });
    yPos += 7;
  });

  doc.save(filename);
}
