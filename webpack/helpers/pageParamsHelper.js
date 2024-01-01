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

export const useCurrentPagination = (history) => {
  const pageParams = parsePageParams(history);
  const uiSettings = useForemanSettings();

  return {
    page: parseInt(pageParams.page, 10) || 1,
    per_page:
      parseInt(pageParams.per_page, 10) || uiSettings.perPage,
  };
};

export const pageToVars = ({ page, per_page }, totalCount = 0) => ({
  first: page * per_page,
  last: page > 1 & totalCount > 0 ? totalCount - per_page : per_page,
})

export const useParamsToVars = (history, totalCount) => pageToVars(useCurrentPagination(history), totalCount);
