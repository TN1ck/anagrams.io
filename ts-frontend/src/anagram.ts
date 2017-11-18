import {sortBy, drop, uniqBy} from 'lodash';

//
// interfaces
//

export interface Word {
  set: string,
  word: string;
};

export interface IndexedWord {
  word: Word;
  index: number;
}

type AnagramSolution = [number[], string];

type OptimizedAnagramSolution = number[];

export interface AnagramGeneratorStep {
  solutions: AnagramSolution[],
  numberOfPossibilitiesChecked: number,
};

export type AnagramGenerator = IterableIterator<AnagramGeneratorStep>;

export interface SubanagramSolver {
  subanagram: IndexedWord;
  generator: AnagramGenerator;
}

type StackItem = AnagramSolution;

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
  list: IndexedWord[][],
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

export function sanitizeQuery(str: string): string {
  return str.toLowerCase()
    .replace(/ü/g, 'ue')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/[^a-z]/g, '');
}

export function stringToWord (str: string): Word {
  const sorted = str.split('').sort().join('');
  return {
    set: sorted,
    word: str,
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
  if (w1.length < w2.length) {
    return joinTwoStrings(w2, w1);
  }
  while (index1 < w1.length) {
    const c1 = w1[index1];
    const c2 = w2[index2];

    if (c2 === undefined) {
      while(index1 < w1.length) {
        const c = w1[index1];
        combined += (c);
        index1++;
      }
      break;
    }

    if (c1 < c2) {
      combined += (c1);
      index1++;
    } else if (c1 > c2) {
      combined += (c2);
      index2++;
    } else if (c1 === c2) {
      const startChar = c1;
      let char = startChar;
      let index = 0;
      while (char === startChar) {
        combined += (char);
        index++;
        char = w1[index1 + index];
        if (char === undefined) {
          break;
        }
      }
      index1 += index;
      let newIndex = 0;
      char = startChar;
      while (char === startChar) {
        combined += (char);
        index++;
        newIndex++;
        char = w2[index2 + newIndex];
        if (char === undefined) {
          break;
        }
      }
      index2 += newIndex;
    }
  }
  while(index2 < w2.length) {
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

export function findSubAnagrams(query: string, dictionary: Word[]): Word[] {
  const nQuery = stringToWord(query);
  // not sure why uniqBy is needed, have to investigate
  return uniqBy(dictionary.filter(nStr => {
    return isSubset(nStr.set, nQuery.set);
  }), w => w.set);
}

export function sortWordList(wordList: Word[]) {
  return sortBy(wordList, w => -w.word.length);
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
  query: string, initialStack: StackItem[], subanagrams: IndexedWord[],
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
          return s.word.word.length <= charsMissing;
        });

        const combinedWords = possibleSubanagrams.map(w => {
          return {
            word: w,
            combined: joinTwoStrings(current[1], w.word.set)
          };
        });

        // check if the result is still a subset
        const filterCombined = combinedWords.filter(cw => {
          return isSubset(cw.combined, nQuery.set);
        });

        const newStackItems: AnagramSolution[] = filterCombined.map(cw => {
          return [
            [cw.word.index].concat(current[0]),
            cw.combined,
          ] as AnagramSolution;
        });

        stack.unshift(...newStackItems);
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

export function findAnagramSentencesForSubAnagram(query: string, subanagrams: IndexedWord[], subanagram: IndexedWord): SubanagramSolver {
  const initialStack: AnagramSolution[] = [
    [
      [subanagram.index],
      subanagram.word.set,
    ]
  ];
  const generator = findAnagramSentencesForInitialStack(query, initialStack, subanagrams);
  return {
    subanagram,
    generator,
  };
}

export function findAnagramSentences(query: string, subanagrams: IndexedWord[]): SubanagramSolver[] {

  const subanagramsGenerators = subanagrams.map((w) => {
    return findAnagramSentencesForSubAnagram(query, subanagrams, w);
  });

  return subanagramsGenerators;
}

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
