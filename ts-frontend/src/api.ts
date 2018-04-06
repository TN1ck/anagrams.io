import axios from 'axios';
import {Word} from './anagram';
import {Performance} from './performance/performance';

import {BACKEND_URL} from './constants';

export enum RequestStatus {
  none = 'none',
  loading = 'loading',
  success = 'success',
  error = 'error',
};

export function getSubAnagrams(query: string, dictionaries: string)  {
  return axios.get<{
    success: boolean;
    anagrams: Word[];
  }>(BACKEND_URL + '/anagram/' + query + '?dictionary=' + dictionaries);
}

export interface Dictionary {
  id: string;
  name: string;
}

export function getDictionaries() {
  return axios.get<{
    success: boolean;
    dictionaries: Dictionary[];
  }>(BACKEND_URL + '/anagram-dictionaries');
}

export function postPerformance(performance: Performance) {
  return axios.post<{success: boolean, performances: Performance[]}>(BACKEND_URL + '/performance', performance);
}

export function getPerformances() {
  return axios.get<{success: boolean, performances: Performance[]}>(BACKEND_URL + '/performances');
}
