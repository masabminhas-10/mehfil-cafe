
export const MIN_ORDER_TOTAL = 1500; 
export const MIN_GUESTS = 1;
export const MAX_GUESTS = 8;
export const FEAST_MIN_GUESTS = 4; 

export function checkPortions(quantity, portionsLeft) {
  if (portionsLeft <= 0) {
    return { ok: false, message: 'Sold out for today.' };
  }
  if (quantity > portionsLeft) {
    return {
      ok: false,
      message: `Only ${portionsLeft} portion${portionsLeft === 1 ? '' : 's'} left today.`,
    };
  }
  return { ok: true, message: '' };
}

export function checkFeastEligibility(orderLines, guests) {
  const feastNames = orderLines
    .filter((line) => line.item.groupOnly)
    .map((line) => line.item.name);

  if (feastNames.length > 0 && guests < FEAST_MIN_GUESTS) {
    return {
      ok: false,
      message: `${feastNames.join(', ')} ${feastNames.length === 1 ? 'needs' : 'need'} a booking of at least ${FEAST_MIN_GUESTS} guests.`,
    };
  }
  return { ok: true, message: '' };
}

export function checkMinimumOrder(subtotal) {
  if (subtotal < MIN_ORDER_TOTAL) {
    const shortBy = MIN_ORDER_TOTAL - subtotal;
    return {
      ok: false,
      shortBy,
      message: `Add Rs ${shortBy.toLocaleString()} more to reach the Rs ${MIN_ORDER_TOTAL.toLocaleString()} minimum.`,
    };
  }
  return { ok: true, shortBy: 0, message: '' };
}
