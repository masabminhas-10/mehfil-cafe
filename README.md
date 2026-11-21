# Mehfil Café — Pre-order & Book a Table


A React website for a fictional desi café in Clifton, Karachi. Customers browse today's menu, search and filter dishes, see dietary and allergen info, build a pre-order, enter booking details, and get a confirmation. The design addresses three problems found on https://www.dishoom.com/ (see `DECISIONS.md`).


## Setup and commands

Requires Node.js 20 or newer.

```bash
npm install       # install dependencies
npm run dev       # start the development server (http://localhost:5173)
npm run build     # production build into dist/
npm run preview   # serve the production build
npm test          # run the business-rule test (node --test)
```

## Routes

| Route | Purpose |
|---|---|
| `/` | Home: intro, booking rules, how it works |
| `/menu` | Menu with search, category filter, dietary filter, sort (saved in the URL) |
| `/menu/:dishId` | Dish details, quantity and spice level (invalid IDs show "Dish not found") |
| `/order` | Your order: change quantities and spice, remove, summary, rule checks |
| `/checkout` | Booking form (name, mobile, date, time, guests, notes) and final checks |
| `/confirmation` | Simulated booking confirmation |
| `/demo` | Demo settings for testing edge cases |
| `*` | Page not found |

## Features

- 14 local dishes with stable IDs, loaded through an async mock loader (`loadMenu`) with loading, error and retry states.
- Search across name, description and category; category and dietary filters; four sort options. All of them work together.
- Pre-order cart shared across all pages, saved in `localStorage`, and checked against the current menu when it is restored.
- Controlled booking form with five validated fields. Errors are specific, focus moves to the first invalid field, and valid answers are kept.
- Calculated summary: item count, subtotal, per-guest cost, amount still needed for the minimum.
- Three business rules:
  1. **Portions left (availability):** you can't order more than the portions left today. Sold-out dishes can't be added.
  2. **Feast platters (eligibility):** only for bookings of 4 or more guests.
  3. **Minimum pre-order (pricing):** at least Rs 1,500.

  The guest count must also be 1–8.

## Reproducing edge cases

Open **Demo settings** (link in the footer, or `/demo`):

| Edge case | How to reproduce |
|---|---|
| Loading failure + retry | Tick "Loading failure" → open Menu → error with **Try again**. Untick, then press Try again. |
| Empty dataset | Tick "Empty menu" → Menu shows "No dishes published yet". |
| No search matches | On Menu, search `pizza` → "No dishes match your search" + **Clear search and filters**. |
| Changed availability of a saved order | Add 2 × Chicken Karahi and 1 × Beef Seekh Kabab → tick "Changed availability" → open Your order → conflict notice with **Change to 1** / **Remove**. Checkout is blocked until the conflicts are fixed. |
| Invalid URL / dish ID | Visit `/menu/abc` or `/anything`. |
| Missing image | Roghni Naan has no image, so it shows "Photo coming soon". It also has a very long description. |
| Invalid form input | On Checkout, press Confirm with empty fields, or enter phone `12345`. |
| Rule boundaries | Feast with 3 guests (blocked) vs 4 (allowed); order of Rs 1,450 (blocked) vs Rs 1,500 (allowed); Paneer Makhani has 3 portions, so the + button stops at 3. |

## Simulated operations and limitations

- Bookings are **simulated**. Nothing is sent to a server, no table is reserved, and no payment is taken. The phone number is not saved.
- Menu data and stock levels are local. Stock doesn't go down after a booking.
- Time slots don't check whether a slot is already in the past on today's date.
- Only the latest booking is kept, in `localStorage`.

## Concept map

| Concept | File | Component / function |
|---|---|---|
| Components, imports/exports | `src/components/*`, `src/pages/*` | e.g. `MenuCard`, `QuantityControl` |
| Props | `src/pages/MenuPage.jsx` | passes `dish`, `quantity` to `MenuCard` |
| Callback props | `src/App.jsx` → `MenuCard.jsx` | `onAdd`, `onSetQuantity` |
| useState / controlled inputs | `src/pages/CheckoutPage.jsx` | `form` state + `handleChange` |
| Functional updates | `src/App.jsx` | `setCart((prevCart) => ...)` |
| Immutable object update | `src/pages/CheckoutPage.jsx` | `{ ...prevForm, [name]: value }` |
| Immutable array add/remove/update | `src/App.jsx` | `setQuantity` (spread, `filter`, `map`) |
| Lists and keys | `src/pages/MenuPage.jsx` | `results.map(dish => <MenuCard key={dish.id} />)` |
| Conditional rendering | `src/components/LoadState.jsx`, `MenuPage.jsx` | loading / error / empty states |
| Shared state | `src/App.jsx` | `menu`, `cart`, `lastBooking` |
| Derived values | `src/utils/cartHelpers.js` | `getSubtotal`, `findCartConflicts` |
| useEffect + dependencies + cleanup | `src/App.jsx` | menu loading effect with `ignore` flag |
| Async code + failure handling | `src/services/menuLoader.js`, `App.jsx` | `loadMenu` (Promise), `async/await` with `try/catch` |
| localStorage | `src/utils/storage.js`, `App.jsx` | `readStorage`, `writeStorage` |
| Routing, URL params | `src/App.jsx`, `DishDetailsPage.jsx` | `<Routes>`, `useParams`, `useSearchParams` |
| Event handling / preventDefault | `src/pages/CheckoutPage.jsx` | `handleSubmit` |
| Business rules | `src/rules/orderRules.js` | `checkPortions`, `checkFeastEligibility`, `checkMinimumOrder` |
| Validation | `src/rules/validateBooking.js` | `validateBooking` |
| Automated test | `tests/orderRules.test.js` | tests `checkMinimumOrder` |

## Deployment note

For hosts like Netlify, add a SPA redirect so nested routes work on refresh: `public/_redirects` containing `/*  /index.html  200`. For Vercel, use a `vercel.json` rewrite to `/index.html`.
