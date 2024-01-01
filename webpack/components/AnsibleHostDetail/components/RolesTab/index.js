import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { Button } from '@patternfly/react-core';
import { Link, Route } from 'react-router-dom';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';

import ansibleRolesQuery from '../../../../graphql/queries/hostAnsibleRoles.gql';
import { encodeId } from '../../../../globalIdHelper';
import RolesTable from './RolesTable';
import {
  useParamsToVars,
  useCurrentPagination,
} from '../../../../helpers/pageParamsHelper';
import EditRolesModal from './EditRolesModal';
import AllRolesModal from './AllRolesModal';

const RolesTab = ({ hostId, history, canEditHost }) => {
  const hostGlobalId = encodeId('Host', hostId);
  const pagination = useCurrentPagination(history);
  const [assignModal, setAssignModal] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const setTotalCount = data => {
    if (!data) return;
    const { totalCount } = data.host.ownAnsibleRoles;
    if (totalItems === 0) setTotalItems(totalCount);
  };

  const renameData = data => ({
    ansibleRoles: data.host.ownAnsibleRoles.nodes,
    totalCount: data.host.ownAnsibleRoles.totalCount,
  });

  const useFetchFn = () =>
    useQuery(ansibleRolesQuery, {
      variables: { id: hostGlobalId, ...useParamsToVars(history, totalItems) },
      fetchPolicy: 'network-only',
      onCompleted: setTotalCount,
    });

  const editBtn = canEditHost ? (
    <Button
      onClick={() => setAssignModal(true)}
      aria-label="edit ansible roles"
      ouiaId="edit-ansible-roles-button"
    >
      {__('Assign roles directly to the host')}
    </Button>
  ) : null;

  const url = hostId && foremanUrl(`/api/v2/hosts/${hostId}/ansible_roles`);
  const { response: allAnsibleRoles } = useAPI('get', url, {
    key: 'ANSIBLE_ROLES',
  });
  const emptyStateDescription = allAnsibleRoles.length > 0 && (
    <>
      <Route path="/Ansible/roles/all">
        <AllRolesModal
          onClose={() => history.push('/Ansible/roles')}
          isOpen
          hostGlobalId={hostGlobalId}
          history={history}
        />
      </Route>
      <Link to="/Ansible/roles/all">{__('View inherited roles')}</Link>
    </>
  );

  return (
    <>
      <RolesTable
        fetchFn={useFetchFn}
        renamedDataPath="ansibleRoles"
        renameData={renameData}
        permissions={['view_ansible_roles']}
        history={history}
        hostGlobalId={hostGlobalId}
        emptyStateProps={{
          header: __('No roles assigned directly to the host'),
          action: editBtn,
          description: emptyStateDescription,
        }}
        pagination={pagination}
        canEditHost={canEditHost}
        hostId={hostId}
      />
      {assignModal && (
        <EditRolesModal
          closeModal={() => setAssignModal(false)}
          isOpen={assignModal}
          assignedRoles={[]}
          hostId={hostId}
          canEditHost={canEditHost}
        />
      )}
    </>
  );
};

RolesTab.propTypes = {
  hostId: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  canEditHost: PropTypes.bool.isRequired,
};

export default RolesTab;
