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

test('parses ISO 8601 date-time format', (t) => {
  clock.tick(parseDate('2000-01-02', 'yyyy-MM-dd', new Date()).getTime());

  t.deepEqual(extractDate('2000-01-02T00:00'), [{date: '2000-01-02'}]);
});

test('extracts date matching multiple formats once', (t) => {
  clock.tick(parseDate('2000-01-02', 'yyyy-MM-dd', new Date()).getTime());

  // 'foo bar' prefix is required to ensure that substring matching is correctly advancing.
  t.deepEqual(extractDate('foo bar 02/01/2000', {direction: 'DMY'}), [{date: '2000-01-02'}]);
});

test('full-year formats are used regardless of whether direction defines Y', (t) => {
  clock.tick(parseDate('2000-01-02', 'yyyy-MM-dd', new Date()).getTime());

  t.deepEqual(extractDate('02/01/2020', {direction: 'DM'}), [{date: '2020-01-02'}]);
});
