import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { storage } from '../services/storage';
import { initialUsers, ROLES } from '../data/seedData';

const AuthContext = createContext(null);

function loadUsers() {
  const stored = storage.get('users', null);
  if (!stored) return initialUsers;
  const adminSeed = initialUsers.find((u) => u.id === 'u1');
  return stored.map((u) =>
    u.id === 'u1' ? { ...u, email: adminSeed.email, name: adminSeed.name, avatar: adminSeed.avatar } : u
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(loadUsers);
  const [loading, setLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState(null);

  useEffect(() => {
    const session = storage.get('session');
    if (session?.user && session?.expires > Date.now()) {
      const adminSeed = initialUsers.find((u) => u.id === 'u1');
      const sessionUser =
        session.user.id === 'u1'
          ? { ...session.user, email: adminSeed.email, name: adminSeed.name, avatar: adminSeed.avatar }
          : session.user;
      setUser(sessionUser);
      setSessionExpiry(session.expires);
      if (sessionUser !== session.user) {
        storage.set('session', { user: sessionUser, expires: session.expires });
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    storage.set('users', users);
  }, [users]);

  const login = useCallback((email, password) => {
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'Invalid email or password' };
    const { password: _, ...safeUser } = found;
    const expires = Date.now() + 8 * 60 * 60 * 1000;
    setUser(safeUser);
    setSessionExpiry(expires);
    storage.set('session', { user: safeUser, expires });
    return { success: true, user: safeUser };
  }, [users]);

  const signup = useCallback((data) => {
    if (users.some((u) => u.email === data.email)) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = {
      id: `u${Date.now()}`,
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role || ROLES.PATIENT,
      avatar: data.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      patientId: data.role === ROLES.PATIENT ? `p${Date.now()}` : undefined,
    };
    setUsers((prev) => [...prev, newUser]);
    return { success: true, user: newUser };
  }, [users]);

  const linkUserAccount = useCallback((userId, patch) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...patch } : u)));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setSessionExpiry(null);
    storage.remove('session');
  }, []);

  const setSession = useCallback((fullUser) => {
    const { password: _, ...safeUser } = fullUser;
    const expires = Date.now() + 8 * 60 * 60 * 1000;
    setUser(safeUser);
    setSessionExpiry(expires);
    storage.set('session', { user: safeUser, expires });
  }, []);

  const extendSession = useCallback(() => {
    if (!user) return;
    const expires = Date.now() + 8 * 60 * 60 * 1000;
    setSessionExpiry(expires);
    storage.set('session', { user, expires });
  }, [user]);

  const hasRole = useCallback((...roles) => user && roles.includes(user.role), [user]);

  const value = useMemo(
    () => ({
      user,
      users,
      loading,
      login,
      signup,
      setSession,
      linkUserAccount,
      logout,
      hasRole,
      extendSession,
      sessionExpiry,
      isAuthenticated: !!user,
    }),
    [user, users, loading, login, signup, setSession, linkUserAccount, logout, hasRole, extendSession, sessionExpiry]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export { ROLES };
