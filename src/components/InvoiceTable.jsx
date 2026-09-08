import { ChevronDown, ChevronUp, MoreHorizontal, Search, SlidersHorizontal, CalendarDays } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatCurrency, formatDate } from '../lib/formatters';

export default function InvoiceTable({
  rows, selectedIds, toggleSelected, toggleAll, sort, setSort, onOpen,
  query, setQuery, status, setStatus, startDate, setStartDate, endDate, setEndDate,
  page, setPage, pageSize,
}) {
  const allSelected = rows.length > 0 && rows.every((row) => selectedIds.includes(row.id));
  const sortBy = (key) => setSort((current) => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }));
  const SortIcon = ({ field }) => sort.key !== field ? null : sort.direction === 'asc' ? <ChevronUp size={13}/> : <ChevronDown size={13}/>;
  const totalPages = Math.max(1, Math.ceil(rows.total / pageSize));
  const pageRows = rows.items;

  return <section className="table-card">
    <div className="table-toolbar">
      <div><span className="eyebrow">Invoice listing</span><h2>Invoice register <span className="count-pill">{rows.total}</span></h2></div>
      <div className="toolbar-actions">
        <label className="search-box"><Search size={16}/><input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search invoice, customer..."/></label>
        <label className="filter-box"><SlidersHorizontal size={15}/><select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}><option value="All">All statuses</option><option>Paid</option><option>Pending</option><option>Overdue</option></select></label>
      </div>
    </div>
    <div className="date-filter-row">
      <div className="filter-label"><CalendarDays size={14}/> Date range</div>
      <label><span>From</span><input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }}/></label>
      <label><span>To</span><input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }}/></label>
      {(query || status !== 'All' || startDate || endDate) && <button className="clear-filter" onClick={() => { setQuery(''); setStatus('All'); setStartDate(''); setEndDate(''); setPage(1); }}>Clear filters</button>}
    </div>
    <div className="table-wrap"><table><thead><tr>
      <th className="checkbox-cell"><input type="checkbox" checked={allSelected} onChange={() => toggleAll(pageRows.map((row) => row.id))} aria-label="Select all"/></th>
      {['id','client','issueDate','dueDate','amount'].map((field) => <th key={field}><button className="sort-btn" onClick={() => sortBy(field)}>{field === 'id' ? 'Invoice' : field === 'client' ? 'Customer' : field === 'issueDate' ? 'Issue date' : field === 'dueDate' ? 'Due date' : 'Amount'} <SortIcon field={field}/></button></th>)}
      <th>Status</th><th className="actions-cell"></th>
    </tr></thead><tbody>
      {pageRows.map((invoice) => <tr key={invoice.id} className={selectedIds.includes(invoice.id) ? 'selected-row' : ''}>
        <td className="checkbox-cell"><input type="checkbox" checked={selectedIds.includes(invoice.id)} onChange={() => toggleSelected(invoice.id)} aria-label={`Select ${invoice.id}`}/></td>
        <td><button className="invoice-link" onClick={() => onOpen(invoice)}>{invoice.id}</button></td>
        <td><div className="customer-cell"><div className="avatar tiny">{invoice.client.split(' ').map((word) => word[0]).join('').slice(0,2)}</div><div><strong>{invoice.client}</strong><span>{invoice.email}</span></div></div></td>
        <td>{formatDate(invoice.issueDate)}</td><td>{formatDate(invoice.dueDate)}</td><td className="amount-cell">{formatCurrency(invoice.amount)}</td><td><StatusBadge status={invoice.status}/></td>
        <td className="actions-cell"><button className="icon-btn" onClick={() => onOpen(invoice)} title="View invoice"><MoreHorizontal size={18}/></button></td>
      </tr>)}
    </tbody></table>
    {pageRows.length === 0 && <div className="empty-state"><div className="empty-icon"><Search size={22}/></div><h3>No invoices found</h3><p>Try changing the search or filters.</p></div>}
    </div>
    <div className="pagination"><span>Showing {pageRows.length ? ((page - 1) * pageSize) + 1 : 0}–{Math.min(page * pageSize, rows.total)} of {rows.total}</span><div className="page-controls"><button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button>{Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((number) => <button key={number} className={page === number ? 'page-active' : ''} onClick={() => setPage(number)}>{number}</button>)}<button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button></div></div>
  </section>;
}
