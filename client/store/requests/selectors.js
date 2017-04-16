import { NAME } from './constants';

export const isLoading = state => !!state[NAME].pending;
export const requestErrors = state => state[NAME].errors;
