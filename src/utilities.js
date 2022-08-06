export function objDeepCopy(obj) {
  const keysAndValues = Object.entries(obj);
  const copiedObj = {};

  keysAndValues.forEach(([key, value]) => {
    if (value && typeof value === 'object') {
      copiedObj[`${key}`] = objDeepCopy(value);
    } else {
      copiedObj[`${key}`] = value;
    }
  });
  return copiedObj;
}

export function twoDimensionArrayDeepCopy(arr) {
  return arr.map((subarr) => subarr.map((obj) => objDeepCopy(obj)));
}
