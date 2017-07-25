function show_ad_hoc_role_modal(modal_id) {
  var modal_window = !modal_id ? $('#adHocRoleModal') : $('#adHocRoleModal' + modal_id);
  modal_window.modal({'show': true});
  modal_window.find('a[rel="popover-modal"]').popover();
  activate_select2(modal_window);
}

function close_ad_hoc_role_modal(modal_id) {
  var modal_window = !modal_id ? $('#adHocRoleModal') : $('#adHocRoleModal' + modal_id);
  modal_window.modal('hide');
}
