import { NAME } from './constants';

export const selIsLoading = state => !!state[NAME].pending;
export const selErrors = state => state[NAME].errors;
export default selErrors;
