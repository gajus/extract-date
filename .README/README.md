# extract-date 📅

[![Travis build status](http://img.shields.io/travis/gajus/extract-date/master.svg?style=flat-square)](https://travis-ci.org/gajus/extract-date)
[![Coveralls](https://img.shields.io/coveralls/gajus/extract-date.svg?style=flat-square)](https://coveralls.io/github/gajus/extract-date)
[![NPM version](http://img.shields.io/npm/v/extract-date.svg?style=flat-square)](https://www.npmjs.org/package/extract-date)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

Extracts date from an arbitrary text input.

{"gitdown": "contents"}

## Principals

* Deterministic and unambiguous (input must include year; see [Date resolution without year](#date-resolution-without-year))
* 0 or minimum configuration.

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

## Configuration

|Name|Description|Default|
|---|---|---|
|`format`|Token identifying the order of numeric date attributes within the string. Possible values: DMY, DYM, YDM, YMD. Used to resolve ambiguous dates, e.g. DD/MM/YYYY and MM/DD/YYYY.|N/A|
|`maximumAge`|See [Date resolution without year](#date-resolution-without-year).|2|
|`minimumAge`|See [Date resolution without year](#date-resolution-without-year).|2|
|`timezone`|[TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Used to resolve relative dates ("Today", "Tomorrow").|N/A|

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
