import $ from 'jquery';

const formFields = () =>
  $('form.hostresource-form input,select,textarea')
    .not('.ansible-role-id-input')
    .not('.form_template *');

const serializeForm = () => formFields().serialize();

export const reloadOverrides = (
  url,
  id,
  resourceName,
  assignedRoleIds,
  onSuccess,
  onError
) => {
  const resourceField = resourceName.toLowerCase();

  let payload = assignedRoleIds.reduce(
    (memo, roleId) => `${memo}&${resourceField}[ansible_role_ids][]=${roleId}`,
    ''
  );

  if (id) {
    payload = `${payload}&${resourceField}[id]=${id}`;
  }

  updateForm(payload, url, onSuccess, onError);
};

const updateForm = (payload, url, onSuccess, onError) => {
  const data = serializeForm().replace('method=patch', 'method=post') + payload;

  // eslint-disable-next-line jquery/no-ajax
  return $.ajax({
    type: 'post',
    url,
    data,
    success: response => onSuccess(response),
    error: response => onError(response),
  });
};
