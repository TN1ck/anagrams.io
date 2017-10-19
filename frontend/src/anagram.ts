import * as dictionary from 'dictionaries/eng-us-1.csv';
import {groupBy, sortBy, identity, drop} from 'lodash';

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

export function sortWordList(wordList: Word[]) {
  return sortBy(wordList, w => -w.word.length);
}


interface IndexedWord {
  word: Word;
  index: number;
}

interface StackItem {
  list: IndexedWord[];
  set: NString;
  goodness: number;
}

export function findAnagramSentences(query: string, dictionary: Word[]): any {
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
  
  const initialStack = subanagrams.map((w, index) => {
    return {
      index,
      list: [w],
      set: w.word.set,
      goodness: 0,
    }
  });
  
  
  const queryLength = query.length;
  
  const generator = function* () {

    let stack: StackItem[] = initialStack;
    const solutions: StackItem[] = [];

    while(stack.length !== 0) {
      const current = stack.shift() as StackItem;
      let solution = false;

      if (isSame(nQuery.set, current.set)) {
        solutions.push(current);
        solution = true;
      } else {

        const charsMissing = queryLength - current.set.length;

        // drop all subanagrams that were before index
        const droppedSubanagrams = drop(subanagrams, current.list[0].index); 

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

        const newStackItems: StackItem[] = filterCombined.map(cw => {
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
      };
    }
  
    return solutions;
  }

  return generator;
}

const dict = parseDictionary(dictionary as any);
console.log('anagrams', findAnagrams("mother", dict));
console.log('anagrams', findSubAnagrams("mother", dict));
console.log(joinTwoNStrings(stringToWord("mother").set, stringToWord('testmother').set));
const generator = findAnagramSentences("taisiatikhnovetskaya", dict)();

console.log(generator);

for (let i = 0; i < 10000; i++) {
  const current = generator.next();
  if (current) {
    if (current.value && current.value.solution) {
      console.log('SOLUTION', current.value.current.list.map((w: any) => w.word.word).join(' '));
    } else if (!current.value) {
      console.log(current);
      break;
    }
  } else {
    console.log('stopped', i);
    break;
  }
}

