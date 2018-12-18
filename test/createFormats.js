// @flow

import test from 'ava';
import createFormats from '../src/createFormats';

const expectedOrder = `MMMM YYYY ddd Do
MMMM YYYY ddd D
Do MMMM YYYY
MMMM YYYY Do
D MMMM YYYY
Do MMM YYYY
MMM YYYY Do
MMMM YYYY D
D MMM YYYY
DD-MM-YYYY
DD.MM.YYYY
DD/MM/YYYY
MM-DD-YYYY
MM.DD.YYYY
MM/DD/YYYY
MMM YYYY D
YYYY-MM-DD
YYYY.DD.MM
YYYY.MM.DD
YYYY/MM/DD
D-M-YYYY
D.M.YYYY
D/M/YYYY
M-D-YYYY
M.D.YYYY
M/D/YYYY
YYYY-M-D
YYYY.D.M
YYYY.M.D
YYYY/M/D
YYYYMMDD
dddd DD MMMM
dddd Do MMMM
dddd MMMM DD
dddd MMMM Do
ddd DD MMMM
ddd Do MMMM
ddd MMMM DD
ddd MMMM Do
dddd D MMMM
dddd DD MMM
dddd Do MMM
dddd MMM DD
dddd MMM Do
dddd MMMM D
ddd D MMMM
ddd DD MMM
ddd Do MMM
ddd MMM DD
ddd MMM Do
ddd MMMM D
dddd D MMM
dddd MMM D
ddd D MMM
ddd MMM D
DD MMMM
Do MMMM
MMMM DD
MMMM Do
D MMMM
DD MMM
Do MMM
MMM DD
MMM Do
MMMM D
D MMM
DD-MM
DD/MM
MM-DD
MMM D
D-M
D/M
M-D
dddd
ddd
R`;

test('orders formats by their specificity (resolves conflicts using localeCompare)', (t) => {
  const formats = createFormats();

  const order = formats
    .map((format) => {
      return format.momentFormat;
    })
    .join('\n');

  t.true(order === expectedOrder);
});
