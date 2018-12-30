// @flow

import test, {
  afterEach,
  beforeEach
} from 'ava';
import sinon from 'sinon';
import moment from 'moment';
import extractDate from '../../src/extractDate';

let clock;

beforeEach(() => {
  clock = sinon.useFakeTimers();
});

afterEach(() => {
  clock.restore();
});

test('assumes last year if month difference is greater or equal to `maximumAge`', (t) => {
  clock.tick(moment('2000-01-01').valueOf());

  const configuration = {
    direction: 'MD',
    maximumAge: 10
  };

  t.is(extractDate('01-01', configuration), '2000-01-01');
  t.is(extractDate('02-01', configuration), '2000-02-01');
  t.is(extractDate('03-01', configuration), '2000-03-01');
  t.is(extractDate('04-01', configuration), '2000-04-01');
  t.is(extractDate('05-01', configuration), '2000-05-01');
  t.is(extractDate('06-01', configuration), '2000-06-01');
  t.is(extractDate('07-01', configuration), '2000-07-01');
  t.is(extractDate('08-01', configuration), '2000-08-01');
  t.is(extractDate('09-01', configuration), '2000-09-01');
  t.is(extractDate('10-01', configuration), '2000-10-01');

  t.is(extractDate('11-01', configuration), '1999-11-01');
  t.is(extractDate('12-01', configuration), '1999-12-01');
});

test('does not assume last year when `maximumAge` is `Infinity`', (t) => {
  clock.tick(moment('2000-01-01').valueOf());

  const configuration = {
    direction: 'MD',
    maximumAge: Infinity
  };

  t.is(extractDate('01-01', configuration), '2000-01-01');
  t.is(extractDate('02-01', configuration), '2000-02-01');
  t.is(extractDate('03-01', configuration), '2000-03-01');
  t.is(extractDate('04-01', configuration), '2000-04-01');
  t.is(extractDate('05-01', configuration), '2000-05-01');
  t.is(extractDate('06-01', configuration), '2000-06-01');
  t.is(extractDate('07-01', configuration), '2000-07-01');
  t.is(extractDate('08-01', configuration), '2000-08-01');
  t.is(extractDate('09-01', configuration), '2000-09-01');
  t.is(extractDate('10-01', configuration), '2000-10-01');
  t.is(extractDate('11-01', configuration), '2000-11-01');
  t.is(extractDate('12-01', configuration), '2000-12-01');
});

test('increments year value if month difference is greater or equal to `minimumAge`', (t) => {
  clock.tick(moment('2000-12-01').valueOf());

  const configuration = {
    direction: 'MD',
    minimumAge: 2
  };

  t.is(extractDate('01-01', configuration), '2001-01-01');
  t.is(extractDate('02-01', configuration), '2001-02-01');
  t.is(extractDate('03-01', configuration), '2001-03-01');
  t.is(extractDate('04-01', configuration), '2001-04-01');
  t.is(extractDate('05-01', configuration), '2001-05-01');
  t.is(extractDate('06-01', configuration), '2001-06-01');
  t.is(extractDate('07-01', configuration), '2001-07-01');
  t.is(extractDate('08-01', configuration), '2001-08-01');
  t.is(extractDate('09-01', configuration), '2001-09-01');
  t.is(extractDate('10-01', configuration), '2001-10-01');

  t.is(extractDate('11-01', configuration), '2000-11-01');
  t.is(extractDate('12-01', configuration), '2000-12-01');
});

test('does not increment year value if `minimumAge` is `Infinity`', (t) => {
  clock.tick(moment('2000-12-01').valueOf());

  const configuration = {
    direction: 'MD',
    minimumAge: Infinity
  };

  t.is(extractDate('01-01', configuration), '2000-01-01');
  t.is(extractDate('02-01', configuration), '2000-02-01');
  t.is(extractDate('03-01', configuration), '2000-03-01');
  t.is(extractDate('04-01', configuration), '2000-04-01');
  t.is(extractDate('05-01', configuration), '2000-05-01');
  t.is(extractDate('06-01', configuration), '2000-06-01');
  t.is(extractDate('07-01', configuration), '2000-07-01');
  t.is(extractDate('08-01', configuration), '2000-08-01');
  t.is(extractDate('09-01', configuration), '2000-09-01');
  t.is(extractDate('10-01', configuration), '2000-10-01');
  t.is(extractDate('11-01', configuration), '2000-11-01');
  t.is(extractDate('12-01', configuration), '2000-12-01');
});

test('`maximumAge` and `minimumAge` can be combined', (t) => {
  clock.tick(moment('2000-06-01').valueOf());

  const configuration = {
    direction: 'MD',
    maximumAge: 2,
    minimumAge: 2
  };

  t.is(extractDate('01-01', configuration), '2001-01-01');
  t.is(extractDate('02-01', configuration), '2001-02-01');
  t.is(extractDate('03-01', configuration), '2001-03-01');
  t.is(extractDate('04-01', configuration), '2001-04-01');

  t.is(extractDate('05-01', configuration), '2000-05-01');
  t.is(extractDate('06-01', configuration), '2000-06-01');
  t.is(extractDate('07-01', configuration), '2000-07-01');

  t.is(extractDate('08-01', configuration), '1999-08-01');
  t.is(extractDate('09-01', configuration), '1999-09-01');
  t.is(extractDate('10-01', configuration), '1999-10-01');
  t.is(extractDate('11-01', configuration), '1999-11-01');
  t.is(extractDate('12-01', configuration), '1999-12-01');
});
