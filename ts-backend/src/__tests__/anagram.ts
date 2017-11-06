import * as anagram from 'src/../../ts-frontend/src/anagram';
import dictionaries from 'src/dictionaries';

// I use this one, because I tested it, and it doesn't have so many solutions and takes
// some time to calculate
const TEST_WORD = 'johannesvonplato';
const TEST_WORD_SOLUTIONS = [
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
    const {generator} = anagram.findAnagramSentences(TEST_WORD, subanagrams);
    const gen = generator();
    const values = [...gen].filter(v => v.solution);
    expect(values.length).toBe(TEST_WORD_SOLUTIONS.length);
  });
});