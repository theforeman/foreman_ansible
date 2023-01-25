import { translate as __, sprintf } from 'foremanReact/common/I18n';

export const permissionCheck = (user, permissionsRequired) => {
  if (permissionsRequired.length === 0) {
    return { allowed: true };
  }

  if (!user) {
    throw new Error(
      'No user data when loading the page - cannot determine if current user is allowed to view the page.'
    );
  }

  if (
    user.admin ||
    user.usergroups.nodes.find(usergroup => usergroup.admin === true)
  ) {
    return { allowed: true };
  }

  const permList = permissionsRequired.reduce((memo, item) => {
    const found = user.permissions.nodes.find(
      permission => permission.name === item
    );
    memo.push({ name: item, present: !!found });
    return memo;
  }, []);

  if (permList.reduce((memo, item) => memo && item.present, true)) {
    return { allowed: true, permissions: permList };
  }

  return { allowed: false, permissions: permList };
};

export const permissionDeniedMsg = permissions => {
  let msg = __('You are not authorized to view the page. ');
  if (permissions?.length > 0) {
    msg += sprintf(
      __('Request the following permissions from administrator: %s.'),
      permissions.join(', ')
    );
  }
  return msg;
};

export const allowPrimaryAction = (
  emptyStateProps,
  currentUser,
  permissionsRequired
) => {
  if (!permissionCheck(currentUser, permissionsRequired).allowed) {
    return Object.keys(emptyStateProps)
      .filter(key => key !== 'action')
      .reduce((memo, key) => {
        memo[key] = emptyStateProps[key];
        return memo;
      }, {});
  }
  return emptyStateProps;
};
