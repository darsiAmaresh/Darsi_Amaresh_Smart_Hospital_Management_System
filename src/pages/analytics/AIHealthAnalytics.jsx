import { useMemo } from 'react';
import { Brain, AlertTriangle, TrendingUp, Lightbulb, Activity } from 'lucide-react';
import { useHospital } from '../../contexts/HospitalContext';
import { DiseasePieChart, RiskBarChart, HealthTrendChart } from '../../components/ui/Charts';
import { diseaseStats, healthRiskData } from '../../data/seedData';
import { StatCard } from '../../components/ui/StatCard';

const recoveryTrend = [
  { week: 'W1', score: 45 }, { week: 'W2', score: 52 }, { week: 'W3', score: 61 },
  { week: 'W4', score: 68 }, { week: 'W5', score: 72 },
];

const recommendations = [
  { patient: 'David Kim', text: 'Increase cardiac monitoring frequency; consider beta-blocker adjustment', priority: 'high' },
  { patient: 'Michael Brown', text: 'Schedule HbA1c retest in 2 weeks; nutrition counseling recommended', priority: 'medium' },
  { patient: 'John Anderson', text: 'Blood pressure trending stable; continue current medication regimen', priority: 'low' },
  { patient: 'Emma Wilson', text: 'Preventive therapy effective; reduce follow-up interval to 6 months', priority: 'low' },
];

export default function AIHealthAnalytics() {
  const { state } = useHospital();

  const monitoring = useMemo(
    () => state.patients.filter((p) => p.status === 'admitted'),
    [state.patients]
  );

  const criticalAlerts = state.patients.filter((p) => p.riskLevel === 'critical' || p.riskLevel === 'high');

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1><Brain size={28} /> AI Health Analytics</h1>
          <p>Patient monitoring, disease statistics & smart recommendations</p>
        </div>
      </div>

      <div className="stats-grid stats-grid-4">
        <StatCard icon={Activity} label="Monitored Patients" value={monitoring.length} color="primary" />
        <StatCard icon={AlertTriangle} label="Active Alerts" value={criticalAlerts.length} color="danger" />
        <StatCard icon={TrendingUp} label="Avg Recovery Rate" value="74%" color="success" />
        <StatCard icon={Lightbulb} label="AI Recommendations" value={recommendations.length} color="warning" />
      </div>

      <div className="charts-grid">
        <div className="card chart-card">
          <h3>Disease Statistics</h3>
          <DiseasePieChart data={diseaseStats} />
        </div>
        <div className="card chart-card">
          <h3>Health Risk Indicators</h3>
          <RiskBarChart data={healthRiskData} />
        </div>
      </div>

      <div className="dashboard-grid-3">
        <div className="card">
          <h3><Activity size={18} /> Patient Health Monitoring</h3>
          {monitoring.map((p) => (
            <div key={p.id} className="monitor-item">
              <div className="avatar sm">{p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
              <div className="monitor-info">
                <strong>{p.name}</strong>
                <span>{p.room} · Score: {p.healthScore}</span>
                <div className="health-bar">
                  <div className="health-fill" style={{ width: `${p.healthScore}%`, background: p.healthScore < 50 ? 'var(--danger)' : 'var(--success)' }} />
                </div>
              </div>
              <span className={`risk-badge ${p.riskLevel}`}>{p.riskLevel}</span>
            </div>
          ))}
        </div>

        <div className="card emergency-card">
          <h3><AlertTriangle size={18} /> Emergency Alerts</h3>
          {criticalAlerts.map((p) => (
            <div key={p.id} className="alert-item">
              <AlertTriangle size={16} className="text-danger" />
              <div>
                <strong>{p.name}</strong>
                <p>{p.room || 'Outpatient'} — Health score {p.healthScore}</p>
              </div>
            </div>
          ))}
          {state.notifications.filter((n) => n.type === 'emergency' && !n.read).map((n) => (
            <div key={n.id} className="alert-item unread">
              <strong>{n.title}</strong>
              <p>{n.message}</p>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Recovery Progress (ICU Patient)</h3>
          <HealthTrendChart data={recoveryTrend} />
        </div>
      </div>

      <div className="card recommendations-panel">
        <h3><Lightbulb size={18} /> Smart Recommendation Panel</h3>
        <div className="recommendations-list">
          {recommendations.map((r, i) => (
            <div key={i} className={`recommendation priority-${r.priority}`}>
              <Lightbulb size={16} />
              <div>
                <strong>{r.patient}</strong>
                <p>{r.text}</p>
              </div>
              <span className={`priority-tag ${r.priority}`}>{r.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
