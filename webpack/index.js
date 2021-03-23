import componentRegistry from 'foremanReact/components/componentRegistry';
import injectReducer from 'foremanReact/redux/reducers/registerReducer';
import ReportJsonViewer from './components/ReportJsonViewer';
import AnsibleRolesSwitcher from './components/AnsibleRolesSwitcher';
import WrappedImportRolesAndVariables from './components/AnsibleRolesAndVariables';
import AnsibleHostParams from './components/AnsibleHostParams';
import reducer from './reducer';

componentRegistry.register({
  name: 'ReportJsonViewer',
  type: ReportJsonViewer,
});
componentRegistry.register({
  name: 'AnsibleRolesSwitcher',
  type: AnsibleRolesSwitcher,
});
componentRegistry.register({
  name: 'AnsibleHostParams',
  type: AnsibleHostParams,
});

componentRegistry.register({
  name: 'WrappedImportRolesAndVariables',
  type: WrappedImportRolesAndVariables,
});

injectReducer('foremanAnsible', reducer);
