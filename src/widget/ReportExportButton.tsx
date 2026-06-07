import React from 'react';
import { Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

interface ReportData {
  id: string;
  title: string;
  data: Record<string, unknown>[];
  generatedAt: Date;
}

interface ReportExportButtonProps {
  reportData: ReportData;
  onExport?: (data: ReportData) => void;
  disabled?: boolean;
}

export const ReportExportButton: React.FC<ReportExportButtonProps> = ({
  reportData,
  onExport,
  disabled = false,
}) => {
  const handleExport = () => {
    if (onExport) {
      onExport(reportData);
    } else {
      generatePDF(reportData);
    }
  };

  const generatePDF = (data: ReportData): void => {
    // PDF generation logic will be implemented separately
    console.log('Generating PDF for report:', data.title);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<PictureAsPdfIcon />}
      onClick={handleExport}
      disabled={disabled}
    >
      Export PDF
    </Button>
  );
};

export default ReportExportButton;
