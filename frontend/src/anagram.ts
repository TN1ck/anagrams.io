import * as dictionary from 'dictionaries/eng-us-1.csv';
import {groupBy, sortBy, identity} from 'lodash';

type NString = string[];

interface Word {
  set: string[],
  word: string;
};

function stringToWord (str: string): Word {
  const sorted = sortBy([...str], identity);
  let i = 0;
  let j = 0;
  let newString = [];
  for (let c of sorted) {
    if (j !== 0) {
      const lastChar = sorted[j - 1];
      if (lastChar === c) {
        i += 1;
      } else {
        i = 0;
      }
    }
    newString.push(c + i);
    j++;
  }
  return {
    set: newString,
    word: str,
  };
}

function isSubset(nStr1: NString, nStr2: NString): boolean {
  const length1 = nStr1.length;
  const length2 = nStr2.length;

  let searchIndex = 0;
  for (let i = 0; i < length2; i++) {
    if (searchIndex >= length1) {
      // we have a success!
      return true;
    }
    const current1 = nStr1[searchIndex];
    const current2 = nStr2[i];
    if (current1 === current2) {
      searchIndex += 1;
    }
  }
  // when length2 === length1
  return searchIndex === length1;
}

function isSame(nStr1: NString, nStr2: NString): boolean {
  const sameSize = nStr1.length === nStr2.length;
  if (sameSize) {
    for (let i = 0; i < nStr1.length; i++) {
      if (nStr1[i] !== nStr2[i]) {
        return false;
      }
    }
    return true;
  }
  return false;
}

// console.log('issubset', isSubset(stringToNstring('mother'), stringToNstring('thermo')));

export function parseDictionary(rawDictionary: string): Word[] {
  const rows = rawDictionary.split('\n');
  return rows.map(r => {
    const nStr = stringToWord(r);
    return nStr;
  });
}

export function findAnagrams(query: string, dictionary: Word[]): Word[] {
  const nQuery = stringToWord(query);
  return dictionary.filter(nStr => {
    return isSame(nStr.set, nQuery.set);
  });
}

export function findSubAnagrams(query: string, dictionary: Word[]): Word[] {
  const nQuery = stringToWord(query);
  return dictionary.filter(nStr => {
    return isSubset(nStr.set, nQuery.set);
  })
}

const dict = parseDictionary(dictionary as any);
console.log('anagrams', findAnagrams("mother", dict));
console.log('anagrams', findSubAnagrams("mother", dict));