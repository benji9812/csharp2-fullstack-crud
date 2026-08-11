import React from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry, onDismiss }) => {
  return (
    <div className="error-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertTriangle size={20} />
        <span>{message}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {onRetry && (
          <button className="btn btn-sm btn-secondary" onClick={onRetry}>
            <RefreshCw size={14} /> Försök igen
          </button>
        )}
        {onDismiss && (
          <button className="btn btn-sm btn-secondary btn-icon" onClick={onDismiss}>
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
