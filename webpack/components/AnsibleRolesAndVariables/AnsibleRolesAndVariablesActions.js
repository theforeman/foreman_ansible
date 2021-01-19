import { post } from 'foremanReact/redux/API';
import { push } from 'connected-react-router';
import { prepareResult } from './AnsibleRolesAndVariablesHelpers';
import {
  ANSIBLE_ROLES_INDEX,
  ANSIBLE_ROLE_CONFIRM_IMPORT_PATH,
} from './AnsibleRolesAndVariablesConstants';

export const onSubmit = (rows, proxy) => dispatch => {
  const params = prepareResult(rows);
  dispatch(
    post({
      key: 'import_ansible_v_r',
      url: ANSIBLE_ROLE_CONFIRM_IMPORT_PATH,
      params: { changed: params, proxy },
      handleSuccess: () => {
        dispatch(push(ANSIBLE_ROLES_INDEX));
      },
    })
  );
};
