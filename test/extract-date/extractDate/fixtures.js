// @flow

import test from 'ava';
import sinon from 'sinon';
import {
  parse as parseDate,
} from 'date-fns';
import fixtureDates from '../../fixtures/dates.json';
import extractDate from '../../../src/extractDate';

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
    const clock = sinon.useFakeTimers();

    clock.restore();
    clock.tick(parseDate(fixtureDate.date, 'yyyy-MM-dd', new Date()).getTime());

    t.deepEqual(extractDate(fixtureDate.subject, fixtureDate.configuration), fixtureDate.matches);
  });
}
