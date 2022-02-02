import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { Button } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';

import ansibleRolesQuery from '../../../../../graphql/queries/hostAnsibleRoles.gql';
import HostRolesTable from './HostRolesTable';
import {
  useParamsToVars,
  useCurrentPagination,
} from '../../../../../helpers/pageParamsHelper';
import EditRolesModal from '../EditRolesModal';

const HostRoles = ({ hostId, hostGlobalId, history, canEditHost }) => {
  const pagination = useCurrentPagination(history);
  const [assignModal, setAssignModal] = useState(false);
  const renameData = data => ({
    ansibleRoles: data.host.ownAnsibleRoles.nodes,
    totalCount: data.host.ownAnsibleRoles.totalCount,
  });

  const useFetchFn = () =>
    useQuery(ansibleRolesQuery, {
      variables: { id: hostGlobalId, ...useParamsToVars(history) },
      fetchPolicy: 'network-only',
    });

  const editBtn = canEditHost ? (
    <Button
      onClick={() => setAssignModal(true)}
      aria-label="edit ansible roles"
    >
      {__('Assign Ansible roles')}
    </Button>
  ) : null;
  return (
    <>
      <HostRolesTable
        fetchFn={useFetchFn}
        renamedDataPath="ansibleRoles"
        renameData={renameData}
        permissions={['view_ansible_roles']}
        history={history}
        emptyStateProps={{
          header: __('No Ansible roles assigned'),
          action: editBtn,
        }}
        pagination={pagination}
        hostId={hostId}
        canEditHost={canEditHost}
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

HostRoles.propTypes = {
  hostId: PropTypes.number.isRequired,
  hostGlobalId: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  canEditHost: PropTypes.bool.isRequired,
};

export default HostRoles;
