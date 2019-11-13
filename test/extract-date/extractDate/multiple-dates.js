// @flow

import test, {
  afterEach,
  beforeEach,
} from 'ava';
import sinon from 'sinon';
import {
  addDays,
  format as formatDate,
  parse as parseDate,
} from 'date-fns';
import extractDate from '../../../src/extractDate';

let clock;

beforeEach(() => {
  clock = sinon.useFakeTimers();
});

afterEach(() => {
  clock.restore();
});

test('extracts multiple dates', (t) => {
  clock.tick(parseDate('2000-06-01', 'yyyy-MM-dd', new Date()).valueOf());

  const actual = extractDate(formatDate(new Date(), 'yyyy-MM-dd') + ' ' + formatDate(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const expected = [
    {
      date: formatDate(new Date(), 'yyyy-MM-dd'),
    },
    {
      date: formatDate(addDays(new Date(), 1), 'yyyy-MM-dd'),
    },
  ];

  t.deepEqual(actual, expected);
});
