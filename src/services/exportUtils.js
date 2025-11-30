// Data export utilities for Excel and PDF
export function exportToCSV(data, filename = 'export.csv') {
  if (!Array.isArray(data) || data.length === 0) {
    alert('No data to export');
    return;
  }

  const keys = Object.keys(data[0]);
  const csv = [
    keys.join(','),
    ...data.map(row => keys.map(key => {
      const val = row[key];
      if (typeof val === 'string' && val.includes(',')) {
        return `"${val}"`;
      }
      return val;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToJSON(data, filename = 'export.json') {
  if (!data) {
    alert('No data to export');
    return;
  }

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// For PDF export, users should install a library like jsPDF or pdfkit
// This is a stub for future implementation
export function exportToPDF(data, filename = 'export.pdf') {
  alert('PDF export requires additional library (jsPDF, pdfkit, etc.)');
  console.warn('PDF export not yet implemented. Consider installing jsPDF or similar.');
}
