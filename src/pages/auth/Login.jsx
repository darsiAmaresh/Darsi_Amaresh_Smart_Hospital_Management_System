import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Hospital, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const demoAccounts = [
  { email: 'darsi123@gmail.com', password: 'admin123', role: 'Admin' },
  { email: 'doctor@hospital.com', password: 'doctor123', role: 'Doctor' },
  { email: 'reception@hospital.com', password: 'reception123', role: 'Receptionist' },
  { email: 'patient@hospital.com', password: 'patient123', role: 'Patient' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email format';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      toast(`Welcome back, ${result.user.name}!`, 'success');
      navigate(from, { replace: true });
    } else {
      toast(result.error, 'error');
    }
  };

  const quickLogin = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card animate-in">
        <div className="auth-brand">
          <Hospital size={40} />
          <h1>SmartCare HMS</h1>
          <p>Smart Hospital Management System</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Sign In</h2>
          <div className={`form-group ${errors.email ? 'error' : ''}`}>
            <label><Mail size={14} /> Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@hospital.com" />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>
          <div className={`form-group ${errors.password ? 'error' : ''}`}>
            <label><Lock size={14} /> Password</label>
            <div className="input-with-icon">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-link">Don't have an account? <Link to="/signup">Create account</Link></p>
        <div className="demo-accounts">
          <p>Demo accounts (click to fill):</p>
          <div className="demo-grid">
            {demoAccounts.map((acc) => (
              <button key={acc.role} type="button" className="demo-btn" onClick={() => quickLogin(acc)}>
                {acc.role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
