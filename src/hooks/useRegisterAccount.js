import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useHospital } from '../contexts/HospitalContext';
import { buildRegistrationRecords } from '../services/accountRegistration';

/**
 * Creates auth user + linked hospital records (patient/doctor/staff) site-wide.
 */
export function useRegisterAccount() {
  const { signup, linkUserAccount, setSession } = useAuth();
  const { dispatch } = useHospital();

  const registerAccount = useCallback(
    (form, { autoLogin = true } = {}) => {
      const authResult = signup(form);
      if (!authResult.success) return authResult;

      const { userPatch, dispatches } = buildRegistrationRecords(authResult.user, form);
      dispatches.forEach((action) => dispatch(action));
      linkUserAccount(authResult.user.id, userPatch);

      const linkedUser = { ...authResult.user, ...userPatch, password: form.password };

      if (autoLogin) {
        setSession(linkedUser);
      }

      return { success: true, user: linkedUser };
    },
    [signup, linkUserAccount, setSession, dispatch]
  );

  return { registerAccount };
}
