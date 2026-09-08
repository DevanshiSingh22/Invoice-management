# InvoiceFlow

A responsive invoice management frontend built with React and Vite. It is intentionally presented as a standalone, generic product.

## Features
- Dashboard with total, paid, pending and overdue invoice metrics
- Invoice listing with search, status filter and date-range filter
- Sorting by invoice, customer, issue date, due date and amount
- Pagination
- Invoice details drawer with line items and download action
- Bulk selection, bulk mark-as-paid and CSV export
- Role-based actions for Administrator, Accountant and Viewer
- Create invoice form with validation and dynamic line items
- Responsive navigation and layouts
- API-ready architecture via `VITE_API_BASE_URL`

## Run locally
```bash
npm install
npm run dev
```

## Test and build
```bash
npm test
npm run build
```

## Deployment
The project is configured for Vercel. Import the GitHub repository into Vercel and use the default Vite build settings (`npm run build`, output `dist`).

## Notes
The demo uses local mock data so the frontend can be reviewed without a backend. The API boundary in `src/lib/api.js` can be connected to a real `/invoices` endpoint later.
