

export const CART_KEY = 'mehfil-cart';
export const DEMO_KEY = 'mehfil-demo-settings';
export const BOOKING_KEY = 'mehfil-last-booking';

export function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {

  }
}
