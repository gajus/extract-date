// @flow

import test from 'ava';
import cartesian from 'cartesian';
import calculateSpecificity from '../../src/calculateSpecificity';

test('tokens including YYYY, (MMMM, MM, MM, M), (DD, D, Do) have the highest specificity', (t) => {
  const formats = cartesian([
    [
      'YYYY',
    ],
    [
      'MMMM',
      'MMM',
      'MM',
      'M',
    ],
    [
      'DD',
      'D',
      'Do',
    ],
  ]);

  for (const tokens of formats) {
    const format = tokens.join(' ');

    t.true(calculateSpecificity(format) === 80 + format.length);
  }
});

test('tokens without year, month or month date have the lowest specificity', (t) => {
  const formats = [
    'dddd',
    'ddd',
    'R',
  ];

  for (const format of formats) {
    t.true(calculateSpecificity(format) === format.length);
  }
});

test('adds format length to the specificity', (t) => {
  t.true(calculateSpecificity('xxxx') === 4);
  t.true(calculateSpecificity('xx') === 2);
});
