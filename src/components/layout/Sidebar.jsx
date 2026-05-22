import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Stethoscope, Calendar, Pill,
  BarChart3, Brain, Activity, Settings, ChevronLeft, ChevronRight,
  Hospital, ClipboardList,
} from 'lucide-react';
import { useAuth, ROLES } from '../../contexts/AuthContext';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.PATIENT] },
  { path: '/patients', icon: Users, label: 'Patients', roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST] },
  { path: '/doctors', icon: Stethoscope, label: 'Doctors', roles: [ROLES.ADMIN, ROLES.RECEPTIONIST] },
  { path: '/appointments', icon: Calendar, label: 'Appointments', roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.PATIENT] },
  { path: '/pharmacy', icon: Pill, label: 'Pharmacy & Billing', roles: [ROLES.ADMIN, ROLES.RECEPTIONIST] },
  { path: '/analytics', icon: Brain, label: 'AI Health Analytics', roles: [ROLES.ADMIN, ROLES.DOCTOR] },
  { path: '/activity', icon: ClipboardList, label: 'Activity Logs', roles: [ROLES.ADMIN] },
  { path: '/settings', icon: Settings, label: 'Settings', roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.PATIENT] },
];

export function Sidebar({ collapsed, onToggle }) {
  const { user, hasRole } = useAuth();
  const filtered = navItems.filter((item) => hasRole(...item.roles));

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <Hospital size={28} className="brand-icon" />
        {!collapsed && <span>SmartCare HMS</span>}
      </div>
      <nav className="sidebar-nav">
        {filtered.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        {!collapsed && user && (
          <div className="sidebar-user">
            <div className="avatar">{user.avatar}</div>
            <div>
              <strong>{user.name}</strong>
              <span className="role-badge">{user.role}</span>
            </div>
          </div>
        )}
        <button className="collapse-btn" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
