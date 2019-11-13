// @flow

import test from 'ava';
import cartesian from 'cartesian';
import calculateSpecificity from '../../src/calculateSpecificity';

test('tokens including yyyy, (MMMM, MM, MM, M), (dd, d, do) have the highest specificity', (t) => {
  const formats = cartesian([
    [
      'yyyy',
    ],
    [
      'MMMM',
      'MMM',
      'MM',
      'M',
    ],
    [
      'dd',
      'd',
      'do',
    ],
  ]);

  for (const tokens of formats) {
    const format = tokens.join(' ');

    t.is(calculateSpecificity(format), 80 + format.length);
  }
});

test('tokens without year, month or month date have the lowest specificity', (t) => {
  const formats = [
    'EEEE',
    'EEE',
    'R',
  ];

  for (const format of formats) {
    t.is(calculateSpecificity(format), format.length);
  }
});

test('adds format length to the specificity', (t) => {
  t.is(calculateSpecificity('xxxx'), 4);
  t.is(calculateSpecificity('xx'), 2);
});
