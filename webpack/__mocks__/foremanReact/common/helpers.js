import { camelCase } from 'lodash';

export const propsToCamelCase = ob =>
  propsToCase(camelCase, 'propsToCamelCase only takes objects', ob);

export const deepPropsToCamelCase = obj => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(deepPropsToCamelCase);
  }
  const transformed = propsToCamelCase(obj);
  return Object.keys(transformed).reduce((memo, key) => {
    memo[key] = deepPropsToCamelCase(transformed[key]);
    return memo;
  }, {});
};

const propsToCase = (casingFn, errorMsg, ob) => {
  if (typeof ob !== 'object') throw Error(errorMsg);

  return Object.keys(ob).reduce((memo, key) => {
    memo[casingFn(key)] = ob[key];
    return memo;
  }, {});
};
