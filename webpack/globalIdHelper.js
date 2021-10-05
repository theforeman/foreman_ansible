const idSeparator = '-';
const versionSeparator = ':';
const defaultVersion = '01';

export const decodeModelId = model => decodeId(model.id);

export const decodeId = id => {
  const split = atob(id).split(idSeparator);
  return parseInt(split[split.length - 1], 10);
};

export const encodeId = (typename, id) =>
  btoa([defaultVersion, versionSeparator, typename, idSeparator, id].join(''));
