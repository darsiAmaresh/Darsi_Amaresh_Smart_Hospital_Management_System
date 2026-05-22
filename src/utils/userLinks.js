/** Resolve hospital records for the logged-in user */
export function findPatientForUser(patients, user) {
  if (!user) return null;
  return (
    patients.find(
      (p) => p.id === user.patientId || p.userId === user.id || p.email === user.email
    ) ?? null
  );
}

export function findDoctorForUser(doctors, user) {
  if (!user) return null;
  return (
    doctors.find(
      (d) => d.id === user.doctorId || d.userId === user.id || d.email === user.email
    ) ?? null
  );
}

export function findStaffForUser(staffMembers, user) {
  if (!user) return null;
  return (
    staffMembers.find(
      (s) => s.id === user.staffId || s.userId === user.id || s.email === user.email
    ) ?? null
  );
}
