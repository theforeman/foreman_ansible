import { selectAPIStatus } from 'foremanReact/redux/API/APISelectors';
import { IMPORT_ANSIBLE_V_R } from './AnsibleRolesAndVariablesConstants';

// API statuses
export const selectApiImportStatus = state =>
  selectAPIStatus(state, IMPORT_ANSIBLE_V_R);
