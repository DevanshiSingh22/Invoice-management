export function exportInvoicesToCsv(rows) {
  const headers = ['Invoice', 'Client', 'Issue Date', 'Due Date', 'Amount', 'Status', 'Category'];
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const lines = rows.map((row) => [row.id, row.client, row.issueDate, row.dueDate, row.amount, row.status, row.category].map(escape).join(','));
  const blob = new Blob([[headers.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoices-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
