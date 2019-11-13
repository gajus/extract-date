// @flow

import test, {
  afterEach,
  beforeEach,
} from 'ava';
import sinon from 'sinon';
import {
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

test('extracts a localised date (English)', (t) => {
  clock.tick(parseDate('2000-01-01', 'yyyy-MM-dd', new Date()).getTime());

  const configuration = {
    locale: 'en',
  };

  t.deepEqual(extractDate('May 1, 2017', configuration), [{date: '2017-05-01'}]);
});

test('extracts a localised date (French)', (t) => {
  clock.tick(parseDate('2000-01-01', 'yyyy-MM-dd', new Date()).getTime());

  const configuration = {
    locale: 'fr',
  };

  t.deepEqual(extractDate('Mai 1, 2017', configuration), [{date: '2017-05-01'}]);
});
