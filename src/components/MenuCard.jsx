import { Link } from 'react-router-dom';
import DishImage from './DishImage.jsx';
import DietaryInfo from './DietaryInfo.jsx';
import AvailabilityBadge from './AvailabilityBadge.jsx';
import QuantityControl from './QuantityControl.jsx';
import { formatPrice } from '../utils/cartHelpers.js';
import { FEAST_MIN_GUESTS } from '../rules/orderRules.js';


function MenuCard({ dish, quantity, onAdd, onSetQuantity }) {
  const soldOut = dish.portionsLeft <= 0;

  return (
    <li className={`menu-card ${quantity > 0 ? 'is-selected' : ''} ${soldOut ? 'is-unavailable' : ''}`}>
      <DishImage src={dish.image} alt={dish.imageAlt} name={dish.name} />
      <div className="menu-card-body">
        <div className="card-title-row">
          <h3>{dish.name}</h3>
          <span className="price">{formatPrice(dish.price)}</span>
        </div>
        <AvailabilityBadge portionsLeft={dish.portionsLeft} />
        {dish.groupOnly && <span className="badge badge-group">For {FEAST_MIN_GUESTS}+ guests</span>}
        <p className="description">{dish.description}</p>
        <DietaryInfo dietary={dish.dietary} allergens={dish.allergens} />

        <div className="card-actions">
          {quantity === 0 ? (
            <button type="button" className="btn btn-primary" onClick={() => onAdd(dish.id)} disabled={soldOut}>
              {soldOut ? 'Sold out' : `Add ${dish.name}`}
            </button>
          ) : (
            <QuantityControl
              name={dish.name}
              quantity={quantity}
              portionsLeft={dish.portionsLeft}
              onChange={(newQuantity) => onSetQuantity(dish.id, newQuantity)}
            />
          )}
          <Link to={`/menu/${dish.id}`} className="btn btn-secondary">
            Details<span className="visually-hidden"> for {dish.name}</span>
          </Link>
        </div>
        {quantity > 0 && <p className="selected-note">✓ In your order</p>}
      </div>
    </li>
  );
}

export default MenuCard;
