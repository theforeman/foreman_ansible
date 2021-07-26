import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { Route, Link } from 'react-router-dom';

import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import { Flex, FlexItem, Button } from '@patternfly/react-core';

import EditRolesModal from './EditRolesModal';

import withLoading from '../../../withLoading';
import AllRolesModal from './AllRolesModal';

const RolesTable = props => {
  const columns = [__('Name')];

  return (
    <React.Fragment>
      <h3>{__('Assigned Ansible Roles')}</h3>
      <Flex>
        <FlexItem>
          <Link to="/Ansible/roles/edit">
            <Button aria-label="edit ansible roles">
              {__('Edit Ansible Roles')}
            </Button>
          </Link>
        </FlexItem>
        <FlexItem>
          <Link to="/Ansible/roles/all">
            <Button variant="link">{__('View all assigned roles')}</Button>
          </Link>
        </FlexItem>
      </Flex>
      <TableComposable variant="compact">
        <Thead>
          <Tr>
            {columns.map((col, idx) => (
              <Th key={col}>{col}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {props.ansibleRoles.map(role => (
            <Tr key={role.id}>
              <Td>{role.name}</Td>
            </Tr>
          ))}
        </Tbody>
      </TableComposable>
      <Route path="/Ansible/roles/edit">
        <EditRolesModal
          closeModal={() => props.history.push('/Ansible/roles')}
          isOpen
          assignedRoles={props.ansibleRoles}
          hostId={props.hostId}
        />
      </Route>
      <Route path="/Ansible/roles/all">
        <AllRolesModal
          onClose={() => props.history.push('/Ansible/roles')}
          isOpen
          hostGlobalId={props.hostGlobalId}
        />
      </Route>
    </React.Fragment>
  );
};

RolesTable.propTypes = {
  ansibleRoles: PropTypes.array.isRequired,
  hostId: PropTypes.number.isRequired,
  hostGlobalId: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};

export default withLoading(RolesTable);
