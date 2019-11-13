// @flow

export default (dateFnsFormat: string): number => {
  let specificity = 0;

  if (dateFnsFormat.includes('yyyy')) {
    specificity += 40;
  } else if (dateFnsFormat.includes('yy')) {
    specificity += 20;
  }

  if (dateFnsFormat.includes('M')) {
    specificity += 20;
  }

  if (/d/.test(dateFnsFormat)) {
    specificity += 20;
  }

  return specificity + dateFnsFormat.length;
};
