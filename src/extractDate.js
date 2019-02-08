// @flow

/* eslint-disable no-continue, no-negated-condition */

import moment from 'moment-timezone';
import cldr from 'cldr';
import createMovingChunks from './createMovingChunks';
import extractRelativeDate from './extractRelativeDate';
import splitToWords from './splitToWords';
import createFormats from './createFormats';
import Logger from './Logger';

type DateMatchType = {|
  +date: string
|};

type FormatType = 'DM' | 'DMY' | 'DYM' | 'MD' | 'YDM' | 'YMD';

type UserConfigurationType = {|
  +direction?: FormatType,
  +locale?: string,
  +maximumAge?: number,
  +minimumAge?: number,
  +timezone?: string
|};

type ConfigurationType = {|
  +direction?: FormatType,
  +locale: string,
  +maximumAge: number,
  +minimumAge: number,
  +timezone?: string
|};

const log = Logger.child({
  namespace: 'extractDate'
});

const defaultConfiguration = {
  maximumAge: Infinity,
  minimumAge: Infinity
};

// eslint-disable-next-line complexity
export default (subject: string, userConfiguration: UserConfigurationType = defaultConfiguration): $ReadOnlyArray<DateMatchType> => {
  const configuration: ConfigurationType = {
    ...defaultConfiguration,
    ...userConfiguration
  };

  if (configuration.locale && !cldr.localeIds.includes(configuration.locale)) {
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
    configuration
  }, 'attempting to extract date from "%s" input', subject);

  const formats = createFormats();

  let words = splitToWords(subject);

  const matches = [];

  for (const format of formats) {
    const movingChunks = createMovingChunks(words, format.wordCount);

    let chunkIndex = 0;

    for (const movingChunk of movingChunks) {
      const wordOffset = ++chunkIndex * format.wordCount;

      const input = movingChunk.join(' ');

      log.trace('testing "%s" input using "%s" format (%s direction)', input, format.momentFormat, format.direction || 'no');

      if (format.momentFormat === 'R') {
        if (!configuration.locale) {
          log.trace('cannot attempt format without `locale` configuration');
        } else if (!configuration.timezone) {
          log.trace('cannot attempt format without `timezone` configuration');
        } else {
          const maybeDate = extractRelativeDate(input, configuration.locale, configuration.timezone);

          if (maybeDate) {
            words = words.slice(wordOffset);

            log.debug('matched using relative date format');

            matches.push({
              date: maybeDate
            });
          }
        }
      } else if (format.momentFormat === 'ddd' || format.momentFormat === 'dddd') {
        const date = moment(input, format.momentFormat, true);

        if (date.isValid()) {
          words = words.slice(wordOffset);

          log.debug('matched using week name format');

          matches.push({
            date: date.format('YYYY-MM-DD')
          });
        }
      } else {
        const yearIsExplicit = typeof format.yearIsExplicit === 'boolean' ? format.yearIsExplicit : true;

        if (yearIsExplicit) {
          const date = moment(input, format.momentFormat, true);

          if (!date.isValid()) {
            continue;
          }

          if (format.direction && configuration.direction && format.momentFormat.includes('YYYY') && format.direction.replace('Y', '') === configuration.direction.replace('Y', '')) {
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

          log.debug('matched using %s format', format.momentFormat);

          matches.push({
            date: date.format('YYYY-MM-DD')
          });
        } else {
          const date = moment(input, format.momentFormat, true);

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

          log.debug('matched using %s format', format.momentFormat);

          matches.push({
            date: maybeDate.format('YYYY-MM-DD')
          });
        }
      }
    }
  }

  return matches;
};
