import { ANSIBLE_KEY } from './constants';

export const hashRoute = subpath => `#/${ANSIBLE_KEY}/${subpath}`;
export const route = subpath => hashRoute(subpath).substring(1);
