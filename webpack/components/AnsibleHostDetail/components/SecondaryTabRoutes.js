import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';

import AnsibleVariableOverrides from './AnsibleVariableOverrides';
import RolesTab from './RolesTab';
import JobsTab from './components/JobsTab';
import TabLayout from './TabLayout';

import WrappedAnsibleHostInventory from './AnsibleHostInventory';
import { ANSIBLE_KEY } from '../constants';
import { route } from '../helpers';

const SecondaryTabRoutes = ({ response }) => (
  <Switch>
    <Route exact path={`/${ANSIBLE_KEY}`}>
      <Redirect to={route('roles')} />
    </Route>
    <Route path={route('roles')}>
      <TabLayout>
        <RolesTab hostId={response.id} />
      </TabLayout>
    </Route>
    <Route path={route('variables')}>
      <TabLayout>
        <AnsibleVariableOverrides id={response.id} />
      </TabLayout>
    </Route>
    <Route path={route('inventory')}>
      <TabLayout>
        <WrappedAnsibleHostInventory hostId={response.id} />
      </TabLayout>
    </Route>
    <Route path={route('jobs')}>
      <TabLayout>
        <JobsTab response={response} />
      </TabLayout>
    </Route>
  </Switch>
);

SecondaryTabRoutes.propTypes = {
  response: PropTypes.object.isRequired,
};

export default SecondaryTabRoutes;
