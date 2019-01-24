import React from 'react';

const withProtectedView = (ProtectedComponent, ProtectionComponent, protectionFn) => props => (
  protectionFn(props) ?
    <ProtectedComponent {...props} /> :
    <ProtectionComponent {...props} />
);

export default withProtectedView;
