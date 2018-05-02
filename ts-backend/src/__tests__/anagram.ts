// import {flatten} from 'lodash';

import * as anagram from 'src/../../ts-frontend/src/anagram';
// import dictionaries from 'src/dictionaries';

// I use this one, because I tested it, and it doesn't have so many solutions and takes
// some time to calculate
// const TEST_WORD = 'johannesvonplato';
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
// const NUMBER_OF_SUBANAGRAMS = 113;

// describe('joinTwoStrings', () => {
//   test('Should merge correctly two equal strings', () => {
//     const string1 = 'mot';
//     const string2 = 'mot';
//     const expectedResult = 'mmoott';
//     const result = anagram.joinTwoStrings(string1, string2);
//     expect(result).toEqual(expectedResult);
//   });
//   test('Should merge correctly were one letter occurs multiple times', () => {
//     const string1 = 'mooot';
//     const string2 = 'mot';
//     const expectedResult = 'mmoooott';
//     const result = anagram.joinTwoStrings(string1, string2);
//     expect(result).toEqual(expectedResult);
//   });

//   test('Should merge correctly when the the second word is exhausted quickly', () => {
//     const string1 = anagram.stringToWord('ab');
//     const string2 = anagram.stringToWord('a');
//     const expectedResult = anagram.joinTwoStringsNaive(string1.set, string2.set);
//     const result = anagram.joinTwoStrings(string1.set, string2.set);
//     expect(result).toEqual(expectedResult);
//   });

//   // was only needed to verify the new joinTwoNString implementation
//   // test('every word in the dictionary!', () => {
//   //   const dictionary = dictionaries.find(d => d.id === 'eng-us-3k');
//   //   let currentMerge = ["a0", "a1", "a2", "a3", "a4", "a5", "b0", "b1", "b2", "d0", "e0", "i0", "i1", "l0", "l1", "n0", "n1", "o0", "t0", "y0"];
//   //   for (let c of dictionary.dict) {
//   //    const resultExpected = anagram.joinTwoStringsNaive(currentMerge, c.set);
//   //    const result = anagram.joinTwoStrings(currentMerge, c.set);
//   //    expect(result).toEqual(resultExpected);
//   //    currentMerge = resultExpected;
//   //   }
//   // });

// });

describe('sanitizeQuery', () => {
  test('Should remove everything but letters', () => {
    const string1 = '  . !, testö ü ä 112233';
    const expectedResult = 'testoeueae';
    const result = anagram.sanitizeQuery(string1);
    expect(result).toBe(expectedResult);
  })
});
