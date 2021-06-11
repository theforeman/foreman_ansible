import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { MockedProvider } from '@apollo/react-testing';

import toasts from 'foremanReact/redux/reducers/toasts';

export const withRedux = Component => props => {
  const combinedReducers = combineReducers({
    toasts,
  });

  const store = createStore(combinedReducers);
  return (
    <Provider store={store}>
      <Component {...props} />
    </Provider>
  );
};

export const withMockedProvider = Component => props => {
  // eslint-disable-next-line react/prop-types
  const { mocks, ...rest } = props;

  return (
    <MockedProvider mocks={mocks}>
      <Component {...rest} />
    </MockedProvider>
  );
};

// use to resolve async mock requests for apollo MockedProvider
export const tick = () => new Promise(resolve => setTimeout(resolve, 0));
