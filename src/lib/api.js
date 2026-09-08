const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getInvoices() {
  if (!API_BASE_URL) return null;
  const response = await fetch(`${API_BASE_URL}/invoices`);
  if (!response.ok) throw new Error('Unable to load invoices');
  return response.json();
}
