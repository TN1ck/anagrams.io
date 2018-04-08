import {sortBy, drop, uniqBy, groupBy} from 'lodash';

//
// interfaces
//

export interface BasicWord {
  set: string;
  index: number;
}

export interface SimpleWord extends BasicWord {
  word: string;
};

export interface Word extends BasicWord {
  words: string[];
}

type AnagramSolution = [number[], string];

type OptimizedAnagramSolution = number[];

export interface AnagramGeneratorStep {
  solutions: AnagramSolution[],
  numberOfPossibilitiesChecked: number,
};

export type AnagramGenerator = IterableIterator<AnagramGeneratorStep>;

export interface SubanagramSolver {
  subanagram: Word;
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

export interface SerializedAnagramIteratorState {
  counter: number;
  numberOfPossibilitiesChecked: number;
  unsolvedSubanagrams: number[];
  solvedSubanagrams: number[];
  currentSubanagrams: number[];
  solutions: OptimizedAnagramSolution[];
}

export interface GroupedAnagramSolutions {
  list: SimpleWord[][],
  word: string,
  counter: number,
  wordIndex: number;
};

export interface AnagramGeneratorStepSerialized {
  solutions: number[][];
  numberOfPossibilitiesChecked: number;
}

//
// functions
//

export function sanitizeQuery(str: string, removeSpaces: boolean = true): string {

  const umlauts = str.replace(/[üÜ]/g, 'ue')
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe');

  if (removeSpaces) {
    return umlauts.toLowerCase().replace(/[^a-z]/g, '');
  } else {
    return umlauts.replace(/[^A-Za-z\s]/g, '')
  }
}

export function stringToWord (str: string): SimpleWord {
  const sorted = str.split('').sort().join('');
  return {
    set: sorted,
    word: str,
    index: -1,
  };
}


// this is correct!
export function joinTwoStringsNaive(w1: string, w2: string) {
  return stringToWord(w1 + w2).set;
}

// w1 is the longer word
export function joinTwoStrings(w1: string, w2: string): string {
  let combined = '';
  let index1 = 0;
  let index2 = 0;
  const w1Length = w1.length;
  const w2Length = w2.length;
  if (w1Length < w2Length) {
    return joinTwoStrings(w2, w1);
  }
  while (index1 < w1Length) {

    if (index2 >= w2Length) {
      while(index1 < w1Length) {
        const c = w1[index1];
        combined += c;
        index1++;
      }
      return combined;
    }
    const c1 = w1[index1];
    const c2 = w2[index2];

    if (c1 < c2) {
      combined += c1;
      index1++;
    } else if (c1 > c2) {
      combined += c2;
      index2++;
    } else if (c1 === c2) {
      const startChar = c1;
      let char = startChar;
      let index = 0;
      while (char === startChar) {
        combined += char;
        index++;
        const newIndex = index1 + index;
        if (newIndex >= w1Length) {
          break;
        }
        char = w1[newIndex];
      }
      index1 += index;
      let newIndex = 0;
      char = startChar;
      while (char === startChar) {
        combined += char;
        index++;
        newIndex++;
        // checking the index instead of char === undefined 10%
        const newIndex2 = index2 + newIndex;
        if (newIndex2 >= w2Length) {
          break;
        }
        char = w2[newIndex2];
      }
      index2 += newIndex;
    }
  }
  // substr is not faster
  while(index2 < w2Length) {
    const c2 = w2[index2];
    combined += c2;
    index2++;
  }
  return combined;
}

function isSubset(nStr1: string, nStr2: string): boolean {
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

function isSame(nStr1: string, nStr2: string): boolean {
  return nStr1 === nStr2;
}

export function findAnagrams(query: string, dictionary: Word[]): Word[] {
  const nQuery = stringToWord(query);
  return dictionary.filter(nStr => {
    return isSame(nStr.set, nQuery.set);
  });
}

export function findSubAnagrams(query: string, dictionary: SimpleWord[]): SimpleWord[] {
  const nQuery = stringToWord(query);
  // not sure why uniqBy is needed, have to investigate
  return uniqBy(dictionary.filter(nStr => {
    return isSubset(nStr.set, nQuery.set);
  // w.set should be used, but we have to do some stuff for it
  }), w => w.word);
}

export function sortWordList<T extends BasicWord>(wordList: T[]): T[] {
  return sortBy(wordList, w => -w.set.length);
}

export function findSortedSubAnagrmns(query: string, dictionary: SimpleWord[]): BasicWord[] {
  const _subanagrams = findSubAnagrams(query, dictionary);
  // we like long words more
  const sorted = sortWordList(_subanagrams);
  const subanagrams: BasicWord[] = sorted.map((word, index) => {
    return {
      ...word,
      index,
    };
  });
  return subanagrams;
}

export function findSortedAndGroupedSubAnagrams(query: string, dictionary: SimpleWord[]): Word[] {
  const _subanagrams = findSubAnagrams(query, dictionary);
  const groupedSubanagrams = groupBy(_subanagrams, s => s.set);
  const groups = Object.keys(groupedSubanagrams);
  const sortedGroups = sortBy(groups, g => -g.length);
  const subanagrams = sortedGroups.map((set, index) => {
    const words = groupedSubanagrams[set].map(w => w.word);
    return {
      set,
      words,
      index,
    };
  });

  return subanagrams;
}


export function anagramIteratorStateFactory(unsolvedGenerators = []) {
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

export function serializeAnagramIteratorStateFactor(state: AnagramIteratorState): SerializedAnagramIteratorState {
  const solutions = state.solutions.map(s => [...s[0]].reverse());
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

export function findAnagramSentencesForInitialStack(
  query: string, initialStack: AnagramSolution[], subanagrams: Word[],
) {
  const nQuery = stringToWord(query);
  const queryLength = nQuery.word.length;
  const generator = function* () {
    let stack: AnagramSolution[] = initialStack;
    // const solutions: AnagramSolution[] = [];

    let numberOfPossibilitiesChecked = initialStack.length;

    let newSolutions: AnagramSolution[] = [];
    let numberOfSolutions = 0;
    const MAX_SOLUTIONS = 100;

    while(stack.length !== 0 && numberOfSolutions < MAX_SOLUTIONS) {
      const current = stack.shift() as AnagramSolution;

      if (isSame(nQuery.set, current[1])) {
        // solutions.push(current);
        newSolutions.push(current);
      } else {

        const charsMissing = queryLength - current[1].length;

        // drop all subanagrams that were before index
        const droppedSubanagrams = drop(subanagrams, current[0][0]);

        numberOfPossibilitiesChecked += droppedSubanagrams.length;

        // first filter those out, that are too big
        const possibleSubanagrams = droppedSubanagrams.filter(s => {
          return s.set.length <= charsMissing;
        });

        const combinedWords = possibleSubanagrams.map(w => {
          return {
            word: w,
            combined: joinTwoStrings(current[1], w.set)
          };
        });

        // check if the result is still a subset
        const filterCombined = combinedWords.filter(cw => {
          return isSubset(cw.combined, nQuery.set);
        });

        const newAnagramSolutions: AnagramSolution[] = filterCombined.map(cw => {
          return [
            [cw.word.index].concat(current[0]),
            cw.combined,
          ] as AnagramSolution;
        });

        stack.unshift(...newAnagramSolutions);
      }

      yield {
        solutions: newSolutions,
        numberOfPossibilitiesChecked,
      };
      numberOfSolutions += newSolutions.length;
      newSolutions = [];
    }

  }

  return generator();
}

export function findAnagramSentencesForSubAnagram(query: string, subanagrams: Word[], subanagram: Word): SubanagramSolver {
  const initialStack: AnagramSolution[] = [
    [
      [subanagram.index],
      subanagram.set,
    ]
  ];
  const generator = findAnagramSentencesForInitialStack(query, initialStack, subanagrams);
  return {
    subanagram,
    generator,
  };
}

export function findAnagramSentences(query: string, subanagrams: Word[]): SubanagramSolver[] {

  const subanagramsGenerators = subanagrams.map((w) => {
    return findAnagramSentencesForSubAnagram(query, subanagrams, w);
  });

  return subanagramsGenerators;
}

export interface GroupedWords {
  list: SimpleWord[][],
  counter: number,
  word: string,
  wordIndex: number,
}

export type GroupedWordsDict = {[key: string]: GroupedWords};

function createGroups(subanagrams: Word[]): GroupedWordsDict {
  const groups = {};
  subanagrams.forEach(a => {
    a.words.forEach(w => {
      const group = {
        word: w,
        counter: 0,
        list: [],
        wordIndex: a.index,
      };
      groups[w] = group;
    });
  });
  return groups;
}

export function groupWordsByStartWord(
  subanagrams: Word[],
  words: SimpleWord[][],
  cache: {[key: string]: GroupedWords} = {},
  cacheLength: number = 0,
): GroupedWordsDict {
  const values = Object.values(cache || {});
  const groups: {[key: string]: GroupedWords} = values.length === 0 ? createGroups(subanagrams) : cache;
  // TODO
  cacheLength = values.reduce((a, c) => c.list.length + a, 0)

  // let current = null;
  let currentWordIndex = 0;

  const newWords = words.slice(cacheLength);

  for (let i = 0; i < newWords.length; i++) {
    const aList = newWords[i];
    const newIndexdWord = aList[0];
    const newIndexdWordIndex = newIndexdWord.index;
    if (currentWordIndex !== newIndexdWordIndex) {
      currentWordIndex = newIndexdWordIndex;
    }
    const group = groups[newIndexdWord.word];
    group.list.push(aList);
    for (let word of aList) {
      groups[word.word].counter += 1;
    }
  }

  return groups;

}


export enum AnagramResultState {
  active = "active",
  unsolved = "unsolved",
  solved = "solved",
}


export function getAnagramMapping(w1: string, w2: string): number[] {
  w1 = w1.toLowerCase();
  w2 = w2.toLowerCase();
  const mapping = {};
  const resultMapping = [];
  // let index1 = 0;
  // let index2 = 0;
  // let index = 0;
  for (let s of w1) {
    if (s === ' ') {
      resultMapping.push(undefined);
      continue;
    }
    // check if the char was already used once
    let chars = mapping[s] || [];
    mapping[s] = chars;
    let lastPosition = 0;
    if (chars.length > 0) {
      // add +1 to search starting from the next string
      lastPosition = chars[chars.length - 1] + 1;
    }
    const sInW2 = w2.indexOf(s, lastPosition);
    chars.push(sInW2);
    resultMapping.push(sInW2);
    // index++;
  }
  return resultMapping;
}

function _expandArray<T>(array: T[][], current: T[][]): T[][] {
  if (array.length === 0) {
    return current;
  }
  const [start, ...rest] = array;
  const newCurrent: T[][] = [];
  for (let t of start) {
    for (let t2 of current) {
      newCurrent.push([...t2, t]);
    }
  }
  return _expandArray(rest, newCurrent);
}

export function expandArray<T>(array: T[][]): T[][] {
  const [start, ...rest] = array;
  return _expandArray(rest, start.map(s => [s]));
}


export function expandSolutions(solutions: OptimizedAnagramSolution[], subanagrams: Word[]): SimpleWord[][] {
  const expandedSolutions = [].concat(...solutions.map(solution => {
    const currentSolutions = solution.map(s => {
      const subanagram = subanagrams[s];
      return subanagram.words.map(w => {
        return {
          word: w,
          index: subanagram.index,
          set: subanagram.set,
        }
      });
    });

    const expanded = expandArray(currentSolutions);
    return expanded;
  }));
  return expandedSolutions;

}
