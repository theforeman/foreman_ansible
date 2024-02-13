import React from 'react';

export const hostgroupsLink = (
  roleName,
  hostgroupsCount,
  apiStatus,
  permissions
) => {
  if (
    apiStatus === 'RESOLVED' &&
    permissions.some(perm => perm.name === 'view_hostgroups')
  ) {
    return link(hostgroupsUrl(roleName), hostgroupsCount);
  }
  return hostgroupsCount;
};

export const hostsLink = (
  roleName,
  hostgroupsCount,
  apiStatus,
  permissions
) => {
  if (
    apiStatus === 'RESOLVED' &&
    permissions.some(perm => perm.name === 'view_hosts')
  ) {
    return link(hostsUrl(roleName), hostgroupsCount);
  }
  return hostgroupsCount;
};

export const variablesLink = (
  roleName,
  hostgroupsCount,
  apiStatus,
  permissions
) => {
  if (
    apiStatus === 'RESOLVED' &&
    permissions.some(perm => perm.name === 'view_ansible_variables')
  ) {
    return link(variablesUrl(roleName), hostgroupsCount);
  }
  return hostgroupsCount;
};

const link = (url, displayText) => (
  <a href={url} target="_blank" rel="noreferrer">
    {displayText}
  </a>
);

const hostgroupsUrl = roleName => `/hostgroups${searchString(roleName)}`;
const hostsUrl = roleName => `/new/hosts${searchString(roleName)}`;
const variablesUrl = roleName => `ansible_variables${searchString(roleName)}`;
const searchString = roleName =>
  `?search=${encodeURIComponent(`ansible_role = ${roleName}`)}`;

export const importUrl = (proxyName, proxyId) =>
  `ansible_roles/import?proxy=${encodeURIComponent(`${proxyId}-${proxyName}`)}`;
