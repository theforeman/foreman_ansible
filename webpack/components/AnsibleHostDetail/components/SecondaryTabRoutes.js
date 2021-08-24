import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';

import AnsibleVariableOverrides from './AnsibleVariableOverrides';
import RolesTab from './RolesTab';
import TabLayout from './TabLayout';

import WrappedAnsibleHostInventory from './AnsibleHostInventory';
import { ANSIBLE_KEY } from '../constants';
import { route } from '../helpers';

const SecondaryTabRoutes = ({ id }) => (
  <Switch>
    <Route exact path={`/${ANSIBLE_KEY}`}>
      <Redirect to={route('roles')} />
    </Route>
    <Route path={route('roles')}>
      <TabLayout>
        <RolesTab hostId={id} />
      </TabLayout>
    </Route>
    <Route path={route('variables')}>
      <TabLayout>
        <AnsibleVariableOverrides id={id} />
      </TabLayout>
    </Route>
    <Route path={route('inventory')}>
      <TabLayout>
        <WrappedAnsibleHostInventory hostId={id} />
      </TabLayout>
    </Route>
  </Switch>
);

SecondaryTabRoutes.propTypes = {
  id: PropTypes.number.isRequired,
};

export default SecondaryTabRoutes;
