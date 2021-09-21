import { addSearch } from './pageParamsHelper';

export const preparePerPageOptions = opts =>
  opts.map(item => ({ title: item.toString(), value: item }));

export const refreshPage = (history, params = {}) => {
  const url = addSearch(history.location.pathname, params);
  history.push(url);
};
