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

test('extracts date matching multiple formats once', (t) => {
  clock.tick(moment('2019-02-08').valueOf());

  // 'foo bar' prefix is required to ensure that substring matching is correctly advancing.
  t.deepEqual(extractDate('foo bar 08/02/2019', {direction: 'DMY'}), [{date: '2019-02-08'}]);
});
