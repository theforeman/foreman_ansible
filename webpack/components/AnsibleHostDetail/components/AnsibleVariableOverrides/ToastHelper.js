import { addToast } from 'foremanReact/redux/actions/toasts';

export const dispatchToast = dispatch => toast => dispatch(addToast(toast));
