import { sortBy, drop, groupBy } from "lodash";

// TODO: Use dictionaries to create the letter list.
export const ALPHABET = "abcdefghijklmnopqrstuvwxyzüäößéèêëàâôûùçîïœæñ";

export interface BasicWord {
  set: Uint8Array;
  index: number;
  length: number;
}

export interface SimpleWord extends BasicWord {
  word: string;
}

export interface Word extends BasicWord {
  words: string[];
}

type AnagramSolution = [number[], BasicWord["set"], BasicWord["length"]];

type OptimizedAnagramSolution = number[];

export interface AnagramGeneratorStep {
  solutions: AnagramSolution[];
  numberOfPossibilitiesChecked: number;
}

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
  list: SimpleWord[][];
  word: string;
  counter: number;
  wordIndex: number;
}

export interface AnagramGeneratorStepSerialized {
  solutions: number[][];
  numberOfPossibilitiesChecked: number;
}

/**
 * Map letters in str to the given mapping
 * @param str string which we map
 * @param mapping mapping which we use
 * @returns mapped string
 */
export function mapLetters(
  str: string,
  mapping: Record<string, string>
): string {
  str = str.toLowerCase();

  for (let key of Object.keys(mapping)) {
    const value = mapping[key];
    str = str.replace(new RegExp(key, "g"), value);
  }
  return str;
}

/**
 * Remove all letters from str that are not in the alphabet
 *
 * @param str string which we sanitize
 * @param mapping mapping which we use
 * @param removeSpaces if true, we also remove spaces
 * @returns sanitized string
 */
export function sanitizeQuery(
  str: string,
  mapping: Record<string, string>,
  removeSpaces: boolean = true
): string {
  str = mapLetters(str, mapping);
  str = [...str]
    .filter((char) => {
      if (removeSpaces) {
        return ALPHABET.includes(char);
      }
      return ALPHABET.includes(char) || char === " ";
    })
    .join("");
  return str;
}

/**
 * Convert binary array to string
 * @param bin binary array which we convert
 * @param alphabet alphabet which we use
 * @returns string
 */
export function binaryToString(bin: Uint8Array, alphabet = ALPHABET) {
  let word = "";
  for (let i = 0; i < alphabet.length; i++) {
    const letter = alphabet[i];
    const frequency = bin[i];
    for (let j = 0; j < frequency; j++) {
      word += letter;
    }
  }
  return word;
}

/**
 * Convert string to binary array
 * @param str string which we convert
 * @param alphabet alphabet which we use
 * @returns binary array
 */
export function stringToBinary(str: string, alphabet = ALPHABET): Uint8Array {
  const buffer = new ArrayBuffer(alphabet.length);
  const frequency = new Uint8Array(buffer);
  for (const l of str) {
    const position = alphabet.indexOf(l);
    frequency[position] += 1;
  }
  return frequency;
}

/**
 * Convert string to word
 * @param str string which we convert
 * @param alphabet alphabet which we use
 * @returns word
 */
export function stringToWord(str: string, alphabet = ALPHABET): SimpleWord {
  return {
    set: stringToBinary(str, alphabet),
    word: str,
    index: -1,
    length: str.length,
  };
}

/**
 * Join all occurences of letters in bin1 with bin2 (bin1 + bin2)
 *
 * @param bin1 binary array which we join
 * @param bin2 binary array which we join
 * @returns binary array which is the result of joining bin1 and bin2
 */
export function mergeBinaries(bin1: Uint8Array, bin2: Uint8Array): Uint8Array {
  if (bin1.length !== bin2.length) {
    throw new Error("Given arrays must have the same length");
  }
  const buffer = new ArrayBuffer(bin1.length);
  const frequency = new Uint8Array(buffer);
  for (let i = 0; i < bin1.length; i++) {
    frequency[i] = bin1[i] + bin2[i];
  }
  return frequency;
}

/**
 * Remove all occurences of letters in bin2 from bin1 (bin1 - bin2)
 *
 * @param bin1 binary array from which we remove
 * @param bin2 binary array which we use to remove
 * @returns binary array with removed letters
 */
export function removeBinary(bin1: Uint8Array, bin2: Uint8Array): Uint8Array {
  if (bin1.length !== bin2.length) {
    throw new Error("Given arrays must have the same length");
  }
  const buffer = new ArrayBuffer(bin1.length);
  const frequency = new Uint8Array(buffer);
  for (let i = 0; i < bin1.length; i++) {
    frequency[i] = bin1[i] - bin2[i];
  }
  return frequency;
}

/**
 * Check if bin1 is a subset of bin2
 * @param bin1 binary array which we check
 * @param bin2 binary array which we check
 * @returns true if bin1 is a subset of bin2
 */
export function isBinarySubset(bin1: Uint8Array, bin2: Uint8Array): boolean {
  for (let i = 0; i < bin1.length; i++) {
    if (bin1[i] > bin2[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Check if bin1 and bin2 are the same
 * @param bin1 binary array which we check
 * @param bin2 binary array which we check
 * @returns true if bin1 and bin2 are the same
 */
export function isBinarySame(bin1: Uint8Array, bin2: Uint8Array): boolean {
  for (let i = 0; i < bin1.length; i++) {
    if (bin1[i] !== bin2[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Find all subanagrams of query in dictionary
 * @param query query which we use
 * @param dictionary dictionary which we use
 * @returns subanagrams
 */
export function findSubAnagrams(
  query: string,
  dictionary: SimpleWord[]
): SimpleWord[] {
  const nQuery = stringToWord(query);
  return dictionary.filter((nStr) => {
    return isBinarySubset(nStr.set, nQuery.set);
  });
}

/**
 * Group subanagrams by their set representation
 * @param subanagrams subanagrams which we group
 * @returns grouped subanagrams
 */
export function findSortedAndGroupedSubAnagrams(
  subanagrams: SimpleWord[]
): Word[] {
  const groupedSubanagrams = groupBy(subanagrams, (s) => binaryToString(s.set));
  const groups = Object.keys(groupedSubanagrams);
  const sortedGroups = sortBy(groups, (g) => -g.length);
  return sortedGroups.map((set, index) => {
    const words = groupedSubanagrams[set].map((w) => w.word);
    return {
      set: groupedSubanagrams[set][0].set,
      words,
      index,
      length: groupedSubanagrams[set][0].length,
    };
  });
}

/**
 * Find all anagram sentences for the given query and subanagrams.
 * @param query query which we use
 * @param subanagrams subanagrams which we use
 * @returns anagram sentences
 */
export function findAnagramSentencesForInitialStack(
  query: SimpleWord,
  initialStack: AnagramSolution[],
  subanagrams: Word[]
) {
  const queryLength = query.word.length;
  const calculateAnagrams = () => {
    let stack: AnagramSolution[] = initialStack;

    let numberOfPossibilitiesChecked = initialStack.length;

    let newSolutions: AnagramSolution[] = [];
    const solutions: AnagramSolution[] = [];
    let numberOfSolutions = 0;
    const MAX_SOLUTIONS = 100;

    while (stack.length !== 0 && numberOfSolutions < MAX_SOLUTIONS) {
      const current = stack.shift() as AnagramSolution;

      if (isBinarySame(query.set, current[1])) {
        newSolutions.push(current);
      } else {
        const charsMissing = queryLength - current[2];

        // drop all subanagrams that were before index
        const droppedSubanagrams = drop(subanagrams, current[0][0]);

        numberOfPossibilitiesChecked += droppedSubanagrams.length;

        // first filter those out, that are too big
        const possibleSubanagrams = droppedSubanagrams.filter((s) => {
          return s.length <= charsMissing;
        });

        const combinedWords = possibleSubanagrams.map((w) => {
          return {
            word: w,
            combined: mergeBinaries(current[1], w.set),
          };
        });

        // check if the result is still a subset
        const filterCombined = combinedWords.filter((cw) => {
          return isBinarySubset(cw.combined, query.set);
        });

        const newAnagramSolutions: AnagramSolution[] = filterCombined.map(
          (cw) => {
            return [
              [cw.word.index].concat(current[0]),
              cw.combined,
              cw.word.length + current[2],
            ] as AnagramSolution;
          }
        );

        stack.unshift(...newAnagramSolutions);
      }

      solutions.push(...newSolutions);

      numberOfSolutions += newSolutions.length;
      newSolutions = [];
    }
    return {
      solutions,
      numberOfPossibilitiesChecked,
    };
  };
  return calculateAnagrams;
}

/**
 * Find all anagram sentences for the given query and subanagrams.
 * @param query query which we use
 * @param subanagrams subanagrams which we use
 * @param subanagram subanagram which we use
 * @returns anagram sentences
 */
export function findAnagramSentencesForSubAnagram(
  query: SimpleWord,
  subanagrams: Word[],
  subanagram: Word
): SubanagramSolver {
  const initialStack: AnagramSolution[] = [
    [[subanagram.index], subanagram.set, subanagram.length],
  ];
  const generator = findAnagramSentencesForInitialStack(
    query,
    initialStack,
    subanagrams
  );
  return {
    subanagram,
    generator,
  };
}

export function findAnagramSentences(
  query: SimpleWord,
  subanagrams: Word[]
): SubanagramSolver[] {
  const subanagramsGenerators = subanagrams.map((w) => {
    return findAnagramSentencesForSubAnagram(query, subanagrams, w);
  });

  return subanagramsGenerators;
}

export interface GroupedWords {
  list: SimpleWord[][];
  counter: number;
  word: string;
  wordIndex: number;
}

export type GroupedWordsDict = Record<string, GroupedWords>;

function createGroups(subanagrams: Word[]): GroupedWordsDict {
  const groups: GroupedWordsDict = {};
  subanagrams.forEach((a) => {
    a.words.forEach((w) => {
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
  cache: { [key: string]: GroupedWords } = {},
  cacheLength: number = 0
): GroupedWordsDict {
  const values = Object.values(cache || {});
  const groups: { [key: string]: GroupedWords } =
    values.length === 0 ? createGroups(subanagrams) : cache;
  // TODO
  cacheLength = values.reduce((a, c) => c.list.length + a, 0);

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

export function isLetter(letter: string) {
  // ignore the dot for now: TODO, refactor
  return ALPHABET.includes(letter.toLocaleLowerCase()) || letter === ".";
}

/**
 * Get the mapping of the letters of w1 to the letters of w2
 * @param w1 word 1
 * @param w2 word 2
 * @returns mapping
 */
export function getAnagramMapping(
  w1: string,
  w2: string
): (number | undefined)[] {
  w1 = w1.toLowerCase();
  w2 = w2.toLowerCase();
  const mapping: Record<string, number[]> = {};
  const resultMapping: (number | undefined)[] = [];
  for (let s of w1) {
    // if it's not a letter, ignore it
    if (!isLetter(s)) {
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
  return _expandArray(
    rest,
    start.map((s) => [s])
  );
}

export function expandSolutions(
  solutions: OptimizedAnagramSolution[],
  subanagrams: Word[]
): SimpleWord[][] {
  const expandedSolutions: SimpleWord[][] = ([] as SimpleWord[][]).concat(
    ...solutions.map((solution) => {
      const currentSolutions: SimpleWord[][] = solution.map((s) => {
        const subanagram = subanagrams[s];
        return subanagram.words.map((w) => {
          const simpleWord: SimpleWord = {
            word: w,
            index: subanagram.index,
            set: subanagram.set,
            length: w.length,
          };
          return simpleWord;
        });
      });

      const expanded = expandArray(currentSolutions);
      return expanded;
    })
  );
  return expandedSolutions;
}
