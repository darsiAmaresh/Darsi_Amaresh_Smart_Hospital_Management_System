import { useMemo } from 'react';
import { Calendar, User, Clock, Pill, Heart } from 'lucide-react';
import { useAuth, ROLES } from '../../contexts/AuthContext';
import { useHospital } from '../../contexts/HospitalContext';
import { findDoctorForUser, findPatientForUser } from '../../utils/userLinks';
import AdminDashboard from './AdminDashboard';
import { StatCard } from '../../components/ui/StatCard';
import { format } from 'date-fns';

function DoctorDashboard() {
  const { user } = useAuth();
  const { state } = useHospital();
  const doctor = findDoctorForUser(state.doctors, user);
  const myAppts = useMemo(
    () => state.appointments.filter((a) => a.doctorId === doctor?.id),
    [state.appointments, doctor]
  );

  if (!doctor) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <h1>Doctor Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <div className="card">
          <p>Your doctor profile is not linked yet. Please contact the hospital admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Doctor Dashboard</h1>
        <p>Welcome, {doctor.name}</p>
      </div>
      <div className="stats-grid stats-grid-4">
        <StatCard icon={Calendar} label="Today's Patients" value={doctor?.patientsToday || 0} color="primary" />
        <StatCard icon={Clock} label="Upcoming Appointments" value={myAppts.filter((a) => a.status === 'approved').length} color="success" />
        <StatCard icon={User} label="Status" value={doctor?.status || 'N/A'} color="info" />
        <StatCard icon={Heart} label="Rating" value={doctor?.rating || '—'} color="warning" />
      </div>
      <div className="card">
        <h3>Today's Schedule</h3>
        <div className="table-responsive">
          <table>
            <thead><tr><th>Time</th><th>Patient</th><th>Type</th><th>Status</th></tr></thead>
            <tbody>
              {myAppts.map((a) => (
                <tr key={a.id}>
                  <td>{a.time}</td><td>{a.patientName}</td><td>{a.type}</td>
                  <td><span className={`status-badge ${a.status}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReceptionistDashboard() {
  const { state } = useHospital();
  const pending = state.appointments.filter((a) => a.status === 'pending').length;

  return (
    <div className="dashboard-page">
      <div className="page-header"><h1>Reception Dashboard</h1></div>
      <div className="stats-grid stats-grid-4">
        <StatCard icon={User} label="Registered Patients" value={state.patients.length} color="primary" />
        <StatCard icon={Calendar} label="Pending Approvals" value={pending} color="warning" />
        <StatCard icon={Clock} label="Today's Appointments" value={state.appointments.length} color="success" />
        <StatCard icon={Pill} label="Pending Bills" value={state.bills.filter((b) => b.status === 'pending').length} color="danger" />
      </div>
      <div className="card">
        <h3>Pending Appointment Approvals</h3>
        <div className="table-responsive">
          <table>
            <thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
            <tbody>
              {state.appointments.filter((a) => a.status === 'pending').map((a) => (
                <tr key={a.id}>
                  <td>{a.patientName}</td><td>{a.doctorName}</td>
                  <td>{a.date}</td><td>{a.time}</td>
                  <td><span className="status-badge pending">pending</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PatientDashboard() {
  const { user } = useAuth();
  const { state } = useHospital();
  const patient = findPatientForUser(state.patients, user);
  const myAppts = state.appointments.filter((a) => a.patientId === patient?.id);

  if (!patient) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <h1>My Health Portal</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <div className="card">
          <p>Your patient profile is being set up. Please contact reception if this message persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>My Health Portal</h1>
        <p>Welcome, {patient.name}</p>
      </div>
      <div className="stats-grid stats-grid-4">
        <StatCard icon={Heart} label="Health Score" value={patient?.healthScore || '—'} color="success" />
        <StatCard icon={Calendar} label="Upcoming Visits" value={myAppts.length} color="primary" />
        <StatCard icon={Pill} label="Active Prescriptions" value={patient?.prescriptions?.length || 0} color="info" />
        <StatCard icon={User} label="Status" value={patient?.status || '—'} color="warning" />
      </div>
      <div className="dashboard-grid-2">
        <div className="card">
          <h3>Upcoming Appointments</h3>
          {myAppts.map((a) => (
            <div key={a.id} className="appt-card-mini">
              <strong>{a.doctorName}</strong>
              <span>{format(new Date(a.date), 'MMM d')} at {a.time}</span>
              <span className={`status-badge ${a.status}`}>{a.status}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <h3>Recent Prescriptions</h3>
          {patient?.prescriptions?.map((rx) => (
            <div key={rx.id} className="rx-item">
              <time>{rx.date}</time>
              <p>{rx.medicines.join(', ')}</p>
              <span>— {rx.doctor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RoleDashboard() {
  const { hasRole, user } = useAuth();
  if (hasRole(ROLES.ADMIN)) return <AdminDashboard />;
  if (hasRole(ROLES.DOCTOR)) return <DoctorDashboard />;
  if (hasRole(ROLES.RECEPTIONIST)) return <ReceptionistDashboard />;
  if (hasRole(ROLES.PATIENT)) return <PatientDashboard />;
  return <div className="dashboard-page"><h1>Welcome, {user?.name}</h1></div>;
}
