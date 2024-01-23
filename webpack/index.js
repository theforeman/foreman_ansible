import componentRegistry from 'foremanReact/components/componentRegistry';
import injectReducer from 'foremanReact/redux/reducers/registerReducer';
import ReportJsonViewer from './components/ReportJsonViewer';
import AnsibleRolesSwitcher from './components/AnsibleRolesSwitcher';
import WrappedImportRolesAndVariables from './components/AnsibleRolesAndVariables';
import reducer from './reducer';
import { AnsibleRolesTable } from './components/AnsibleRoles/AnsibleRolesTable';
import { YamlVariablesImporterWrapper } from './components/YamlVariablesImporter/YamlVariablesImporterWrapper';

componentRegistry.register({
  name: 'ReportJsonViewer',
  type: ReportJsonViewer,
});
componentRegistry.register({
  name: 'AnsibleRolesSwitcher',
  type: AnsibleRolesSwitcher,
});

componentRegistry.register({
  name: 'WrappedImportRolesAndVariables',
  type: WrappedImportRolesAndVariables,
});

componentRegistry.register({
  name: 'YamlVariablesImporterWrapper',
  type: YamlVariablesImporterWrapper,
});

componentRegistry.register({
  name: 'AnsibleRolesTable',
  type: AnsibleRolesTable,
});

injectReducer('foremanAnsible', reducer);
