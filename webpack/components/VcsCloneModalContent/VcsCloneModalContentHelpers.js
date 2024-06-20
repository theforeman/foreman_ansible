import React from 'react';
import { translate as __, sprintf } from 'foremanReact/common/I18n';
import { showToast } from '../../toastHelper';
import { foremanUrl } from '../AnsibleRolesAndVariables/AnsibleRolesAndVariablesActions';

export const fetchSmartProxies = async () => {
  const response = await fetch('/api/smart_proxies');
  const responseJson = await response.json();
  const tempSmartProxies = {};
  responseJson.results.forEach(proxy =>
    proxy.features.forEach(feature => {
      if (feature.name === 'Ansible') {
        if (feature.capabilities.includes('vcs_clone')) {
          tempSmartProxies[proxy.name] = proxy.id;
        }
      }
    })
  );
  return {
    ok: response.ok,
    proxies: tempSmartProxies,
  };
};

export const getRepoInfo = async (smartProxyId, repoUrl) => {
  const response = await fetch(
    `/api/v2/smart_proxies/${smartProxyId}/repository_metadata?${new URLSearchParams(
      {
        vcs_url: repoUrl,
      }
    )}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return {
    ok: response.ok,
    result: await response.json(),
  };
};

export const installRole = async (
  updateExisting,
  smartProxyId,
  repoUrl,
  repoName,
  repoRef
) => {
  const response = await fetch(
    updateExisting
      ? `/api/v2/smart_proxies/${smartProxyId}/roles/${repoName}`
      : `/api/v2/smart_proxies/${smartProxyId}/roles`,
    {
      method: updateExisting ? 'PUT' : 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repo_info: {
          vcs_url: repoUrl,
          role_name: repoName,
          ref: repoRef,
        },
      }),
    }
  );

  return {
    ok: response.ok,
    status: response.status,
    result: await response.json(),
  };
};

export const showSuccessToast = (taskId, repoName) => {
  showToast({
    type: 'success',
    message: (
      <span>
        {sprintf(__('Cloning of %(rName)s from Git started:'), {
          rName: repoName,
        })}
        <br />
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={foremanUrl(`/foreman_tasks/tasks/${taskId}`)}
        >
          {sprintf(__('View task %(tId)s'), { tId: taskId })}
        </a>
      </span>
    ),
  });
};

export const showErrorToast = (statusCode, repoName) => {
  showToast({
    type: 'danger',
    message: (
      <span>
        {sprintf(__('Could not start cloning %(rName)s from Git'), {
          rName: repoName,
        })}
        <br />
        {sprintf(__('Status-Code: %(status)s'), { status: statusCode })}
      </span>
    ),
  });
};
