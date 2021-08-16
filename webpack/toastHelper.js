import { addToast } from 'foremanReact/redux/actions/toasts';

export const showToast = dispatch => toast => dispatch(addToast(toast));
