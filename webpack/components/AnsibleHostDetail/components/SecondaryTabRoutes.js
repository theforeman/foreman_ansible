import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';

import AnsibleVariableOverrides from './AnsibleVariableOverrides';
import RolesTab from './RolesTab';
import JobsTab from './JobsTab';
import TabLayout from './TabLayout';

import WrappedAnsibleHostInventory from './AnsibleHostInventory';
import { ANSIBLE_KEY } from '../constants';
import { route } from '../helpers';

const SecondaryTabRoutes = ({ response, router, history }) => (
  <Switch>
    <Route exact path={`/${ANSIBLE_KEY}`}>
      <Redirect to={route('roles')} />
    </Route>
    <Route path={route('roles')}>
      <TabLayout>
        <RolesTab
          hostId={response.id}
          history={history}
          canEditHost={response.permissions.edit_hosts}
        />
      </TabLayout>
    </Route>
    <Route path={route('variables')}>
      <TabLayout>
        <AnsibleVariableOverrides
          hostId={response.id}
          hostAttrs={response}
          history={history}
        />
      </TabLayout>
    </Route>
    <Route path={route('inventory')}>
      <TabLayout>
        <WrappedAnsibleHostInventory hostId={response.id} />
      </TabLayout>
    </Route>
    <Route path={route('jobs')}>
      <TabLayout>
        <JobsTab
          resourceId={response.id}
          resourceName="host"
          hostGroupId={response.hostgroup_id}
          history={history}
        />
      </TabLayout>
    </Route>
  </Switch>
);

SecondaryTabRoutes.propTypes = {
  response: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default SecondaryTabRoutes;
