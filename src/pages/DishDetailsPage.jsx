import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadState from '../components/LoadState.jsx';
import DishImage from '../components/DishImage.jsx';
import DietaryInfo from '../components/DietaryInfo.jsx';
import AvailabilityBadge from '../components/AvailabilityBadge.jsx';
import QuantityControl from '../components/QuantityControl.jsx';
import { formatPrice } from '../utils/cartHelpers.js';
import { FEAST_MIN_GUESTS } from '../rules/orderRules.js';
import { SPICE_LEVELS } from '../data/menuItems.js';

function DishDetailsPage({ menu, status, loadError, onRetry, cart, getQuantity, onAdd, onSetQuantity, onChangeSpice }) {
  const { dishId } = useParams();
  const navigate = useNavigate();

  if (status !== 'ready') {
    return <LoadState status={status} loadError={loadError} onRetry={onRetry} />;
  }

  const dish = menu.find((item) => item.id === dishId);

  // Invalid ID -> useful feedback
  if (!dish) {
    return (
      <div className="status-box">
        <h1>Dish not found</h1>
        <p>We couldn't find a dish with the ID “{dishId}”. It may have been removed from the menu.</p>
        <Link to="/menu" className="btn btn-primary">
          Back to the menu
        </Link>
      </div>
    );
  }

  const quantity = getQuantity(dish.id);
  const cartEntry = cart.find((line) => line.id === dish.id);
  const soldOut = dish.portionsLeft <= 0;

  return (
    <article className="details">
      <button type="button" className="btn btn-link" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="details-layout">
        <DishImage src={dish.image} alt={dish.imageAlt} name={dish.name} />
        <div>
          <p className="eyebrow">{dish.category}</p>
          <h1>{dish.name}</h1>
          <p className="price price-large">{formatPrice(dish.price)}</p>
          <AvailabilityBadge portionsLeft={dish.portionsLeft} />
          <p>{dish.description}</p>
          <DietaryInfo dietary={dish.dietary} allergens={dish.allergens} />

          {dish.groupOnly && (
            <p className="notice">
              This platter is only available for bookings of <strong>{FEAST_MIN_GUESTS} or more guests</strong>.
            </p>
          )}

          <div className="details-actions">
            {quantity === 0 ? (
              <button type="button" className="btn btn-primary btn-large" onClick={() => onAdd(dish.id)} disabled={soldOut}>
                {soldOut ? 'Sold out today' : `Add to order — ${formatPrice(dish.price)}`}
              </button>
            ) : (
              <>
                <p className="selected-note">✓ In your order</p>
                <QuantityControl
                  name={dish.name}
                  quantity={quantity}
                  portionsLeft={dish.portionsLeft}
                  onChange={(newQuantity) => onSetQuantity(dish.id, newQuantity)}
                />
                {dish.hasSpiceLevel && (
                  <div className="field">
                    <label htmlFor="spice">Spice level</label>
                    <select id="spice" value={cartEntry.spice} onChange={(event) => onChangeSpice(dish.id, event.target.value)}>
                      {SPICE_LEVELS.map((level) => (
                        <option key={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                )}
                <Link to="/order" className="btn btn-primary">
                  Review order
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default DishDetailsPage;
