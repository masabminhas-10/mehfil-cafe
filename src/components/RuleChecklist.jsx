
function RuleChecklist({ checks }) {
  return (
    <ul className="rule-checklist" aria-label="Booking checks">
      {checks.map((check) => (
        <li key={check.label} className={check.ok ? 'check-ok' : 'check-fail'}>
          <span aria-hidden="true">{check.ok ? '✓' : '✗'}</span>{' '}
          <strong>{check.label}:</strong> {check.ok ? 'OK' : check.message}
        </li>
      ))}
    </ul>
  );
}

export default RuleChecklist;
