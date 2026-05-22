export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  RECEPTIONIST: 'receptionist',
  PATIENT: 'patient',
};

export const DEPARTMENTS = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
  'Emergency', 'Oncology', 'Radiology', 'General Medicine',
];

export const initialUsers = [
  { id: 'u1', email: 'darsi123@gmail.com', password: 'admin123', name: 'Darsi Amaresh', role: ROLES.ADMIN, avatar: 'DA' },
  { id: 'u2', email: 'doctor@hospital.com', password: 'doctor123', name: 'Dr. James Chen', role: ROLES.DOCTOR, department: 'Cardiology', doctorId: 'd1', avatar: 'JC' },
  { id: 'u3', email: 'reception@hospital.com', password: 'reception123', name: 'Emily Rodriguez', role: ROLES.RECEPTIONIST, avatar: 'ER' },
  { id: 'u4', email: 'patient@hospital.com', password: 'patient123', name: 'John Anderson', role: ROLES.PATIENT, patientId: 'p1', avatar: 'JA' },
];

export const initialPatients = [
  {
    id: 'p1', userId: 'u4', name: 'John Anderson', age: 45, gender: 'Male', bloodGroup: 'O+',
    phone: '+1 555-0101', email: 'patient@hospital.com', address: '123 Oak St, Boston',
    emergencyContact: { name: 'Mary Anderson', relation: 'Spouse', phone: '+1 555-0102' },
    status: 'admitted', room: 'A-204', admissionDate: '2026-05-18', dischargeDate: null,
    medicalHistory: [
      { date: '2026-03-10', diagnosis: 'Hypertension', doctor: 'Dr. James Chen', notes: 'Stage 1, lifestyle changes recommended' },
      { date: '2026-04-22', diagnosis: 'Chest Pain Evaluation', doctor: 'Dr. James Chen', notes: 'ECG normal, stress test scheduled' },
    ],
    prescriptions: [
      { id: 'rx1', date: '2026-05-18', medicines: ['Lisinopril 10mg', 'Aspirin 81mg'], doctor: 'Dr. James Chen' },
    ],
    healthScore: 72, riskLevel: 'moderate',
  },
  {
    id: 'p2', name: 'Emma Wilson', age: 32, gender: 'Female', bloodGroup: 'A+',
    phone: '+1 555-0201', email: 'emma.w@email.com', address: '456 Pine Ave, Boston',
    emergencyContact: { name: 'Robert Wilson', relation: 'Father', phone: '+1 555-0202' },
    status: 'outpatient', room: null, admissionDate: null, dischargeDate: null,
    medicalHistory: [{ date: '2026-02-15', diagnosis: 'Migraine', doctor: 'Dr. Lisa Park', notes: 'Chronic, preventive medication started' }],
    prescriptions: [{ id: 'rx2', date: '2026-02-15', medicines: ['Sumatriptan 50mg'], doctor: 'Dr. Lisa Park' }],
    healthScore: 85, riskLevel: 'low',
  },
  {
    id: 'p3', name: 'Michael Brown', age: 58, gender: 'Male', bloodGroup: 'B+',
    phone: '+1 555-0301', email: 'm.brown@email.com', address: '789 Elm Rd, Cambridge',
    emergencyContact: { name: 'Susan Brown', relation: 'Wife', phone: '+1 555-0302' },
    status: 'admitted', room: 'B-112', admissionDate: '2026-05-20', dischargeDate: null,
    medicalHistory: [{ date: '2026-05-20', diagnosis: 'Type 2 Diabetes', doctor: 'Dr. James Chen', notes: 'HbA1c 8.2%, insulin therapy initiated' }],
    prescriptions: [{ id: 'rx3', date: '2026-05-20', medicines: ['Metformin 500mg', 'Insulin Glargine'], doctor: 'Dr. James Chen' }],
    healthScore: 58, riskLevel: 'high',
  },
  {
    id: 'p4', name: 'Sophia Martinez', age: 28, gender: 'Female', bloodGroup: 'AB-',
    phone: '+1 555-0401', email: 's.martinez@email.com', address: '321 Maple Dr, Boston',
    emergencyContact: { name: 'Carlos Martinez', relation: 'Brother', phone: '+1 555-0402' },
    status: 'discharged', room: null, admissionDate: '2026-05-10', dischargeDate: '2026-05-17',
    medicalHistory: [{ date: '2026-05-10', diagnosis: 'Appendicitis', doctor: 'Dr. Robert Lee', notes: 'Laparoscopic appendectomy successful' }],
    prescriptions: [{ id: 'rx4', date: '2026-05-17', medicines: ['Amoxicillin 500mg', 'Ibuprofen 400mg'], doctor: 'Dr. Robert Lee' }],
    healthScore: 90, riskLevel: 'low',
  },
  {
    id: 'p5', name: 'David Kim', age: 67, gender: 'Male', bloodGroup: 'O-',
    phone: '+1 555-0501', email: 'd.kim@email.com', address: '654 Birch Ln, Somerville',
    emergencyContact: { name: 'Jennifer Kim', relation: 'Daughter', phone: '+1 555-0502' },
    status: 'admitted', room: 'ICU-03', admissionDate: '2026-05-21', dischargeDate: null,
    medicalHistory: [{ date: '2026-05-21', diagnosis: 'Acute MI', doctor: 'Dr. James Chen', notes: 'Emergency PCI performed, stable in ICU' }],
    prescriptions: [{ id: 'rx5', date: '2026-05-21', medicines: ['Clopidogrel 75mg', 'Atorvastatin 40mg', 'Metoprolol 25mg'], doctor: 'Dr. James Chen' }],
    healthScore: 45, riskLevel: 'critical',
  },
];

export const initialDoctors = [
  { id: 'd1', userId: 'u2', name: 'Dr. James Chen', department: 'Cardiology', specialization: 'Interventional Cardiology', email: 'doctor@hospital.com', phone: '+1 555-1001', status: 'available', experience: 15, rating: 4.9, patientsToday: 8, avatar: 'JC' },
  { id: 'd2', name: 'Dr. Lisa Park', department: 'Neurology', specialization: 'Neurology & Headache', email: 'l.park@hospital.com', phone: '+1 555-1002', status: 'busy', experience: 12, rating: 4.7, patientsToday: 6, avatar: 'LP' },
  { id: 'd3', name: 'Dr. Robert Lee', department: 'General Medicine', specialization: 'General Surgery', email: 'r.lee@hospital.com', phone: '+1 555-1003', status: 'available', experience: 20, rating: 4.8, patientsToday: 5, avatar: 'RL' },
  { id: 'd4', name: 'Dr. Amanda Foster', department: 'Pediatrics', specialization: 'Pediatric Care', email: 'a.foster@hospital.com', phone: '+1 555-1004', status: 'off-duty', experience: 10, rating: 4.6, patientsToday: 0, avatar: 'AF' },
  { id: 'd5', name: 'Dr. Michael Torres', department: 'Orthopedics', specialization: 'Joint Replacement', email: 'm.torres@hospital.com', phone: '+1 555-1005', status: 'available', experience: 18, rating: 4.9, patientsToday: 7, avatar: 'MT' },
];

export const initialAppointments = [
  { id: 'a1', patientId: 'p1', patientName: 'John Anderson', doctorId: 'd1', doctorName: 'Dr. James Chen', date: '2026-05-23', time: '09:00', type: 'Follow-up', status: 'approved', notes: 'Post-admission checkup' },
  { id: 'a2', patientId: 'p2', patientName: 'Emma Wilson', doctorId: 'd2', doctorName: 'Dr. Lisa Park', date: '2026-05-23', time: '10:30', type: 'Consultation', status: 'pending', notes: 'Migraine review' },
  { id: 'a3', patientId: 'p3', patientName: 'Michael Brown', doctorId: 'd1', doctorName: 'Dr. James Chen', date: '2026-05-24', time: '14:00', type: 'Check-up', status: 'approved', notes: 'Diabetes management' },
  { id: 'a4', patientId: 'p4', patientName: 'Sophia Martinez', doctorId: 'd3', doctorName: 'Dr. Robert Lee', date: '2026-05-25', time: '11:00', type: 'Follow-up', status: 'pending', notes: 'Post-surgery review' },
  { id: 'a5', patientId: 'p5', patientName: 'David Kim', doctorId: 'd1', doctorName: 'Dr. James Chen', date: '2026-05-22', time: '16:00', type: 'Emergency', status: 'approved', notes: 'ICU monitoring review' },
];

export const initialMedicines = [
  { id: 'm1', name: 'Lisinopril 10mg', category: 'Cardiovascular', stock: 450, unit: 'tablets', price: 12.5, expiry: '2027-06-15', supplier: 'PharmaCorp' },
  { id: 'm2', name: 'Metformin 500mg', category: 'Diabetes', stock: 320, unit: 'tablets', price: 8.0, expiry: '2027-03-20', supplier: 'MediSupply' },
  { id: 'm3', name: 'Amoxicillin 500mg', category: 'Antibiotics', stock: 180, unit: 'capsules', price: 15.0, expiry: '2026-11-10', supplier: 'BioHealth' },
  { id: 'm4', name: 'Ibuprofen 400mg', category: 'Pain Relief', stock: 600, unit: 'tablets', price: 5.5, expiry: '2028-01-05', supplier: 'PharmaCorp' },
  { id: 'm5', name: 'Insulin Glargine', category: 'Diabetes', stock: 45, unit: 'vials', price: 85.0, expiry: '2026-08-30', supplier: 'DiabeCare' },
  { id: 'm6', name: 'Atorvastatin 40mg', category: 'Cardiovascular', stock: 280, unit: 'tablets', price: 18.0, expiry: '2027-09-12', supplier: 'MediSupply' },
];

export const initialBills = [
  { id: 'b1', patientId: 'p1', patientName: 'John Anderson', date: '2026-05-18', items: [{ name: 'Room Charges (3 days)', amount: 900 }, { name: 'Lab Tests', amount: 250 }, { name: 'Medications', amount: 120 }], total: 1270, status: 'paid', method: 'Insurance' },
  { id: 'b2', patientId: 'p3', patientName: 'Michael Brown', date: '2026-05-20', items: [{ name: 'Room Charges (2 days)', amount: 600 }, { name: 'Consultation', amount: 150 }], total: 750, status: 'pending', method: null },
  { id: 'b3', patientId: 'p5', patientName: 'David Kim', date: '2026-05-21', items: [{ name: 'ICU Charges', amount: 3500 }, { name: 'Surgery', amount: 12000 }, { name: 'Medications', amount: 450 }], total: 15950, status: 'partial', method: 'Insurance' },
  { id: 'b4', patientId: 'p4', patientName: 'Sophia Martinez', date: '2026-05-17', items: [{ name: 'Surgery', amount: 4500 }, { name: 'Room (7 days)', amount: 2100 }], total: 6600, status: 'paid', method: 'Card' },
];

export const initialActivityLogs = [
  { id: 'log1', user: 'Darsi Amaresh', action: 'Approved appointment #a1', timestamp: '2026-05-22T08:30:00', type: 'appointment' },
  { id: 'log2', user: 'Emily Rodriguez', action: 'Registered new patient Emma Wilson', timestamp: '2026-05-22T09:15:00', type: 'patient' },
  { id: 'log3', user: 'Dr. James Chen', action: 'Updated prescription for David Kim', timestamp: '2026-05-22T10:00:00', type: 'prescription' },
  { id: 'log4', user: 'System', action: 'Emergency alert: ICU-03 vitals critical', timestamp: '2026-05-22T10:45:00', type: 'emergency' },
  { id: 'log5', user: 'Emily Rodriguez', action: 'Generated invoice #b3', timestamp: '2026-05-22T11:20:00', type: 'billing' },
  { id: 'log6', user: 'Darsi Amaresh', action: 'Discharged patient Sophia Martinez', timestamp: '2026-05-17T14:00:00', type: 'patient' },
];

export const dashboardStats = {
  totalPatients: 1247,
  availableDoctors: 42,
  todayAppointments: 38,
  emergencyCases: 5,
  revenue: 284500,
  bedsTotal: 200,
  bedsOccupied: 156,
};

export const revenueData = [
  { month: 'Jan', revenue: 185000, expenses: 120000 },
  { month: 'Feb', revenue: 198000, expenses: 125000 },
  { month: 'Mar', revenue: 210000, expenses: 130000 },
  { month: 'Apr', revenue: 225000, expenses: 135000 },
  { month: 'May', revenue: 284500, expenses: 142000 },
];

export const appointmentTrend = [
  { day: 'Mon', count: 32 }, { day: 'Tue', count: 38 }, { day: 'Wed', count: 35 },
  { day: 'Thu', count: 42 }, { day: 'Fri', count: 38 }, { day: 'Sat', count: 18 }, { day: 'Sun', count: 12 },
];

export const diseaseStats = [
  { name: 'Cardiovascular', value: 28 }, { name: 'Diabetes', value: 22 },
  { name: 'Respiratory', value: 15 }, { name: 'Neurological', value: 12 },
  { name: 'Orthopedic', value: 10 }, { name: 'Other', value: 13 },
];

export const healthRiskData = [
  { patient: 'David Kim', risk: 95, condition: 'Acute MI' },
  { patient: 'Michael Brown', risk: 72, condition: 'Diabetes' },
  { patient: 'John Anderson', risk: 45, condition: 'Hypertension' },
  { patient: 'Emma Wilson', risk: 20, condition: 'Migraine' },
];

export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];
