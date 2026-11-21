import { Link } from 'react-router-dom';
import LoadState from '../components/LoadState.jsx';
import QuantityControl from '../components/QuantityControl.jsx';
import ConflictNotice from '../components/ConflictNotice.jsx';
import OrderSummary from '../components/OrderSummary.jsx';
import RuleChecklist from '../components/RuleChecklist.jsx';
import { formatPrice } from '../utils/cartHelpers.js';
import { checkMinimumOrder, FEAST_MIN_GUESTS } from '../rules/orderRules.js';
import { SPICE_LEVELS } from '../data/menuItems.js';

function CartPage({
  status, loadError, onRetry,
  orderLines, subtotal, itemCount, conflicts,
  onSetQuantity, onRemove, onChangeSpice, onFixConflict,
}) {
  if (status !== 'ready') {
    return <LoadState status={status} loadError={loadError} onRetry={onRetry} />;
  }

  if (orderLines.length === 0 && conflicts.length === 0) {
    return (
      <div className="status-box">
        <h1>Your order is empty</h1>
        <p>Add a few dishes from the menu to pre-order for your table.</p>
        <Link to="/menu" className="btn btn-primary">
          Browse the menu
        </Link>
      </div>
    );
  }

  const minimum = checkMinimumOrder(subtotal);
  const hasFeast = orderLines.some((line) => line.item.groupOnly);
  const checks = [
    { label: 'Portions available', ok: conflicts.length === 0, message: 'Fix the dishes listed above.' },
    { label: 'Minimum pre-order', ok: minimum.ok, message: minimum.message },
  ];
  const canContinue = checks.every((check) => check.ok);

  return (
    <>
      <h1>Your order</h1>
      <ConflictNotice conflicts={conflicts} onFix={onFixConflict} />

      <div className="two-column">
        <ul className="order-lines">
          {orderLines.map(({ id, quantity, spice, item }) => (
            <li key={id} className="order-line">
              <div className="order-line-info">
                <h2 className="h3">
                  <Link to={`/menu/${id}`}>{item.name}</Link>
                </h2>
                <p>
                  {formatPrice(item.price)} each · <strong>{formatPrice(item.price * quantity)}</strong>
                </p>
                {item.groupOnly && <p className="hint">Needs a booking of {FEAST_MIN_GUESTS}+ guests.</p>}
              </div>
              <QuantityControl
                name={item.name}
                quantity={quantity}
                portionsLeft={item.portionsLeft}
                onChange={(newQuantity) => onSetQuantity(id, newQuantity)}
              />
              {item.hasSpiceLevel && (
                <div className="field field-inline">
                  <label htmlFor={`spice-${id}`}>Spice</label>
                  <select id={`spice-${id}`} value={spice} onChange={(event) => onChangeSpice(id, event.target.value)}>
                    {SPICE_LEVELS.map((level) => (
                      <option key={level}>{level}</option>
                    ))}
                  </select>
                </div>
              )}
              <button type="button" className="btn btn-link" onClick={() => onRemove(id)}>
                Remove<span className="visually-hidden"> {item.name}</span>
              </button>
            </li>
          ))}
        </ul>

        <aside className="summary-card" aria-labelledby="summary-heading">
          <h2 id="summary-heading">Summary</h2>
          <OrderSummary itemCount={itemCount} subtotal={subtotal} />
          <RuleChecklist checks={checks} />
          {hasFeast && <p className="hint">You'll enter the number of guests on the next step.</p>}
          {canContinue ? (
            <Link to="/checkout" className="btn btn-primary btn-block">
              Continue to booking details
            </Link>
          ) : (
            <p className="hint">Fix the items marked ✗ to continue.</p>
          )}
          <Link to="/menu" className="btn btn-secondary btn-block">
            Add more dishes
          </Link>
        </aside>
      </div>
    </>
  );
}

export default CartPage;
