// @flow

import test, {
  afterEach,
  beforeEach
} from 'ava';
import sinon from 'sinon';
import moment from 'moment';
import extractDate from '../../../src/extractDate';
import createFormats from '../../../src/createFormats';

let clock;

beforeEach(() => {
  clock = sinon.useFakeTimers();
});

afterEach(() => {
  clock.restore();
});

// https://en.wikipedia.org/wiki/Date_format_by_country
// %w arbitrary white-space separated text

const describeConfiguration = (userConfiguration) => {
  const configuration = {};

  if (userConfiguration.direction) {
    configuration.direction = userConfiguration.direction;
  }

  return JSON.stringify(configuration);
};

const formats = createFormats();

const subjects = formats
  .filter((format) => {
    return format.test !== false;
  })
  .map((format) => {
    clock = sinon.useFakeTimers();
    clock.tick(moment('2000-06-01').valueOf());

    const currentDate = moment();

    return {
      date: currentDate.format('YYYY-MM-DD'),
      direction: format.direction,
      input: currentDate.format(format.momentFormat),
      momentFormat: format.momentFormat
    };
  });

for (const subject of subjects) {
  // eslint-disable-next-line no-loop-func
  test('extracts ' + subject.momentFormat + ' from "' + subject.momentFormat + '" input using ' + describeConfiguration(subject) + ' configuration', (t) => {
    clock.tick(moment('2000-06-01').valueOf());

    const actual = extractDate(subject.input, subject);
    const expected = subject.date;

    t.is(actual, expected);
  });

  // eslint-disable-next-line no-loop-func
  test('extracts ' + subject.momentFormat + ' from "%w' + subject.momentFormat + '%w" input using ' + describeConfiguration(subject) + ' configuration', (t) => {
    clock.tick(moment('2000-06-01').valueOf());

    const actual = extractDate('foo ' + subject.input + ' bar', subject);
    const expected = subject.date;

    t.is(actual, expected);
  });
}
