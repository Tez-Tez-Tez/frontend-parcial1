/**
 * Componente: ErrorMessage
 * Mostrador de errores
 */

import '../styles/ErrorMessage.css';

export function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="error-message">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <div className="error-text">
          <p className="error-title">Error</p>
          <p className="error-description">{message}</p>
        </div>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="error-close">
          ✕
        </button>
      )}
    </div>
  );
}
