import { combineReducers } from 'redux';

import ansibleRolesSwitcher from './components/AnsibleRolesSwitcher/AnsibleRolesSwitcherReducer';
import yamlVariablesReducer from './components/YamlVariablesImporter/YamlVariablesImporterReducer';

export default combineReducers({
  ansibleRolesSwitcher,
  yamlVariablesReducer,
});
