import { Link, useLocation } from 'react-router-dom';
import { formatPrice } from '../utils/cartHelpers.js';

function OrderBar({ itemCount, subtotal }) {
  const { pathname } = useLocation();
  const hiddenOn = ['/order', '/checkout', '/confirmation'];

  if (itemCount === 0 || hiddenOn.includes(pathname)) return null;

  return (
    <div className="order-bar">
      <span>
        {itemCount} item{itemCount === 1 ? '' : 's'} · {formatPrice(subtotal)}
      </span>
      <Link to="/order" className="btn btn-primary">
        Review order
      </Link>
    </div>
  );
}

export default OrderBar;
