// @flow

import test, {
  afterEach,
  beforeEach
} from 'ava';
import sinon from 'sinon';
import moment from 'moment';
import extractDate from '../../../src/extractDate';

let clock;

beforeEach(() => {
  clock = sinon.useFakeTimers();
});

afterEach(() => {
  clock.restore();
});

test('does not extract relative dates when locale is undefined', (t) => {
  clock.tick(moment('2000-01-01').valueOf());

  const configuration = {
    timezone: 'Europe/London'
  };

  t.deepEqual(extractDate('today', configuration), []);
});

test('does not extract relative dates when timezone is undefined', (t) => {
  clock.tick(moment('2000-01-01').valueOf());

  const configuration = {
    locale: 'en'
  };

  t.deepEqual(extractDate('today', configuration), []);
});

test('extracts relative date (yesterday)', (t) => {
  clock.tick(moment('2000-01-02').valueOf());

  const configuration = {
    locale: 'en',
    timezone: 'Europe/London'
  };

  t.deepEqual(extractDate('yesterday', configuration), [{date: '2000-01-01'}]);
});

test('extracts relative date (today)', (t) => {
  clock.tick(moment('2000-01-01').valueOf());

  const configuration = {
    locale: 'en',
    timezone: 'Europe/London'
  };

  t.deepEqual(extractDate('today', configuration), [{date: '2000-01-01'}]);
});

test('extracts relative date (tomorrow)', (t) => {
  clock.tick(moment('2000-01-01').valueOf());

  const configuration = {
    locale: 'en',
    timezone: 'Europe/London'
  };

  t.deepEqual(extractDate('tomorrow', configuration), [{date: '2000-01-02'}]);
});
