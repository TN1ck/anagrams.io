import {sortBy, identity, drop, last} from 'lodash';

type NString = string[];

export interface Word {
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

export function stringToWord (str: string): Word {
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

export function findSortedSubAnagrmns(query: string, dictionary: Word[]): IndexedWord[] {
  const _subanagrams = findSubAnagrams(query, dictionary);
  // we like long words more
  const sorted = sortWordList(_subanagrams);
  const subanagrams: IndexedWord[] = sorted.map((word, index) => {
    return {
      word: word,
      index,
    };
  });
  return subanagrams;
}

export function findAnagramSentences(query: string, subanagrams: IndexedWord[]): {
  subanagrams: IndexedWord[],
  generator: () => IterableIterator<{
    current: AnagramSolution,
    solution: boolean,
    numberOfPossibilitiesChecked: number,
  }>
} {

  const nQuery = stringToWord(query);

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

export function groupAnagramsByStartWord(
  subanagrams: IndexedWord[],
  anagrams: AnagramSolution[]
):
Array<{list: AnagramSolution[], word: string, checked: boolean, counter: number}> {
  const groups = subanagrams.map(a => {
    return {
      list: [] as AnagramSolution[],
      word: a.word.word,
      counter: 0,
      checked: false,
    };
  });

  // let current = null;
  let currentWord = '';
  let currentWordIndex = 0;

  for (let i = 0; i < anagrams.length; i++) {
    const a = anagrams[i];
    const newIndexdWord = last(a.list) as IndexedWord;
    const newWord = newIndexdWord.word.word;
    if (currentWord !== newWord) {
      currentWordIndex = subanagrams.findIndex(a => a.word.word === newWord);
      currentWord = newWord;
    }
    groups[currentWordIndex].list.push(a);
    for (let subangram of a.list) {
      const currentWordIndex = subanagrams.findIndex(a => a.word.word === subangram.word.word);
      groups[currentWordIndex].counter += 1;
    }
  }
  
  // all anagrams that are less than the currentWordIndex and have an empty list have no solutino
  for(let i = 0; i < groups.length; i++) {
    const group = groups[i];
    group.checked = i < currentWordIndex;
  }

  return groups;
}