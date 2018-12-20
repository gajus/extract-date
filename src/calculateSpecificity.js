// @flow

export default (momentFormat: string): number => {
  let specificity = 0;

  if (momentFormat.includes('YYYY')) {
    specificity += 40;
  } else if (momentFormat.includes('YY')) {
    specificity += 20;
  }

  if (momentFormat.includes('M')) {
    specificity += 20;
  }

  if (momentFormat.includes('D')) {
    specificity += 20;
  }

  return specificity + momentFormat.length;
};
