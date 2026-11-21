import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkMinimumOrder, MIN_ORDER_TOTAL } from '../src/rules/orderRules.js';

test('valid: an order above the minimum is accepted', () => {
  const result = checkMinimumOrder(2400);
  assert.equal(result.ok, true);
  assert.equal(result.shortBy, 0);
});

test('boundary: an order of exactly Rs 1,500 is accepted', () => {
  const result = checkMinimumOrder(MIN_ORDER_TOTAL);
  assert.equal(MIN_ORDER_TOTAL, 1500);
  assert.equal(result.ok, true);
});

test('invalid: Rs 1,499 is rejected and reports Rs 1 short', () => {
  const result = checkMinimumOrder(1499);
  assert.equal(result.ok, false);
  assert.equal(result.shortBy, 1);
  assert.match(result.message, /Rs 1 more/);
});

test('invalid: an empty order (Rs 0) is rejected', () => {
  const result = checkMinimumOrder(0);
  assert.equal(result.ok, false);
  assert.equal(result.shortBy, 1500);
});
