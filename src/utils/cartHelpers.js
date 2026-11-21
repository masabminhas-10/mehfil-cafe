
import { checkPortions } from '../rules/orderRules.js';

export function formatPrice(amount) {
  return `Rs ${amount.toLocaleString()}`;
}


export function buildOrderLines(cart, menu) {
  return cart
    .map((entry) => ({ ...entry, item: menu.find((dish) => dish.id === entry.id) }))
    .filter((line) => line.item !== undefined);
}

export function getSubtotal(orderLines) {
  return orderLines.reduce((total, line) => total + line.item.price * line.quantity, 0);
}

export function getItemCount(cart) {
  return cart.reduce((count, entry) => count + entry.quantity, 0);
}

export function findCartConflicts(cart, menu) {
  const conflicts = [];

  cart.forEach((entry) => {
    const item = menu.find((dish) => dish.id === entry.id);

    if (!item) {
      conflicts.push({ id: entry.id, name: entry.id, message: 'is no longer on the menu.', fixQuantity: 0 });
      return;
    }

    const result = checkPortions(entry.quantity, item.portionsLeft);
    if (!result.ok) {
      conflicts.push({
        id: entry.id,
        name: item.name,
        message:
          item.portionsLeft <= 0
            ? `is sold out today (you had ${entry.quantity}).`
            : `— you have ${entry.quantity}, but only ${item.portionsLeft} left today.`,
        fixQuantity: item.portionsLeft, 
      });
    }
  });

  return conflicts;
}
