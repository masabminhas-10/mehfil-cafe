
import { MIN_GUESTS, MAX_GUESTS } from './orderRules.js';

export const MAX_DAYS_AHEAD = 14;


export function todayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function lastBookableISO() {
  const d = new Date();
  d.setDate(d.getDate() + MAX_DAYS_AHEAD);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

export function validateBooking(form) {
  const errors = {};
  const name = form.name.trim();
  const guests = Number(form.guests);

  if (name.length < 2) {
    errors.name = 'Please enter your name (at least 2 letters).';
  }

  if (!/^03\d{9}$/.test(form.phone.trim())) {
    errors.phone = 'Enter an 11-digit mobile number starting with 03, e.g. 03001234567.';
  }

  if (!form.date) {
    errors.date = 'Choose a date for your visit.';
  } else if (form.date < todayISO()) {
    errors.date = 'This date has already passed. Choose today or a later date.';
  } else if (form.date > lastBookableISO()) {
    errors.date = `We take bookings up to ${MAX_DAYS_AHEAD} days ahead.`;
  }

  if (!form.time) {
    errors.time = 'Choose a time slot.';
  }

  if (!Number.isInteger(guests) || guests < MIN_GUESTS || guests > MAX_GUESTS) {
    errors.guests = `Guests must be a whole number from ${MIN_GUESTS} to ${MAX_GUESTS}.`;
  }

  return errors;
}
