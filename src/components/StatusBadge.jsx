export default function StatusBadge({ status }) { return <span className={`status-badge ${status.toLowerCase()}`}><span className="status-dot"/>{status}</span>; }
