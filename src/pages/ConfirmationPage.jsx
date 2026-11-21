import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/cartHelpers.js';

function ConfirmationPage({ booking }) {
  if (!booking) {
    return (
      <div className="status-box">
        <h1>No booking yet</h1>
        <p>You haven't confirmed a booking in this browser.</p>
        <Link to="/menu" className="btn btn-primary">
          Start an order
        </Link>
      </div>
    );
  }

  const { reference, name, date, time, guests, notes, items, subtotal } = booking;

  return (
    <section className="confirmation" aria-labelledby="confirm-heading">
      <p className="success-banner" role="status">✓ Booking confirmed (simulated)</p>
      <h1 id="confirm-heading">Thank you, {name}!</h1>
      <p>
        Your table for <strong>{guests}</strong> is booked on <strong>{date}</strong> at <strong>{time}</strong>.
        Reference: <strong>{reference}</strong>
      </p>

      <h2>Your pre-order</h2>
      <ul className="mini-lines">
        {items.map((line) => (
          <li key={line.id}>
            {line.quantity} × {line.name}
            {line.spice && ` (${line.spice})`} — {formatPrice(line.lineTotal)}
          </li>
        ))}
      </ul>
      <p className="summary-total-line">
        Total to pay at the café: <strong>{formatPrice(subtotal)}</strong>
      </p>
      {notes && <p>Notes: {notes}</p>}

      <p className="simulated-label">This is a student project. No table has been reserved and no payment was taken.</p>
      <Link to="/menu" className="btn btn-secondary">
        Back to the menu
      </Link>
    </section>
  );
}

export default ConfirmationPage;
