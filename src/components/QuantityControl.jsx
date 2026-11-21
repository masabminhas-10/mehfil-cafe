import { checkPortions } from '../rules/orderRules.js';


function QuantityControl({ name, quantity, portionsLeft, onChange }) {
  const canIncrease = checkPortions(quantity + 1, portionsLeft).ok;

  return (
    <div className="quantity-control">
      <div className="quantity-buttons">
        <button
          type="button"
          className="btn btn-icon"
          onClick={() => onChange(quantity - 1)}
          disabled={quantity === 0}
          aria-label={`Remove one ${name}`}
        >
          −
        </button>
        <span className="quantity-value" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          className="btn btn-icon"
          onClick={() => onChange(quantity + 1)}
          disabled={!canIncrease}
          aria-label={`Add one ${name}`}
        >
          +
        </button>
      </div>
      {!canIncrease && portionsLeft > 0 && (
        <p className="hint">Maximum reached: {portionsLeft} left today.</p>
      )}
    </div>
  );
}

export default QuantityControl;
