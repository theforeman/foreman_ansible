import React from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from 'foremanReact/redux/actions/toasts';
import AnsibleVariableOverrides from './AnsibleVariableOverrides';

const WrappedAnsibleVariableOverrides = props => {
  const dispatch = useDispatch();
  const showToast = toast => dispatch(addToast(toast));

  return <AnsibleVariableOverrides showToast={showToast} {...props} />;
};

export default WrappedAnsibleVariableOverrides;
