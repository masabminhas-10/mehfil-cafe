import { Link, NavLink } from 'react-router-dom';

// Site header. The order link shows a live item count from shared state.
function Header({ itemCount }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          Mehfil <span>Café</span>
        </Link>
        <nav aria-label="Main">
          <ul className="nav-list">
            <li>
              <NavLink to="/" end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/menu">Menu</NavLink>
            </li>
            <li>
              <NavLink to="/order">
                Your order <span className="count-badge">{itemCount}</span>
                <span className="visually-hidden"> items</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
