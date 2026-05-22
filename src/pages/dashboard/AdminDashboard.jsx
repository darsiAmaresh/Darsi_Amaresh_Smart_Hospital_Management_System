import { useMemo } from 'react';
import {
  Users, Stethoscope, Calendar, AlertTriangle, DollarSign,
  BedDouble, Activity, FileText, Settings2,
} from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { RevenueChart, AppointmentBarChart } from '../../components/ui/Charts';
import { useHospital } from '../../contexts/HospitalContext';
import {
  dashboardStats, revenueData, appointmentTrend,
} from '../../data/seedData';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { state, dispatch } = useHospital();
  const { widgetLayout } = state;

  const stats = useMemo(() => ({
    patients: state.patients.length,
    doctors: state.doctors.filter((d) => d.status === 'available').length,
    appointments: state.appointments.filter((a) => a.date === '2026-05-23').length,
    emergency: state.patients.filter((p) => p.riskLevel === 'critical').length,
    revenue: state.bills.reduce((s, b) => s + b.total, 0),
    beds: dashboardStats.bedsOccupied,
    bedsTotal: dashboardStats.bedsTotal,
  }), [state]);

  const toggleWidget = (id) => {
    const next = widgetLayout.includes(id)
      ? widgetLayout.filter((w) => w !== id)
      : [...widgetLayout, id];
    dispatch({ type: 'SET_WIDGET_LAYOUT', payload: next });
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Hospital overview · {format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <div className="widget-customizer">
          <Settings2 size={16} />
          <span>Widgets:</span>
          {['stats', 'charts', 'activity', 'reports'].map((w) => (
            <button
              key={w}
              className={`chip ${widgetLayout.includes(w) ? 'active' : ''}`}
              onClick={() => toggleWidget(w)}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {widgetLayout.includes('stats') && (
        <div className="stats-grid">
          <StatCard icon={Users} label="Total Patients" value={stats.patients.toLocaleString()} change="+12%" color="primary" delay={0} />
          <StatCard icon={Stethoscope} label="Available Doctors" value={stats.doctors} change="+2" color="success" delay={50} />
          <StatCard icon={Calendar} label="Today's Appointments" value={stats.appointments} change="+8%" color="info" delay={100} />
          <StatCard icon={AlertTriangle} label="Emergency Cases" value={stats.emergency} change="Critical" color="danger" delay={150} />
          <StatCard icon={DollarSign} label="Revenue (MTD)" value={`$${(stats.revenue / 1000).toFixed(0)}k`} change="+18%" color="warning" delay={200} />
          <StatCard icon={BedDouble} label="Bed Availability" value={`${stats.bedsTotal - stats.beds}/${stats.bedsTotal}`} change={`${stats.beds} occupied`} color="purple" delay={250} />
        </div>
      )}

      {widgetLayout.includes('charts') && (
        <div className="charts-grid">
          <div className="card chart-card">
            <h3>Revenue Analytics</h3>
            <RevenueChart data={revenueData} />
          </div>
          <div className="card chart-card">
            <h3>Weekly Appointments</h3>
            <AppointmentBarChart data={appointmentTrend} />
          </div>
        </div>
      )}

      <div className="dashboard-grid-3">
        {widgetLayout.includes('activity') && (
          <div className="card activity-card">
            <h3><Activity size={18} /> Hospital Activity Feed</h3>
            <div className="activity-feed">
              {state.activityLogs.slice(0, 6).map((log) => (
                <div key={log.id} className={`activity-item type-${log.type}`}>
                  <div className="activity-dot" />
                  <div>
                    <strong>{log.user}</strong>
                    <p>{log.action}</p>
                    <time>{format(new Date(log.timestamp), 'MMM d, h:mm a')}</time>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card emergency-card">
          <h3><AlertTriangle size={18} /> Emergency Cases</h3>
          {state.patients.filter((p) => p.riskLevel === 'critical' || p.riskLevel === 'high').map((p) => (
            <div key={p.id} className="emergency-item">
              <span className={`risk-badge ${p.riskLevel}`}>{p.riskLevel}</span>
              <div>
                <strong>{p.name}</strong>
                <span>{p.room || 'Outpatient'} · Score: {p.healthScore}</span>
              </div>
            </div>
          ))}
        </div>

        {widgetLayout.includes('reports') && (
          <div className="card reports-card">
            <h3><FileText size={18} /> Daily Reports</h3>
            <ul className="reports-list">
              <li><span>Admissions Today</span><strong>4</strong></li>
              <li><span>Discharges Today</span><strong>2</strong></li>
              <li><span>Surgeries Scheduled</span><strong>3</strong></li>
              <li><span>Lab Tests Pending</span><strong>18</strong></li>
              <li><span>Pharmacy Orders</span><strong>27</strong></li>
              <li><span>Revenue Today</span><strong>$12,450</strong></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
