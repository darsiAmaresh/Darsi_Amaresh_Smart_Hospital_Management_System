import { useState } from 'react';
import { Bell, Check, AlertTriangle, Calendar, Package, CreditCard } from 'lucide-react';
import { useHospital } from '../../contexts/HospitalContext';
import { formatDistanceToNow } from 'date-fns';

const typeIcons = {
  emergency: AlertTriangle,
  appointment: Calendar,
  inventory: Package,
  billing: CreditCard,
};

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useHospital();
  const unread = state.notifications.filter((n) => !n.read).length;

  return (
    <div className="notification-center">
      <button className="icon-btn notification-btn" onClick={() => setOpen(!open)}>
        <Bell size={20} />
        {unread > 0 && <span className="badge">{unread}</span>}
      </button>
      {open && (
        <>
          <div className="dropdown-backdrop" onClick={() => setOpen(false)} />
          <div className="notification-dropdown animate-in">
            <div className="dropdown-header">
              <h4>Notifications</h4>
              {unread > 0 && (
                <button
                  className="text-btn"
                  onClick={() => dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' })}
                >
                  <Check size={14} /> Mark all read
                </button>
              )}
            </div>
            <div className="notification-list">
              {state.notifications.length === 0 ? (
                <p className="empty-msg">No notifications</p>
              ) : (
                state.notifications.map((n) => {
                  const Icon = typeIcons[n.type] || Bell;
                  return (
                    <div
                      key={n.id}
                      className={`notification-item ${n.read ? 'read' : ''} type-${n.type}`}
                      onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: n.id })}
                    >
                      <Icon size={18} />
                      <div>
                        <strong>{n.title}</strong>
                        <p>{n.message}</p>
                        <time>{formatDistanceToNow(new Date(n.time), { addSuffix: true })}</time>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
