import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Flex, FlexItem } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { translate as __ } from 'foremanReact/common/I18n';
import { encodeId } from '../../../../globalIdHelper';
import HostRoles from './HostRoles';
import AllRoles from './AllRoles';

const RolesTab = ({ hostId, history, canEditHost }) => {
  const hostGlobalId = encodeId('Host', hostId);
  const [showAll, setShowAll] = useState(false);

  const EditAnsibleRoles = () => (
    <Flex>
      <FlexItem>
        <Link to="/Ansible/roles/edit">
          <Button aria-label="edit ansible roles">
            {__('Edit Ansible roles')}
          </Button>
        </Link>
      </FlexItem>
    </Flex>
  );

  const Navigation = () => (
    <>
      {canEditHost && <EditAnsibleRoles />}
      <Flex>
        <FlexItem>
          <Checkbox
            id="view_all_assigned_roles"
            label={__('View all assigned roles')}
            isChecked={showAll}
            onChange={() => setShowAll(!showAll)}
          />
        </FlexItem>
      </Flex>
    </>
  );

  if (showAll) {
    return (
      <>
        <Navigation />
        <AllRoles hostGlobalId={hostGlobalId} history={history} />
      </>
    );
  }
  return (
    <>
      <Navigation />
      <HostRoles
        hostId={hostId}
        hostGlobalId={hostGlobalId}
        history={history}
        canEditHost={canEditHost}
      />
    </>
  );
};

RolesTab.propTypes = {
  hostId: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  canEditHost: PropTypes.bool.isRequired,
};

export default RolesTab;
