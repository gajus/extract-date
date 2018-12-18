// @flow

import test, {
  afterEach,
  beforeEach
} from 'ava';
import sinon from 'sinon';
import extractDate from '../../src/extractDate';

let clock;

beforeEach(() => {
  clock = sinon.useFakeTimers();
});

afterEach(() => {
  clock.restore();
});

test('throws an error if invalid `locale` is provided', (t) => {
  t.throws(() => {
    extractDate('foo', {
      locale: 'bar'
    });
  }, 'No translation available for the target locale.');
});

test('throws an error if invalid `timezone` is provided', (t) => {
  t.throws(() => {
    extractDate('foo', {
      timezone: 'bar'
    });
  }, 'Unrecognized timezone.');
});

test('throws an error if invalid `maximumAge` is a negative value', (t) => {
  t.throws(() => {
    extractDate('foo', {
      maximumAge: -1
    });
  }, '`maximumAge` must be a positive number.');
});

test('throws an error if invalid `minimumAge` is a negative value', (t) => {
  t.throws(() => {
    extractDate('foo', {
      minimumAge: -1
    });
  }, '`minimumAge` must be a positive number.');
});
