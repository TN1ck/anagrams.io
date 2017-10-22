import * as dictionaryEngUs1 from 'dictionaries/eng-us-1.csv';
import * as dictionaryEngUs2 from 'dictionaries/eng-us-2.csv';
import {groupBy, sortBy, identity, drop, last} from 'lodash';

type NString = string[];

interface Word {
  set: string[],
  word: string;
};

export function sanitizeQuery(str: string): string {
  return str.toLowerCase()
    .replace(/ü/g, 'ue')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ /g, '');
}

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

function nStringToString(nString: NString): string {
  let string = '';

  for (let c of nString) {
    string += c[0];
  }
  return string;
}

// todo: can be made faster, only one pass should be needed
function joinTwoNStrings(w1: NString, w2: NString) {
  const str1 = nStringToString(w1);
  const str2 = nStringToString(w2);
  return stringToWord(str1 + str2).set;
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

export function sortWordList(wordList: Word[]) {
  return sortBy(wordList, w => -w.word.length);
}


export interface IndexedWord {
  word: Word;
  index: number;
}

export interface AnagramSolution {
  list: IndexedWord[];
  set: NString;
  goodness: number;
}

export function findAnagramSentences(query: string, dictionary: Word[]): {
  subanagrams: IndexedWord[],
  generator: () => IterableIterator<{
    current: AnagramSolution,
    solution: boolean,
    numberOfPossibilitiesChecked: number,
  }>
} {
  
  // const query = sanitizeQuery(input);
  console.log('Finding anagrams for', query);

  const nQuery = stringToWord(query);
  const _subanagrams = findSubAnagrams(query, dictionary);
  // we like long words more
  const sorted = sortWordList(_subanagrams);
  const subanagrams: IndexedWord[] = sorted.map((word, index) => {
    return {
      word: word,
      index,
    };
  });

  console.log(`There are ${subanagrams.length} subanagrams to start with`);
  
  const initialStack = subanagrams.map((w) => {
    return {
      list: [w],
      set: w.word.set,
      goodness: 0,
    }
  });
  
  
  const queryLength = query.length;
  
  const generator = function* () {

    let stack: AnagramSolution[] = initialStack;
    const solutions: AnagramSolution[] = [];

    let numberOfPossibilitiesChecked = initialStack.length;
    while(stack.length !== 0) {
      const current = stack.shift() as AnagramSolution;
      let solution = false;

      if (isSame(nQuery.set, current.set)) {
        solutions.push(current);
        solution = true;
      } else {

        const charsMissing = queryLength - current.set.length;

        // drop all subanagrams that were before index
        const droppedSubanagrams = drop(subanagrams, current.list[0].index); 

        numberOfPossibilitiesChecked += droppedSubanagrams.length;

        // first filter those out, that are two big
        const possibleSubanagrams = droppedSubanagrams.filter(s => {
          return s.word.word.length <= charsMissing;
        });

        const combinedWords = possibleSubanagrams.map(w => {
          return {
            word: w,
            combined: joinTwoNStrings(w.word.set, current.set)
          };
        });

        // check if the result is still a subset
        const filterCombined = combinedWords.filter(cw => {
          return isSubset(cw.combined, nQuery.set);
        });

        const newStackItems: AnagramSolution[] = filterCombined.map(cw => {
          return {
            list: [cw.word].concat(current.list),
            goodness: current.goodness,
            set: cw.combined,
          };
        });

        for (let item of newStackItems) {
          stack.unshift(item);
        }
      }

      yield {
        current,
        solution,
        numberOfPossibilitiesChecked,
      };
    }
  }



  return {
    generator,
    subanagrams,
  };
}

export const dictionaries = {
  engUS1: parseDictionary(dictionaryEngUs1 as any),
  engUS2: parseDictionary(dictionaryEngUs2 as any),
};

// console.log(dictionaries.engUS1.filter(w => w.word.length === 3).map(w => w.word));