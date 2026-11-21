import { MIN_ORDER_TOTAL, FEAST_MIN_GUESTS, MAX_GUESTS } from '../rules/orderRules.js';


function RulesBanner() {
  return (
    <section className="rules-banner" aria-labelledby="rules-heading">
      <h2 id="rules-heading">Before you order</h2>
      <ul>
        <li>
          <strong>Minimum pre-order:</strong> Rs {MIN_ORDER_TOTAL.toLocaleString()} per table booking.
        </li>
        <li>
          <strong>Feast platters:</strong> for bookings of {FEAST_MIN_GUESTS} or more guests.
        </li>
        <li>
          <strong>Limited portions:</strong> each dish shows how many portions are left today.
        </li>
        <li>
          <strong>Table size:</strong> 1 to {MAX_GUESTS} guests, up to 14 days ahead.
        </li>
      </ul>
    </section>
  );
}

export default RulesBanner;
