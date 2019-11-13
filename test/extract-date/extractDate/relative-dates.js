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

test('does not extract relative dates when locale is undefined', (t) => {
  clock.tick(parseDate('2000-01-01', 'yyyy-MM-dd', new Date()).getTime());

  const configuration = {
    timezone: 'Europe/London',
  };

  t.deepEqual(extractDate('today', configuration), []);
});

test('does not extract relative dates when timezone is undefined', (t) => {
  clock.tick(parseDate('2000-01-01', 'yyyy-MM-dd', new Date()).getTime());

  const configuration = {
    locale: 'en',
  };

  t.deepEqual(extractDate('today', configuration), []);
});

test('extracts relative date (yesterday)', (t) => {
  clock.tick(parseDate('2000-01-02', 'yyyy-MM-dd', new Date()).getTime());

  const configuration = {
    locale: 'en',
    timezone: 'Europe/London',
  };

  t.deepEqual(extractDate('yesterday', configuration), [{date: '2000-01-01'}]);
});

test('extracts relative date (today)', (t) => {
  clock.tick(parseDate('2000-01-01', 'yyyy-MM-dd', new Date()).getTime());

  const configuration = {
    locale: 'en',
    timezone: 'Europe/London',
  };

  t.deepEqual(extractDate('today', configuration), [{date: '2000-01-01'}]);
});

test('extracts relative date (tomorrow)', (t) => {
  clock.tick(parseDate('2000-01-01', 'yyyy-MM-dd', new Date()).getTime());

  const configuration = {
    locale: 'en',
    timezone: 'Europe/London',
  };

  t.deepEqual(extractDate('tomorrow', configuration), [{date: '2000-01-02'}]);
});
