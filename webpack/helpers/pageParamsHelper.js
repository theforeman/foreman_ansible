import URI from 'urijs';
import { useForemanSettings } from 'foremanReact/Root/Context/ForemanContext';

const parsePageParams = history => URI.parseQuery(history.location.search);

export const addSearch = (basePath, params) => {
  let stringyfied = '';
  if (Object.keys(params).length > 0) {
    stringyfied = `?${URI.buildQuery(params)}`;
  }

  return `${basePath}${stringyfied}`;
};

export const useCurrentPagination = (
  history,
  keys = { page: 'page', perPage: 'perPage' }
) => {
  const pageParams = parsePageParams(history);
  const uiSettings = useForemanSettings();

  return {
    [keys.page]: parseInt(pageParams[keys.page], 10) || 1,
    [keys.perPage]:
      parseInt(pageParams[keys.perPage], 10) || uiSettings.perPage,
  };
};

export const pageToVars = (
  pagination,
  keys = { page: 'page', perPage: 'perPage' }
) => ({
  first: pagination[keys.page] * pagination[keys.perPage],
  last: pagination[keys.perPage],
});

export const useParamsToVars = (
  history,
  keys = { page: 'page', perPage: 'perPage' }
) => pageToVars(useCurrentPagination(history, keys), keys);
