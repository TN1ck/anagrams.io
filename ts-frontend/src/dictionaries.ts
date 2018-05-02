import {stringToWord, sanitizeQuery, SimpleWord} from './anagram';

export function parseDictionary(rawDictionary: string): SimpleWord[] {
  const rows = rawDictionary.split('\n');
  return rows.map(str => {
    const sanitized = sanitizeQuery(str);
    const nStr = stringToWord(sanitized);
    return nStr;
  });
}

export function filterDictionaryFromDictionary(dict1: SimpleWord[], dict2: SimpleWord[]) {
  return dict1.filter(w => {
    return w.length > 3;
  }).concat(dict2.filter(w => w.length >= 1));
}
