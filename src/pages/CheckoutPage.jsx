import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadState from '../components/LoadState.jsx';
import ConflictNotice from '../components/ConflictNotice.jsx';
import OrderSummary from '../components/OrderSummary.jsx';
import RuleChecklist from '../components/RuleChecklist.jsx';
import { validateBooking, todayISO, lastBookableISO } from '../rules/validateBooking.js';
import { checkMinimumOrder, checkFeastEligibility, MIN_GUESTS, MAX_GUESTS, FEAST_MIN_GUESTS } from '../rules/orderRules.js';

const TIME_SLOTS = ['12:30', '13:30', '14:30', '15:30', '18:00', '19:00', '20:00', '21:00', '22:00'];

const EMPTY_FORM = { name: '', phone: '', date: '', time: '', guests: '2', notes: '' };

function CheckoutPage({ status, loadError, onRetry, orderLines, subtotal, itemCount, conflicts, onFixConflict, onComplete }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [attempted, setAttempted] = useState(false);

  if (status !== 'ready') {
    return <LoadState status={status} loadError={loadError} onRetry={onRetry} />;
  }

  if (orderLines.length === 0 && conflicts.length === 0) {
    return (
      <div className="status-box">
        <h1>Nothing to book yet</h1>
        <p>Your order is empty, so there is nothing to confirm.</p>
        <Link to="/menu" className="btn btn-primary">
          Browse the menu
        </Link>
      </div>
    );
  }

  const errors = attempted ? validateBooking(form) : {};
  const minimum = checkMinimumOrder(subtotal);
  const feast = checkFeastEligibility(orderLines, Number(form.guests));
  const checks = [
    { label: 'Portions available', ok: conflicts.length === 0, message: 'Fix the dishes listed above.' },
    { label: 'Minimum pre-order', ok: minimum.ok, message: minimum.message },
    { label: 'Feast platters', ok: feast.ok, message: feast.message },
  ];
  const rulesOk = checks.every((check) => check.ok);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setAttempted(true);

    const fieldErrors = validateBooking(form);
    const firstInvalid = Object.keys(fieldErrors)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid).focus();
      return;
    }
    if (!rulesOk) return;


    const booking = {
      reference: `MC-${Date.now().toString().slice(-6)}`,
      name: form.name.trim(),
      date: form.date,
      time: form.time,
      guests: Number(form.guests),
      notes: form.notes.trim(),
      items: orderLines.map(({ id, quantity, spice, item }) => ({
        id,
        name: item.name,
        quantity,
        spice: item.hasSpiceLevel ? spice : null,
        lineTotal: item.price * quantity,
      })),
      subtotal,
    };
    onComplete(booking);
    navigate('/confirmation');
  }

  function errorFor(field) {
    return errors[field] ? (
      <p className="field-error" id={`${field}-error`}>
        {errors[field]}
      </p>
    ) : null;
  }

  return (
    <>
      <h1>Booking details</h1>
      <p className="simulated-label">Simulated booking — no real table is reserved and no payment is taken.</p>
      <ConflictNotice conflicts={conflicts} onFix={onFixConflict} />

      <div className="two-column">
        <form className="booking-form" onSubmit={handleSubmit} noValidate>
          {Object.keys(errors).length > 0 && (
            <p className="form-error-summary" role="alert">
              Please fix {Object.keys(errors).length} field{Object.keys(errors).length === 1 ? '' : 's'} below.
              Your other answers have been kept.
            </p>
          )}

          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} autoComplete="name"
              aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
            {errorFor('name')}
          </div>

          <div className="field">
            <label htmlFor="phone">Mobile number</label>
            <input id="phone" name="phone" type="tel" inputMode="numeric" value={form.phone} onChange={handleChange}
              placeholder="03001234567" autoComplete="tel"
              aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} />
            {errorFor('phone')}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="date">Date</label>
              <input id="date" name="date" type="date" value={form.date} onChange={handleChange}
                min={todayISO()} max={lastBookableISO()}
                aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? 'date-error' : undefined} />
              {errorFor('date')}
            </div>

            <div className="field">
              <label htmlFor="time">Time</label>
              <select id="time" name="time" value={form.time} onChange={handleChange}
                aria-invalid={Boolean(errors.time)} aria-describedby={errors.time ? 'time-error' : undefined}>
                <option value="">Choose a time</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errorFor('time')}
            </div>
          </div>

          <div className="field">
            <label htmlFor="guests">Number of guests</label>
            <input id="guests" name="guests" type="number" min={MIN_GUESTS} max={MAX_GUESTS} value={form.guests}
              onChange={handleChange} aria-describedby={errors.guests ? 'guests-error guests-hint' : 'guests-hint'}
              aria-invalid={Boolean(errors.guests)} />
            <p className="hint" id="guests-hint">
              {MIN_GUESTS}–{MAX_GUESTS} guests. Feast platters need {FEAST_MIN_GUESTS} or more.
            </p>
            {errorFor('guests')}
          </div>

          <div className="field">
            <label htmlFor="notes">Notes for the kitchen (optional)</label>
            <textarea id="notes" name="notes" rows="3" value={form.notes} onChange={handleChange}
              placeholder="e.g. high chair needed, no onions in the daal" />
          </div>

          {attempted && !rulesOk && (
            <p className="form-error-summary" role="alert">
              Your order doesn't meet a booking rule yet:{' '}
              {checks.filter((check) => !check.ok).map((check) => check.message).join(' ')}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-large btn-block">
            Confirm simulated booking
          </button>
        </form>

        <aside className="summary-card" aria-labelledby="checkout-summary">
          <h2 id="checkout-summary">Order summary</h2>
          <ul className="mini-lines">
            {orderLines.map(({ id, quantity, item }) => (
              <li key={id}>
                {quantity} × {item.name}
              </li>
            ))}
          </ul>
          <OrderSummary itemCount={itemCount} subtotal={subtotal} guests={form.guests} />
          <RuleChecklist checks={checks} />
          <Link to="/order" className="btn btn-secondary btn-block">
            Change order
          </Link>
        </aside>
      </div>
    </>
  );
}

export default CheckoutPage;
