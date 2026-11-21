import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import OrderBar from './components/OrderBar.jsx';
import HomePage from './pages/HomePage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import DishDetailsPage from './pages/DishDetailsPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import ConfirmationPage from './pages/ConfirmationPage.jsx';
import DemoSettingsPage from './pages/DemoSettingsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

import { loadMenu } from './services/menuLoader.js';
import { checkPortions } from './rules/orderRules.js';
import { readStorage, writeStorage, CART_KEY, DEMO_KEY, BOOKING_KEY } from './utils/storage.js';
import { buildOrderLines, findCartConflicts, getItemCount, getSubtotal } from './utils/cartHelpers.js';

const DEFAULT_DEMO = { failLoading: false, emptyMenu: false, lowStock: false };

function App() {
  const [menu, setMenu] = useState([]);
  const [status, setStatus] = useState('loading');
  const [loadError, setLoadError] = useState('');
  const [reloadCount, setReloadCount] = useState(0);

  // Lazy initial state: read localStorage only once, on first render
  const [cart, setCart] = useState(() => readStorage(CART_KEY, []));
  const [demoSettings, setDemoSettings] = useState(() => readStorage(DEMO_KEY, DEFAULT_DEMO));
  const [lastBooking, setLastBooking] = useState(() => readStorage(BOOKING_KEY, null));


  useEffect(() => {
    let ignore = false;

    async function fetchMenu() {
      setStatus('loading');
      try {
        const items = await loadMenu(demoSettings);
        if (!ignore) {
          setMenu(items);
          setStatus('ready');
        }
      } catch (error) {
        if (!ignore) {
          setLoadError(error.message);
          setStatus('error');
        }
      }
    }

    fetchMenu();
    return () => {
      ignore = true;
    };
  }, [demoSettings, reloadCount]);

  useEffect(() => writeStorage(CART_KEY, cart), [cart]);
  useEffect(() => writeStorage(DEMO_KEY, demoSettings), [demoSettings]);
  useEffect(() => writeStorage(BOOKING_KEY, lastBooking), [lastBooking]);

  const orderLines = buildOrderLines(cart, menu);
  const subtotal = getSubtotal(orderLines);
  const itemCount = getItemCount(cart);
  const conflicts = status === 'ready' ? findCartConflicts(cart, menu) : [];


  function getQuantity(id) {
    const entry = cart.find((line) => line.id === id);
    return entry ? entry.quantity : 0;
  }

  function setQuantity(id, newQuantity) {
    const item = menu.find((dish) => dish.id === id);
    if (!item) return;


    if (newQuantity > 0 && !checkPortions(newQuantity, item.portionsLeft).ok) return;

    setCart((prevCart) => {
      if (newQuantity <= 0) {
        return prevCart.filter((line) => line.id !== id); // remove
      }
      const exists = prevCart.some((line) => line.id === id);
      if (exists) {
        return prevCart.map((line) => (line.id === id ? { ...line, quantity: newQuantity } : line)); // update
      }
      return [...prevCart, { id, quantity: newQuantity, spice: 'Medium' }]; // add
    });
  }

  function addToCart(id) {
    setQuantity(id, getQuantity(id) + 1);
  }

  function removeFromCart(id) {
    setCart((prevCart) => prevCart.filter((line) => line.id !== id));
  }

  function changeSpice(id, spice) {
    setCart((prevCart) => prevCart.map((line) => (line.id === id ? { ...line, spice } : line)));
  }


  function fixConflict(id, fixQuantity) {
    if (fixQuantity <= 0) {
      removeFromCart(id);
    } else {
      setCart((prevCart) =>
        prevCart.map((line) => (line.id === id ? { ...line, quantity: fixQuantity } : line)),
      );
    }
  }

  function completeBooking(booking) {
    setLastBooking(booking);
    setCart([]);
  }

  function retryLoading() {
    setReloadCount((count) => count + 1);
  }


  const menuProps = { menu, status, loadError, onRetry: retryLoading };
  const cartProps = { getQuantity, onAdd: addToCart, onSetQuantity: setQuantity };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header itemCount={itemCount} />
      <main id="main" className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage {...menuProps} {...cartProps} />} />
          <Route
            path="/menu/:dishId"
            element={<DishDetailsPage {...menuProps} {...cartProps} cart={cart} onChangeSpice={changeSpice} />}
          />
          <Route
            path="/order"
            element={
              <CartPage
                {...menuProps}
                orderLines={orderLines}
                subtotal={subtotal}
                itemCount={itemCount}
                conflicts={conflicts}
                onSetQuantity={setQuantity}
                onRemove={removeFromCart}
                onChangeSpice={changeSpice}
                onFixConflict={fixConflict}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                {...menuProps}
                orderLines={orderLines}
                subtotal={subtotal}
                itemCount={itemCount}
                conflicts={conflicts}
                onFixConflict={fixConflict}
                onComplete={completeBooking}
              />
            }
          />
          <Route path="/confirmation" element={<ConfirmationPage booking={lastBooking} />} />
          <Route
            path="/demo"
            element={<DemoSettingsPage settings={demoSettings} onChange={setDemoSettings} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <OrderBar itemCount={itemCount} subtotal={subtotal} />
      <Footer />
    </>
  );
}

export default App;
