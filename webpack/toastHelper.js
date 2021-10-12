import store from 'foremanReact/redux';
import { addToast } from 'foremanReact/redux/actions/toasts';

export const showToast = toast => store.dispatch(addToast(toast));
