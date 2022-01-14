import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { Button } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';

import ansibleRolesQuery from '../../../../graphql/queries/hostAnsibleRoles.gql';
import { encodeId } from '../../../../globalIdHelper';
import RolesTable from './RolesTable';
import {
  useParamsToVars,
  useCurrentPagination,
} from '../../../../helpers/pageParamsHelper';
import EditRolesModal from './EditRolesModal';

const RolesTab = ({ hostId, history, canEditHost }) => {
  const hostGlobalId = encodeId('Host', hostId);
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
      <RolesTable
        fetchFn={useFetchFn}
        renamedDataPath="ansibleRoles"
        renameData={renameData}
        permissions={['view_ansible_roles']}
        history={history}
        hostGlobalId={hostGlobalId}
        emptyStateProps={{
          header: __('No Ansible roles assigned'),
          action: editBtn,
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
