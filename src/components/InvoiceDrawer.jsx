import { CheckCircle2, Download, Mail, X } from 'lucide-react';
import { formatCurrency, formatDate, daysOverdue } from '../lib/formatters';
import StatusBadge from './StatusBadge';

export default function InvoiceDrawer({ invoice, onClose, onDownload, role = 'Administrator', onMarkPaid }) {
  if (!invoice) return null;
  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  return <div className="drawer-shell">
    <button className="drawer-backdrop" onClick={onClose} aria-label="Close invoice details"/>
    <aside className="drawer">
      <div className="drawer-header"><div><span className="eyebrow">Invoice details</span><h2>{invoice.id}</h2></div><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20}/></button></div>
      <div className="drawer-scroll">
        <div className="invoice-hero"><div><span className="muted">Total amount</span><strong>{formatCurrency(invoice.amount)}</strong></div><StatusBadge status={invoice.status}/></div>
        <div className="detail-grid"><div><span>Customer</span><strong>{invoice.client}</strong></div><div><span>Category</span><strong>{invoice.category}</strong></div><div><span>Issue date</span><strong>{formatDate(invoice.issueDate)}</strong></div><div><span>Due date</span><strong>{formatDate(invoice.dueDate)}</strong></div></div>
        <div className="client-box"><div className="avatar small">{invoice.client.split(' ').map((word) => word[0]).join('').slice(0,2)}</div><div><strong>{invoice.client}</strong><span>{invoice.email}</span></div><button className="icon-btn" title="Email customer"><Mail size={17}/></button></div>
        <section className="drawer-section"><div className="section-heading"><h3>Line items</h3><span>{invoice.items.length} items</span></div><div className="line-items">{invoice.items.map((item, index) => <div className="line-item" key={`${item.description}-${index}`}><div><strong>{item.description}</strong><span>{item.quantity} × {formatCurrency(item.rate)}</span></div><strong>{formatCurrency(item.quantity * item.rate)}</strong></div>)}</div><div className="total-row"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div><div className="total-row grand"><span>Total</span><strong>{formatCurrency(invoice.amount)}</strong></div></section>
        {invoice.status === 'Overdue' && <div className="alert-box"><strong>{daysOverdue(invoice.dueDate)} days overdue</strong><span>Follow up with the customer to close this invoice.</span></div>}
      </div>
      <div className="drawer-footer"><button className="secondary-btn" onClick={onClose}>Close</button>{invoice.status !== 'Paid' && role !== 'Viewer' && <button className="secondary-btn" onClick={() => onMarkPaid?.(invoice.id)}><CheckCircle2 size={16}/> Mark paid</button>}<button className="primary-btn" onClick={() => onDownload(invoice)}><Download size={16}/> Download</button></div>
    </aside>
  </div>;
}
