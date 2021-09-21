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

export const useCurrentPagination = history => {
  const pageParams = parsePageParams(history);
  const uiSettings = useForemanSettings();

  return {
    page: parseInt(pageParams.page, 10) || 1,
    perPage: parseInt(pageParams.perPage, 10) || uiSettings.perPage,
  };
};

export const pageToVars = pagination => ({
  first: pagination.page * pagination.perPage,
  last: pagination.perPage,
});

export const useParamsToVars = history =>
  pageToVars(useCurrentPagination(history));
