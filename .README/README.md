# extract-date 📅

[![Travis build status](http://img.shields.io/travis/gajus/extract-date/master.svg?style=flat-square)](https://travis-ci.org/gajus/extract-date)
[![Coveralls](https://img.shields.io/coveralls/gajus/extract-date.svg?style=flat-square)](https://coveralls.io/github/gajus/extract-date)
[![NPM version](http://img.shields.io/npm/v/extract-date.svg?style=flat-square)](https://www.npmjs.org/package/extract-date)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

Extracts date from an arbitrary text input.

{"gitdown": "contents"}

## Features

* Deterministic and unambiguous date parsing (input must include year; see [Date resolution without year](#date-resolution-without-year))
* No date format configuration.
* Recognises relative dates (yesterday, today, tomorrow).
* Recognises weekdays (Monday, Tuesday, etc.).
* Supports timezones (for relative date resolution) and locales.

## Motivation

I am creating a large scale data aggregation platform (https://applaudience.com/). I have observed that the date-matching patterns and site specific date validation logic is repeating and could be abstracted into a universal function as long as minimum information about the expected pattern is provided (such as the `direction` configuration). My motivation for creating such abstraction is to reduce the amount of repetitive logic that we use to extract dates from multiple sources.

## Use case

The intended use case is extracting date of future events from blobs of text that may contain auxiliary information, e.g. 'Event at 14:00 2019-01-01 (2D)'.

The emphasis on the _future_ events is because resolving dates such 'today' (relative dates) and 'Wednesday' (weekday dates) requires knowing the offset date. If your input sources refer predominantly to future events, then the ambiguity can be resolved using the present date.

## Usage

```js
import extractDate from 'extract-date';

extractDate('extracts date from anywhere within the input 2000-01-02');
// 2000-01-02

extractDate('extracts only the first date from the input 2000-01-02, 2000-01-03');
// 2000-01-02

extractDate('produces a null when date is ambiguous 02/01/2000');
// null

extractDate('uses `format` to resolve ambiguous dates 02/01/2000', {format: 'DMY'});
// 2000-01-02

extractDate('uses `timezone` to resolve relative dates such as today or tomorrow', {timezone: 'Europe/London'});
// 2000-01-02 (assuming today is 2000-01-02)

```

### Configuration

|Name|Description|Default|
|---|---|---|
|`format`|Token identifying the order of numeric date attributes within the string. Possible values: DM, DMY, DYM, MD, YDM, YMD. Used to resolve ambiguous dates, e.g. DD/MM/YYYY and MM/DD/YYYY.|N/A|
|`maximumAge`|See [Date resolution without year](#date-resolution-without-year).|`Infinity`|
|`minimumAge`|See [Date resolution without year](#date-resolution-without-year).|`Infinity`|
|`timezone`|[TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Used to resolve relative dates ("Today", "Tomorrow").|N/A|

## Resolution of ambiguous dates

### Date resolution without year

When year is not part of the input (e.g. March 2nd), then `minimumAge` and `maximumAge` configuration determines the year value.

* If the difference between the current month and the parsed month is greater or equal to `minimumAge`, then the year value is equal to the current year +1.
* If the difference between the current month and the parsed month is lower or equal to `maximumAge`, then the year value is equal to the current year -1.
* If the difference is within those two ranges, then the current year value is used.

Example:

* If the current date is 2000-12-01 and the parsed date is 10-01, then the month difference is -2.
  * If `minimumAge` is 2, then the final date is 2001-10-01.
  * If `minimumAge` is 3, then the final date is 2000-10-01.

* If the current date is 2000-01-01 and the input date is 10-01, then the month difference is 9.
  * If `maximumAge` is 10, then the final date is 2000-10-01.
  * If `maximumAge` is 9, then the final date is 1999-10-01.

Note: `minimumAge` comparison is done using absolute difference value.

## Implementation

Note: This section of the documentation is included for contributors.

* `extract-date` includes a collection of formats ([`./src/createFormats.js`](./src/createFormats.js)).
* Individual formats define their expectations (see [Format specification](#format-specification)).
* The formats are attempted in the order of their specificity, i.e. "YYYY-MM-DD" is attempted before "MM-DD".
* Formats are attempted against a tokenised version of the input (see [Input tokenisation](#input-tokenisation)).
* The first format that can extract the date is used.

### Input tokenisation

* Individual formats define how many words make up the date.
* `extract-date` splits input string into a collection of slices pairing words into phrases of the required length.
* Format is attempted against each resulting phrase.

Example:

Given input "foo bar baz qux" and format:

```js
{
  direction: 'YMD',
  localised: false,
  momentFormat: 'YYYY MM.DD',
  wordCount: 2,
  yearIsExplicit: true
}

```

Input is broken down into:

* "foo bar"
* "bar baz"
* "baz qux"

collection and the format is attempted against each phrase until a match is found.

### Format specification

|Field|Description|
|---|---|
|`direction`|Identifies the order of numeric date attributes within the string. Possible values: DMY, DYM, YDM, YMD. Used to resolve ambiguous dates, e.g. DD/MM/YYYY and MM/DD/YYYY.|
|`localised`|Identifies if the date is localised, i.e. includes names of the week day or month. A format that is localised is used only when `locale` configuration is provided.|
|`momentFormat`|Identifies [`moment`](https://www.npmjs.org/package/moment) format used to attempt date extraction. `moment` is evaluated using the strict parser option.|
|`wordCount`|Identifies how many words make up the date format.|
|`yearIsExplicit`|Identifies whether the date format includes year.|

Example formats:

```js
{
  direction: 'YMD',
  localised: false,
  momentFormat: 'YYYY.MM.DD',
  wordCount: 1,
  yearIsExplicit: true
},
{
  direction: 'DD MMMM',
  localised: true,
  momentFormat: 'DD MMMM',
  wordCount: 2,
  yearIsExplicit: false
},

```
