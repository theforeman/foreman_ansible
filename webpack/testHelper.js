import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import { MockedProvider } from '@apollo/react-testing';
import { Router, MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { reducers as apiReducer, APIMiddleware } from 'foremanReact/redux/API';
import ConfirmModal, {
  reducers as confirmModalReducers,
} from 'foremanReact/components/ConfirmModal';
import { getForemanContext } from 'foremanReact/Root/Context/ForemanContext';

const reducers = combineReducers({ ...apiReducer, ...confirmModalReducers });

export const generateStore = () =>
  createStore(reducers, compose(applyMiddleware(thunk, APIMiddleware)));

export const withRedux = Component => props => (
  <Provider store={generateStore()}>
    <Component {...props} />
    <ConfirmModal />
  </Provider>
);

export const withRouter = Component => props => (
  <MemoryRouter>
    <Component {...props} />
  </MemoryRouter>
);

export const withReactRouter = Component => props => {
  // eslint-disable-next-line react/prop-types
  const history = props.history || createMemoryHistory();

  return (
    <Router history={history}>
      <Component {...props} history={history} />
    </Router>
  );
};

export const withMockedProvider = Component => props => {
  const ForemanContext = getForemanContext(ctx);
  // eslint-disable-next-line react/prop-types
  const { mocks, ...rest } = props;

  const ctx = {
    metadata: {
      UISettings: {
        perPage: 20,
      },
    },
  };

  return (
    <ForemanContext.Provider value={ctx}>
      <MockedProvider mocks={mocks}>
        <Component {...rest} />
      </MockedProvider>
    </ForemanContext.Provider>
  );
};

export const userFactory = (login, permissions = []) => ({
  __typename: 'User',
  id: 'MDE6VXNlci01',
  login,
  admin: false,
  permissions: {
    nodes: permissions,
  },
});

export const admin = {
  __typename: 'User',
  id: 'MDE6VXNlci00',
  login: 'admin',
  admin: true,
  permissions: {
    nodes: [],
  },
};

export const intruder = userFactory('intruder', [
  {
    __typename: 'Permission',
    id: 'MDE6UGVybWlzc2lvbi0x',
    name: 'view_architectures',
  },
]);

// use to resolve async mock requests for apollo MockedProvider
export const tick = () => new Promise(resolve => setTimeout(resolve, 0));

export const historyMock = {
  location: {
    search: '',
  },
};

export const mockFactory = (resultName, query) => (
  variables,
  modelResults,
  { errors = [], currentUser = null, refetchData = null } = {}
) => {
  let called = false;

  const returnData = results => {
    const result = {
      data: {
        [resultName]: results,
      },
    };

    if (errors.length !== 0) {
      result.errors = errors;
    }

    if (currentUser) {
      result.data.currentUser = currentUser;
    }

    return result;
  };

  const mock = {
    request: {
      query,
      variables,
    },
    newData: () => {
      if (called && refetchData) {
        return returnData(refetchData);
      }
      called = true;
      return returnData(modelResults);
    },
  };

  return [mock];
};

export const advancedMockFactory = query => (
  variables,
  data,
  { errors = [], currentUser = null, refetchData = null } = {}
) => {
  let called = false;

  const mock = {
    request: {
      query,
      variables,
    },
    newData: () => {
      if (called && refetchData) {
        return { data: refetchData };
      }
      called = true;
      return { data };
    },
  };

  if (errors.length !== 0) {
    mock.result.errors = errors;
  }

  if (currentUser) {
    mock.result.data.currentUser = currentUser;
  }
  return [mock];
};
