# Mehfil Café — Pre-order & Book a Table

A React website for a fictional desi café in Clifton, Karachi. Customers browse today's menu, search and filter dishes, see dietary and allergen information, build a pre-order, enter booking details, and receive a confirmation.

The design addresses three problems found on [Dishoom](https://www.dishoom.com/) (see `DECISIONS.md`).

## Setup and Commands

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
npm run build
npm run preview
npm test
```

## Routes

| Route | Purpose |
|---|---|
| `/` | Home page |
| `/menu` | Menu with search, category filter, dietary filter and sorting |
| `/menu/:dishId` | Dish details |
| `/order` | Shopping cart and order summary |
| `/checkout` | Booking form and validation |
| `/confirmation` | Simulated booking confirmation |
| `/demo` | Demo settings for testing edge cases |
| `*` | Page not found |

## Features

- 14 local dishes with stable IDs.
- Search by name, description and category.
- Category and dietary filters.
- Four sorting options.
- Shared pre-order cart saved in `localStorage`.
- Controlled booking form with validation.
- Calculated order summary.
- Loading, error and retry states.
- Automated business-rule tests.

## Business Rules

1. **Portion availability:** Customers cannot order more portions than are available.
2. **Feast platter eligibility:** Feast platters require at least 4 guests.
3. **Minimum pre-order:** The order must be at least Rs 1,500.
4. **Guest limit:** Bookings must have between 1 and 8 guests.

## Simulated Operations and Limitations

- Bookings are simulated. No actual table is reserved.
- No payment is processed.
- Menu data and stock levels are local.
- Stock does not decrease after booking.
- Only the latest booking is stored in `localStorage`.

## Testing

Run the automated tests using:

```bash
npm test
```

## Deployment

For Netlify, use a `public/_redirects` file:

```text
/* /index.html 200
```

For Vercel, use a `vercel.json` rewrite to `/index.html`.
