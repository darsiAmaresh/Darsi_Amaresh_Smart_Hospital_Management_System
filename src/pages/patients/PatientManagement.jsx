import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Eye, Filter } from 'lucide-react';
import { useHospital } from '../../contexts/HospitalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useDebounce } from '../../hooks/useDebounce';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { SearchBar } from '../../components/ui/SearchBar';
import { Modal } from '../../components/ui/Modal';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { DEPARTMENTS } from '../../data/seedData';

const emptyPatient = {
  name: '', age: '', gender: 'Male', bloodGroup: 'O+', phone: '', email: '', address: '',
  emergencyContact: { name: '', relation: '', phone: '' },
  status: 'outpatient', room: '', admissionDate: '', dischargeDate: null,
  medicalHistory: [], prescriptions: [], healthScore: 80, riskLevel: 'low',
};

export default function PatientManagement() {
  const { state, dispatch, addLog } = useHospital();
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewPatient, setViewPatient] = useState(null);
  const [editPatient, setEditPatient] = useState(null);
  const [form, setForm] = useState(emptyPatient);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(search);

  const filtered = useMemo(() => {
    let list = [...state.patients];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.email?.toLowerCase().includes(q) ||
          p.phone?.includes(q)
      );
    }
    if (statusFilter !== 'all') list = list.filter((p) => p.status === statusFilter);
    return list;
  }, [state.patients, debouncedSearch, statusFilter]);

  const { visible, hasMore, loading: scrollLoading, sentinelRef } = useInfiniteScroll(filtered, 8);

  const openAdd = () => { setEditPatient(null); setForm(emptyPatient); setModalOpen(true); };
  const openEdit = (p) => { setEditPatient(p); setForm({ ...p }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast('Patient name is required', 'error'); return; }
    if (editPatient) {
      dispatch({ type: 'UPDATE_PATIENT', payload: { ...form, id: editPatient.id } });
      addLog(user?.name, `Updated patient ${form.name}`, 'patient');
      toast('Patient updated', 'success');
    } else {
      const newP = { ...form, id: `p${Date.now()}`, age: Number(form.age) || 0 };
      dispatch({ type: 'ADD_PATIENT', payload: newP });
      addLog(user?.name, `Added patient ${form.name}`, 'patient');
      toast('Patient added', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (!confirm(`Delete patient ${name}?`)) return;
    dispatch({ type: 'DELETE_PATIENT', payload: id });
    addLog(user?.name, `Deleted patient ${name}`, 'patient');
    toast('Patient deleted', 'warning');
  };

  const updateForm = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Patient Management</h1>
          <p>{filtered.length} patients · Search, filter & manage records</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Patient</button>
      </div>

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email, phone..." />
        <div className="filters">
          <Filter size={16} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="admitted">Admitted</option>
            <option value="outpatient">Outpatient</option>
            <option value="discharged">Discharged</option>
          </select>
        </div>
      </div>

      <div className="card table-card">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Age</th><th>Blood</th><th>Status</th><th>Room</th>
                <th>Health Score</th><th>Risk</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8}><SkeletonTable rows={5} /></td></tr>
              ) : (
                visible.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong><br /><small>{p.email}</small></td>
                    <td>{p.age}</td>
                    <td>{p.bloodGroup}</td>
                    <td><span className={`status-badge ${p.status}`}>{p.status}</span></td>
                    <td>{p.room || '—'}</td>
                    <td>
                      <div className="health-bar">
                        <div className="health-fill" style={{ width: `${p.healthScore}%` }} />
                        <span>{p.healthScore}</span>
                      </div>
                    </td>
                    <td><span className={`risk-badge ${p.riskLevel}`}>{p.riskLevel}</span></td>
                    <td className="actions">
                      <button className="icon-btn" onClick={() => setViewPatient(p)} title="View"><Eye size={16} /></button>
                      <button className="icon-btn" onClick={() => openEdit(p)} title="Edit"><Edit2 size={16} /></button>
                      <button className="icon-btn danger" onClick={() => handleDelete(p.id, p.name)} title="Delete"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {hasMore && <div ref={sentinelRef} className="scroll-sentinel">{scrollLoading ? 'Loading more...' : ''}</div>}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editPatient ? 'Edit Patient' : 'Add Patient'} size="lg">
        <div className="form-grid">
          <div className="form-group"><label>Name</label><input value={form.name} onChange={(e) => updateForm('name', e.target.value)} /></div>
          <div className="form-group"><label>Age</label><input type="number" value={form.age} onChange={(e) => updateForm('age', e.target.value)} /></div>
          <div className="form-group"><label>Gender</label>
            <select value={form.gender} onChange={(e) => updateForm('gender', e.target.value)}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
          <div className="form-group"><label>Blood Group</label>
            <select value={form.bloodGroup} onChange={(e) => updateForm('bloodGroup', e.target.value)}>
              {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Phone</label><input value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} /></div>
          <div className="form-group"><label>Email</label><input value={form.email} onChange={(e) => updateForm('email', e.target.value)} /></div>
          <div className="form-group full"><label>Address</label><input value={form.address} onChange={(e) => updateForm('address', e.target.value)} /></div>
          <div className="form-group"><label>Status</label>
            <select value={form.status} onChange={(e) => updateForm('status', e.target.value)}>
              <option value="outpatient">Outpatient</option><option value="admitted">Admitted</option><option value="discharged">Discharged</option>
            </select>
          </div>
          <div className="form-group"><label>Room</label><input value={form.room || ''} onChange={(e) => updateForm('room', e.target.value)} /></div>
          <fieldset className="full emergency-fieldset">
            <legend>Emergency Contact</legend>
            <div className="form-grid">
              <div className="form-group"><label>Name</label>
                <input value={form.emergencyContact?.name || ''} onChange={(e) => updateForm('emergencyContact', { ...form.emergencyContact, name: e.target.value })} />
              </div>
              <div className="form-group"><label>Relation</label>
                <input value={form.emergencyContact?.relation || ''} onChange={(e) => updateForm('emergencyContact', { ...form.emergencyContact, relation: e.target.value })} />
              </div>
              <div className="form-group"><label>Phone</label>
                <input value={form.emergencyContact?.phone || ''} onChange={(e) => updateForm('emergencyContact', { ...form.emergencyContact, phone: e.target.value })} />
              </div>
            </div>
          </fieldset>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Patient</button>
        </div>
      </Modal>

      <Modal isOpen={!!viewPatient} onClose={() => setViewPatient(null)} title="Patient Profile" size="lg">
        {viewPatient && (
          <div className="patient-profile">
            <div className="profile-header">
              <div className="avatar lg">{viewPatient.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
              <div>
                <h2>{viewPatient.name}</h2>
                <p>{viewPatient.age} yrs · {viewPatient.gender} · {viewPatient.bloodGroup}</p>
                <span className={`status-badge ${viewPatient.status}`}>{viewPatient.status}</span>
              </div>
            </div>
            <div className="profile-grid">
              <div><strong>Phone</strong><p>{viewPatient.phone}</p></div>
              <div><strong>Email</strong><p>{viewPatient.email}</p></div>
              <div><strong>Room</strong><p>{viewPatient.room || 'N/A'}</p></div>
              <div><strong>Admission</strong><p>{viewPatient.admissionDate || 'N/A'}</p></div>
              <div><strong>Emergency Contact</strong>
                <p>{viewPatient.emergencyContact?.name} ({viewPatient.emergencyContact?.relation}) — {viewPatient.emergencyContact?.phone}</p>
              </div>
            </div>
            <h4>Medical History</h4>
            {viewPatient.medicalHistory?.map((h, i) => (
              <div key={i} className="history-item">
                <time>{h.date}</time> — <strong>{h.diagnosis}</strong> by {h.doctor}
                <p>{h.notes}</p>
              </div>
            ))}
            <h4>Prescriptions</h4>
            {viewPatient.prescriptions?.map((rx) => (
              <div key={rx.id} className="rx-item">
                <time>{rx.date}</time> — {rx.medicines.join(', ')} <span>({rx.doctor})</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
