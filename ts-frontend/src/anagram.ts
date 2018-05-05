import {sortBy, drop, groupBy} from 'lodash';

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

//
// interfaces
//

export interface BasicWord {
  set: Uint8Array;
  index: number;
  length: number;
}

export interface SimpleWord extends BasicWord {
  word: string;
};

export interface Word extends BasicWord {
  words: string[];
}

type AnagramSolution = [number[], BasicWord["set"], BasicWord["length"]];

type OptimizedAnagramSolution = number[];

export interface AnagramGeneratorStep {
  solutions: AnagramSolution[],
  numberOfPossibilitiesChecked: number,
};

// export type AnagramGenerator = IterableIterator<AnagramGeneratorStep>;

export interface SubanagramSolver {
  subanagram: Word;
  generator: () => AnagramGeneratorStep;
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

export function binaryToString(bin: Uint8Array) {
  let word = '';
  for (let i = 0; i < ALPHABET.length; i++) {
    const letter = ALPHABET[i];
    const frequency = bin[i];
    for (let j = 0; j < frequency; j++) {
      word += letter;
    }
  }
  return word;
}

export function stringToBinary(str: string): Uint8Array {
  const buffer = new ArrayBuffer(ALPHABET.length);
  const frequency = new Uint8Array(buffer);
  for (const l of str) {
    const position = ALPHABET.indexOf(l);
    frequency[position] += 1;
  }
  return frequency;
}

export function stringToWord(str: string): SimpleWord {
  // const sorted = str.split('').sort().join('');
  return {
    set: stringToBinary(str),
    word: str,
    index: -1,
    length: str.length,
  };
}

export function joinTwoBinary(bin1: Uint8Array, bin2: Uint8Array): Uint8Array {
  const buffer = new ArrayBuffer(ALPHABET.length);
  const frequency = new Uint8Array(buffer);
  for (let i = 0; i < ALPHABET.length; i++) {
    frequency[i] = bin1[i] + bin2[i];
  }
  return frequency;
}

/**
 * Remove all occurences of letters in bin2 from bin1 (bin1 - bin2)
 *
 * @param bin1 binary array from which we remove
 * @param bin2 binary array which we use to remove
 */
export function removeBinary(bin1: Uint8Array, bin2: Uint8Array): Uint8Array {
  const buffer = new ArrayBuffer(ALPHABET.length);
  const frequency = new Uint8Array(buffer);
  for (let i = 0; i < ALPHABET.length; i++) {
    frequency[i] = bin1[i] - bin2[i];
  }
  return frequency;
}

export function isBinarySubset(bin1: Uint8Array, bin2: Uint8Array): boolean {
  for (let i = 0; i < ALPHABET.length; i++) {
    if (bin1[i] > bin2[i]) {
      return false;
    }
  }
  return true;
}

// function isSubset(nStr1: string, nStr2: string): boolean {
//   const length1 = nStr1.length;
//   const length2 = nStr2.length;

//   let searchIndex = 0;
//   for (let i = 0; i < length2; i++) {
//     if (searchIndex >= length1) {
//       // we have a success!
//       return true;
//     }
//     const current1 = nStr1[searchIndex];
//     const current2 = nStr2[i];
//     if (current1 === current2) {
//       searchIndex += 1;
//     }
//   }
//   // when length2 === length1
//   return searchIndex === length1;
// }

function isBinarySame(bin1: Uint8Array, bin2: Uint8Array): boolean {
  for (let i = 0; i < ALPHABET.length; i++) {
    if (bin1[i] !== bin2[i]) {
      return false;
    }
  }
  return true;
}

// function isSame(nStr1: string, nStr2: string): boolean {
//   return nStr1 === nStr2;
// }

export function findAnagrams(query: string, dictionary: Word[]): Word[] {
  const nQuery = stringToWord(query);
  return dictionary.filter(nStr => {
    return isBinarySame(nStr.set, nQuery.set);
  });
}

export function findSubAnagrams(query: string, dictionary: SimpleWord[]): SimpleWord[] {
  const nQuery = stringToWord(query);
  // not sure why uniqBy is needed, have to investigate
  // return uniqBy(
  return dictionary.filter(nStr => {
    return isBinarySubset(nStr.set, nQuery.set);
  // w.set should be used, but we have to do some stuff for it
  });
  // , w => w.word);
}

export function sortWordList<T extends BasicWord>(wordList: T[]): T[] {
  return sortBy(wordList, w => -w.length);
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
  const groupedSubanagrams = groupBy(_subanagrams, s => binaryToString(s.set));
  const groups = Object.keys(groupedSubanagrams);
  const sortedGroups = sortBy(groups, g => -g.length);
  const subanagrams = sortedGroups.map((set, index) => {
    const words = groupedSubanagrams[set].map(w => w.word);
    return {
      set: groupedSubanagrams[set][0].set,
      words,
      index,
      length: groupedSubanagrams[set][0].length,
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
  const calculateAnagrams = () => {
    let stack: AnagramSolution[] = initialStack;
    // const solutions: AnagramSolution[] = [];

    let numberOfPossibilitiesChecked = initialStack.length;

    let newSolutions: AnagramSolution[] = [];
    const solutions: AnagramSolution[] = []
    let numberOfSolutions = 0;
    const MAX_SOLUTIONS = 100;

    while(stack.length !== 0 && numberOfSolutions < MAX_SOLUTIONS) {
      const current = stack.shift() as AnagramSolution;

      if (isBinarySame(nQuery.set, current[1])) {
        // solutions.push(current);
        newSolutions.push(current);
      } else {

        const charsMissing = queryLength - current[2];

        // drop all subanagrams that were before index
        const droppedSubanagrams = drop(subanagrams, current[0][0]);

        numberOfPossibilitiesChecked += droppedSubanagrams.length;

        // first filter those out, that are too big
        const possibleSubanagrams = droppedSubanagrams.filter(s => {
          return s.length <= charsMissing;
        });

        const combinedWords = possibleSubanagrams.map(w => {
          return {
            word: w,
            combined: joinTwoBinary(current[1], w.set)
          };
        });

        // check if the result is still a subset
        const filterCombined = combinedWords.filter(cw => {
          return isBinarySubset(cw.combined, nQuery.set);
        });

        const newAnagramSolutions: AnagramSolution[] = filterCombined.map(cw => {
          return [
            [cw.word.index].concat(current[0]),
            cw.combined,
            cw.word.length + current[2]
          ] as AnagramSolution;
        });

        stack.unshift(...newAnagramSolutions);
      }

      solutions.push(...newSolutions);

      numberOfSolutions += newSolutions.length;
      newSolutions = [];
    }
    return {
      solutions,
      numberOfPossibilitiesChecked,
    }
  }
  return calculateAnagrams;

}

export function findAnagramSentencesForSubAnagram(query: string, subanagrams: Word[], subanagram: Word): SubanagramSolver {
  const initialStack: AnagramSolution[] = [
    [
      [subanagram.index],
      subanagram.set,
      subanagram.length,
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
