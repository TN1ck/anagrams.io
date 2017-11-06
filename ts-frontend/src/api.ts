import axios from 'axios';
import {IndexedWord} from './anagram';

import {BACKEND_URL} from './constants';

export enum RequestStatus {
  none = 'none',
  loading = 'loading',
  success = 'success',
  error = 'error',
};

export function getSubAnagrams(query: string)  {
  return axios.get<{
    success: boolean;
    anagrams: IndexedWord[];
  }>(BACKEND_URL + '/anagram/' + query);
}

interface Dictionary {
  id: string;
  name: string;
}

export function getDictionaries() {
  return axios.get<{
    success: boolean;
    dictionaries: Dictionary[];
  }>(BACKEND_URL + '/anagram-dictionaries');
}