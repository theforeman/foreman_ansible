import React from 'react';

export const orderable = (Component, orderableProps) => props => (
  <Component {...orderableProps} {...props} />
);
