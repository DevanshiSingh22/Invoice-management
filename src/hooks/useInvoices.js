import { useMemo, useState } from 'react';
import { initialInvoices } from '../data/invoices';

export function useInvoices() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelected = (id) => setSelectedIds((current) => current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id]);

  const toggleAll = (ids) => setSelectedIds((current) => {
    const allSelected = ids.length > 0 && ids.every((id) => current.includes(id));
    return allSelected ? current.filter((id) => !ids.includes(id)) : [...new Set([...current, ...ids])];
  });

  const removeSelected = () => {
    setInvoices((current) => current.filter((invoice) => !selectedIds.includes(invoice.id)));
    setSelectedIds([]);
  };

  const markSelectedPaid = () => {
    setInvoices((current) => current.map((invoice) => selectedIds.includes(invoice.id)
      ? { ...invoice, status: 'Paid' }
      : invoice));
    setSelectedIds([]);
  };

  const markPaidById = (id) => setInvoices((current) => current.map((invoice) => invoice.id === id ? { ...invoice, status: 'Paid' } : invoice));

  const addInvoice = (invoice) => setInvoices((current) => [invoice, ...current]);

  const summary = useMemo(() => ({
    total: invoices.length,
    paid: invoices.filter((invoice) => invoice.status === 'Paid').length,
    pending: invoices.filter((invoice) => invoice.status === 'Pending').length,
    pendingAmount: invoices.filter((invoice) => invoice.status === 'Pending').reduce((sum, invoice) => sum + invoice.amount, 0),
    overdue: invoices.filter((invoice) => invoice.status === 'Overdue').length,
    totalValue: invoices.reduce((sum, invoice) => sum + invoice.amount, 0),
    paidValue: invoices.filter((invoice) => invoice.status === 'Paid').reduce((sum, invoice) => sum + invoice.amount, 0),
  }), [invoices]);

  return {
    invoices, setInvoices, selectedIds, toggleSelected, toggleAll,
    removeSelected, markSelectedPaid, markPaidById, addInvoice, summary,
  };
}
