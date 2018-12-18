// @flow

export default (subject: string): $ReadOnlyArray<string> => {
  return subject
    .replace(/,/g, ' ')
    .replace(/[.:;] /g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ');
};
