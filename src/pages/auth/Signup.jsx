import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hospital, Mail, Lock, User, Eye, EyeOff, ChevronRight, ChevronLeft } from 'lucide-react';
import { ROLES } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useRegisterAccount } from '../../hooks/useRegisterAccount';
import { DEPARTMENTS } from '../../data/seedData';

const steps = ['Personal Info', 'Account Details', 'Role & Profile'];

export default function Signup() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: ROLES.PATIENT,
    phone: '', age: '', gender: 'Other', department: DEPARTMENTS[7], specialization: '',
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const { registerAccount } = useRegisterAccount();
  const { toast } = useToast();
  const navigate = useNavigate();

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = 'Full name is required';
      else if (form.name.length < 2) e.name = 'Name must be at least 2 characters';
    }
    if (step === 1) {
      if (!form.email.trim()) e.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
      if (!form.password) e.password = 'Password required';
      else if (form.password.length < 6) e.password = 'Min 6 characters';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, 2)); };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = registerAccount(form);
    if (result.success) {
      toast(`Welcome, ${result.user.name}! Your profile is active across the hospital system.`, 'success');
      navigate('/dashboard');
    } else {
      toast(result.error, 'error');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card auth-card-wide animate-in">
        <div className="auth-brand">
          <Hospital size={36} />
          <h1>Create Account</h1>
        </div>
        <div className="step-indicator">
          {steps.map((s, i) => (
            <div key={s} className={`step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <span>{i + 1}</span>
              <label>{s}</label>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {step === 0 && (
            <div className={`form-group ${errors.name ? 'error' : ''}`}>
              <label><User size={14} /> Full Name</label>
              <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="John Doe" />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>
          )}
          {step === 1 && (
            <>
              <div className={`form-group ${errors.email ? 'error' : ''}`}>
                <label><Mail size={14} /> Email</label>
                <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
                {errors.email && <span className="error-msg">{errors.email}</span>}
              </div>
              <div className={`form-group ${errors.password ? 'error' : ''}`}>
                <label><Lock size={14} /> Password</label>
                <div className="input-with-icon">
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} />
                  <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="error-msg">{errors.password}</span>}
              </div>
              <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
                <label>Confirm Password</label>
                <input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} />
                {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="role-select">
                {Object.values(ROLES).map((role) => (
                  <label key={role} className={`role-option ${form.role === role ? 'selected' : ''}`}>
                    <input type="radio" name="role" value={role} checked={form.role === role} onChange={() => update('role', role)} />
                    <span className="role-label">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                  </label>
                ))}
              </div>
              <p className="signup-hint">Your details will appear in dashboards, patient/doctor lists, and activity logs.</p>
              <div className="form-grid signup-role-fields">
                <div className="form-group">
                  <label>Phone</label>
                  <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+1 555-0000" />
                </div>
                {form.role === ROLES.PATIENT && (
                  <>
                    <div className="form-group">
                      <label>Age</label>
                      <input type="number" value={form.age} onChange={(e) => update('age', e.target.value)} placeholder="25" />
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <select value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                  </>
                )}
                {form.role === ROLES.DOCTOR && (
                  <>
                    <div className="form-group">
                      <label>Department</label>
                      <select value={form.department} onChange={(e) => update('department', e.target.value)}>
                        {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="form-group full">
                      <label>Specialization</label>
                      <input value={form.specialization} onChange={(e) => update('specialization', e.target.value)} placeholder="e.g. General Practice" />
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          <div className="form-actions">
            {step > 0 && (
              <button type="button" className="btn btn-secondary" onClick={prev}>
                <ChevronLeft size={16} /> Back
              </button>
            )}
            {step < 2 ? (
              <button type="button" className="btn btn-primary" onClick={next}>
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button type="submit" className="btn btn-primary">Create Account</button>
            )}
          </div>
        </form>
        <p className="auth-link">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
