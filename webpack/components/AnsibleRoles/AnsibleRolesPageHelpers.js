import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';

export const getActions = ({ id, name, canDelete, ...item }) => [
  {
    title: (
      <a href={hostgroupsUrl(name)} target="_blank" rel="noreferrer">
        {__('View Hostgroups')}
      </a>
    ),
    isDisabled: false,
  },
  {
    title: (
      <a href={hostsUrl(name)} target="_blank" rel="noreferrer">
        {__('View Hosts')}
      </a>
    ),
    isDisabled: false,
  },
  {
    title: (
      <a href={variablesUrl(name)} target="_blank" rel="noreferrer">
        {__('View Variables')}
      </a>
    ),
    isDisabled: false,
  },
];

const hostgroupsUrl = roleName => `/hostgroups${searchString(roleName)}`;
const hostsUrl = roleName => `/hosts${searchString(roleName)}`;
const variablesUrl = roleName => `ansible_variables${searchString(roleName)}`;
const searchString = roleName =>
  `?search=${encodeURIComponent(`ansible_role = ${roleName}`)}`;

export const importUrl = (proxyName, proxyId) =>
  `ansible_roles/import?proxy=${encodeURIComponent(`${proxyId}-${proxyName}`)}`;
