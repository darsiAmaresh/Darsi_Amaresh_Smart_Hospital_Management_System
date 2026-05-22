import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useHospital } from '../../contexts/HospitalContext';
import { Sun, Moon, User, Bell, Database } from 'lucide-react';
import { storage } from '../../services/storage';
import { useToast } from '../../contexts/ToastContext';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, users, extendSession, sessionExpiry } = useAuth();
  const { state } = useHospital();
  const { toast } = useToast();

  const clearData = () => {
    if (!confirm('Reset all hospital data to defaults? This cannot be undone.')) return;
    storage.remove('hospital_data');
    window.location.reload();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Preferences & account configuration</p>
      </div>

      <div className="settings-grid">
        <div className="card settings-card">
          <h3><User size={18} /> Profile</h3>
          <div className="profile-settings">
            <div className="avatar lg">{user?.avatar}</div>
            <div>
              <strong>{user?.name}</strong>
              <p>{user?.email}</p>
              <span className="role-badge">{user?.role}</span>
            </div>
          </div>
          {sessionExpiry && (
            <p className="session-info">
              Session expires: {new Date(sessionExpiry).toLocaleString()}
              <button className="btn btn-sm btn-secondary" onClick={extendSession}>Extend Session</button>
            </p>
          )}
          {user?.patientId && <p className="linked-id">Patient ID: {user.patientId}</p>}
          {user?.doctorId && <p className="linked-id">Doctor ID: {user.doctorId}</p>}
          {user?.staffId && <p className="linked-id">Staff ID: {user.staffId}</p>}
        </div>

        <div className="card settings-card full-width">
          <h3><User size={18} /> Registered Accounts ({users.length})</h3>
          <div className="table-responsive">
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Linked record</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className={u.id === user?.id ? 'current-user-row' : ''}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td><span className="role-badge">{u.role}</span></td>
                    <td>{u.patientId || u.doctorId || u.staffId || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {(state.staffMembers?.length > 0) && (
          <div className="card settings-card full-width">
            <h3>Hospital Staff</h3>
            <div className="table-responsive">
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                <tbody>
                  {state.staffMembers.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.email}</td>
                      <td><span className="role-badge">{s.role}</span></td>
                      <td>{new Date(s.joinedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="card settings-card">
          <h3><Sun size={18} /> Appearance</h3>
          <div className="theme-toggle-group">
            <button className={`theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>
              <Sun size={18} /> Light
            </button>
            <button className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>
              <Moon size={18} /> Dark
            </button>
          </div>
        </div>

        <div className="card settings-card">
          <h3><Bell size={18} /> Notifications</h3>
          <p>{state.notifications.filter((n) => !n.read).length} unread notifications</p>
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked /> Appointment alerts
          </label>
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked /> Emergency alerts
          </label>
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked /> Inventory low stock
          </label>
        </div>

        <div className="card settings-card">
          <h3><Database size={18} /> Data Management</h3>
          <p>Data is persisted in local storage (mock backend).</p>
          <p>Patients: {state.patients.length} · Appointments: {state.appointments.length} · Bills: {state.bills.length}</p>
          <button className="btn btn-danger" onClick={clearData}>Reset Hospital Data</button>
        </div>
      </div>
    </div>
  );
}
