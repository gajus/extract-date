// @flow

/* eslint-disable no-continue, no-negated-condition, import/no-namespace */

import {
  format as formatDate,
  parse as parseDate,
  isValid as isValidDate,
} from 'date-fns';
import * as locales from 'date-fns/locale';
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

const formats = createFormats();

const dateFnsLocaleMap = {
  en: 'enUS',
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

  const locale = configuration.locale || 'en';

  const dateFnsLocale = locales[dateFnsLocaleMap[locale] || locale];

  if (!dateFnsLocale) {
    throw new Error('No translation available for the target locale (date-fns).');
  }

  if (!dictionary[locale]) {
    throw new Error('No translation available for the target locale (relative dates).');
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

  let words = normalizedInput.split(' ');

  const matches = [];

  const baseDate = new Date();

  for (const format of formats) {
    const movingChunks = createMovingChunks(words, format.wordCount);

    let chunkIndex = 0;

    for (const movingChunk of movingChunks) {
      const wordOffset = ++chunkIndex * format.wordCount;

      const subject = movingChunk.join(' ');

      if (format.dateFnsFormat === 'R') {
        if (!configuration.locale) {
          log.trace('cannot attempt format without `locale` configuration');
        } else if (!configuration.timezone) {
          log.trace('cannot attempt format without `timezone` configuration');
        } else {
          const maybeDate = extractRelativeDate(subject, configuration.locale, configuration.timezone);

          if (maybeDate) {
            words = words.slice(wordOffset);

            log.debug('matched "%s" input using "%s" format (%s direction)', subject, format.dateFnsFormat, format.direction || 'no');

            matches.push({
              date: maybeDate,
            });
          }
        }
      } else if (format.dateFnsFormat === 'EEE' || format.dateFnsFormat === 'EEEE') {
        const date = parseDate(
          subject,
          format.dateFnsFormat,
          baseDate,
          {
            locale: dateFnsLocale,
          },
        );

        if (isValidDate(date)) {
          words = words.slice(wordOffset);

          log.debug('matched "%s" input using "%s" format (%s direction)', subject, format.dateFnsFormat, format.direction || 'no');

          matches.push({
            date: formatDate(date, 'yyyy-MM-dd'),
          });
        }
      } else {
        const yearIsExplicit = typeof format.yearIsExplicit === 'boolean' ? format.yearIsExplicit : true;

        if (yearIsExplicit) {
          const date = parseDate(
            subject,
            format.dateFnsFormat,
            baseDate,
            {
              locale: dateFnsLocale,
            },
          );

          if (!isValidDate(date)) {
            continue;
          }

          const formatDirection = format.direction;
          const configurationDirection = configuration.direction;

          if (formatDirection && configurationDirection && format.dateFnsFormat.includes('yyyy') && formatDirection.replace('Y', '') === configurationDirection.replace('Y', '')) {
            log.debug('matched format using yyyy; month-day direction matches');
          } else if (format.direction && format.direction !== configuration.direction) {
            log.trace('discarding match; direction mismatch');

            continue;
          }

          if (format.direction && !configuration.direction) {
            log.info('found a match using "%s" format; unsafe to use without `direction` configuration', format.dateFnsFormat);

            continue;
          }

          words = words.slice(wordOffset);

          log.debug('matched "%s" input using "%s" format (%s direction)', subject, format.dateFnsFormat, format.direction || 'no');

          matches.push({
            date: formatDate(date, 'yyyy-MM-dd'),
          });
        } else {
          const date = parseDate(
            subject,
            format.dateFnsFormat,
            baseDate,
            {
              locale: dateFnsLocale,
            },
          );

          if (!isValidDate(date)) {
            continue;
          }

          const currentYear = parseInt(formatDate(baseDate, 'yyyy'), 10);

          const currentMonth = parseInt(formatDate(baseDate, 'M'), 10) + currentYear * 12;
          const parsedMonth = parseInt(formatDate(date, 'M'), 10) + parseInt(formatDate(date, 'yyyy'), 10) * 12;
          const difference = parsedMonth - currentMonth;

          let useYear;

          if (difference >= configuration.maximumAge) {
            useYear = currentYear - 1;
          } else if (difference < 0 && Math.abs(difference) >= configuration.minimumAge) {
            useYear = currentYear + 1;
          } else {
            useYear = currentYear;
          }

          const maybeDate = parseDate(
            useYear + '-' + formatDate(date, 'MM-dd'),
            'yyyy-MM-dd',
            baseDate,
            {
              locale: dateFnsLocale,
            },
          );

          if (!isValidDate(maybeDate)) {
            continue;
          }

          if (format.direction && format.direction !== configuration.direction) {
            log.trace('discarding match; direction mismatch');

            continue;
          }

          if (format.direction && !configuration.direction) {
            log.info('found a match using "%s" format; unsafe to use without "format" configuration', format.dateFnsFormat);

            continue;
          }

          words = words.slice(wordOffset);

          log.debug('matched "%s" input using "%s" format (%s direction)', subject, format.dateFnsFormat, format.direction || 'no');

          matches.push({
            date: formatDate(maybeDate, 'yyyy-MM-dd'),
          });
        }
      }
    }
  }

  return matches;
};
