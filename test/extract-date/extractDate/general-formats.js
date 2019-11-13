// @flow

import test, {
  afterEach,
  beforeEach,
} from 'ava';
import sinon from 'sinon';
import {
  format as formatDate,
  parse as parseDate,
} from 'date-fns';
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
    clock.tick(parseDate('2000-06-01', 'yyyy-MM-dd', new Date()).getTime());

    const currentDate = new Date();

    return {
      date: formatDate(currentDate, 'yyyy-MM-dd'),
      dateFnsFormat: format.dateFnsFormat,
      direction: format.direction,
      input: formatDate(currentDate, format.dateFnsFormat),
    };
  });

for (const subject of subjects) {
  // eslint-disable-next-line no-loop-func
  test('extracts ' + subject.dateFnsFormat + ' from "' + subject.input + '" input using ' + describeConfiguration(subject) + ' configuration', (t) => {
    clock.tick(parseDate('2000-06-01', 'yyyy-MM-dd', new Date()).getTime());

    const actual = extractDate(subject.input, subject);
    const expected = subject.date;

    t.is(actual.length, 1);
    t.is(actual[0].date, expected);
  });
}
