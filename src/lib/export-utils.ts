import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Type definitions for export formats
export type ExportFormat = 'excel' | 'csv' | 'googlesheets';

// Interface for export data
export interface ExportData {
  filename: string;
  data: Array<Record<string, unknown>>;
  columns?: Array<{
    key: string;
    label: string;
    formatter?: (value: unknown) => string;
  }>;
}

// Format currency for export
export const formatCurrencyForExport = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₦0.00';
  }
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
  }).format(amount);
};

// Format date for export
export const formatDateForExport = (dateString: string | undefined): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Transform data for export based on column definitions
const transformDataForExport = (data: Array<Record<string, unknown>>, columns?: ExportData['columns']) => {
  if (!columns) return data;
  
  return data.map(row => {
    const transformedRow: Record<string, unknown> = {};
    columns.forEach(column => {
      const value = row[column.key];
      transformedRow[column.label] = column.formatter ? column.formatter(value) : value;
    });
    return transformedRow;
  });
};

// Export to Excel format
export const exportToExcel = ({ filename, data, columns }: ExportData): void => {
  try {
    const transformedData = transformDataForExport(data, columns);
    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(blob, `${filename}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export to Excel format');
  }
};

// Export to CSV format
export const exportToCSV = ({ filename, data, columns }: ExportData): void => {
  try {
    const transformedData = transformDataForExport(data, columns);
    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw new Error('Failed to export to CSV format');
  }
};

// Generate Google Sheets compatible CSV and provide instructions
export const exportToGoogleSheets = ({ filename, data, columns }: ExportData): void => {
  try {
    // Export as CSV first
    exportToCSV({ filename, data, columns });
    
    // Show instructions for Google Sheets import
    const instructions = `
CSV file downloaded! To import to Google Sheets:

1. Go to Google Sheets (sheets.google.com)
2. Create a new spreadsheet or open existing one
3. Click File → Import
4. Select "Upload" tab
5. Choose the downloaded CSV file (${filename}.csv)
6. Configure import settings and click "Import data"

Your data will be imported into Google Sheets!
    `.trim();
    
    // You could show this in a modal or toast - for now, we'll log it
    console.info(instructions);
    
    return;
  } catch (error) {
    console.error('Error preparing Google Sheets export:', error);
    throw new Error('Failed to prepare Google Sheets export');
  }
};

// Main export function
export const exportData = (exportData: ExportData, format: ExportFormat = 'excel'): void => {
  if (!exportData.data || exportData.data.length === 0) {
    throw new Error('No data available to export');
  }

  switch (format) {
    case 'excel':
      exportToExcel(exportData);
      break;
    case 'csv':
      exportToCSV(exportData);
      break;
    case 'googlesheets':
      exportToGoogleSheets(exportData);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

// Predefined column configurations for different data types

// Sales data columns
export const salesColumns = [
  { key: 'saleDate', label: 'Date & Time', formatter: (value: unknown) => formatDateForExport(value as string) },
  { key: 'productName', label: 'Product Name', formatter: (value: unknown) => String(value || 'N/A') },
  { key: 'quantity', label: 'Quantity', formatter: (value: unknown) => String(value || '0') },
  { key: 'unitPrice', label: 'Unit Price', formatter: (value: unknown) => formatCurrencyForExport(value as number) },
  { key: 'totalPrice', label: 'Total Price', formatter: (value: unknown) => formatCurrencyForExport(value as number) },
  { key: 'paymentMethod', label: 'Payment Method', formatter: (value: unknown) => String(value || '').charAt(0).toUpperCase() + String(value || '').slice(1) },
  { key: 'customerName', label: 'Customer Name', formatter: (value: unknown) => String(value || 'N/A') },
  { key: 'notes', label: 'Notes', formatter: (value: unknown) => String(value || 'N/A') }
];

// Inventory/Products data columns
export const inventoryColumns = [
  { key: 'name', label: 'Product Name', formatter: (value: unknown) => String(value || 'N/A') },
  { key: 'category', label: 'Category', formatter: (value: unknown) => String(value || 'N/A') },
  { key: 'price', label: 'Price', formatter: (value: unknown) => formatCurrencyForExport(value as number) },
  { key: 'currentQuantity', label: 'Current Stock', formatter: (value: unknown) => String(value || '0') },
  { key: 'initialQuantity', label: 'Initial Stock', formatter: (value: unknown) => String(value || '0') },
  { key: 'restockLevel', label: 'Restock Level', formatter: (value: unknown) => String(value || '0') },
  { key: 'sku', label: 'SKU', formatter: (value: unknown) => String(value || 'N/A') },
  { key: 'createdAt', label: 'Date Added', formatter: (value: unknown) => formatDateForExport(value as string) }
];

// Credit book data columns  
export const creditColumns = [
  { key: 'customerName', label: 'Customer Name', formatter: (value: unknown) => String(value || 'N/A') },
  { key: 'totalBalance', label: 'Total Balance', formatter: (value: unknown) => formatCurrencyForExport(value as number) },
  { key: 'totalCredit', label: 'Total Credit', formatter: (value: unknown) => formatCurrencyForExport(value as number) },
  { key: 'totalPayment', label: 'Total Payments', formatter: (value: unknown) => formatCurrencyForExport(value as number) },
  { key: 'lastTransactionDate', label: 'Last Transaction', formatter: (value: unknown) => formatDateForExport(value as string) },
  { key: 'createdAt', label: 'Customer Since', formatter: (value: unknown) => formatDateForExport(value as string) }
];

// Credit transactions columns
export const creditTransactionsColumns = [
  { key: 'date', label: 'Date', formatter: (value: unknown) => formatDateForExport(value as string) },
  { key: 'type', label: 'Transaction Type', formatter: (value: unknown) => String(value || '').charAt(0).toUpperCase() + String(value || '').slice(1) },
  { key: 'amount', label: 'Amount', formatter: (value: unknown) => formatCurrencyForExport(value as number) },
  { key: 'description', label: 'Description', formatter: (value: unknown) => String(value || 'N/A') },
  { key: 'balance', label: 'Running Balance', formatter: (value: unknown) => formatCurrencyForExport(value as number) }
];
