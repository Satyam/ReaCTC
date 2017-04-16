import {
  NAME,
} from './constants';

export const isLoading = state => !!state[NAME].pending;
export const errors = state => state[NAME].errors;
