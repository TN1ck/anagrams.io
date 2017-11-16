import {flatten} from 'lodash';

import * as anagram from 'src/../../ts-frontend/src/anagram';
import dictionaries from 'src/dictionaries';

// I use this one, because I tested it, and it doesn't have so many solutions and takes
// some time to calculate
const TEST_WORD = 'johannesvonplato';
export const TEST_WORD_SOLUTIONS = [
  'loan jet pan oh on vs',
  'loan jet pan no oh vs',
  'plan jet oh on on vs a',
  'plan jet no oh on vs a',
  'plan jet no no oh vs a',
  'jet lap ah on on on vs',
  'jet lap ah no on on vs',
  'jet lap ah no no on vs',
  'jet lap ah no no no vs',
];
const NUMBER_OF_SUBANAGRAMS = 112;

describe('Anagram / findanagrams', () => {
  test('Should find the the anagrams', () => {
    const dictionary = dictionaries.find(d => d.id === 'eng-us-3k');
    const subanagrams = anagram.findSortedSubAnagrmns(TEST_WORD, dictionary.dict);
    expect(subanagrams.length).toBe(NUMBER_OF_SUBANAGRAMS);
    const generators = anagram.findAnagramSentences(TEST_WORD, subanagrams);
    const subanagramSolutions = generators.map(({generator}) => {
      const gen = generator;
      const values = [...gen].filter(v => v.solution);
      return values;
    });
    const values = flatten(subanagramSolutions);
    expect(values.length).toBe(TEST_WORD_SOLUTIONS.length);
  });
});

describe('joinTwoStrings', () => {
  test('Should merge correctly two equal strings', () => {
    const string1 = ['m0', 'o0', 't0'];
    const string2 = ['m0', 'o0', 't0'];
    const expectedResult = ['m0', 'm1', 'o0', 'o1', 't0', 't1'];
    const result = anagram.joinTwoNStrings(string1, string2);
    expect(result).toEqual(expectedResult);
  });
  test('Should merge correctly were one letter occurs multiple times', () => {
    const string1 = ['m0', 'o0', 'o1', 'o2', 't0'];
    const string2 = ['m0', 'o0', 't0'];
    const expectedResult = ['m0', 'm1', 'o0', 'o1', 'o2', 'o3', 't0', 't1'];
    const result = anagram.joinTwoNStrings(string1, string2);
    expect(result).toEqual(expectedResult);
  });
  test('Should merge correctly were one letter occurs multiple times 2', () => {
    const string1 = ['a0', 'a1', 'm0', 'o0', 'o1', 'o2', 'o3', 't0'];
    const string2 = ['m0', 'o0', 't0'];
    const expectedResult = ['a0', 'a1', 'm0', 'm1', 'o0', 'o1', 'o2', 'o3', 'o4', 't0', 't1'];
    const result = anagram.joinTwoNStrings(string1, string2);
    expect(result).toEqual(expectedResult);
  });
  test('Should merge correctly were one letter occurs multiple times 2', () => {
    const string1 = ['a0', 'a1', 'm0', 'o0', 't0'];
    const string2 = ['a0', 'c0', 'z0', 'z1'];
    const expectedResult = ['a0', 'a1', 'a2', 'c0', 'm0', 'o0', 't0', 'z0', 'z1'];
    const result = anagram.joinTwoNStrings(string1, string2);
    expect(result).toEqual(expectedResult);
  });

  test('Should merge correctly when the the second word is exhausted quickly', () => {
    const string1 = anagram.stringToWord('ab');
    const string2 = anagram.stringToWord('a');
    const expectedResult = anagram.joinTwoNStringsNaive(string1.set, string2.set);
    const result = anagram.joinTwoNStrings(string1.set, string2.set);
    expect(result).toEqual(expectedResult);
  })

  // was only needed to verify the new joinTwoNString implementation
  // test('every word in the dictionary!', () => {
  //   const dictionary = dictionaries.find(d => d.id === 'eng-us-3k');
  //   let currentMerge = ["a0", "a1", "a2", "a3", "a4", "a5", "b0", "b1", "b2", "d0", "e0", "i0", "i1", "l0", "l1", "n0", "n1", "o0", "t0", "y0"];
  //   for (let c of dictionary.dict) {
  //    const resultExpected = anagram.joinTwoNStringsNaive(currentMerge, c.set);
  //    const result = anagram.joinTwoNStrings(currentMerge, c.set);
  //    expect(result).toEqual(resultExpected);
  //    currentMerge = resultExpected; 
  //   }
  // });

});