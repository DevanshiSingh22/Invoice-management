# Invoice Management System

A modern, responsive invoice management frontend built with React and Vite.

### 🔗 Live Demo

[View Live Application](https://invoice-management-bice.vercel.app/)

The application provides a complete invoice workflow — from dashboard-level financial insights and invoice discovery to invoice creation, detailed invoice review, bulk actions, CSV export, and role-based controls.

## ✨ Features

### Dashboard
- Total invoice count
- Paid invoice count
- Pending invoice amount
- Overdue invoice count
- Invoice value visualization
- Payment status breakdown
- Recent invoice activity

### Invoice Management
- Search invoices by ID, client, email, or category
- Filter by payment status
- Filter by invoice date range
- Sort by invoice ID, client, amount, status, and issue date
- Paginated invoice table
- Select individual or multiple invoices
- Mark invoices as paid
- Delete invoices based on user role
- Export selected invoices to CSV

### Invoice Details
- Invoice summary
- Client information
- Payment status
- Issue and due dates
- Line-item breakdown
- Total invoice amount
- Overdue indicators
- Download invoice functionality

### Create Invoice
- Client information form
- Dynamic invoice line items
- Quantity and rate calculations
- Automatic total calculation
- Form validation
- Invoice creation and listing update

### Role-Based Actions
Three user roles are available:

| Role | Capabilities |
|------|--------------|
| Administrator | Full access including delete and payment actions |
| Accountant | Invoice management and payment actions |
| Viewer | Read-only access |

### Responsive Design
- Desktop dashboard
- Tablet-friendly layout
- Mobile navigation
- Responsive invoice table
- Mobile-friendly invoice details

---

## 🛠️ Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Libraries**
- Lucide React — icons

**Data & Utilities**
- Local invoice dataset
- Custom React hooks
- CSV export utility
- Client-side invoice download

**Deployment**
- Vercel
- GitHub

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── Dashboard.jsx
│   ├── CreateInvoice.jsx
│   ├── InvoiceDrawer.jsx
│   ├── InvoiceTable.jsx
│   ├── Sidebar.jsx
│   ├── StatCard.jsx
│   ├── StatusBadge.jsx
│   └── Toast.jsx
│
├── data/
│   └── invoices.js
│
├── hooks/
│   └── useInvoices.js
│
├── lib/
│   ├── api.js
│   ├── csv.js
│   └── formatters.js
│
├── test/
│   └── formatters.test.js
│
├── App.jsx
├── main.jsx
└── styles.css
