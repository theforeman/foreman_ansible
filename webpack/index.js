import componentRegistry from 'foremanReact/components/componentRegistry';
import injectReducer from 'foremanReact/redux/reducers/registerReducer';
import ReportJsonViewer from './components/ReportJsonViewer';
import AnsibleRolesSwitcher from './components/AnsibleRolesSwitcher';
import WrappedImportRolesAndVariables from './components/AnsibleRolesAndVariables';
import reducer from './reducer';
import { VcsCloneModalContent } from './components/VcsCloneModalContent/VcsCloneModalContent';

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
  name: 'VcsCloneModalContent',
  type: VcsCloneModalContent,
});

injectReducer('foremanAnsible', reducer);
