/**
 * Componente: LoadingSpinner
 * Indicador de carga
 */

import '../styles/LoadingSpinner.css';

export function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner" />
      <p>Loading...</p>
    </div>
  );
}
