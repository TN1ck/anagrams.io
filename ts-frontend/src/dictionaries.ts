import {Word, stringToWord} from './anagram';

// 1 and 2 letter words are the most 'problematic', as they match easily
// but do not look good. So we allow only specific words there
const ALLOWED_WORDS_SMALLER_THAN_TWO = [
  "a",
  "ad",
  "ah",
  "am",
  "as",
  "at",
  "be",
  "by",
  "do",
  "go",
  "he",
  "hi",
  "i",
  "ie",
  "if",
  "in",
  "it",
  "me",
  "mr",
  "ms",
  "my",
  "no",
  "of",
  "oh",
  "ok",
  "on",
  "or",
  "pc",
  "pm",
  "so",
  "to",
  "tv",
  "up",
  "us",
  "vs",
  "we",
];

export function parseDictionary(rawDictionary: string): Word[] {
  const rows = rawDictionary.split('\n');
  return rows.map(str => {
    const lowercaseStr = str.toLowerCase();
    const nStr = stringToWord(lowercaseStr);
    return nStr;
  }).filter(str => {
    return str.word.length > 2 || ALLOWED_WORDS_SMALLER_THAN_TWO.includes(str.word);
  });
}