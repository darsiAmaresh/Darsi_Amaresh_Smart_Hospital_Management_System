import { useState, useMemo } from 'react';
import { Star, Clock, Users } from 'lucide-react';
import { useHospital } from '../../contexts/HospitalContext';
import { SearchBar } from '../../components/ui/SearchBar';
import { Modal } from '../../components/ui/Modal';
import { DEPARTMENTS } from '../../data/seedData';

export default function DoctorManagement() {
  const { state, dispatch } = useHospital();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let list = [...state.doctors];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q) || d.department.toLowerCase().includes(q));
    }
    if (deptFilter !== 'all') list = list.filter((d) => d.department === deptFilter);
    return list;
  }, [state.doctors, search, deptFilter]);

  const toggleStatus = (doctor) => {
    const statuses = ['available', 'busy', 'off-duty'];
    const idx = statuses.indexOf(doctor.status);
    const next = statuses[(idx + 1) % statuses.length];
    dispatch({ type: 'UPDATE_DOCTOR', payload: { id: doctor.id, status: next } });
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Doctor Management</h1>
        <p>{filtered.length} doctors · Departments & availability</p>
      </div>

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search doctors..." />
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
          <option value="all">All Departments</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="doctors-grid">
        {filtered.map((d) => (
          <div key={d.id} className="doctor-card card animate-in" onClick={() => setSelected(d)}>
            <div className="doctor-card-header">
              <div className="avatar">{d.avatar}</div>
              <div>
                <h3>{d.name}</h3>
                <span className="dept-tag">{d.department}</span>
              </div>
              <button
                className={`status-pill ${d.status}`}
                onClick={(e) => { e.stopPropagation(); toggleStatus(d); }}
              >
                {d.status}
              </button>
            </div>
            <p className="specialization">{d.specialization}</p>
            <div className="doctor-stats">
              <span><Star size={14} /> {d.rating}</span>
              <span><Clock size={14} /> {d.experience} yrs</span>
              <span><Users size={14} /> {d.patientsToday} today</span>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Doctor Profile" size="md">
        {selected && (
          <div className="doctor-profile">
            <div className="profile-header">
              <div className="avatar lg">{selected.avatar}</div>
              <div>
                <h2>{selected.name}</h2>
                <p>{selected.department} · {selected.specialization}</p>
              </div>
            </div>
            <div className="profile-grid">
              <div><strong>Email</strong><p>{selected.email}</p></div>
              <div><strong>Phone</strong><p>{selected.phone}</p></div>
              <div><strong>Experience</strong><p>{selected.experience} years</p></div>
              <div><strong>Rating</strong><p>{selected.rating} / 5.0</p></div>
              <div><strong>Status</strong><p><span className={`status-pill ${selected.status}`}>{selected.status}</span></p></div>
              <div><strong>Patients Today</strong><p>{selected.patientsToday}</p></div>
            </div>
            <h4>Consultation History (Recent)</h4>
            {state.appointments.filter((a) => a.doctorId === selected.id).slice(0, 5).map((a) => (
              <div key={a.id} className="consult-item">
                <strong>{a.patientName}</strong> — {a.type} on {a.date} at {a.time}
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
