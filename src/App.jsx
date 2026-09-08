import { useMemo, useState } from 'react';
import {
  Bell,
  Check,
  Download,
  Menu,
  Plus,
  ReceiptText,
  Trash2,
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import InvoiceTable from './components/InvoiceTable';
import InvoiceDrawer from './components/InvoiceDrawer';
import Toast from './components/Toast';
import Dashboard from './components/Dashboard';
import CreateInvoice from './components/CreateInvoice';

import { useInvoices } from './hooks/useInvoices';
import { exportInvoicesToCsv } from './lib/csv';
import { formatCurrency } from './lib/formatters';

function downloadInvoice(invoice) {
  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${invoice.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 48px;
            color: #17324d;
            max-width: 850px;
            margin: auto;
          }

          h1 {
            margin: 0 0 5px;
          }

          .muted {
            color: #718096;
            margin-bottom: 28px;
          }

          .row {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #e2e8f0;
            padding: 13px 0;
          }

          .total {
            font-size: 20px;
            font-weight: 700;
            margin-top: 15px;
          }
        </style>
      </head>

      <body>
        <h1>${invoice.id}</h1>

        <div class="muted">
          ${invoice.client} · ${invoice.email}
        </div>

        ${invoice.items
          .map(
            (item) => `
              <div class="row">
                <span>
                  ${item.description}
                  (${item.quantity} × ₹${Number(item.rate).toLocaleString(
                    'en-IN'
                  )})
                </span>

                <strong>
                  ₹${(item.quantity * item.rate).toLocaleString('en-IN')}
                </strong>
              </div>
            `
          )
          .join('')}

        <div class="row total">
          <span>Total</span>
          <strong>${formatCurrency(invoice.amount)}</strong>
        </div>
      </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${invoice.id}.html`;
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function App() {
  const {
    invoices,
    selectedIds,
    toggleSelected,
    toggleAll,
    removeSelected,
    markSelectedPaid,
    markPaidById,
    addInvoice,
    summary,
  } = useInvoices();

  const [activeView, setActiveView] = useState('Overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [sort, setSort] = useState({
    key: 'issueDate',
    direction: 'desc',
  });

  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [role, setRole] = useState('Administrator');

  const pageSize = 6;

  const filteredRows = useMemo(() => {
    const filtered = invoices.filter((invoice) => {
      const haystack = `
        ${invoice.id}
        ${invoice.client}
        ${invoice.email}
        ${invoice.category}
      `.toLowerCase();

      return (
        haystack.includes(query.toLowerCase()) &&
        (status === 'All' || invoice.status === status) &&
        (!startDate || invoice.issueDate >= startDate) &&
        (!endDate || invoice.issueDate <= endDate)
      );
    });

    filtered.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];

      const left =
        sort.key === 'amount' ? Number(av) : String(av);

      const right =
        sort.key === 'amount' ? Number(bv) : String(bv);

      return (
        (left < right ? -1 : left > right ? 1 : 0) *
        (sort.direction === 'asc' ? 1 : -1)
      );
    });

    return {
      items: filtered.slice(
        (page - 1) * pageSize,
        page * pageSize
      ),
      total: filtered.length,
    };
  }, [
    invoices,
    query,
    status,
    startDate,
    endDate,
    sort,
    page,
  ]);

  const notify = (message) => {
    setToast(message);

    window.clearTimeout(window.__invoiceToast);

    window.__invoiceToast = window.setTimeout(() => {
      setToast('');
    }, 2400);
  };

  const handleExport = () => {
    if (!selectedIds.length) {
      return notify('Select at least one invoice to export.');
    }

    exportInvoicesToCsv(
      invoices.filter((invoice) =>
        selectedIds.includes(invoice.id)
      )
    );

    notify('Selected invoices exported as CSV.');
  };

  const handleBulkPaid = () => {
    if (!selectedIds.length) {
      return notify('Select at least one invoice.');
    }

    markSelectedPaid();
    notify('Selected invoices marked as paid.');
  };

  const handleDelete = () => {
    if (role !== 'Administrator') {
      return notify(
        'Delete action is restricted to administrators.'
      );
    }

    if (!selectedIds.length) {
      return notify('Select at least one invoice.');
    }

    removeSelected();
    notify('Selected invoices removed.');
  };

  const openInvoice = (invoice) => {
    if (invoice) {
      setSelectedInvoice(invoice);
    } else {
      setActiveView('Invoices');
    }
  };

  const openNotification = (newStatus = 'All') => {
    setNotificationsOpen(false);
    setActiveView('Invoices');
    setStatus(newStatus);
    setPage(1);
  };

  return (
    <div className="app-shell">

      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <main className="main">

        {/* TOP HEADER */}
        <header className="topbar">

          <button
            className="icon-btn menu-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          <div className="breadcrumbs">
            <span>Workspace</span>
            <span>/</span>
            <strong>{activeView}</strong>
          </div>

          <div className="topbar-actions">

            {/* NOTIFICATIONS */}
            <div className="notification-wrapper">

              <button
                className="icon-btn notification"
                title="Notifications"
                aria-label="Open notifications"
                onClick={() =>
                  setNotificationsOpen(
                    (open) => !open
                  )
                }
              >
                <Bell size={18} />
                <span />
              </button>

              {notificationsOpen && (
                <div className="notification-panel">

                  <div className="notification-header">

                    <div>
                      <strong>Notifications</strong>
                      <span>3 updates</span>
                    </div>

                    <button
                      className="notification-close"
                      onClick={() =>
                        setNotificationsOpen(false)
                      }
                      aria-label="Close notifications"
                    >
                      ×
                    </button>

                  </div>

                  <div className="notification-list">

                    <button
                      className="notification-item"
                      onClick={() =>
                        openNotification('Overdue')
                      }
                    >
                      <div className="notification-dot overdue-dot" />

                      <div>
                        <strong>
                          Overdue invoice
                        </strong>

                        <p>
                          There are invoices that
                          need your attention.
                        </p>

                        <small>Recently</small>
                      </div>
                    </button>

                    <button
                      className="notification-item"
                      onClick={() =>
                        openNotification('Paid')
                      }
                    >
                      <div className="notification-dot paid-dot" />

                      <div>
                        <strong>
                          Payment received
                        </strong>

                        <p>
                          A recent invoice has
                          been marked as paid.
                        </p>

                        <small>Today</small>
                      </div>
                    </button>

                    <button
                      className="notification-item"
                      onClick={() =>
                        openNotification('Pending')
                      }
                    >
                      <div className="notification-dot pending-dot" />

                      <div>
                        <strong>
                          Invoice due soon
                        </strong>

                        <p>
                          Review upcoming invoice
                          due dates.
                        </p>

                        <small>Today</small>
                      </div>
                    </button>

                  </div>

                  <button
                    className="notification-footer"
                    onClick={() =>
                      openNotification('All')
                    }
                  >
                    View all invoices
                  </button>

                </div>
              )}

            </div>

            {/* ROLE SELECTOR */}
            <div className="role-select">
              <span>Role</span>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
              >
                <option>Administrator</option>
                <option>Accountant</option>
                <option>Viewer</option>
              </select>
            </div>

            <div className="top-avatar">
              FT
            </div>

          </div>
        </header>

        {/* DASHBOARD */}
        {activeView === 'Overview' && (
          <Dashboard
            summary={summary}
            invoices={invoices}
            onOpen={openInvoice}
            onCreate={() =>
              setActiveView('Create Invoice')
            }
          />
        )}

        {/* INVOICES */}
        {activeView === 'Invoices' && (
          <>
            <div className="page-head">

              <div>
                <span className="eyebrow">
                  Invoice listing
                </span>

                <h1>Invoices</h1>

                <p>
                  Search, review and manage your
                  billing records.
                </p>
              </div>

              <div className="head-actions">

                <button
                  className="secondary-btn"
                  onClick={handleExport}
                >
                  <Download size={16} />
                  Export CSV
                </button>

                <button
                  className="primary-btn"
                  onClick={() =>
                    setActiveView(
                      'Create Invoice'
                    )
                  }
                >
                  <Plus size={17} />
                  Create invoice
                </button>

              </div>

            </div>

            {/* BULK ACTION BAR */}
            {selectedIds.length > 0 && (
              <div className="bulk-bar">

                <span>
                  <strong>
                    {selectedIds.length}
                  </strong>{' '}
                  selected
                </span>

                <div>

                  <button
                    className="bulk-btn"
                    onClick={handleBulkPaid}
                  >
                    <Check size={15} />
                    Mark paid
                  </button>

                  <button
                    className="bulk-btn"
                    onClick={handleExport}
                  >
                    <Download size={15} />
                    Export
                  </button>

                  {role === 'Administrator' && (
                    <button
                      className="bulk-btn danger"
                      onClick={handleDelete}
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  )}

                </div>

              </div>
            )}

            <InvoiceTable
              rows={filteredRows}
              selectedIds={selectedIds}
              toggleSelected={toggleSelected}
              toggleAll={toggleAll}
              sort={sort}
              setSort={(value) => {
                setSort(value);
                setPage(1);
              }}
              onOpen={setSelectedInvoice}
              query={query}
              setQuery={setQuery}
              status={status}
              setStatus={setStatus}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              page={page}
              setPage={setPage}
              pageSize={pageSize}
            />
          </>
        )}

        {/* CREATE INVOICE */}
        {activeView === 'Create Invoice' && (
          <CreateInvoice
            onCancel={() =>
              setActiveView('Invoices')
            }
            onCreate={addInvoice}
            notify={notify}
          />
        )}

        {/* OTHER MODULES */}
        {[
          'Customers',
          'Analytics',
          'Settings',
        ].includes(activeView) && (
          <section className="placeholder-page">

            <div className="placeholder-icon">
              <ReceiptText size={27} />
            </div>

            <span className="eyebrow">
              Workspace module
            </span>

            <h1>{activeView}</h1>

            <p>
              This workspace keeps the navigation
              extensible while the core invoice
              workflow remains fully functional.
            </p>

            <button
              className="secondary-btn"
              onClick={() =>
                setActiveView('Invoices')
              }
            >
              Open invoice register
            </button>

          </section>
        )}

      </main>

      {/* INVOICE DETAILS DRAWER */}
      <InvoiceDrawer
        invoice={selectedInvoice}
        onClose={() =>
          setSelectedInvoice(null)
        }
        onDownload={downloadInvoice}
        role={role}
        onMarkPaid={(id) => {

          if (role === 'Viewer') {
            return notify(
              'Your role cannot change invoice status.'
            );
          }

          const invoice = invoices.find(
            (item) => item.id === id
          );

          if (invoice) {
            markPaidById(id);

            setSelectedInvoice(
              (current) =>
                current
                  ? {
                      ...current,
                      status: 'Paid',
                    }
                  : current
            );

            notify(
              `${id} marked as paid.`
            );
          }

        }}
      />

      <Toast message={toast} />

    </div>
  );
}