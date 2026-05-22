import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, Search, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { NotificationCenter } from './NotificationCenter';
import { format } from 'date-fns';

export function Header({ onSearch }) {
  const { user, logout, sessionExpiry, extendSession } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const sessionLeft = sessionExpiry
    ? Math.max(0, Math.floor((sessionExpiry - Date.now()) / 60000))
    : 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-search">
        <Search size={18} />
        <input
          placeholder="Quick search patients, doctors..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onSearch?.(e.target.value);
          }}
        />
      </div>
      <div className="header-actions">
        <span className="header-time">
          <Clock size={14} />
          {format(now, 'EEE, MMM d · h:mm a')}
        </span>
        {sessionExpiry && (
          <button className="session-badge" onClick={extendSession} title="Click to extend session">
            Session: {sessionLeft}m left
          </button>
        )}
        <NotificationCenter />
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <div className="header-user">
          <div className="avatar sm">{user?.avatar}</div>
          <span>{user?.name}</span>
        </div>
        <button className="icon-btn" onClick={handleLogout} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
