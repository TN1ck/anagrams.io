import axios from 'axios';

import {BACKEND_URL} from './constants';

export enum RequestStatus {
  none = 'none',
  loading = 'loading',
  success = 'success',
  error = 'error',
};

export function getAnagram(query: string) {
  return axios.get(BACKEND_URL + '/anagram/' + query);
}

export function getAnagramSentences(query: string) {
  return axios.get(BACKEND_URL + '/anagram-sentences/' + query);
}