// @flow

import cartesian from 'cartesian';
import calculateSpecificity from './calculateSpecificity';

export default () => {
  // The reason `yearFirstDashSeparator` and `yearFirstSlashSeparator` formats do not have direction is because
  // there are no known regions that use YYYY-DD-MM format.
  // https://en.wikipedia.org/wiki/Date_format_by_country
  const yearFirstDashSeparator = [
    {
      momentFormat: 'YYYY-MM-DD',
    },
    {
      momentFormat: 'YYYY-M-D',
    },
  ];

  const yearFirstSlashSeparator = [
    {
      momentFormat: 'YYYY/MM/DD',
    },
    {
      momentFormat: 'YYYY/M/D',
    },
  ];

  const yearFirstDotSeparator = [
    {
      direction: 'YMD',
      momentFormat: 'YYYY.MM.DD',
    },
    {
      direction: 'YMD',
      momentFormat: 'YYYY.M.D',
    },
    {
      direction: 'YDM',
      momentFormat: 'YYYY.DD.MM',
    },
    {
      direction: 'YDM',
      momentFormat: 'YYYY.D.M',
    },
  ];

  const yearLastDashSeparator = [
    {
      direction: 'DMY',
      momentFormat: 'DD-MM-YYYY',
    },
    {
      direction: 'DMY',
      momentFormat: 'D-M-YYYY',
    },
    {
      direction: 'MDY',
      momentFormat: 'MM-DD-YYYY',
    },
    {
      direction: 'MDY',
      momentFormat: 'M-D-YYYY',
    },
  ];

  const yearLastDotSeparator = [
    {
      direction: 'DMY',
      momentFormat: 'DD.MM.YYYY',
    },
    {
      direction: 'DMY',
      momentFormat: 'D.M.YYYY',
    },
    {
      direction: 'MDY',
      momentFormat: 'MM.DD.YYYY',
    },
    {
      direction: 'MDY',
      momentFormat: 'M.D.YYYY',
    },
    {
      direction: 'DMY',
      momentFormat: 'DD.MM.YY',
    },
    {
      direction: 'DMY',
      momentFormat: 'D.M.YY',
    },
  ];

  const yearLastSlashSeparator = [
    {
      direction: 'DMY',
      momentFormat: 'DD/MM/YYYY',
    },
    {
      direction: 'DMY',
      momentFormat: 'D/M/YYYY',
    },
    {
      direction: 'MDY',
      momentFormat: 'MM/DD/YYYY',
    },
    {
      direction: 'MDY',
      momentFormat: 'M/D/YYYY',
    },
    {
      direction: 'MDY',
      momentFormat: 'MM/DD/YY',
    },
    {
      direction: 'DMY',
      momentFormat: 'DD/MM/YY',
    },
    {
      direction: 'DMY',
      momentFormat: 'D/M/YY',
    },
    {
      direction: 'MDY',
      momentFormat: 'M/D/YY',
    },
  ];

  const localised = [
    ...cartesian([
      [
        'Do',
        'D',
      ],
      [
        'MMMM',
        'MMM',
      ],
      [
        'YYYY',
      ],
    ])
      .map((combination) => {
        return {
          momentFormat: combination.join(' '),
        };
      }),
    ...cartesian([
      [
        'MMMM',
        'MMM',
      ],
      [
        'YYYY',
      ],
      [
        'Do',
        'D',
      ],
    ])
      .map((combination) => {
        return {
          momentFormat: combination.join(' '),
        };
      }),
    {
      momentFormat: 'MMMM YYYY ddd Do',
    },
    {
      momentFormat: 'MMMM YYYY ddd D',
    },
  ];

  const impliedYearLocalised = [
    ...cartesian([
      [
        'dddd',
        'ddd',
      ],
      [
        'MMMM',
        'MMM',
      ],
      [
        'DD',
        'Do',
        'D',
      ],
    ])
      .map((combination) => {
        return {
          momentFormat: combination.join(' '),
        };
      }),
    ...cartesian([
      [
        'dddd',
        'ddd',
      ],
      [
        'DD',
        'Do',
        'D',
      ],
      [
        'MMMM',
        'MMM',
      ],
    ])
      .map((combination) => {
        return {
          momentFormat: combination.join(' '),
        };
      }),
    ...cartesian([
      [
        'MMMM',
        'MMM',
      ],
      [
        'DD',
        'Do',
        'D',
      ],
    ])
      .map((combination) => {
        return {
          momentFormat: combination.join(' '),
        };
      }),
    ...cartesian([
      [
        'DD',
        'Do',
        'D',
      ],
      [
        'MMMM',
        'MMM',
      ],
    ])
      .map((combination) => {
        return {
          momentFormat: combination.join(' '),
        };
      }),
  ];

  const impliedYear = [
    ...cartesian([
      [
        'DD',
        'D',
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
          direction: 'DM',
          momentFormat: combination.join(''),
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
        'DD',
        'D',
      ],
    ])
      .map((combination) => {
        return {
          direction: 'MD',
          momentFormat: combination.join(''),
        };
      }),
  ];

  const relative = [
    {
      momentFormat: 'R',
      test: false,
    },
    {
      momentFormat: 'dddd',
    },
    {
      momentFormat: 'ddd',
    },
  ];

  return [
    {
      momentFormat: 'YYYYMMDD',
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
        localised: /ddd|mmm/i.test(format.momentFormat),
        specificity: calculateSpecificity(format.momentFormat),
        wordCount: format.momentFormat.replace(/[^ ]/g, '').length + 1,
        yearIsExplicit: format.momentFormat.includes('YYYY'),
        ...format,
      };
    })
    .sort((a, b) => {
      if (a.wordCount !== b.wordCount) {
        return b.wordCount - a.wordCount;
      }

      if (b.specificity === a.specificity) {
        return a.momentFormat.localeCompare(b.momentFormat);
      }

      return b.specificity - a.specificity;
    });
};
