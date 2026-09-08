import { BarChart3, FileText, LayoutDashboard, Settings, Users, X } from 'lucide-react';

export default function Sidebar({ mobileOpen, onClose, activeView, setActiveView }) {
  const items = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Invoices', icon: FileText },
    { label: 'Customers', icon: Users },
    { label: 'Analytics', icon: BarChart3 },
  ];

  return <>
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand-row">
        <div className="brand-mark">↗</div>
        <div><div className="brand-name">InvoiceFlow</div><div className="brand-caption">Invoice workspace</div></div>
        <button className="icon-btn mobile-close" onClick={onClose} aria-label="Close navigation"><X size={18}/></button>
      </div>
      <nav className="nav-list">
        {items.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${activeView === label ? 'active' : ''}`} onClick={() => { setActiveView(label); onClose(); }}>
          <Icon size={18}/><span>{label}</span>
        </button>)}
      </nav>
      <div className="sidebar-bottom">
        <button className={`nav-item ${activeView === 'Settings' ? 'active' : ''}`} onClick={() => { setActiveView('Settings'); onClose(); }}><Settings size={18}/><span>Settings</span></button>
        <div className="workspace-card"><div className="avatar">FT</div><div><strong>Finance Team</strong><span>Administrator</span></div></div>
      </div>
    </aside>
    {mobileOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={onClose}/>} 
  </>;
}
