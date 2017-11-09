import {Word, stringToWord, sanitizeQuery} from './anagram';

export function parseDictionary(rawDictionary: string): Word[] {
  const rows = rawDictionary.split('\n');
  return rows.map(str => {
    const sanitized = sanitizeQuery(str);
    const nStr = stringToWord(sanitized);
    return nStr;
  });
}

export function filterDictionaryFromDictionary(dict1: Word[], dict2: Word[]) {
  const wordStrings = dict2.map(d => d.word);
  return dict1.filter(w => {
    return w.word.length > 3 || wordStrings.includes(w.word);
  });
}