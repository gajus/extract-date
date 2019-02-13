// @flow

import test from 'ava';
import normalizeInput from '../../src/normalizeInput';

test('splits YYYY-MM-DDTHH:mm', (t) => {
  t.true(normalizeInput('2018-01-01T14:00 2018-01-02T15:00') === '2018-01-01 14:00 2018-01-02 15:00');
});

test('removes spaces between date-like fragments separated by /', (t) => {
  t.true(normalizeInput('10 / 20 / 30') === '10/20/30');
});

test('removes repeating white space', (t) => {
  t.true(normalizeInput('foo    bar  baz') === 'foo bar baz');
});

test('trims white space', (t) => {
  t.true(normalizeInput('  foo  ') === 'foo');
});
