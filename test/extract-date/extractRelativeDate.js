// @flow

import test, {
  afterEach,
  beforeEach
} from 'ava';
import sinon from 'sinon';
import moment from 'moment';
import extractRelativeDate from '../../src/extractRelativeDate';

let clock;

beforeEach(() => {
  clock = sinon.useFakeTimers();
});

afterEach(() => {
  clock.restore();
});

test('extracts relative date (yesterday)', (t) => {
  clock.tick(moment('2018-07-08').valueOf());

  t.true(extractRelativeDate('yesterday', 'en', 'Europe/London') === '2018-07-07');
});

test('extracts relative date (today)', (t) => {
  clock.tick(moment('2018-07-08').valueOf());

  t.true(extractRelativeDate('today', 'en', 'Europe/London') === '2018-07-08');
});

test('extracts relative date (tomorrow)', (t) => {
  clock.tick(moment('2018-07-08').valueOf());

  t.true(extractRelativeDate('tomorrow', 'en', 'Europe/London') === '2018-07-09');
});

test('supports different locales', (t) => {
  clock.tick(moment('2018-07-08').valueOf());

  t.true(extractRelativeDate('rytoj', 'lt', 'Europe/London') === '2018-07-09');
});

test('returns null when date cannot be recognized', (t) => {
  clock.tick(moment('2018-07-08').valueOf());

  t.true(extractRelativeDate('foo', 'en', 'Europe/London') === null);
});
