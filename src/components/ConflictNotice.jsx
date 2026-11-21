
function ConflictNotice({ conflicts, onFix }) {
  if (conflicts.length === 0) return null;

  return (
    <section className="conflict-notice" role="alert" aria-labelledby="conflict-heading">
      <h2 id="conflict-heading">Your saved order needs a change</h2>
      <p>Availability changed since you added these dishes:</p>
      <ul>
        {conflicts.map((conflict) => (
          <li key={conflict.id}>
            <span>
              <strong>{conflict.name}</strong> {conflict.message}
            </span>
            <button type="button" className="btn btn-secondary" onClick={() => onFix(conflict.id, conflict.fixQuantity)}>
              {conflict.fixQuantity > 0 ? `Change to ${conflict.fixQuantity}` : 'Remove'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ConflictNotice;
