import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function StatCard({ label, value, icon: Icon, tone = 'blue', change, helper }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div className="stat-content"><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong>{change && <span className={`stat-change ${change.startsWith('-') ? 'down' : ''}`}>{change.startsWith('-') ? <ArrowDownRight size={14}/> : <ArrowUpRight size={14}/>} {change.replace('-', '')} vs last month</span>}{helper && <span className="stat-helper">{helper}</span>}</div></article>;
}
