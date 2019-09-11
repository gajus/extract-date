// @flow

/* eslint-disable no-continue, no-negated-condition */

import moment from 'moment-timezone';
import dictionary from 'relative-date-names';
import createMovingChunks from './createMovingChunks';
import extractRelativeDate from './extractRelativeDate';
import createFormats from './createFormats';
import normalizeInput from './normalizeInput';
import Logger from './Logger';
import type {
  ConfigurationType,
  DateMatchType,
  UserConfigurationType,
} from './types';

const log = Logger.child({
  namespace: 'extractDate',
});

const defaultConfiguration = {
  maximumAge: Infinity,
  minimumAge: Infinity,
};

// eslint-disable-next-line complexity
export default (input: string, userConfiguration: UserConfigurationType = defaultConfiguration): $ReadOnlyArray<DateMatchType> => {
  log.debug('attempting to extract date from "%s" input', input);

  const normalizedInput = normalizeInput(input);

  log.debug('normalized input to "%s"', normalizedInput);

  const configuration: ConfigurationType = {
    ...defaultConfiguration,
    ...userConfiguration,
  };

  if (configuration.locale && !dictionary[configuration.locale]) {
    throw new Error('No translation available for the target locale.');
  }

  if (configuration.timezone && !moment.tz.zone(configuration.timezone)) {
    throw new Error('Unrecognized timezone.');
  }

  if (configuration.maximumAge && configuration.maximumAge < 0) {
    throw new Error('`maximumAge` must be a positive number.');
  }

  if (configuration.minimumAge && configuration.minimumAge < 0) {
    throw new Error('`minimumAge` must be a positive number.');
  }

  log.debug({
    configuration,
  }, 'attempting to extract date from "%s" input', normalizedInput);

  const formats = createFormats();

  let words = normalizedInput.split(' ');

  const matches = [];

  for (const format of formats) {
    const movingChunks = createMovingChunks(words, format.wordCount);

    let chunkIndex = 0;

    for (const movingChunk of movingChunks) {
      const wordOffset = ++chunkIndex * format.wordCount;

      const subject = movingChunk.join(' ');

      if (format.momentFormat === 'R') {
        if (!configuration.locale) {
          log.trace('cannot attempt format without `locale` configuration');
        } else if (!configuration.timezone) {
          log.trace('cannot attempt format without `timezone` configuration');
        } else {
          const maybeDate = extractRelativeDate(subject, configuration.locale, configuration.timezone);

          if (maybeDate) {
            words = words.slice(wordOffset);

            log.debug('matched "%s" input using "%s" format (%s direction)', subject, format.momentFormat, format.direction || 'no');

            matches.push({
              date: maybeDate,
            });
          }
        }
      } else if (format.momentFormat === 'ddd' || format.momentFormat === 'dddd') {
        const date = moment(subject, format.momentFormat, true);

        if (date.isValid()) {
          words = words.slice(wordOffset);

          log.debug('matched "%s" input using "%s" format (%s direction)', subject, format.momentFormat, format.direction || 'no');

          matches.push({
            date: date.format('YYYY-MM-DD'),
          });
        }
      } else {
        const yearIsExplicit = typeof format.yearIsExplicit === 'boolean' ? format.yearIsExplicit : true;

        if (yearIsExplicit) {
          const date = moment(subject, format.momentFormat, true);

          if (!date.isValid()) {
            continue;
          }

          const formatDirection = format.direction;
          const configurationDirection = configuration.direction;

          if (formatDirection && configurationDirection && format.momentFormat.includes('YYYY') && formatDirection.replace('Y', '') === configurationDirection.replace('Y', '')) {
            log.debug('matched format using YYYY; month-day direction matches');
          } else if (format.direction && format.direction !== configuration.direction) {
            log.trace('discarding match; direction mismatch');

            continue;
          }

          if (format.direction && !configuration.direction) {
            log.info('found a match using "%s" format; unsafe to use without `direction` configuration', format.momentFormat);

            continue;
          }

          words = words.slice(wordOffset);

          log.debug('matched "%s" input using "%s" format (%s direction)', subject, format.momentFormat, format.direction || 'no');

          matches.push({
            date: date.format('YYYY-MM-DD'),
          });
        } else {
          const date = moment(subject, format.momentFormat, true);

          if (!date.isValid()) {
            continue;
          }

          const currentMonth = parseInt(moment().format('M'), 10) + parseInt(moment().format('YYYY'), 10) * 12;
          const parsedMonth = parseInt(date.format('M'), 10) + parseInt(date.format('YYYY'), 10) * 12;
          const difference = parsedMonth - currentMonth;

          let useYear;

          if (difference >= configuration.maximumAge) {
            useYear = parseInt(moment().format('YYYY'), 10) - 1;
          } else if (difference < 0 && Math.abs(difference) >= configuration.minimumAge) {
            useYear = parseInt(moment().format('YYYY'), 10) + 1;
          } else {
            useYear = parseInt(moment().format('YYYY'), 10);
          }

          const maybeDate = moment(useYear + '-' + date.format('MM-DD'), 'YYYY-MM-DD', true);

          if (!maybeDate.isValid()) {
            continue;
          }

          if (format.direction && format.direction !== configuration.direction) {
            log.trace('discarding match; direction mismatch');

            continue;
          }

          if (format.direction && !configuration.direction) {
            log.info('found a match using "%s" format; unsafe to use without "format" configuration', format.momentFormat);

            continue;
          }

          words = words.slice(wordOffset);

          log.debug('matched "%s" input using "%s" format (%s direction)', subject, format.momentFormat, format.direction || 'no');

          matches.push({
            date: maybeDate.format('YYYY-MM-DD'),
          });
        }
      }
    }
  }

  return matches;
};
