import React from 'react';
import { Provider } from 'react-redux';
import { MockedProvider } from '@apollo/react-testing';

import store from 'foremanReact/redux';
import ConfirmModal from 'foremanReact/components/ConfirmModal';

export const withRedux = Component => props => (
  <Provider store={store}>
    <Component {...props} />
    <ConfirmModal />
  </Provider>
);

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
