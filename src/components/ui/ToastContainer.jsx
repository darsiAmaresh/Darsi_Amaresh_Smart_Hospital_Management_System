import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

const icons = { success: CheckCircle, error: XCircle, warning: AlertCircle, info: Info };

export function ToastContainer() {
  const { toasts } = useToast();
  return (
    <div className="toast-container">
      {toasts.map((t) => {
        const Icon = icons[t.type] || Info;
        return (
          <div key={t.id} className={`toast toast-${t.type} animate-slide`}>
            <Icon size={18} />
            <span>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
