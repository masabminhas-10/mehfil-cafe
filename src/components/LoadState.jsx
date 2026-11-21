
function LoadState({ status, loadError, onRetry }) {
  if (status === 'loading') {
    return (
      <p className="status-box" role="status">
        Loading today's menu…
      </p>
    );
  }

  return (
    <div className="status-box status-error" role="alert">
      <h2>Menu unavailable</h2>
      <p>{loadError}</p>
      <button type="button" className="btn btn-primary" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}

export default LoadState;
