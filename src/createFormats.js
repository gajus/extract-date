// @flow

import cartesian from 'cartesian';
import calculateSpecificity from './calculateSpecificity';

export default () => {
  // The reason `yearFirstDashSeparator` and `yearFirstSlashSeparator` formats do not have direction is because
  // there are no known regions that use yyyy-dd-MM format.
  // https://en.wikipedia.org/wiki/Date_format_by_country
  const yearFirstDashSeparator = [
    {
      dateFnsFormat: 'yyyy-MM-dd',
    },
    {
      dateFnsFormat: 'yyyy-M-d',
    },
  ];

  const yearFirstSlashSeparator = [
    {
      dateFnsFormat: 'yyyy/MM/dd',
    },
    {
      dateFnsFormat: 'yyyy/M/d',
    },
  ];

  const yearFirstDotSeparator = [
    {
      dateFnsFormat: 'yyyy.MM.dd',
      direction: 'YMD',
    },
    {
      dateFnsFormat: 'yyyy.M.d',
      direction: 'YMD',
    },
    {
      dateFnsFormat: 'yyyy.dd.MM',
      direction: 'YDM',
    },
    {
      dateFnsFormat: 'yyyy.d.M',
      direction: 'YDM',
    },
  ];

  const yearLastDashSeparator = [
    {
      dateFnsFormat: 'dd-MM-yyyy',
      direction: 'DMY',
    },
    {
      dateFnsFormat: 'd-M-yyyy',
      direction: 'DMY',
    },
    {
      dateFnsFormat: 'MM-dd-yyyy',
      direction: 'MDY',
    },
    {
      dateFnsFormat: 'M-d-yyyy',
      direction: 'MDY',
    },
  ];

  const yearLastDotSeparator = [
    {
      dateFnsFormat: 'dd.MM.yyyy',
      direction: 'DMY',
    },
    {
      dateFnsFormat: 'd.M.yyyy',
      direction: 'DMY',
    },
    {
      dateFnsFormat: 'MM.dd.yyyy',
      direction: 'MDY',
    },
    {
      dateFnsFormat: 'M.d.yyyy',
      direction: 'MDY',
    },
    {
      dateFnsFormat: 'dd.MM.yy',
      direction: 'DMY',
    },
    {
      dateFnsFormat: 'd.M.yy',
      direction: 'DMY',
    },
  ];

  const yearLastSlashSeparator = [
    {
      dateFnsFormat: 'dd/MM/yyyy',
      direction: 'DMY',
    },
    {
      dateFnsFormat: 'd/M/yyyy',
      direction: 'DMY',
    },
    {
      dateFnsFormat: 'MM/dd/yyyy',
      direction: 'MDY',
    },
    {
      dateFnsFormat: 'M/d/yyyy',
      direction: 'MDY',
    },
    {
      dateFnsFormat: 'MM/dd/yy',
      direction: 'MDY',
    },
    {
      dateFnsFormat: 'dd/MM/yy',
      direction: 'DMY',
    },
    {
      dateFnsFormat: 'd/M/yy',
      direction: 'DMY',
    },
    {
      dateFnsFormat: 'M/d/yy',
      direction: 'MDY',
    },
  ];

  const localised = [
    {
      dateFnsFormat: 'MMMM d yyyy',
    },
    {
      dateFnsFormat: 'MMMM do yyyy',
    },
    ...cartesian([
      [
        'do',
        'd',
      ],
      [
        'MMMM',
        'MMM',
      ],
      [
        'yyyy',
      ],
    ])
      .map((combination) => {
        return {
          dateFnsFormat: combination.join(' '),
        };
      }),
    ...cartesian([
      [
        'MMMM',
        'MMM',
      ],
      [
        'yyyy',
      ],
      [
        'do',
        'd',
      ],
    ])
      .map((combination) => {
        return {
          dateFnsFormat: combination.join(' '),
        };
      }),
    {
      dateFnsFormat: 'MMMM yyyy EEE do',
    },
    {
      dateFnsFormat: 'MMMM yyyy EEE d',
    },
  ];

  const impliedYearLocalised = [
    ...cartesian([
      [
        'EEEE',
        'EEE',
      ],
      [
        'MMMM',
        'MMM',
      ],
      [
        'dd',
        'do',
        'd',
      ],
    ])
      .map((combination) => {
        return {
          dateFnsFormat: combination.join(' '),
        };
      }),
    ...cartesian([
      [
        'EEEE',
        'EEE',
      ],
      [
        'dd',
        'do',
        'd',
      ],
      [
        'MMMM',
        'MMM',
      ],
    ])
      .map((combination) => {
        return {
          dateFnsFormat: combination.join(' '),
        };
      }),
    ...cartesian([
      [
        'MMMM',
        'MMM',
      ],
      [
        'dd',
        'do',
        'd',
      ],
    ])
      .map((combination) => {
        return {
          dateFnsFormat: combination.join(' '),
        };
      }),
    ...cartesian([
      [
        'dd',
        'do',
        'd',
      ],
      [
        'MMMM',
        'MMM',
      ],
    ])
      .map((combination) => {
        return {
          dateFnsFormat: combination.join(' '),
        };
      }),
  ];

  const impliedYear = [
    ...cartesian([
      [
        'dd',
        'd',
      ],
      [
        '/',
        '-',
        '.',
      ],
      [
        'MM',
        'M',
      ],
    ])
      .map((combination) => {
        return {
          dateFnsFormat: combination.join(''),
          direction: 'DM',
        };
      }),
    ...cartesian([
      [
        'MM',
        'M',
      ],
      [
        '/',
        '-',
        '.',
      ],
      [
        'dd',
        'd',
      ],
    ])
      .map((combination) => {
        return {
          dateFnsFormat: combination.join(''),
          direction: 'MD',
        };
      }),
  ];

  const relative = [
    {
      dateFnsFormat: 'R',
      test: false,
    },
    {
      dateFnsFormat: 'EEEE',
    },
    {
      dateFnsFormat: 'EEE',
    },
  ];

  return [
    {
      dateFnsFormat: 'yyyyMMdd',
    },
    ...yearFirstDashSeparator,
    ...yearFirstDotSeparator,
    ...yearFirstSlashSeparator,
    ...yearLastDashSeparator,
    ...yearLastDotSeparator,
    ...yearLastSlashSeparator,
    ...localised,
    ...impliedYearLocalised,
    ...impliedYear,
    ...relative,
  ]
    .map((format) => {
      return {
        localised: /eee|mmm/i.test(format.dateFnsFormat),
        specificity: calculateSpecificity(format.dateFnsFormat),
        wordCount: format.dateFnsFormat.replace(/[^ ]/g, '').length + 1,
        yearIsExplicit: format.dateFnsFormat.includes('yyyy'),
        ...format,
      };
    })
    .sort((a, b) => {
      if (a.wordCount !== b.wordCount) {
        return b.wordCount - a.wordCount;
      }

      if (b.specificity === a.specificity) {
        return a.dateFnsFormat.localeCompare(b.dateFnsFormat);
      }

      return b.specificity - a.specificity;
    });
};
