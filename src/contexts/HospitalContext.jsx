import { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { storage } from '../services/storage';
import {
  initialPatients, initialDoctors, initialAppointments,
  initialMedicines, initialBills, initialActivityLogs,
} from '../data/seedData';

const HospitalContext = createContext(null);

const initialState = {
  patients: initialPatients,
  doctors: initialDoctors,
  staffMembers: [],
  appointments: initialAppointments,
  medicines: initialMedicines,
  bills: initialBills,
  activityLogs: initialActivityLogs,
  notifications: [
    { id: 'n1', title: 'Emergency Alert', message: 'ICU-03 patient vitals critical', type: 'emergency', read: false, time: '2026-05-22T10:45:00' },
    { id: 'n2', title: 'Appointment Pending', message: '3 appointments awaiting approval', type: 'appointment', read: false, time: '2026-05-22T09:00:00' },
    { id: 'n3', title: 'Low Stock', message: 'Insulin Glargine below threshold', type: 'inventory', read: false, time: '2026-05-22T08:30:00' },
    { id: 'n4', title: 'Payment Received', message: 'Invoice #b1 paid via Insurance', type: 'billing', read: true, time: '2026-05-21T16:00:00' },
  ],
  widgetLayout: ['stats', 'charts', 'activity', 'reports'],
};

function hospitalReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload };
    case 'SET_PATIENTS':
      return { ...state, patients: action.payload };
    case 'ADD_PATIENT':
      return { ...state, patients: [...state.patients, action.payload] };
    case 'UPDATE_PATIENT':
      return {
        ...state,
        patients: state.patients.map((p) => (p.id === action.payload.id ? { ...p, ...action.payload } : p)),
      };
    case 'DELETE_PATIENT':
      return { ...state, patients: state.patients.filter((p) => p.id !== action.payload) };
    case 'SET_DOCTORS':
      return { ...state, doctors: action.payload };
    case 'ADD_DOCTOR':
      return { ...state, doctors: [...state.doctors, action.payload] };
    case 'UPDATE_DOCTOR':
      return {
        ...state,
        doctors: state.doctors.map((d) => (d.id === action.payload.id ? { ...d, ...action.payload } : d)),
      };
    case 'ADD_STAFF':
      return { ...state, staffMembers: [...(state.staffMembers || []), action.payload] };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload } : a
        ),
      };
    case 'DELETE_APPOINTMENT':
      return { ...state, appointments: state.appointments.filter((a) => a.id !== action.payload) };
    case 'SET_MEDICINES':
      return { ...state, medicines: action.payload };
    case 'UPDATE_MEDICINE':
      return {
        ...state,
        medicines: state.medicines.map((m) => (m.id === action.payload.id ? { ...m, ...action.payload } : m)),
      };
    case 'ADD_BILL':
      return { ...state, bills: [...state.bills, action.payload] };
    case 'UPDATE_BILL':
      return {
        ...state,
        bills: state.bills.map((b) => (b.id === action.payload.id ? { ...b, ...action.payload } : b)),
      };
    case 'ADD_LOG':
      return { ...state, activityLogs: [action.payload, ...state.activityLogs] };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) };
    case 'SET_WIDGET_LAYOUT':
      return { ...state, widgetLayout: action.payload };
    default:
      return state;
  }
}

export function HospitalProvider({ children }) {
  const [state, dispatch] = useReducer(hospitalReducer, initialState);

  useEffect(() => {
    const saved = storage.get('hospital_data');
    if (saved) dispatch({ type: 'HYDRATE', payload: saved });
  }, []);

  useEffect(() => {
    storage.set('hospital_data', state);
  }, [state]);

  const addLog = useCallback((user, action, type) => {
    dispatch({
      type: 'ADD_LOG',
      payload: { id: `log${Date.now()}`, user, action, timestamp: new Date().toISOString(), type },
    });
  }, []);

  const value = useMemo(() => ({ state, dispatch, addLog }), [state, addLog]);

  return <HospitalContext.Provider value={value}>{children}</HospitalContext.Provider>;
}

export const useHospital = () => {
  const ctx = useContext(HospitalContext);
  if (!ctx) throw new Error('useHospital must be used within HospitalProvider');
  return ctx;
};
