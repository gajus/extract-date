// @flow

import moment from 'moment-timezone';
import cldr from 'cldr';

export default (subject: string, locale: string, timezone: string): ?string => {
  if (!cldr.localeIds.includes(locale)) {
    throw new Error('No translation available for the target locale.');
  }

  if (!moment.tz.zone(timezone)) {
    throw new Error('Unrecognized timezone.');
  }

  const dictionary = cldr.extractFields(locale);

  const normalizedSubject = subject.toLowerCase();

  const now = moment();

  if (normalizedSubject === dictionary.day.relative['-1']) {
    return now.subtract(1, 'day').format('YYYY-MM-DD');
  }

  if (normalizedSubject === dictionary.day.relative['0']) {
    return now.format('YYYY-MM-DD');
  }

  if (normalizedSubject === dictionary.day.relative['1']) {
    return now.add(1, 'day').format('YYYY-MM-DD');
  }

  return null;
};
