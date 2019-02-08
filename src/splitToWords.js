// @flow

export default (subject: string): $ReadOnlyArray<string> => {
  return subject
    .replace(/,/g, ' ')
    .replace(/[.:;] /g, ' ')
    .replace(/\s+/g, ' ')

    // 2019-02-12T00:00:00
    .replace(/(\d+)T(\d+)/, '$1 $2')
    .split(' ');
};
