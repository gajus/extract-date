// @flow

import test from 'ava';
import createMovingChunks from '../../src/createMovingChunks';

test('creates an array of fixed length text slices, each offset by 1 character', (t) => {
  t.deepEqual(createMovingChunks(['a', 'b', 'c', 'd'], 2), [
    [
      'a',
      'b',
    ],
    [
      'b',
      'c',
    ],
    [
      'c',
      'd',
    ],
  ]);

  t.deepEqual(createMovingChunks(['a', 'b', 'c'], 2), [
    [
      'a',
      'b',
    ],
    [
      'b',
      'c',
    ],
  ]);
});
