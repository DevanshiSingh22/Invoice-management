import { ArrowUpRight, CircleAlert, Clock3, FileCheck2, ReceiptText, TrendingUp } from 'lucide-react';
import StatCard from './StatCard';
import StatusBadge from './StatusBadge';
import { formatCurrency, formatDate } from '../lib/formatters';

export default function Dashboard({ summary, invoices, onOpen, onCreate }) {
  const recent = invoices.slice(0, 5);
  const max = Math.max(...invoices.map((i) => i.amount), 1);
  const paidRate = summary.total ? Math.round((summary.paid / summary.total) * 100) : 0;
  return <div>
    <div className="page-head"><div><span className="eyebrow">Overview</span><h1>Good evening</h1><p>A clear view of your receivables and invoice activity.</p></div><button className="primary-btn" onClick={onCreate}>Create invoice <ArrowUpRight size={17}/></button></div>
    <section className="stats-grid"><StatCard label="Total invoices" value={summary.total} icon={ReceiptText} tone="blue" change="8.2%"/><StatCard label="Paid invoices" value={summary.paid} icon={FileCheck2} tone="green" change="12.4%"/><StatCard label="Pending amount" value={formatCurrency(summary.pendingAmount)} icon={Clock3} tone="amber" change="4.8%"/><StatCard label="Overdue invoices" value={summary.overdue} icon={CircleAlert} tone="red" helper="Needs attention"/></section>
    <div className="dashboard-grid">
      <section className="panel chart-panel"><div className="panel-head"><div><span className="eyebrow">Portfolio</span><h2>Invoice value</h2></div><span className="trend-chip"><TrendingUp size={14}/> 14.8%</span></div><div className="bar-chart">{recent.map((invoice, index) => <div className="bar-column" key={invoice.id}><div className="bar-value">₹{Math.round(invoice.amount / 1000)}k</div><div className="bar-track"><div className="bar-fill" style={{ height: `${Math.max(12, (invoice.amount / max) * 100)}%` }}/></div><span>{invoice.id.replace('INV-','')}</span></div>)}</div><div className="chart-footer"><span>Latest invoices</span><strong>{formatCurrency(summary.totalValue)} total value</strong></div></section>
      <section className="panel progress-panel"><div className="panel-head"><div><span className="eyebrow">Collection health</span><h2>Payment status</h2></div></div><div className="donut-wrap"><div className="donut" style={{ '--rate': `${paidRate * 3.6}deg` }}><div><strong>{paidRate}%</strong><span>paid</span></div></div></div><div className="status-summary"><div><span><i className="legend-dot paid-dot"/>Paid</span><strong>{summary.paid}</strong></div><div><span><i className="legend-dot pending-dot"/>Pending</span><strong>{summary.pending}</strong></div><div><span><i className="legend-dot overdue-dot"/>Overdue</span><strong>{summary.overdue}</strong></div></div></section>
    </div>
    <section className="panel recent-panel"><div className="panel-head"><div><span className="eyebrow">Latest activity</span><h2>Recent invoices</h2></div><button className="text-btn" onClick={() => onOpen(null)}>View all</button></div><div className="recent-list">{recent.map((invoice) => <button className="recent-row" key={invoice.id} onClick={() => onOpen(invoice)}><div><strong>{invoice.id}</strong><span>{invoice.client}</span></div><span className="recent-date">{formatDate(invoice.issueDate)}</span><strong>{formatCurrency(invoice.amount)}</strong><StatusBadge status={invoice.status}/></button>)}</div></section>
  </div>;
}
