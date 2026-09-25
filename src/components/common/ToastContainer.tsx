import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToastStore, type ToastType } from '../../store/useToastStore';

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return <CheckCircle2 size={18} className="toast-icon success" />;
    case 'warning':
      return <AlertTriangle size={18} className="toast-icon warning" />;
    case 'error':
      return <AlertCircle size={18} className="toast-icon error" />;
    default:
      return <Info size={18} className="toast-icon info" />;
  }
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container-fixed" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-item toast-${t.type}`}>
          <div className="toast-icon-wrap">
            {getToastIcon(t.type)}
          </div>
          <div className="toast-text-wrap">
            <div className="toast-title">{t.title}</div>
            {t.description && (
              <div className="toast-description">{t.description}</div>
            )}
          </div>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => removeToast(t.id)}
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
};
