import { useState, useMemo } from 'react';
import { Plus, Check, X, Calendar as CalIcon, Bell } from 'lucide-react';
import { useHospital } from '../../contexts/HospitalContext';
import { useAuth, ROLES } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../../components/ui/Modal';
import { TIME_SLOTS } from '../../data/seedData';
import { findDoctorForUser, findPatientForUser } from '../../utils/userLinks';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';

export default function Appointments() {
  const { state, dispatch, addLog } = useHospital();
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState('list');
  const [modalOpen, setModalOpen] = useState(false);
  const [calMonth, setCalMonth] = useState(new Date(2026, 4, 1));
  const [form, setForm] = useState({
    patientId: '', doctorId: '', date: '2026-05-24', time: '09:00', type: 'Consultation', notes: '',
  });

  const patients = state.patients;
  const doctors = state.doctors.filter((d) => d.status !== 'off-duty');

  const myAppointments = useMemo(() => {
    if (hasRole(ROLES.PATIENT)) {
      const patient = findPatientForUser(state.patients, user);
      return state.appointments.filter((a) => a.patientId === patient?.id);
    }
    if (hasRole(ROLES.DOCTOR)) {
      const doc = findDoctorForUser(state.doctors, user);
      return state.appointments.filter((a) => a.doctorId === doc?.id);
    }
    return state.appointments;
  }, [state.appointments, user, hasRole, state.doctors]);

  const calendarDays = useMemo(() => {
    const start = startOfMonth(calMonth);
    const end = endOfMonth(calMonth);
    return eachDayOfInterval({ start, end });
  }, [calMonth]);

  const bookedSlots = (date, doctorId) =>
    state.appointments
      .filter((a) => a.date === date && a.doctorId === doctorId)
      .map((a) => a.time);

  const handleBook = () => {
    const patient = patients.find((p) => p.id === form.patientId);
    const doctor = doctors.find((d) => d.id === form.doctorId);
    if (!patient || !doctor) { toast('Select patient and doctor', 'error'); return; }
    const slots = bookedSlots(form.date, form.doctorId);
    if (slots.includes(form.time)) { toast('Time slot already booked', 'error'); return; }
    const appt = {
      id: `a${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      ...form,
      status: hasRole(ROLES.ADMIN, ROLES.RECEPTIONIST) ? 'approved' : 'pending',
    };
    dispatch({ type: 'ADD_APPOINTMENT', payload: appt });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `n${Date.now()}`,
        title: 'New Appointment',
        message: `${patient.name} booked with ${doctor.name}`,
        type: 'appointment',
        read: false,
        time: new Date().toISOString(),
      },
    });
    addLog(user?.name, `Booked appointment for ${patient.name}`, 'appointment');
    toast('Appointment booked successfully', 'success');
    setModalOpen(false);
  };

  const updateStatus = (id, status) => {
    dispatch({ type: 'UPDATE_APPOINTMENT', payload: { id, status } });
    addLog(user?.name, `${status} appointment #${id}`, 'appointment');
    toast(`Appointment ${status}`, status === 'approved' ? 'success' : 'warning');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Appointments</h1>
          <p>Book, approve & manage schedules</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            const linked = findPatientForUser(state.patients, user);
            if (hasRole(ROLES.PATIENT) && linked) {
              setForm((f) => ({ ...f, patientId: linked.id }));
            }
            setModalOpen(true);
          }}
        >
          <Plus size={18} /> Book Appointment
        </button>
      </div>

      <div className="tabs">
        <button className={tab === 'list' ? 'active' : ''} onClick={() => setTab('list')}>List View</button>
        <button className={tab === 'calendar' ? 'active' : ''} onClick={() => setTab('calendar')}>
          <CalIcon size={16} /> Calendar
        </button>
        <button className={tab === 'upcoming' ? 'active' : ''} onClick={() => setTab('upcoming')}>
          <Bell size={16} /> Upcoming
        </button>
      </div>

      {tab === 'list' && (
        <div className="card table-card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th>
                  {hasRole(ROLES.ADMIN, ROLES.RECEPTIONIST) && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {myAppointments.map((a) => (
                  <tr key={a.id}>
                    <td>{a.patientName}</td><td>{a.doctorName}</td>
                    <td>{a.date}</td><td>{a.time}</td><td>{a.type}</td>
                    <td><span className={`status-badge ${a.status}`}>{a.status}</span></td>
                    {hasRole(ROLES.ADMIN, ROLES.RECEPTIONIST) && a.status === 'pending' && (
                      <td className="actions">
                        <button className="icon-btn success" onClick={() => updateStatus(a.id, 'approved')}><Check size={16} /></button>
                        <button className="icon-btn danger" onClick={() => updateStatus(a.id, 'cancelled')}><X size={16} /></button>
                      </td>
                    )}
                    {hasRole(ROLES.ADMIN, ROLES.RECEPTIONIST) && a.status !== 'pending' && <td>—</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'calendar' && (
        <div className="card calendar-widget">
          <div className="cal-nav">
            <button onClick={() => setCalMonth(subMonths(calMonth, 1))}>‹</button>
            <h3>{format(calMonth, 'MMMM yyyy')}</h3>
            <button onClick={() => setCalMonth(addMonths(calMonth, 1))}>›</button>
          </div>
          <div className="cal-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="cal-day-name">{d}</div>
            ))}
            {Array.from({ length: calendarDays[0].getDay() }).map((_, i) => (
              <div key={`e${i}`} className="cal-day empty" />
            ))}
            {calendarDays.map((day) => {
              const dayStr = format(day, 'yyyy-MM-dd');
              const count = myAppointments.filter((a) => a.date === dayStr).length;
              return (
                <div key={dayStr} className={`cal-day ${count ? 'has-events' : ''}`}>
                  <span>{format(day, 'd')}</span>
                  {count > 0 && <span className="cal-dot">{count}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'upcoming' && (
        <div className="upcoming-grid">
          {myAppointments.filter((a) => a.status === 'approved').map((a) => (
            <div key={a.id} className="upcoming-card card">
              <div className="upcoming-date">
                <span className="day">{format(new Date(a.date), 'd')}</span>
                <span className="month">{format(new Date(a.date), 'MMM')}</span>
              </div>
              <div>
                <strong>{a.patientName}</strong>
                <p>with {a.doctorName}</p>
                <span>{a.time} · {a.type}</span>
              </div>
              <span className={`status-badge ${a.status}`}>{a.status}</span>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Book Appointment">
        <div className="form-grid">
          <div className="form-group">
            <label>Patient</label>
            <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}>
              <option value="">Select patient</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Doctor</label>
            <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>
              <option value="">Select doctor</option>
              {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.department}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Time Slot</label>
            <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t} disabled={bookedSlots(form.date, form.doctorId).includes(t)}>
                  {t} {bookedSlots(form.date, form.doctorId).includes(t) ? '(Booked)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {['Consultation', 'Follow-up', 'Check-up', 'Emergency'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group full">
            <label>Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleBook}>Book</button>
        </div>
      </Modal>
    </div>
  );
}
