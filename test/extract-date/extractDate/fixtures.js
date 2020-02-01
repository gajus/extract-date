// @flow

import test, {
  afterEach,
  beforeEach,
} from 'ava';
import sinon from 'sinon';
import {
  parse as parseDate,
} from 'date-fns';
import fixtureDates from '../../fixtures/dates.json';
import extractDate from '../../../src/extractDate';

beforeEach((t) => {
  t.context.clock = sinon.useFakeTimers();
});

afterEach((t) => {
  t.context.clock.restore();
});

const normalizedFixtureDates = fixtureDates
  .map((fixture) => {
    return {
      ...fixture,
      subject: fixture.subject.trim(),
    };
  })
  .map((fixture) => {
    return JSON.stringify(fixture);
  })
  .filter((fixture, index, self) => {
    return self.indexOf(fixture) === index;
  })
  .map((fixture) => {
    return JSON.parse(fixture);
  })
  .map((fixture) => {
    return {
      ...fixture,
      configuration: {
        ...fixture.configuration,
        maximumAge: Infinity,
        minimumAge: Infinity,
      },
    };
  });

for (const fixtureDate of normalizedFixtureDates) {
  test('extracts dates from "' + fixtureDate.subject + '" fixture using ' + JSON.stringify(fixtureDate.configuration) + ' configuration on ' + fixtureDate.date + ' date', (t) => {
    t.context.clock.tick(parseDate(fixtureDate.date, 'yyyy-MM-dd', new Date()).getTime());

    t.deepEqual(extractDate(fixtureDate.subject, fixtureDate.configuration), fixtureDate.matches);
  });
}
