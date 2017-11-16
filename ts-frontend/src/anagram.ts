import {sortBy, drop} from 'lodash';

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
  const sorted = sortBy([...str], d => d);
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

export function nStringToString(nString: NString): string {
  let string = '';

  for (let c of nString) {
    string += c[0];
  }
  return string;
}

// this is correct!
export function joinTwoNStringsNaive(w1: NString, w2: NString) {
  const str1 = nStringToString(w1);
  const str2 = nStringToString(w2);
  return stringToWord(str1 + str2).set;

}

// w1 is the longer word
// works now!
export function joinTwoNStrings(w1: NString, w2: NString) {
  const combined = [];
  let index1 = 0;
  let index2 = 0;
  if (w1.length < w2.length) {
    console.error('This method is optimized and only works correctly when w1 is larger or same as w2');
  }
  while (index1 < w1.length) {
    const c1 = w1[index1];
    const c2 = w2[index2];

    if (c2 === undefined) {
      while(index1 < w1.length) {
        const c = w1[index1];
        combined.push(c);
        index1++;
      }
      break;
    }

    if (c1 < c2) {
      combined.push(c1);
      index1++;
    } else if (c1 > c2) {
      combined.push(c2);
      index2++;
    } else if (c1 === c2) {
      const startChar = c1[0];
      let char = startChar;
      let index = 0;
      while (char === startChar) {
        combined.push(char + index);
        index++;
        char = w1[index1 + index];
        if (char === undefined) {
          break;
        }
        char = char[0];
      }
      index1 += index;
      let newIndex = 0;
      char = startChar;
      while (char === startChar) {
        combined.push(char + index);
        index++;
        newIndex++;
        char = w2[index2 + newIndex];
        if (char === undefined) {
          break;
        }
        char = char[0];
      }
      index2 += newIndex;
    }
  }
  while(index2 < w2.length) {
    const c2 = w2[index2];
    combined.push(c2);
    index2++;
  }
  return combined;
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

type OptimizedAnagramSolution = number[];

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

export type AnagramGenerator = IterableIterator<{
  current: AnagramSolution,
  solution: boolean,
  numberOfPossibilitiesChecked: number,
}>;

export interface SubanagramSolver {
  subanagram: IndexedWord;
  generator: AnagramGenerator;
}

export interface AnagramIteratorState {
  breakLoop: boolean;
  counter: number;
  numberOfPossibilitiesChecked: number;
  unsolvedGenerators: SubanagramSolver[];
  solvedGenerators: SubanagramSolver[];
  currentGenerators: SubanagramSolver[];
  solutions: AnagramSolution[];
}

export function angagramIteratorStateFactory(unsolvedGenerators = []) {
  const state: AnagramIteratorState = {
    breakLoop: false,
    counter: 0,
    numberOfPossibilitiesChecked: 0,
    unsolvedGenerators,
    solvedGenerators: [],
    currentGenerators: [],
    solutions: [],
  };
  return state;
}

export interface SerializedAnagramIteratorState {
  counter: number;
  numberOfPossibilitiesChecked: number;
  unsolvedSubanagrams: number[];
  solvedSubanagrams: number[];
  currentSubanagrams: number[];
  solutions: OptimizedAnagramSolution[];
}

export function serializeAnagramIteratorStateFactor(state: AnagramIteratorState): SerializedAnagramIteratorState {
  const solutions = state.solutions.map(s => s.list.map(w => w.index).reverse());
  return {
    counter: state.counter,
    numberOfPossibilitiesChecked: state.numberOfPossibilitiesChecked,
    unsolvedSubanagrams: state.unsolvedGenerators.map(d => d.subanagram.index),
    solvedSubanagrams: state.solvedGenerators.map(d => d.subanagram.index),
    currentSubanagrams: state.currentGenerators.map(d => d.subanagram.index),
    // use numbers to reduce memory footprint
    solutions,
  }
}

export function findAnagramSentences(query: string, subanagrams: IndexedWord[]): SubanagramSolver[] {

  const nQuery = stringToWord(query);

  interface StackItem {
    list: IndexedWord[];
    set: string[];
    goodness: number;
  }
  
  const queryLength = query.length;
  
  const createGenerator = (initialStack: StackItem[]) => {
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
                combined: joinTwoNStrings(current.set, w.word.set)
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
      return generator();
  }

  const subanagramsGenerators = subanagrams.map((w) => {

    const initialStack = [{
      list: [w],
      set: w.word.set,
      goodness: 0,
    }];

    const generator = createGenerator(initialStack);

    return {
      subanagram: w,
      generator,
    };
  });

  return subanagramsGenerators;
}

export interface GroupedAnagramSolutions {
  list: IndexedWord[][],
  word: string,
  counter: number,
  wordIndex: number;
};

export function groupAnagramsByStartWord(
  subanagrams: IndexedWord[],
  anagrams: OptimizedAnagramSolution[]
): GroupedAnagramSolutions[] {
  const groups = subanagrams.map(a => {
    return {
      list: [] as IndexedWord[][],
      word: a.word.word,
      counter: 0,
      wordIndex: a.index,
    };
  });

  // let current = null;
  let currentWordIndex = 0;

  for (let i = 0; i < anagrams.length; i++) {
    const a = anagrams[i];
    const aList = a.map(j => subanagrams[j]);
    const newIndexdWordIndex = a[0];
    if (currentWordIndex !== newIndexdWordIndex) {
      currentWordIndex = newIndexdWordIndex;
    }
    groups[currentWordIndex].list.push(aList);
    for (let subangramIndex of a) {
      groups[subangramIndex].counter += 1;
    }
  }

  return groups;
}

export enum AnagramResultState {
  active = "active",
  unsolved = "unsolved",
  solved = "solved",
}
