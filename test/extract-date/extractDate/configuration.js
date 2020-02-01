// @flow

import test, {
  afterEach,
  beforeEach,
} from 'ava';
import sinon from 'sinon';
import extractDate from '../../../src/extractDate';

let clock;

beforeEach(() => {
  clock = sinon.useFakeTimers();
});

afterEach(() => {
  clock.restore();
});

test('throws an error if invalid `locale` is provided', (t) => {
  const error = t.throws(() => {
    extractDate('foo', {
      locale: 'bar',
    });
  });

  t.is(error.message, 'No translation available for the target locale (date-fns).');
});

test('throws an error if invalid `timezone` is provided', (t) => {
  const error = t.throws(() => {
    extractDate('foo', {
      timezone: 'bar',
    });
  });

  t.is(error.message, 'Unrecognized timezone.');
});

test('throws an error if invalid `maximumAge` is a negative value', (t) => {
  const error = t.throws(() => {
    extractDate('foo', {
      maximumAge: -1,
    });
  });

  t.is(error.message, '`maximumAge` must be a positive number.');
});

test('throws an error if invalid `minimumAge` is a negative value', (t) => {
  const error = t.throws(() => {
    extractDate('foo', {
      minimumAge: -1,
    });
  });

  t.is(error.message, '`minimumAge` must be a positive number.');
});
