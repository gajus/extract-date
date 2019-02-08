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

test('parses ISO 8601 date-time format', (t) => {
  clock.tick(moment('2000-01-01').valueOf());

  t.deepEqual(extractDate('2000-01-01T00:00'), [{date: '2000-01-01'}]);
});
