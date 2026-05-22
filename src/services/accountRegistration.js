import { ROLES, DEPARTMENTS } from '../data/seedData';

/**
 * Builds hospital records and auth user patches when a new account is created.
 */
export function buildRegistrationRecords(user, form = {}) {
  const ts = Date.now();
  const now = new Date().toISOString();
  const dispatches = [];
  const userPatch = {};

  const addLog = (action, type) => {
    dispatches.push({
      type: 'ADD_LOG',
      payload: { id: `log${ts}`, user: user.name, action, timestamp: now, type },
    });
  };

  const addNotification = (title, message, type) => {
    dispatches.push({
      type: 'ADD_NOTIFICATION',
      payload: { id: `n${ts}`, title, message, type, read: false, time: now },
    });
  };

  switch (user.role) {
    case ROLES.PATIENT: {
      const patientId = user.patientId || `p${ts}`;
      userPatch.patientId = patientId;
      dispatches.push({
        type: 'ADD_PATIENT',
        payload: {
          id: patientId,
          userId: user.id,
          name: user.name,
          age: Number(form.age) || 25,
          gender: form.gender || 'Other',
          bloodGroup: form.bloodGroup || 'O+',
          phone: form.phone || '—',
          email: user.email,
          address: form.address || 'Not provided',
          emergencyContact: {
            name: form.emergencyName || '—',
            relation: form.emergencyRelation || '—',
            phone: form.emergencyPhone || '—',
          },
          status: 'outpatient',
          room: null,
          admissionDate: null,
          dischargeDate: null,
          medicalHistory: [],
          prescriptions: [],
          healthScore: 80,
          riskLevel: 'low',
        },
      });
      addLog(`New patient registered: ${user.name}`, 'patient');
      addNotification('New Patient', `${user.name} joined the patient portal`, 'patient');
      break;
    }

    case ROLES.DOCTOR: {
      const doctorId = `d${ts}`;
      const doctorName = /^Dr\.?\s/i.test(user.name) ? user.name : `Dr. ${user.name}`;
      userPatch.doctorId = doctorId;
      userPatch.department = form.department || DEPARTMENTS[7];
      dispatches.push({
        type: 'ADD_DOCTOR',
        payload: {
          id: doctorId,
          userId: user.id,
          name: doctorName,
          department: form.department || DEPARTMENTS[7],
          specialization: form.specialization || 'General Practice',
          email: user.email,
          phone: form.phone || '—',
          status: 'available',
          experience: Number(form.experience) || 0,
          rating: 5.0,
          patientsToday: 0,
          avatar: user.avatar,
        },
      });
      addLog(`New doctor registered: ${doctorName}`, 'appointment');
      addNotification('New Doctor', `${doctorName} joined the medical staff`, 'appointment');
      break;
    }

    case ROLES.RECEPTIONIST:
    case ROLES.ADMIN: {
      const staffId = `s${ts}`;
      userPatch.staffId = staffId;
      dispatches.push({
        type: 'ADD_STAFF',
        payload: {
          id: staffId,
          userId: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: form.phone || '—',
          joinedAt: now,
        },
      });
      addLog(`New ${user.role} account created: ${user.name}`, 'patient');
      addNotification(
        'New Staff Member',
        `${user.name} registered as ${user.role}`,
        'appointment'
      );
      break;
    }

    default:
      break;
  }

  return { userPatch, dispatches };
}
