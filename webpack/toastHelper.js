import store from 'foremanReact/redux';
import { addToast } from 'foremanReact/components/ToastsList';

export const showToast = toast => store.dispatch(addToast(toast));
