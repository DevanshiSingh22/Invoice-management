import { Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

const blankItem = () => ({ description: '', quantity: 1, rate: 0 });

export default function CreateInvoice({ onCancel, onCreate, notify }) {
  const [form, setForm] = useState({ client: '', email: '', issueDate: new Date().toISOString().slice(0,10), dueDate: '', category: 'Services', notes: '', items: [blankItem()] });
  const total = useMemo(() => form.items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.rate || 0), 0), [form.items]);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const updateItem = (index, key, value) => setForm((current) => ({ ...current, items: current.items.map((item, i) => i === index ? { ...item, [key]: value } : item) }));
  const submit = (event) => {
    event.preventDefault();
    if (!form.client.trim() || !form.email.trim() || !form.dueDate || total <= 0 || form.items.some((item) => !item.description.trim())) return notify('Complete the required fields and add a priced line item.');
    const id = `INV-${1050 + Math.floor(Math.random() * 900)}`;
    onCreate({ id, client: form.client.trim(), email: form.email.trim(), issueDate: form.issueDate, dueDate: form.dueDate, amount: total, status: 'Pending', category: form.category, notes: form.notes, items: form.items.map((item) => ({ ...item, quantity: Number(item.quantity), rate: Number(item.rate) })) });
    notify(`${id} created successfully.`);
    onCancel();
  };

  return <section className="create-page">
    <div className="create-head"><div><span className="eyebrow">New record</span><h1>Create invoice</h1><p>Enter the billing details and line items for a new invoice.</p></div><div className="head-actions"><button className="secondary-btn" onClick={onCancel}>Cancel</button><button className="primary-btn" form="invoice-form">Create invoice</button></div></div>
    <form id="invoice-form" onSubmit={submit}>
      <div className="form-grid">
        <section className="form-card"><div className="form-card-title"><span className="step">01</span><div><h2>Customer information</h2><p>Who is this invoice for?</p></div></div>
          <div className="field-grid"><label>Customer name *<input value={form.client} onChange={(e) => update('client', e.target.value)} placeholder="e.g. Acme Industries"/></label><label>Email address *<input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="billing@company.com"/></label><label>Category<select value={form.category} onChange={(e) => update('category', e.target.value)}><option>Services</option><option>Freight</option><option>Logistics</option><option>Consulting</option></select></label></div>
        </section>
        <section className="form-card"><div className="form-card-title"><span className="step">02</span><div><h2>Invoice details</h2><p>Set dates and payment context.</p></div></div>
          <div className="field-grid"><label>Issue date *<input type="date" value={form.issueDate} onChange={(e) => update('issueDate', e.target.value)}/></label><label>Due date *<input type="date" value={form.dueDate} onChange={(e) => update('dueDate', e.target.value)}/></label><label className="full-field">Notes<textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Optional payment notes..."/></label></div>
        </section>
      </div>
      <section className="form-card line-form-card"><div className="form-card-title"><span className="step">03</span><div><h2>Line items</h2><p>Add each service or charge included in the invoice.</p></div><button type="button" className="secondary-btn add-item" onClick={() => setForm((current) => ({ ...current, items: [...current.items, blankItem()] }))}><Plus size={15}/> Add item</button></div>
        <div className="item-editor"><div className="item-editor-head"><span>Description</span><span>Qty</span><span>Unit price</span><span>Amount</span><span></span></div>{form.items.map((item, index) => <div className="item-editor-row" key={index}><input value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} placeholder="Service description"/><input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)}/><input type="number" min="0" value={item.rate} onChange={(e) => updateItem(index, 'rate', e.target.value)}/><strong>₹{(Number(item.quantity || 0) * Number(item.rate || 0)).toLocaleString('en-IN')}</strong><button type="button" className="icon-btn danger-icon" disabled={form.items.length === 1} onClick={() => setForm((current) => ({ ...current, items: current.items.filter((_, i) => i !== index) }))}><Trash2 size={16}/></button></div>)}</div>
        <div className="invoice-total"><span>Total</span><strong>₹{total.toLocaleString('en-IN')}</strong></div>
      </section>
    </form>
  </section>;
}
