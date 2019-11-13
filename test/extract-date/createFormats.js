// @flow

import test from 'ava';
import createFormats from '../../src/createFormats';

const expectedOrder = `MMMM yyyy EEE do
MMMM yyyy EEE d
do MMMM yyyy
MMMM do yyyy
MMMM yyyy do
d MMMM yyyy
do MMM yyyy
MMM yyyy do
MMMM d yyyy
MMMM yyyy d
d MMM yyyy
MMM yyyy d
EEEE dd MMMM
EEEE do MMMM
EEEE MMMM dd
EEEE MMMM do
EEE dd MMMM
EEE do MMMM
EEE MMMM dd
EEE MMMM do
EEEE d MMMM
EEEE dd MMM
EEEE do MMM
EEEE MMM dd
EEEE MMM do
EEEE MMMM d
EEE d MMMM
EEE dd MMM
EEE do MMM
EEE MMM dd
EEE MMM do
EEE MMMM d
EEEE d MMM
EEEE MMM d
EEE d MMM
EEE MMM d
dd MMMM
do MMMM
MMMM dd
MMMM do
d MMMM
dd MMM
do MMM
MMM dd
MMM do
MMMM d
d MMM
MMM d
dd-MM-yyyy
dd.MM.yyyy
dd/MM/yyyy
MM-dd-yyyy
MM.dd.yyyy
MM/dd/yyyy
yyyy-MM-dd
yyyy.dd.MM
yyyy.MM.dd
yyyy/MM/dd
d-M-yyyy
d.M.yyyy
d/M/yyyy
M-d-yyyy
M.d.yyyy
M/d/yyyy
yyyy-M-d
yyyy.d.M
yyyy.M.d
yyyy/M/d
yyyyMMdd
dd.MM.yy
dd/MM/yy
MM/dd/yy
d.M.yy
d/M/yy
M/d/yy
dd-MM
dd.MM
dd/MM
MM-dd
MM.dd
MM/dd
d-MM
d.MM
d/MM
dd-M
dd.M
dd/M
M-dd
M.dd
M/dd
MM-d
MM.d
MM/d
d-M
d.M
d/M
M-d
M.d
M/d
EEEE
EEE
R`;

test('orders formats by their specificity (resolves conflicts using localeCompare)', (t) => {
  const formats = createFormats();

  const order = formats
    .map((format) => {
      return format.dateFnsFormat;
    })
    .join('\n');

  // eslint-disable-next-line ava/prefer-power-assert
  t.is(order, expectedOrder);
});
