import React from 'react';

export const ANSIBLE_ROLES_API = '/ansible/api/v2/ansible_roles/';
export const linkCellFormatter = ({ title: url }) => ({
  children: <a href={url.split(' ')[1]}>{url.split(' ')[0]}</a>,
});
