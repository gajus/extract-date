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

test('extracts multiple dates', (t) => {
  clock.tick(moment('2000-06-01').valueOf());

  const actual = extractDate(moment().format('YYYY-MM-DD') + ' ' + moment().add(1, 'day').format('YYYY-MM-DD'));
  const expected = [
    {
      date: moment().format('YYYY-MM-DD')
    },
    {
      date: moment().add(1, 'day').format('YYYY-MM-DD')
    }
  ];

  t.deepEqual(actual, expected);
});
