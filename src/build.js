#!/usr/bin/env node

/* eslint-disable import/no-commonjs, import/no-extraneous-dependencies, quote-props */

// Usage: `npm i cldr && node ./src/build && npm uninstall cldr`
// @see https://github.com/papandreou/node-cldr/issues/99

const fs = require('fs');
const path = require('path');
const cldr = require('cldr');

const dayNames = {};

for (const localeId of cldr.localeIds) {
  const dictionary = cldr.extractFields(localeId);

  dayNames[localeId] = {
    '-1': dictionary.day.relative['-1'],
    '0': dictionary.day.relative['0'],
    '1': dictionary.day.relative['1'],
  };
}

fs.writeFileSync(path.resolve(__dirname, 'locale.json'), JSON.stringify(dayNames));
