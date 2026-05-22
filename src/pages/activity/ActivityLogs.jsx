import { useState, useMemo } from 'react';
import { ClipboardList, Filter } from 'lucide-react';
import { useHospital } from '../../contexts/HospitalContext';
import { format } from 'date-fns';

export default function ActivityLogs() {
  const { state } = useHospital();
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() => {
    if (typeFilter === 'all') return state.activityLogs;
    return state.activityLogs.filter((l) => l.type === typeFilter);
  }, [state.activityLogs, typeFilter]);

  return (
    <div className="page">
      <div className="page-header">
        <h1><ClipboardList size={28} /> Activity Logs & Audit</h1>
        <p>Complete audit trail of system actions</p>
      </div>

      <div className="toolbar">
        <Filter size={16} />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="patient">Patient</option>
          <option value="appointment">Appointment</option>
          <option value="prescription">Prescription</option>
          <option value="billing">Billing</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>

      <div className="card">
        <div className="audit-timeline">
          {filtered.map((log) => (
            <div key={log.id} className={`audit-item type-${log.type}`}>
              <div className="audit-dot" />
              <div className="audit-content">
                <div className="audit-header">
                  <strong>{log.user}</strong>
                  <time>{format(new Date(log.timestamp), 'MMM d, yyyy · h:mm a')}</time>
                </div>
                <p>{log.action}</p>
                <span className="type-tag">{log.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
