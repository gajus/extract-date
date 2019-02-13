// @flow

export default (input: string): string => {
  let lastInput = input;

  while (true) {
    const result = lastInput

      // 2019-02-12T00:00:00
      .replace(/(\d+)T(\d+)/, '$1 $2')

      .replace(/(\d+)\s\/\s(\d+)/, '$1/$2')

      // .replace(/,/g, ' ')
      // .replace(/[.:;] /g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (result === lastInput) {
      return result;
    }

    lastInput = result;
  }

  throw new Error('Unexpected state.');
};
