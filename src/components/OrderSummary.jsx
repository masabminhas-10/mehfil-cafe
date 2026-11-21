import { formatPrice } from '../utils/cartHelpers.js';
import { MIN_ORDER_TOTAL } from '../rules/orderRules.js';

function OrderSummary({ itemCount, subtotal, guests }) {
  const remaining = Math.max(0, MIN_ORDER_TOTAL - subtotal);
  const validGuests = Number(guests) > 0;

  return (
    <dl className="summary-list">
      <div>
        <dt>Items</dt>
        <dd>{itemCount}</dd>
      </div>
      <div>
        <dt>Subtotal</dt>
        <dd>{formatPrice(subtotal)}</dd>
      </div>
      {validGuests && (
        <div>
          <dt>Per guest ({guests})</dt>
          <dd>{formatPrice(Math.round(subtotal / Number(guests)))}</dd>
        </div>
      )}
      <div>
        <dt>Needed for minimum</dt>
        <dd>{remaining === 0 ? 'Reached ✓' : formatPrice(remaining)}</dd>
      </div>
      <div className="summary-total">
        <dt>Pay at the café</dt>
        <dd>{formatPrice(subtotal)}</dd>
      </div>
    </dl>
  );
}

export default OrderSummary;
